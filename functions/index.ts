interface HomePreviewContext {
    request: Request;
    env: { VITE_API_URL?: string; SITE_URL?: string };
    next: () => Promise<Response>;
}

function escapeHtml(value: unknown) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function cleanName(value: unknown) {
    return String(value ?? "Player").replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F]/gu, "").replace(/\s+/g, " ").trim() || "Player";
}

function formatDate(value: unknown) {
    const date = new Date(`${String(value ?? "")}Z`);
    if (Number.isNaN(date.getTime())) return String(value ?? "");
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(date);
}

export async function onRequest(context: HomePreviewContext) {
    if (!/Discordbot\/2\.0/i.test(context.request.headers.get("user-agent") ?? "")) return context.next();

    const apiUrl = context.env.VITE_API_URL?.replace(/\/$/, "");
    if (!apiUrl) return context.next();

    const [playersResponse, matchesResponse] = await Promise.all([
        fetch(`${apiUrl}/players_panel`),
        fetch(`${apiUrl}/matches_panel`),
    ]);
    if (!playersResponse.ok) return context.next();

    const players = await playersResponse.json() as Array<{ PlayerID?: string; Username?: string; ELO?: number; Rating?: number; MatchesPlayed?: number }>;
    const matches = matchesResponse.ok ? await matchesResponse.json() as Array<{
        MatchID?: number;
        MapID?: string;
        WinningTeamName?: string;
        LosingTeamName?: string;
        WinningTeamScore?: number;
        LosingTeamScore?: number;
        MatchDate?: string;
        WinningSide?: number;
    }> : [];
    const topPlayers = players
        .filter((player) => (player.MatchesPlayed ?? 0) >= 9)
        .sort((first, second) => (second.Rating ?? 0) - (first.Rating ?? 0))
        .slice(0, 3);
    const latestMatch = matches[0];
    const ansi = String.fromCharCode(27);
    const reset = `${ansi}[0m`;
    const headerColor = `${ansi}[1;36m`;
    const valueColor = `${ansi}[0;37m`;
    const playerNames = topPlayers.map((player) => cleanName(player.Username));
    const playerNameWidth = Math.max(8, ...playerNames.map((name) => name.length));
    const playerRows = topPlayers.map((player, index) => {
        const name = playerNames[index].padEnd(playerNameWidth);
        return `${name} ${Number(player.Rating ?? 0).toFixed(2)}`;
    });
    const matchRows = latestMatch
        ? [
            `${latestMatch.WinningSide === 2 ? "T" : "CT"} ${latestMatch.WinningTeamScore ?? 0} : ${latestMatch.LosingTeamScore ?? 0} ${latestMatch.WinningSide === 2 ? "CT" : "T"}`,
            latestMatch.MapID ?? "Unknown",
            formatDate(latestMatch.MatchDate),
        ]
        : ["No recent matches", "", ""];
    const leftWidth = 18;
    const content = [
        String.fromCharCode(96).repeat(3) + "ansi",
        `${headerColor}${"Top 3 Players".padEnd(leftWidth)} Latest Match${reset}`,
        ...Array.from({ length: 3 }, (_, index) => `${valueColor}${(playerRows[index] ?? "").padEnd(leftWidth)} ${matchRows[index] ?? ""}${reset}`),
        String.fromCharCode(96).repeat(3),
    ].join("\n");
    const siteUrl = (context.env.SITE_URL ?? new URL(context.request.url).origin).replace(/\/$/, "");
    const pageUrl = `${siteUrl}/`;
    const payload = {
        component: {
            type: 17,
            accent_color: 2042167,
            components: [
                { type: 12, items: [{ media: { url: `${siteUrl}/logo_wide.png` } }] },
                { type: 10, content },
            ],
        },
    };
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>CS2Stats</title><meta property="og:title" content="CS2Stats"><meta property="og:description" content="Top players and latest matches"><meta property="og:url" content="${escapeHtml(pageUrl)}"><meta property="og:type" content="website"><script id="discord:component-embed" type="application/json">${JSON.stringify(payload).replace(/</g, "\\u003c")}</script></head><body></body></html>`;
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" } });
}
