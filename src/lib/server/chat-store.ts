import postgres from 'postgres';

export type StoredMessage = {
    content: string;
    role: 'assistant' | 'user';
};

export type StoredBooking = {
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

export type ChatSummary = {
    authorityHook: string;
    companyClues: string;
    disposition: 'booked' | 'follow_up' | 'not_a_fit' | 'unknown';
    dominantLossFrame: string;
    fit: 'high' | 'low' | 'medium';
    nextStep: string;
    noteToGreg: string;
    noteToImproveGrant: string;
    objection: string;
    ownerPain: string;
    reactancePosture: string;
    serviceInterest: string;
    summary: string;
    subjectLine: string;
};

export type ChatSessionRecord = {
    booked: boolean;
    bookingStartTime: string | null;
    bookingState: StoredBooking;
    challenge: string | null;
    createdAt: string;
    finalizedAt: string | null;
    leadEmail: string | null;
    leadName: string | null;
    leadTimezone: string | null;
    messages: StoredMessage[];
    serviceInterest: string | null;
    sessionId: string;
    summary: string | null;
    summaryJson: ChatSummary | null;
    summaryReason: string | null;
    summarySentAt: string | null;
    updatedAt: string;
};

type SaveChatSessionInput = {
    booking?: StoredBooking;
    messages: StoredMessage[];
    sessionId: string;
};

type SaveChatSummaryInput = {
    reason: string;
    sessionId: string;
    summary: ChatSummary;
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

function mapChatSession(row: Record<string, unknown>): ChatSessionRecord {
    return {
        booked: Boolean(row.booked),
        bookingStartTime: (row.booking_start_time as string | null) ?? null,
        bookingState: (row.booking_state as StoredBooking) ?? {},
        challenge: (row.challenge as string | null) ?? null,
        createdAt: String(row.created_at),
        finalizedAt: (row.finalized_at as string | null) ?? null,
        leadEmail: (row.lead_email as string | null) ?? null,
        leadName: (row.lead_name as string | null) ?? null,
        leadTimezone: (row.lead_timezone as string | null) ?? null,
        messages: ((row.transcript as StoredMessage[]) ?? []).filter(Boolean),
        serviceInterest: (row.service_interest as string | null) ?? null,
        sessionId: String(row.session_id),
        summary: (row.summary as string | null) ?? null,
        summaryJson: (row.summary_json as ChatSummary | null) ?? null,
        summaryReason: (row.summary_reason as string | null) ?? null,
        summarySentAt: (row.summary_sent_at as string | null) ?? null,
        updatedAt: String(row.updated_at),
    };
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
                    summary_json jsonb,
                    summary_reason text,
                    finalized_at timestamptz,
                    summary_sent_at timestamptz,
                    created_at timestamptz not null default now(),
                    updated_at timestamptz not null default now()
                )
            `;

            await sql`alter table chat_sessions add column if not exists summary_json jsonb`;
            await sql`alter table chat_sessions add column if not exists summary_reason text`;
            await sql`alter table chat_sessions add column if not exists finalized_at timestamptz`;
            await sql`alter table chat_sessions add column if not exists summary_sent_at timestamptz`;

            await sql`
                create index if not exists chat_sessions_updated_at_idx
                on chat_sessions (updated_at desc)
            `;

            await sql`
                create index if not exists chat_sessions_summary_sent_at_idx
                on chat_sessions (summary_sent_at desc nulls last)
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

export async function getChatSession(sessionId: string) {
    await ensureSchema();

    const sql = getSql();
    const rows = await sql`
        select *
        from chat_sessions
        where session_id = ${sessionId}
        limit 1
    `;

    return rows[0] ? mapChatSession(rows[0]) : null;
}

export async function listChatSessions(limit = 50) {
    await ensureSchema();

    const sql = getSql();
    const rows = await sql`
        select *
        from chat_sessions
        order by updated_at desc
        limit ${limit}
    `;

    return rows.map(mapChatSession);
}

export async function saveChatSummary(input: SaveChatSummaryInput) {
    await ensureSchema();

    const sql = getSql();

    await sql`
        update chat_sessions
        set
            summary = ${input.summary.summary},
            summary_json = ${sql.json(input.summary)},
            summary_reason = ${input.reason},
            finalized_at = coalesce(finalized_at, now()),
            updated_at = now()
        where session_id = ${input.sessionId}
    `;
}

export async function markChatSummarySent(sessionId: string) {
    await ensureSchema();

    const sql = getSql();

    await sql`
        update chat_sessions
        set
            summary_sent_at = now(),
            updated_at = now()
        where session_id = ${sessionId}
    `;
}
