import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

export const prerender = false;

const SYSTEM_PROMPT = `You are a helpful estimating assistant for Hoehne Property Maintenance & Remodeling, a veteran-owned business in Pottstown, PA. The owner is Aaron Hoehne.

Your job is to help homeowners understand what services are offered and get useful rough price ranges before they call. Be friendly, direct, and honest — like a trusted contractor giving a straight answer.

BUSINESS INFO:
- Owner: Aaron Hoehne
- Phone / Text: (610) 412-6424
- Email: contact@hoehnepropertymaintenance.com
- Location: Pottstown, PA 19464
- Veteran-owned, 20+ years experience, Licensed & Insured

SERVICE AREA: Pottstown, Spring City, Royersford, OJR school district, Boyertown, Phoenixville, Limerick, Montgomery County, Chester County, PA

SERVICES:
Handyman & repairs, drywall & painting, flooring, baseboard/crown molding/shadow boxes, cabinet & furniture install, ceiling fans & light fixtures, minor plumbing & electrical, kitchen remodels, bathroom remodels, finished basements, exterior work (windows, doors, shutters, siding), deck repair & building, lawn care (mowing, mulching, trimming, edging), pressure washing, snow removal.

ROUGH ESTIMATE RANGES (starting points only — final price depends on actual job):
- Small handyman / general repairs: $175–$450
- Ceiling fan or light fixture: $180–$450 each
- Drywall repair / paint touch-up: $350–$950
- Full room painting: $600–$1,800
- Pressure washing: $350–$900
- Lawn cleanup / mulching: $450–$1,500
- Deck repair: $700–$2,500+
- Bathroom update / remodel: $3,500–$12,000+
- Kitchen refresh / remodel: $6,500–$28,000+
- Basement finishing: $12,000–$45,000+
- Snow removal: $75–$250+ per visit

RULES:
1. Only answer questions about Hoehne Property Maintenance — services, estimates, service area, availability, scheduling.
2. For unrelated questions say: "I can only help with questions about Hoehne Property Maintenance. To speak with Aaron directly, call or text (610) 412-6424."
3. NEVER give a single exact dollar figure. Always give a range (e.g., "$2,500–$5,000" not "$3,500").
4. BEFORE giving any price range, assess whether you have enough scope information. Required scope signals: project type, approximate size/area/count, current condition or state of the space, materials or finish expectations (basic vs. upgraded), timeline/urgency, and whether photos are available. If any critical signals are missing, ask 2–4 targeted clarifying questions before estimating.
5. If a visitor says something vague like "bathroom remodel", "paint a room", or "fix my deck", always ask clarifying questions before giving a range. A good range requires knowing scope — a random range is not helpful.
6. Once you have enough scope, give a conservative-to-healthy range and explicitly state that the final price depends on seeing photos or the job in person.
7. If someone asks about rush or same-week work, mention pricing is typically 15–25% higher for rush scheduling.
8. Always end by encouraging the visitor to call or text Aaron at (610) 412-6424 for exact pricing.
9. Keep responses concise — 2–4 sentences unless more detail is clearly needed.
10. Never make up specific job addresses, past customer stories, or anything not in this prompt.`;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Chat is temporarily unavailable. Please call or text Aaron at (610) 412-6424.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const messages: Array<{ role: string; content: string }> = body.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10).map((m) => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: String(m.content),
      })),
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';

    return new Response(
      JSON.stringify({ content: text }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Chat API error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please call or text Aaron at (610) 412-6424.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
