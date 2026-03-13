const buildEnv = import.meta.env as Record<string, string | undefined>;

export function getServerEnv(key: string) {
    return process.env[key] ?? buildEnv[key];
}
