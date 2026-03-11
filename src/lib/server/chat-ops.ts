import Anthropic from '@anthropic-ai/sdk';

import {
    getChatSession,
    markChatSummarySent,
    saveChatSummary,
    type ChatSessionRecord,
    type ChatSummary,
} from './chat-store';

export type FinalizeReason = 'booked' | 'closed' | 'idle' | 'pagehide';

const DEFAULT_SUMMARY_RECIPIENTS = 'greg@gnaworks.com,tylerszakacs@gmail.com';
const DEFAULT_FROM_EMAIL = 'GNA Works <onboarding@resend.dev>';
const DEFAULT_REPLY_TO_EMAIL = 'greg@gnaworks.com';

function getAnthropicClient() {
    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    return apiKey ? new Anthropic({ apiKey }) : null;
}

function getSummaryRecipients() {
    const raw = import.meta.env.GRANT_SUMMARY_TO_EMAILS ?? DEFAULT_SUMMARY_RECIPIENTS;
    return raw
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
}

function getInboxUrl(sessionId: string) {
    const token = import.meta.env.GRANT_INBOX_TOKEN;
    if (!token) return null;

    return `https://www.gnaworks.com/grant-inbox?token=${encodeURIComponent(token)}&session=${encodeURIComponent(sessionId)}`;
}

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function formatTranscript(session: ChatSessionRecord) {
    return session.messages
        .map((message) => `${message.role === 'assistant' ? 'Grant' : 'Visitor'}: ${message.content}`)
        .join('\n');
}

function buildFallbackSummary(session: ChatSessionRecord, reason: FinalizeReason): ChatSummary {
    const booked = session.booked || reason === 'booked';
    const ownerPain = session.challenge ?? 'Owner shared general business pressure but no single dominant pain.';
    const serviceInterest = session.serviceInterest ?? '1-on-1 Coaching';

    return {
        authorityHook: booked ? 'Scheduled call with Greg' : 'Greg sees this pattern often in owner-led businesses',
        companyClues: session.challenge ?? 'Not enough company detail collected yet.',
        disposition: booked ? 'booked' : 'follow_up',
        dominantLossFrame: booked ? 'owner dependency' : 'growth drag',
        fit: booked ? 'high' : session.leadEmail ? 'medium' : 'low',
        nextStep: booked
            ? 'Greg should review the transcript before the scheduled call.'
            : session.leadEmail
              ? 'Follow up with a short personal email and invite them back to book.'
              : 'No direct follow-up path yet. Review transcript for objections and tighten Grant if needed.',
        noteToGreg: session.leadEmail
            ? `Lead email: ${session.leadEmail}. Main issue: ${ownerPain}`
            : ownerPain,
        noteToImproveGrant: 'Watch for the main objection and tighten the follow-up question around it.',
        objection: booked ? 'No major objection blocked the call.' : 'Conversation ended before a booking.',
        ownerPain,
        reactancePosture: booked ? 'open' : session.leadEmail ? 'guarded' : 'unknown',
        serviceInterest,
        subjectLine: booked
            ? `Grant booked a Breakthrough call with ${session.leadName ?? 'a new lead'}`
            : `Grant chat recap: ${session.leadName ?? 'anonymous visitor'}`,
        summary: booked
            ? `${session.leadName ?? 'A lead'} booked a Breakthrough with Greg. Main pain: ${ownerPain}`
            : `${session.leadName ?? 'A visitor'} chatted with Grant but did not book. Main pain: ${ownerPain}`,
    };
}

function extractJsonObject(text: string) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
        throw new Error('No JSON object found in summary response');
    }

    return JSON.parse(match[0]) as ChatSummary;
}

