/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly ANTHROPIC_API_KEY?: string;
    readonly CALENDLY_EVENT_TYPE_URI?: string;
    readonly CALENDLY_PAT?: string;
    readonly CALENDLY_SERVICE_QUESTION?: string;
    readonly DATABASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
