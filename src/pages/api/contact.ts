import type { APIRoute } from 'astro';
import { getServerEnv } from '../../lib/server/runtime-env';

export const prerender = false;

const DEFAULT_RECIPIENTS = 'aaron@hoehnepropertymaintenance.com,tyler@szakacsmedia.com';
const DEFAULT_FROM_EMAIL = 'tyler@mail.szakacsmedia.com';
const DEFAULT_FROM_NAME = 'Hoehne Property Maintenance Website';
const DEFAULT_REPLY_TO = 'tyler@szakacsmedia.com';
const MAX_ATTACHMENT_DATA_URL_LENGTH = 6_500_000;

type EstimateAnswer = {
    label: string;
    value: string;
};

type EstimateLineItem = {
    label: string;
    category: string;
    low: string;
    high: string;
};

type EstimateRequest = {
    projectLabel: string;
    rangeLow: string;
    rangeHigh: string;
    address: string;
    notes: string;
    photoAttached: boolean;
    photoName: string;
    photoNotes: string;
    answers: EstimateAnswer[];
    lineItems: EstimateLineItem[];
};

function jsonResponse(status: number, body: Record<string, unknown>) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

function parseRecipients(raw: string) {
    return raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((email) => ({ email }));
}

function textField(value: unknown, maxLength = 500) {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function parseEstimateRequest(raw: unknown): EstimateRequest | undefined {
    if (!raw || typeof raw !== 'object') return undefined;
    const data = raw as Record<string, unknown>;
    const answers = Array.isArray(data.answers)
        ? data.answers
              .map((item) => {
                  if (!item || typeof item !== 'object') return undefined;
                  const row = item as Record<string, unknown>;
                  const label = textField(row.label, 80);
                  const value = textField(row.value, 500);
                  return label && value ? { label, value } : undefined;
              })
              .filter((item): item is EstimateAnswer => Boolean(item))
        : [];
    const lineItems = Array.isArray(data.lineItems)
        ? data.lineItems
              .map((item) => {
                  if (!item || typeof item !== 'object') return undefined;
                  const row = item as Record<string, unknown>;
                  const label = textField(row.label, 120);
                  const low = textField(row.low, 40);
                  const high = textField(row.high, 40);
                  if (!label || !low || !high) return undefined;
                  return {
                      label,
                      category: textField(row.category, 80),
                      low,
                      high,
                  };
              })
              .filter((item): item is EstimateLineItem => Boolean(item))
        : [];

    const projectLabel = textField(data.projectLabel, 120);
    if (!projectLabel && answers.length === 0 && lineItems.length === 0) return undefined;

    return {
        projectLabel,
        rangeLow: textField(data.rangeLow, 40),
        rangeHigh: textField(data.rangeHigh, 40),
        address: textField(data.address, 500),
        notes: textField(data.notes, 2000),
        photoAttached: Boolean(data.photoAttached),
        photoName: textField(data.photoName, 160),
        photoNotes: textField(data.photoNotes, 2000),
        answers,
        lineItems,
    };
}

export const POST: APIRoute = async ({ request }) => {
    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return jsonResponse(400, { error: 'Invalid request body.' });
    }

    const data = (payload ?? {}) as Record<string, unknown>;
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    const photoDataUrl = typeof data.photoDataUrl === 'string' ? data.photoDataUrl : '';
    const photoName = typeof data.photoName === 'string' ? data.photoName.trim() : '';
    const estimateRequest = parseEstimateRequest(data.estimateRequest);

    if (!name || !phone || !message) {
        return jsonResponse(400, { error: 'Name, phone, and project details are required.' });
    }

    if (email && !validEmail(email)) {
        return jsonResponse(400, { error: 'Please enter a valid email address.' });
    }

    const attachment = photoDataUrl ? attachmentFromDataUrl(photoDataUrl, photoName) : undefined;
    if (photoDataUrl && !attachment) {
        return jsonResponse(400, { error: 'Unable to attach that photo. Please try another image.' });
    }

    const apiKey = getServerEnv('BREVO_API_KEY');
    if (!apiKey) {
        console.error('Contact API: BREVO_API_KEY missing.');
        return jsonResponse(503, {
            error: 'We could not send your message right now. Please call or text us at (610) 412-6424.',
        });
    }

    const recipientsRaw = getServerEnv('CONTACT_NOTIFY_EMAILS') || DEFAULT_RECIPIENTS;
    const recipients = parseRecipients(recipientsRaw);
    if (recipients.length === 0) {
        console.error('Contact API: no valid recipients configured.');
        return jsonResponse(500, {
            error: 'We could not send your message right now. Please call or text us at (610) 412-6424.',
        });
    }

    const fromEmail = getServerEnv('CONTACT_FROM_EMAIL') || DEFAULT_FROM_EMAIL;
    const fromName = getServerEnv('CONTACT_FROM_NAME') || DEFAULT_FROM_NAME;
    const replyTo = email || getServerEnv('CONTACT_REPLY_TO') || DEFAULT_REPLY_TO;

    const sourceUrl = request.headers.get('referer') || '';
    const timestamp = new Date().toISOString();
    const textBody = buildTextEmail({
        name,
        email,
        phone,
        message,
        sourceUrl,
        timestamp,
        estimateRequest,
    });
    const htmlBody = buildHtmlEmail({
        name,
        email,
        phone,
        message,
        sourceUrl,
        timestamp,
        estimateRequest,
    });
    const subjectProject = estimateRequest?.projectLabel ? ` - ${estimateRequest.projectLabel}` : '';

    const brevoBody = {
        sender: { email: fromEmail, name: fromName },
        to: recipients,
        replyTo: { email: replyTo },
        subject: `New estimate request - ${name}${subjectProject}`,
        textContent: textBody,
        htmlContent: htmlBody,
        ...(attachment ? { attachment: [attachment] } : {}),
        tags: ['hoehne-contact'],
    };

    try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(brevoBody),
        });

        if (!res.ok) {
            const errText = await res.text().catch(() => '');
            console.error('Contact API: Brevo send failed', res.status, errText);
            return jsonResponse(502, {
                error: 'We could not send your message right now. Please call or text us at (610) 412-6424.',
            });
        }

        return jsonResponse(200, { ok: true });
    } catch (err) {
        console.error('Contact API: send error', err);
        return jsonResponse(500, {
            error: 'We could not send your message right now. Please call or text us at (610) 412-6424.',
        });
    }
};

function validEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildTextEmail({
    name,
    email,
    phone,
    message,
    sourceUrl,
    timestamp,
    estimateRequest,
}: {
    name: string;
    email: string;
    phone: string;
    message: string;
    sourceUrl: string;
    timestamp: string;
    estimateRequest?: EstimateRequest;
}) {
    if (!estimateRequest) {
        return [
            'New estimate request from the Hoehne Property Maintenance website.',
            '',
            `Name: ${name}`,
            email ? `Email: ${email}` : '',
            `Phone: ${phone}`,
            '',
            'Project details:',
            message,
            '',
            sourceUrl ? `Source URL: ${sourceUrl}` : '',
            `Submitted: ${timestamp}`,
        ]
            .filter(Boolean)
            .join('\n');
    }

    return [
        'New estimate request from the Hoehne Property Maintenance website.',
        '',
        'Customer:',
        `Name: ${name}`,
        email ? `Email: ${email}` : '',
        `Phone: ${phone}`,
        estimateRequest.address ? `Address or town: ${estimateRequest.address}` : '',
        '',
        'Planning range:',
        `${estimateRequest.projectLabel}: ${estimateRequest.rangeLow} to ${estimateRequest.rangeHigh}`,
        '',
        'Project details:',
        ...estimateRequest.answers.map((answer) => `${answer.label}: ${answer.value}`),
        '',
        estimateRequest.lineItems.length ? 'What this includes:' : '',
        ...estimateRequest.lineItems.map((item) => `${item.label}: ${item.low} to ${item.high}`),
        '',
        'Photos:',
        `Photo attached: ${estimateRequest.photoAttached ? estimateRequest.photoName || 'Yes' : 'No'}`,
        estimateRequest.photoNotes ? `Photo notes:\n${estimateRequest.photoNotes}` : '',
        estimateRequest.notes ? `\nAdditional notes:\n${estimateRequest.notes}` : '',
        '',
        sourceUrl ? `Source URL: ${sourceUrl}` : '',
        `Submitted: ${timestamp}`,
    ]
        .filter(Boolean)
        .join('\n');
}

