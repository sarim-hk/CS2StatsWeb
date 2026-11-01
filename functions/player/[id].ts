interface PlayerPreviewContext {
    request: Request;
    params: Record<string, string | undefined>;
    env: { VITE_API_URL?: string; SITE_URL?: string };
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

function cleanName(value: unknown) {
    return String(value ?? "Player")
        .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F]/gu, "")
        .replace(/\s+/g, " ")
        .trim() || "Player";
}

function formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

export async function onRequest(context: PlayerPreviewContext) {
    if (!/Discordbot\/2\.0/i.test(context.request.headers.get("user-agent") ?? "")) {
        return context.next();
    }

    const playerId = context.params.id;
    const apiUrl = context.env.VITE_API_URL?.replace(/\/$/, "");
    if (!playerId || !apiUrl) return context.next();

    const query = encodeURIComponent(playerId);
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 89);
    const statsRange = `range=${formatDate(startDate)},${formatDate(endDate)}`;
    const [playerResponse, statsResponse] = await Promise.all([
        fetch(`${apiUrl}/player_panel?player_id=${query}`),
        fetch(`${apiUrl}/playerstats_panel?player_id=${query}&${statsRange}`),
    ]);
    if (!playerResponse.ok) return context.next();

    const player = await playerResponse.json() as {
        Username?: string;
        ELO?: number;
        AvatarL?: string;
    };
    const statsPayload = statsResponse.ok
        ? await statsResponse.json() as Record<string, { Overall?: Record<string, number>; MatchesPlayed?: number; MatchesWon?: number }>
        : {};
    const playerStats = statsPayload[playerId];
    const stats = playerStats?.Overall ?? {};
    const name = cleanName(player.Username);
    const siteUrl = (context.env.SITE_URL ?? new URL(context.request.url).origin).replace(/\/$/, "");
    const pageUrl = `${siteUrl}/player/${encodeURIComponent(playerId)}`;
    const kills = Number(stats.Kills ?? 0);
    const deaths = Number(stats.Deaths ?? 0);
    const headshots = Number(stats.Headshots ?? 0);
    const rating = Number(stats.Rating ?? 0).toFixed(2);
    const kd = (deaths > 0 ? kills / deaths : 0).toFixed(2);
    const adr = Number(stats.ADR ?? 0).toFixed(0);
    const headshotRate = kills > 0 ? `${((headshots / kills) * 100).toFixed(0)}%` : "0%";
    const matchesPlayed = Number(playerStats?.MatchesPlayed ?? 0);
    const winRate = matchesPlayed > 0
        ? `${((Number(playerStats?.MatchesWon ?? 0) / matchesPlayed) * 100).toFixed(0)}%`
        : "0%";
    const ansi = String.fromCharCode(27);
    const reset = `${ansi}[0m`;
    const headerColor = `${ansi}[1;36m`;
    const valueColor = `${ansi}[0;37m`;
    const content = [
        String.fromCharCode(96).repeat(3) + "ansi",
        `${headerColor}${name.padEnd(17)}Last 90 days${reset}`,
        `${valueColor}${"ELO".padEnd(9)}${String(player.ELO ?? 0).padStart(5)}   ${"Win Rate".padEnd(9)}${winRate.padStart(5)}${reset}`,
        `${valueColor}${"ADR".padEnd(9)}${adr.padStart(5)}   ${"HS%".padEnd(9)}${headshotRate.padStart(5)}${reset}`,
        `${valueColor}${"K/D".padEnd(9)}${kd.padStart(5)}   ${"Rating".padEnd(9)}${rating.padStart(5)}${reset}`,
        String.fromCharCode(96).repeat(3),
    ].join("\n");
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
    const serializedPayload = JSON.stringify(payload).replace(/</g, "\\u003c");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(name)}</title><meta property="og:title" content="${escapeHtml(name)}"><meta property="og:description" content="ELO ${escapeHtml(player.ELO)} · K/D ${kd} · Rating ${rating}"><meta property="og:url" content="${escapeHtml(pageUrl)}"><meta property="og:type" content="profile"><script id="discord:component-embed" type="application/json">${serializedPayload}</script></head><body></body></html>`;

    return new Response(html, {
        headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=60",
        },
    });
}
