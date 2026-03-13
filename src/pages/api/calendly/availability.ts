import type { APIRoute } from 'astro';

import { json, options } from '../../../lib/server/api-response';
import { BREAKTHROUGH_SERVICE_OPTIONS, getAvailableSlots, isValidTimezone } from '../../../lib/server/calendly';

export const prerender = false;
export const OPTIONS: APIRoute = async ({ request }) => options(request);

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const timezone =
            typeof body.timezone === 'string' && isValidTimezone(body.timezone)
                ? body.timezone
                : 'America/New_York';

        const slots = await getAvailableSlots();

        return json(request, 200, {
            serviceOptions: BREAKTHROUGH_SERVICE_OPTIONS,
            slots,
            timezone,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load availability';

        return json(request, 500, { error: message });
    }
};
