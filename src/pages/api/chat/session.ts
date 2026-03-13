import type { APIRoute } from 'astro';

import { json, options } from '../../../lib/server/api-response';
import { saveChatSession } from '../../../lib/server/chat-store';

export const prerender = false;
export const OPTIONS: APIRoute = async ({ request }) => options(request);

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
        return json(request, 400, { error: 'Missing session payload' });
    }

    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const booking = typeof body.booking === 'object' && body.booking !== null ? body.booking : undefined;

    if (!sessionId) {
        return json(request, 400, { error: 'Missing session id' });
    }

    if (!messages.length) {
        return json(request, 400, { error: 'Missing messages' });
    }

    try {
        await saveChatSession({ booking, messages, sessionId });

        return json(request, 200, { ok: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to save chat session';

        return json(request, 500, { error: message });
    }
};
