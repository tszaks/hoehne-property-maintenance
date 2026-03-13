import { getServerEnv } from './runtime-env';

const CALENDLY_API_BASE = 'https://api.calendly.com';
const DEFAULT_WINDOW_DAYS = 7;
const DEFAULT_SLOT_LIMIT = 5;

export const BREAKTHROUGH_SERVICE_OPTIONS = [
    'Online Mastermind Groups',
    'GNA Academy Self-Guided Online Curriculum',
    '1-on-1 Coaching',
    'Exit Strategy / Preparing for Sale',
] as const;

export const DEFAULT_SERVICE_QUESTION = 'Which GNA services are you most interested in?';

type CalendlyCollectionResponse<T> = {
    collection?: T[];
    resource?: T;
    title?: string;
    message?: string;
    details?: Array<{ message?: string }>;
};

type CalendlySlot = {
    invitees_remaining: number;
    scheduling_url: string;
    start_time: string;
    status: string;
};

type CalendlyEventType = {
    custom_questions?: Array<{
        answer_choices?: string[];
        name?: string;
        position?: number;
        required?: boolean;
        type?: string;
    }>;
    locations?: Array<{ kind?: string }>;
};

type BookingInput = {
    challenge?: string;
    email: string;
    name: string;
    serviceInterest: string;
    startTime: string;
    timezone: string;
};

function getConfig() {
    const pat = getServerEnv('CALENDLY_PAT');
    const eventTypeUri = getServerEnv('CALENDLY_EVENT_TYPE_URI');
    const serviceQuestion = getServerEnv('CALENDLY_SERVICE_QUESTION') ?? DEFAULT_SERVICE_QUESTION;

    if (!pat || !eventTypeUri) {
        throw new Error('Calendly is not configured');
    }

    return { eventTypeUri, pat, serviceQuestion };
}

function isCalendlyErrorPayload(value: unknown): value is CalendlyCollectionResponse<unknown> {
    return typeof value === 'object' && value !== null;
}

function getCalendlyErrorMessage(payload: unknown) {
    if (!isCalendlyErrorPayload(payload)) {
        return 'Calendly request failed';
    }

    const detail = payload.details?.find((item) => item.message)?.message;
    return detail ?? payload.message ?? payload.title ?? 'Calendly request failed';
}

async function calendlyFetch<T>(path: string, init?: RequestInit) {
    const { pat } = getConfig();

    const response = await fetch(`${CALENDLY_API_BASE}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${pat}`,
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        const error = new Error(getCalendlyErrorMessage(data));
        (error as Error & { status?: number }).status = response.status;
        throw error;
    }

    return data as T;
}

export function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidTimezone(value: string) {
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date());
        return true;
    } catch {
        return false;
    }
}

export function normalizeServiceInterest(value: string) {
    const directMatch = BREAKTHROUGH_SERVICE_OPTIONS.find((option) => option === value);
    if (directMatch) {
        return directMatch;
    }

    const normalized = value.trim().toLowerCase();

    if (normalized.includes('exit') || normalized.includes('sale') || normalized.includes('succession')) {
        return 'Exit Strategy / Preparing for Sale';
    }

    if (normalized.includes('mastermind') || normalized.includes('group')) {
        return 'Online Mastermind Groups';
    }

    if (
        normalized.includes('academy') ||
        normalized.includes('curriculum') ||
        normalized.includes('self-guided') ||
        normalized.includes('self guided')
    ) {
        return 'GNA Academy Self-Guided Online Curriculum';
    }

    return '1-on-1 Coaching';
}

export async function getAvailableSlots(limit = DEFAULT_SLOT_LIMIT) {
    const { eventTypeUri } = getConfig();
    const start = new Date();
    start.setUTCDate(start.getUTCDate() + 1);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + DEFAULT_WINDOW_DAYS);

    const params = new URLSearchParams({
        end_time: end.toISOString(),
        event_type: eventTypeUri,
        start_time: start.toISOString(),
    });

    const response = await calendlyFetch<CalendlyCollectionResponse<CalendlySlot>>(
        `/event_type_available_times?${params.toString()}`
    );

    return (response.collection ?? [])
        .filter((slot) => slot.status === 'available')
        .slice(0, limit)
        .map((slot) => ({
            inviteesRemaining: slot.invitees_remaining,
            schedulingUrl: slot.scheduling_url,
            startTime: slot.start_time,
            status: slot.status,
        }));
}

async function getEventTypeDetails() {
    const { eventTypeUri } = getConfig();
    const url = new URL(eventTypeUri);
    const response = await calendlyFetch<CalendlyCollectionResponse<CalendlyEventType>>(url.pathname);
    return response.resource ?? {};
}

export async function createInvitee(input: BookingInput) {
    const { eventTypeUri, serviceQuestion } = getConfig();
    const serviceInterest = normalizeServiceInterest(input.serviceInterest);
    const eventType = await getEventTypeDetails();
    const locationKind = eventType.locations?.[0]?.kind;
    const requiredQuestions = eventType.custom_questions?.filter((question) => question.required) ?? [];
    const questionsAndAnswers =
        requiredQuestions.length > 0
            ? requiredQuestions.flatMap((question) => {
                  const questionName = question.name?.trim();
                  if (!questionName) {
                      return [];
                  }

                  const lowerName = questionName.toLowerCase();
                  const answer =
                      question.type === 'multi_select' ||
                      lowerName.includes('service') ||
                      lowerName.includes('interested')
                          ? serviceInterest
                          : input.challenge?.trim() || serviceInterest;

                  return [
                      {
                          answer,
                          position: question.position ?? 0,
                          question: questionName,
                      },
                  ];
              })
            : [
                  {
                      answer: serviceInterest,
                      position: 0,
                      question: serviceQuestion,
                  },
              ];

    const payload = {
        event_type: eventTypeUri,
        invitee: {
            email: input.email,
            name: input.name,
            timezone: input.timezone,
        },
        ...(locationKind ? { location: { kind: locationKind } } : {}),
        questions_and_answers: questionsAndAnswers,
        start_time: input.startTime,
    };

    const response = await calendlyFetch<CalendlyCollectionResponse<Record<string, unknown>>>('/invitees', {
        body: JSON.stringify(payload),
        method: 'POST',
    });

    return response.resource ?? {};
}
