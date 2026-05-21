import type { APIRoute } from 'astro';
import { getServerEnv } from '../../lib/server/runtime-env';

export const prerender = false;

const DEFAULT_RECIPIENTS = 'aaron@hoehnepropertymaintenance.com,tyler@szakacsmedia.com';
const DEFAULT_FROM_EMAIL = 'tyler@mail.szakacsmedia.com';
const DEFAULT_FROM_NAME = 'Hoehne Property Maintenance Website';
const DEFAULT_REPLY_TO = 'tyler@szakacsmedia.com';
const MAX_ATTACHMENT_DATA_URL_LENGTH = 6_500_000;

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

    const textBody = [
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

    const brevoBody = {
        sender: { email: fromEmail, name: fromName },
        to: recipients,
        replyTo: { email: replyTo },
        subject: `New estimate request - ${name}`,
        textContent: textBody,
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