async function generateChatSummary(session: ChatSessionRecord, reason: FinalizeReason) {
    const client = getAnthropicClient();
    if (!client) {
        return buildFallbackSummary(session, reason);
    }

    const response = await client.messages.create({
        max_tokens: 700,
        model: 'claude-haiku-4-5-20251001',
        system: `You summarize inbound chats for Greg Neil / GNA Works.

Return valid JSON only with these exact keys:
- subjectLine
- summary
- fit
- disposition
- ownerPain
- companyClues
- serviceInterest
- objection
- nextStep
- noteToGreg
- noteToImproveGrant
- dominantLossFrame
- reactancePosture
- authorityHook

Rules:
- fit must be high, medium, or low
- disposition must be booked, follow_up, not_a_fit, or unknown
- keep every field concise and useful
- write for business owners and operators, not marketers
- noteToImproveGrant should describe one concrete psychologically informed sales/coaching improvement based on this transcript
- prefer practical lenses like loss framing, emotional labeling, lowering reactance, specificity, status, authority, commitment, or reducing choice overload
- do not encourage Grant to overteach or give away the full solution before the call`,
        messages: [
            {
                content: `Reason finalized: ${reason}
Booked: ${session.booked}
Lead name: ${session.leadName ?? 'unknown'}
Lead email: ${session.leadEmail ?? 'unknown'}
Service interest: ${session.serviceInterest ?? 'unknown'}
Challenge: ${session.challenge ?? 'unknown'}

Transcript:
${formatTranscript(session)}`,
                role: 'user',
            },
        ],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';

    try {
        return extractJsonObject(text);
    } catch {
        return buildFallbackSummary(session, reason);
    }
}

async function sendSummaryEmail(session: ChatSessionRecord, summary: ChatSummary) {
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
        return false;
    }

    const to = getSummaryRecipients();
    if (!to.length) {
        return false;
    }

    const replyTo = import.meta.env.GRANT_SUMMARY_REPLY_TO ?? DEFAULT_REPLY_TO_EMAIL;
    const from = import.meta.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM_EMAIL;
    const inboxUrl = getInboxUrl(session.sessionId);
    const transcript = formatTranscript(session);
    const html = `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
            <h2 style="margin-bottom: 8px;">${escapeHtml(summary.subjectLine)}</h2>
            <p style="margin: 0 0 16px;">${escapeHtml(summary.summary)}</p>
            <p><strong>Fit:</strong> ${escapeHtml(summary.fit)}</p>
            <p><strong>Disposition:</strong> ${escapeHtml(summary.disposition)}</p>
            <p><strong>Main pain:</strong> ${escapeHtml(summary.ownerPain)}</p>
            <p><strong>Dominant loss frame:</strong> ${escapeHtml(summary.dominantLossFrame)}</p>
            <p><strong>Reactance posture:</strong> ${escapeHtml(summary.reactancePosture)}</p>
            <p><strong>Authority hook:</strong> ${escapeHtml(summary.authorityHook)}</p>
            <p><strong>Service interest:</strong> ${escapeHtml(summary.serviceInterest)}</p>
            <p><strong>Company clues:</strong> ${escapeHtml(summary.companyClues)}</p>
            <p><strong>Objection:</strong> ${escapeHtml(summary.objection)}</p>
            <p><strong>Next step:</strong> ${escapeHtml(summary.nextStep)}</p>
            <p><strong>Note to Greg:</strong> ${escapeHtml(summary.noteToGreg)}</p>
            <p><strong>Grant improvement note:</strong> ${escapeHtml(summary.noteToImproveGrant)}</p>
            ${inboxUrl ? `<p><a href="${inboxUrl}">Open this chat in Grant Inbox</a></p>` : ''}
            <hr style="margin: 24px 0;" />
            <pre style="white-space: pre-wrap; background: #f9fafb; padding: 12px; border: 1px solid #e5e7eb;">${escapeHtml(transcript)}</pre>
        </div>
    `;
    const text = `${summary.subjectLine}

${summary.summary}

Fit: ${summary.fit}
Disposition: ${summary.disposition}
Main pain: ${summary.ownerPain}
Dominant loss frame: ${summary.dominantLossFrame}
Reactance posture: ${summary.reactancePosture}
Authority hook: ${summary.authorityHook}
Service interest: ${summary.serviceInterest}
Company clues: ${summary.companyClues}
Objection: ${summary.objection}
Next step: ${summary.nextStep}
Note to Greg: ${summary.noteToGreg}
Grant improvement note: ${summary.noteToImproveGrant}
${inboxUrl ? `Inbox: ${inboxUrl}` : ''}

Transcript:
${transcript}`;

    const response = await fetch('https://api.resend.com/emails', {
        body: JSON.stringify({
            from,
            html,
            reply_to: replyTo,
            subject: summary.subjectLine,
            text,
            to,
        }),
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });

    return response.ok;
}

export async function finalizeChatSession(sessionId: string, reason: FinalizeReason) {
    const session = await getChatSession(sessionId);

    if (!session || session.messages.filter((message) => message.role === 'user').length === 0) {
        return { status: 'skipped' as const };
    }

    const summary = session.summaryJson ?? (await generateChatSummary(session, reason));

    if (!session.summaryJson) {
        await saveChatSummary({ reason, sessionId, summary });
    }

    if (session.summarySentAt) {
        return { status: 'already-sent' as const, summary };
    }

    const refreshedSession = (await getChatSession(sessionId)) ?? session;
    const sent = await sendSummaryEmail(refreshedSession, summary);

    if (sent) {
        await markChatSummarySent(sessionId);
        return { status: 'sent' as const, summary };
    }

    return { status: 'saved-no-email' as const, summary };
}
