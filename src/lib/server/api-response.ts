const ALLOWED_ORIGINS = new Set(["https://gnaworks.com", "https://www.gnaworks.com"]);

function getAllowedOrigin(request: Request) {
    const origin = request.headers.get("origin");
    return origin && ALLOWED_ORIGINS.has(origin) ? origin : null;
}

export function json(request: Request, status: number, body: Record<string, unknown>) {
    const headers = new Headers({ "Content-Type": "application/json" });
    const allowedOrigin = getAllowedOrigin(request);

    if (allowedOrigin) {
        headers.set("Access-Control-Allow-Origin", allowedOrigin);
        headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
    }

    return new Response(JSON.stringify(body), { headers, status });
}

export function options(request: Request) {
    const headers = new Headers();
    const allowedOrigin = getAllowedOrigin(request);

    if (allowedOrigin) {
        headers.set("Access-Control-Allow-Origin", allowedOrigin);
        headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
    }

    return new Response(null, { headers, status: 204 });
}
