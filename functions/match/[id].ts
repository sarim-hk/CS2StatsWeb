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

function cleanDisplayName(value: unknown) {
    return String(value ?? "")
        .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F]/gu, "")
        .replace(/\s+/g, " ")
        .trim() || "Player";
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
        Teams?: Record<string, {
            TeamID?: string;
            Side?: number;
            TeamName?: string;
            Score?: number;
            Result?: string;
            Players?: Record<string, {
                Overall?: {
                    Username?: string;
                    Kills?: number;
                    Assists?: number;
                    Deaths?: number;
                    ADR?: number;
                    Damage?: number;
                    UtilityDamage?: number;
                    Impact?: number;
                    KAST?: number;
                    Rating?: number;
                    Blinds?: { Count?: number; TotalDuration?: number };
                };
            }>;
        }>;
    };
    const teams = Object.values(match.Teams ?? {}).sort((first, second) => {
        if (first.Result === "Win") return -1;
        if (second.Result === "Win") return 1;
        return 0;
    });
    const firstTeam = teams[0];
    const secondTeam = teams[1];
    const firstTeamName = cleanDisplayName(firstTeam?.TeamName ?? "Team");
    const secondTeamName = cleanDisplayName(secondTeam?.TeamName ?? "Team");
    const title = `${firstTeamName} ${firstTeam?.Score ?? 0} : ${secondTeam?.Score ?? 0} ${secondTeamName}`;
    const description = `${match.MapID ?? "Match"} · ${formatMatchDate(match.MatchDate)}`;
    const siteUrl = (context.env.SITE_URL ?? new URL(context.request.url).origin).replace(/\/$/, "");
    const pageUrl = `${siteUrl}/match/${encodeURIComponent(matchId)}`;
    const sharedNameWidth = Math.max(
        4,
        "CT 0".length,
        ...teams.flatMap((team) => Object.values(team.Players ?? {})
            .map((player) => cleanDisplayName(player.Overall?.Username ?? "Player").length)),
    );
    const formatPlayers = (team: typeof firstTeam) => {
        const sideName = team?.Side === 2 ? "T" : "CT";
        const teamLabel = `${sideName} ${team?.Score ?? 0}`;
        const players = Object.values(team?.Players ?? {})
            .sort((first, second) => (second.Overall?.Rating ?? 0) - (first.Overall?.Rating ?? 0))
            .map((player) => player.Overall ?? {});
        const nameWidth = sharedNameWidth;
        const rows = players.map((player) => {
            const name = cleanDisplayName(player.Username ?? "Player").padEnd(nameWidth);
            const kills = String(player.Kills ?? 0).padStart(3);
            const assists = String(player.Assists ?? 0).padStart(3);
            const deaths = String(player.Deaths ?? 0).padStart(3);
            const rating = Number(player.Rating ?? 0).toFixed(2).padStart(6);
            return `${name}  ${kills}  ${assists}  ${deaths}  ${rating}`;
        });

        const ansi = String.fromCharCode(27);
        const reset = `${ansi}[0m`;
        const headerColor = `${ansi}[1;36m`;
        const valueColor = `${ansi}[0;37m`;
        const header = `${headerColor}${teamLabel.padEnd(nameWidth)}  ${"K".padStart(3)}  ${"A".padStart(3)}  ${"D".padStart(3)}  ${"Rating".padStart(6)}${reset}`;
        const coloredRows = rows.map((row) => `${valueColor}${row}${reset}`);
        return [String.fromCharCode(96).repeat(3) + "ansi", header, ...coloredRows, String.fromCharCode(96).repeat(3)].join("\n");
    };
    const teamUrl = (team: typeof firstTeam) => team?.TeamID
        ? `${siteUrl}/team/${encodeURIComponent(team.TeamID)}`
        : pageUrl;
    const payload = {
        component: {
            type: 17,
            accent_color: 2042167,
            components: [
                { type: 12, items: [{ media: { url: `${siteUrl}/logo_wide.png` } }] },
                { type: 14, divider: true, spacing: 1 },
                { type: 10, content: formatPlayers(firstTeam) },
                { type: 10, content: formatPlayers(secondTeam) },
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