function buildHtmlEmail({
    name,
    email,
    phone,
    message,
    sourceUrl,
    timestamp,
    estimateRequest,
}: {
    name: string;
    email: string;
    phone: string;
    message: string;
    sourceUrl: string;
    timestamp: string;
    estimateRequest?: EstimateRequest;
}) {
    const submittedAt = formatSubmittedAt(timestamp);
    const safeSourceHref = safeHttpUrl(sourceUrl);
    const sourceHtml = safeSourceHref
        ? `<a href="${escapeAttr(safeSourceHref)}" style="color:#7a7468;text-decoration:none;">${escapeHtml(safeSourceHref)}</a>`
        : 'Hoehne Property Maintenance website';
    const projectLabel = estimateRequest?.projectLabel || 'Project details';
    const rangeText =
        estimateRequest?.rangeLow && estimateRequest.rangeHigh
            ? `${estimateRequest.rangeLow} to ${estimateRequest.rangeHigh}`
            : 'See project details';
    const preheader = `New estimate request from ${name}${estimateRequest?.projectLabel ? ` for ${estimateRequest.projectLabel}` : ''}.`;

    return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f1ed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f4f1ed;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #ded8cc;">
          <tr>
            <td style="background:#101010;color:#ffffff;padding:22px 24px;">
              <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#c2510f;font-weight:800;">Hoehne Property Maintenance</div>
              <div style="font-size:24px;line-height:1.15;font-weight:900;margin-top:6px;">New Estimate Request</div>
              <div style="font-size:13px;line-height:1.5;color:#b8b3ad;margin-top:6px;">Submitted from the website estimate form</div>
            </td>
          </tr>
          ${section('Customer', tableRows([
              { label: 'Name', value: escapeHtml(name) },
              { label: 'Phone', value: phoneLink(phone) },
              { label: 'Email', value: email ? emailLink(email) : '' },
              { label: 'Address or town', value: escapeHtml(estimateRequest?.address || '') },
          ]))}
          <tr>
            <td style="padding:6px 24px 18px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fbf7ef;border-left:5px solid #c2510f;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7a7468;font-weight:800;">Planning Range</div>
                    <div style="font-size:28px;line-height:1.1;color:#1a1a1a;font-weight:900;margin-top:6px;">${escapeHtml(rangeText)}</div>
                    <div style="font-size:14px;line-height:1.5;color:#5a5346;margin-top:4px;">${escapeHtml(projectLabel)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${
              estimateRequest
                  ? section(
                        'Project Details',
                        tableRows(estimateRequest.answers.map((answer) => ({ label: answer.label, value: escapeHtml(answer.value) }))),
                    )
                  : section('Project Details', messageBlock(message))
          }
          ${
              estimateRequest?.lineItems.length
                  ? section(
                        'What This Includes',
                        lineItemRows(estimateRequest.lineItems),
                    )
                  : ''
          }
          ${
              estimateRequest
                  ? section(
                        'Photos',
                        tableRows([
                            {
                                label: 'Photo attached',
                                value: escapeHtml(estimateRequest.photoAttached ? estimateRequest.photoName || 'Yes' : 'No'),
                            },
                        ]) + (estimateRequest.photoNotes ? messageBlock(estimateRequest.photoNotes) : ''),
                    )
                  : ''
          }
          ${estimateRequest?.notes ? section('Additional Notes', messageBlock(estimateRequest.notes)) : ''}
          <tr>
            <td style="background:#f4f1ed;padding:16px 24px;border-top:1px solid #ded8cc;font-size:12px;line-height:1.6;color:#7a7468;">
              Submitted ${escapeHtml(submittedAt)}<br />
              Source: ${sourceHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function section(title: string, body: string) {
    if (!body) return '';
    return `<tr>
            <td style="padding:22px 24px 6px 24px;">
              <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7a7468;font-weight:800;margin-bottom:10px;">${escapeHtml(title)}</div>
              ${body}
            </td>
          </tr>`;
}

function tableRows(rows: { label: string; value: string }[]) {
    const visibleRows = rows.filter((row) => row.value);
    if (visibleRows.length === 0) return '';
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;line-height:1.5;border-top:1px solid #ece7dc;">
                ${visibleRows
                    .map(
                        (row) => `<tr>
                  <td style="padding:9px 0;width:38%;color:#7a7468;border-bottom:1px solid #ece7dc;vertical-align:top;">${escapeHtml(row.label)}</td>
                  <td style="padding:9px 0;border-bottom:1px solid #ece7dc;vertical-align:top;color:#1a1a1a;font-weight:600;">${row.value}</td>
                </tr>`,
                    )
                    .join('')}
              </table>`;
}

function lineItemRows(items: EstimateLineItem[]) {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;line-height:1.5;border-top:1px solid #ece7dc;">
              ${items
                  .map(
                      (item) => `<tr>
                <td style="padding:9px 0;border-bottom:1px solid #ece7dc;vertical-align:top;">
                  <div style="font-weight:700;color:#1a1a1a;">${escapeHtml(item.label)}</div>
                  ${item.category ? `<div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#9a9285;margin-top:2px;">${escapeHtml(item.category)}</div>` : ''}
                </td>
                <td align="right" style="padding:9px 0;border-bottom:1px solid #ece7dc;vertical-align:top;color:#1a1a1a;font-weight:800;white-space:nowrap;">${escapeHtml(item.low)} to ${escapeHtml(item.high)}</td>
              </tr>`,
                  )
                  .join('')}
            </table>`;
}

function messageBlock(value: string) {
    if (!value.trim()) return '';
    return `<div style="font-size:14px;line-height:1.65;color:#1a1a1a;background:#fbfaf7;border:1px solid #ece7dc;padding:14px 16px;white-space:pre-wrap;">${nl2br(value)}</div>`;
}

function phoneLink(phone: string) {
    const href = phone.replace(/[^\d+]/g, '');
    return href
        ? `<a href="tel:${escapeAttr(href)}" style="color:#c2510f;text-decoration:none;font-weight:800;">${escapeHtml(phone)}</a>`
        : escapeHtml(phone);
}

function emailLink(email: string) {
    return `<a href="mailto:${escapeAttr(email)}" style="color:#c2510f;text-decoration:none;font-weight:800;">${escapeHtml(email)}</a>`;
}

function nl2br(value: string) {
    return escapeHtml(value).replace(/\n/g, '<br />');
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(value: string) {
    return escapeHtml(value);
}

function safeHttpUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
    } catch {
        return '';
    }
}

function formatSubmittedAt(timestamp: string) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return timestamp;
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'America/New_York',
    }).format(date);
}

function attachmentFromDataUrl(dataUrl: string, rawName: string) {
    if (dataUrl.length > MAX_ATTACHMENT_DATA_URL_LENGTH) return undefined;
    const match = dataUrl.match(/^data:image\/(png|jpe?g|webp);base64,([a-z0-9+/=]+)$/i);
    if (!match) return undefined;
    const extension = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
    const fallback = `project-photo.${extension}`;
    const safeName = rawName
        .replace(/[^a-z0-9._-]/gi, '-')
        .replace(/-+/g, '-')
        .slice(0, 90);
    return {
        name: safeName || fallback,
        content: match[2],
    };
}
