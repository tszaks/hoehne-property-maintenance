import type { APIRoute } from 'astro';

import { createInvitee, isValidEmail, isValidTimezone, normalizeServiceInterest } from '../../../lib/server/calendly';

export const prerender = false;

function json(status: number, body: Record<string, unknown>) {
    return new Response(JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json' },
        status,
    });
}

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
        return json(400, { error: 'Missing booking details' });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const challenge = typeof body.challenge === 'string' ? body.challenge.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const serviceInterest = typeof body.serviceInterest === 'string' ? body.serviceInterest.trim() : '';
    const startTime = typeof body.startTime === 'string' ? body.startTime.trim() : '';
    const timezone = typeof body.timezone === 'string' ? body.timezone.trim() : '';

    if (!name) {
        return json(400, { error: 'Full name is required' });
    }

    if (!isValidEmail(email)) {
        return json(400, { error: 'A valid email is required' });
    }

    if (!isValidTimezone(timezone)) {
        return json(400, { error: 'A valid timezone is required' });
    }

    if (!startTime) {
        return json(400, { error: 'Pick a time before booking' });
    }

    try {
        const invitee = await createInvitee({
            challenge,
            email,
            name,
            serviceInterest: normalizeServiceInterest(serviceInterest),
            startTime,
            timezone,
        });

        return json(200, {
            cancelUrl: invitee.cancel_url,
            event: invitee.event,
            rescheduleUrl: invitee.reschedule_url,
            timezone: invitee.timezone ?? timezone,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to book that time';
        return json(500, { error: message });
    }
};
