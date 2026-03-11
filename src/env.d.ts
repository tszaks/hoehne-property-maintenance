/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly ANTHROPIC_API_KEY?: string;
    readonly CALENDLY_EVENT_TYPE_URI?: string;
    readonly CALENDLY_PAT?: string;
    readonly CALENDLY_SERVICE_QUESTION?: string;
    readonly DATABASE_URL?: string;
    readonly GRANT_INBOX_TOKEN?: string;
    readonly GRANT_SUMMARY_REPLY_TO?: string;
    readonly GRANT_SUMMARY_TO_EMAILS?: string;
    readonly RESEND_API_KEY?: string;
    readonly RESEND_FROM_EMAIL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
