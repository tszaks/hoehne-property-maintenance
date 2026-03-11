import type { APIRoute } from 'astro';

import { saveChatSession } from '../../../lib/server/chat-store';

export const prerender = false;

async function parseBody(request: Request) {
    const text = await request.text().catch(() => '');
    if (!text) return null;

    try {
        return JSON.parse(text) as Record<string, unknown>;
    } catch {
        return null;
    }
}

export const POST: APIRoute = async ({ request }) => {
    const body = await parseBody(request);

    if (!body || typeof body !== 'object') {
        return new Response(JSON.stringify({ error: 'Missing session payload' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const booking = typeof body.booking === 'object' && body.booking !== null ? body.booking : undefined;

    if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Missing session id' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    if (!messages.length) {
        return new Response(JSON.stringify({ error: 'Missing messages' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    try {
        await saveChatSession({ booking, messages, sessionId });

        return new Response(JSON.stringify({ ok: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to save chat session';

        return new Response(JSON.stringify({ error: message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
};
