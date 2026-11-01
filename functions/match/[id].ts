interface MatchPreviewEnv {
    VITE_API_URL?: string;
    SITE_URL?: string;
}

interface MatchPreviewContext {
    request: Request;
    params: Record<string, string | undefined>;
    env: MatchPreviewEnv;
    next: () => Promise<Response>;
}

function escapeHtml(value: unknown) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatMatchDate(value: unknown) {
    const date = new Date(`${String(value ?? "")}Z`);
    if (Number.isNaN(date.getTime())) return String(value ?? "");

    return new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export async function onRequest(context: MatchPreviewContext) {
    const userAgent = context.request.headers.get("user-agent") ?? "";
    if (!/Discordbot\/2\.0/i.test(userAgent)) return context.next();

    const matchId = context.params.id;
    const apiUrl = context.env.VITE_API_URL?.replace(/\/$/, "");
    if (!matchId || !apiUrl) return context.next();

    let response: Response;
    try {
        response = await fetch(
            `${apiUrl}/match_panel?match_id=${encodeURIComponent(matchId)}`,
            { headers: { Accept: "application/json" } },
        );
    } catch {
        return context.next();
    }
    if (!response.ok) return context.next();

    const match = await response.json() as {
        MapID?: string;
        MatchDate?: string;
        Teams?: Record<string, { TeamName?: string; Score?: number; Result?: string }>;
    };
    const teams = Object.values(match.Teams ?? {}).sort((first, second) => {
        if (first.Result === "Win") return -1;
        if (second.Result === "Win") return 1;
        return 0;
    });
    const firstTeam = teams[0];
    const secondTeam = teams[1];
    const title = `${firstTeam?.TeamName ?? "Team"} ${firstTeam?.Score ?? 0}–${secondTeam?.Score ?? 0} ${secondTeam?.TeamName ?? "Team"}`;
    const description = `${match.MapID ?? "Match"} · ${formatMatchDate(match.MatchDate)}`;
    const siteUrl = (context.env.SITE_URL ?? new URL(context.request.url).origin).replace(/\/$/, "");
    const pageUrl = `${siteUrl}/match/${encodeURIComponent(matchId)}`;
    const payload = {
        component: {
            type: 17,
            accent_color: 2278750,
            components: [
                { type: 10, content: `## ${title}\n${description}` },
                {
                    type: 1,
                    components: [{ type: 2, style: 5, label: "Open match", url: pageUrl }],
                },
            ],
        },
    };
    const serializedPayload = JSON.stringify(payload).replace(/</g, "\\u003c");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(pageUrl)}"><meta property="og:type" content="article"><script id="discord:component-embed" type="application/json">${serializedPayload}</script></head><body></body></html>`;

    return new Response(html, {
        headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=60",
        },
    });
}
