import type { APIRoute } from 'astro';

import { BREAKTHROUGH_SERVICE_OPTIONS, getAvailableSlots, isValidTimezone } from '../../../lib/server/calendly';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const timezone =
            typeof body.timezone === 'string' && isValidTimezone(body.timezone)
                ? body.timezone
                : 'America/New_York';

        const slots = await getAvailableSlots();

        return new Response(
            JSON.stringify({
                serviceOptions: BREAKTHROUGH_SERVICE_OPTIONS,
                slots,
                timezone,
            }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load availability';

        return new Response(JSON.stringify({ error: message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
};
