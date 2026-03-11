import postgres from 'postgres';

type StoredMessage = {
    content: string;
    role: 'assistant' | 'user';
};

type StoredBooking = {
    active?: boolean;
    booked?: boolean;
    draft?: {
        challenge?: string;
        email?: string;
        name?: string;
        serviceInterest?: string;
        startTime?: string;
        timezone?: string;
    };
    phase?: string;
};

type SaveChatSessionInput = {
    booking?: StoredBooking;
    messages: StoredMessage[];
    sessionId: string;
};

let initPromise: Promise<void> | null = null;
let sqlClient: ReturnType<typeof postgres> | null = null;

function getSql() {
    const connectionString = import.meta.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error('Database is not configured');
    }

    if (!sqlClient) {
        sqlClient = postgres(connectionString, {
            idle_timeout: 5,
            max: 1,
            ssl: connectionString.includes('railway.internal') ? undefined : 'require',
        });
    }

    return sqlClient;
}

async function ensureSchema() {
    if (!initPromise) {
        const sql = getSql();

        initPromise = (async () => {
            await sql`
                create table if not exists chat_sessions (
                    session_id text primary key,
                    transcript jsonb not null default '[]'::jsonb,
                    booking_state jsonb not null default '{}'::jsonb,
                    lead_name text,
                    lead_email text,
                    lead_timezone text,
                    challenge text,
                    service_interest text,
                    booked boolean not null default false,
                    booking_start_time timestamptz,
                    summary text,
                    created_at timestamptz not null default now(),
                    updated_at timestamptz not null default now()
                )
            `;

            await sql`
                create index if not exists chat_sessions_updated_at_idx
                on chat_sessions (updated_at desc)
            `;
        })();
    }

    await initPromise;
}

export async function saveChatSession(input: SaveChatSessionInput) {
    await ensureSchema();

    const sql = getSql();
    const booking = input.booking ?? {};
    const draft = booking.draft ?? {};
    const lastUserMessage =
        [...input.messages].reverse().find((message) => message.role === 'user')?.content.trim() ?? null;

    await sql`
        insert into chat_sessions (
            session_id,
            transcript,
            booking_state,
            lead_name,
            lead_email,
            lead_timezone,
            challenge,
            service_interest,
            booked,
            booking_start_time,
            updated_at
        )
        values (
            ${input.sessionId},
            ${sql.json(input.messages)},
            ${sql.json(booking)},
            ${draft.name?.trim() || null},
            ${draft.email?.trim().toLowerCase() || null},
            ${draft.timezone?.trim() || null},
            ${draft.challenge?.trim() || lastUserMessage},
            ${draft.serviceInterest?.trim() || null},
            ${booking.booked === true},
            ${draft.startTime?.trim() || null},
            now()
        )
        on conflict (session_id) do update set
            transcript = excluded.transcript,
            booking_state = excluded.booking_state,
            lead_name = coalesce(excluded.lead_name, chat_sessions.lead_name),
            lead_email = coalesce(excluded.lead_email, chat_sessions.lead_email),
            lead_timezone = coalesce(excluded.lead_timezone, chat_sessions.lead_timezone),
            challenge = coalesce(excluded.challenge, chat_sessions.challenge),
            service_interest = coalesce(excluded.service_interest, chat_sessions.service_interest),
            booked = chat_sessions.booked or excluded.booked,
            booking_start_time = coalesce(excluded.booking_start_time, chat_sessions.booking_start_time),
            updated_at = now()
    `;
}
