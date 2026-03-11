import type { APIRoute } from 'astro';

import { finalizeChatSession, type FinalizeReason } from '../../../lib/server/chat-ops';
import { saveChatSession } from '../../../lib/server/chat-store';

export const prerender = false;

function json(status: number, body: Record<string, unknown>) {
    return new Response(JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json' },
        status,
    });
}

async function parseBody(request: Request) {
    const text = await request.text().catch(() => '');
    if (!text) return null;

    try {
        return JSON.parse(text) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function isFinalizeReason(value: unknown): value is FinalizeReason {
    return value === 'booked' || value === 'closed' || value === 'idle' || value === 'pagehide';
}

export const POST: APIRoute = async ({ request }) => {
    const body = await parseBody(request);

    if (!body || typeof body !== 'object') {
        return json(400, { error: 'Missing finalize payload' });
    }

    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
    const reason = isFinalizeReason(body.reason) ? body.reason : 'closed';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const booking = typeof body.booking === 'object' && body.booking !== null ? body.booking : undefined;

    if (!sessionId) {
        return json(400, { error: 'Missing session id' });
    }

    try {
        if (messages.length > 0) {
            await saveChatSession({ booking, messages, sessionId });
        }

        const result = await finalizeChatSession(sessionId, reason);

        return json(200, {
            ok: true,
            status: result.status,
            summary: result.summary ?? null,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to finalize chat session';
        return json(500, { error: message });
    }
};
