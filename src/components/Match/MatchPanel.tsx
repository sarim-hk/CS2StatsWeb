import { useRef, useState, type CSSProperties } from 'react';
import FullMatchInterface from '../../interfaces/FullMatchInterface';
import { Link } from 'react-router-dom';

interface MatchPanelProps {
    Match: FullMatchInterface | undefined;
}

const MATCH_STAT_HEADERS = [
    { id: 'kills', label: 'K' },
    { id: 'assists', label: 'A' },
    { id: 'deaths', label: 'D' },
    { id: 'kd', label: 'K/D' },
    { id: 'adr', label: 'ADR' },
    { id: 'empty-utility', label: '' },
    { id: 'utility-damage', label: 'UD' },
    { id: 'entry-frags', label: 'EF' },
    { id: 'time-entry-frag', label: 'Time/EF' },
    { id: 'empty-kast', label: '' },
    { id: 'kast', label: 'KAST' },
    { id: 'impact', label: 'Impact' },
    { id: 'rating', label: 'Rating' },
] as const;

function measureMobileNameWidth(name: string) {
    if (typeof document === "undefined") return name.length * 6;

    const context = document.createElement("canvas").getContext("2d");
    if (!context) return name.length * 6;

    context.font = "400 12px 'Noto Sans', ui-sans-serif, system-ui, sans-serif";
    return context.measureText(name).width;
}

function MatchPanel({ Match }: MatchPanelProps) {
    const [showRounds, setShowRounds] = useState(false);
    const tableScrollContainers = useRef<Record<string, HTMLDivElement | null>>({});
    const resultOrder = { Win: -1, Loss: 1, Tie: 0 };

    const sortedTeams = Match
        ? Object.entries(Match.Teams).sort((a, b) => {
              const resultComparison =
                  (resultOrder[a[1].Result as keyof typeof resultOrder] || 0) -
                  (resultOrder[b[1].Result as keyof typeof resultOrder] || 0);

              return resultComparison !== 0
                  ? resultComparison
                  : a[1].TeamName.localeCompare(b[1].TeamName);
          })
        : [];

    const [winningTeamId, losingTeamId] = sortedTeams.map((team) => team[0]);
    const longestUsernameLength = Math.max(
        0,
        ...sortedTeams.flatMap(([, team]) =>
            Object.values(team.Players).map((player) => player.Overall.Username.length),
        ),
    );
    const longestTeamNameLength = Math.max(
        0,
        ...sortedTeams.map(([, team]) => team.TeamName.length),
    );
    const mobileTeamNames = sortedTeams.map(([, team]) =>
        team.TeamName.length <= longestUsernameLength
            ? team.TeamName
            : `${team.TeamName.slice(0, Math.max(1, longestUsernameLength - 1))}\u2026`,
    );
    const widestMobileColumnText = Math.max(
        48,
        ...sortedTeams.flatMap(([, team]) =>
            Object.values(team.Players).map((player) => measureMobileNameWidth(player.Overall.Username)),
        ),
        ...mobileTeamNames.map(measureMobileNameWidth),
    );
    const teamColumnStyle = {
        '--team-column-mobile-width': `calc(${Math.ceil(widestMobileColumnText)}px + 1rem)`,
        '--team-column-desktop-width': `calc(${Math.max(8, longestUsernameLength, longestTeamNameLength)}ch + 1rem)`,
    } as CSSProperties;

    const truncateTeamName = (teamName: string) => {
        if (teamName.length <= longestUsernameLength) return teamName;

        return `${teamName.slice(0, Math.max(1, longestUsernameLength - 1))}…`;
    };

    const syncTableScroll = (sourceTeamId: string, scrollLeft: number) => {
        Object.entries(tableScrollContainers.current).forEach(([teamId, container]) => {
            if (teamId !== sourceTeamId && container && container.scrollLeft !== scrollLeft) {
                container.scrollLeft = scrollLeft;
            }
        });
    };

    return (
        <div className="rounded-sm overflow-hidden shadow-lg bg-gray-800 border border-gray-700">
            {/* Match Header */}
            <div className="p-2 bg-gray-700 border-b border-gray-600 md:p-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="hidden text-sm font-semibold text-gray-300 md:block md:text-base">
                        {Match?.MapID}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowRounds(false)}
                        aria-label="Show score"
                        className={`${showRounds ? 'flex' : 'hidden'} flex-1 justify-center overflow-hidden mx-4 md:flex`}
                    >
                        <div className="flex flex-nowrap gap-1 overflow-x-auto scrollbar-none">
                            {Match?.Rounds.map((round) => (
                                <div
                                    key={round.RoundID}
                                    className={`h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-sm 
                                        ${
                                            round.WinnerSide === 3
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                                : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                                        } text-[10px] font-medium`}
                                >
                                    {(round.RoundID - Match.Rounds[0].RoundID) + 1}
                                </div>
                            ))}
                        </div>
                    </button>

                    <div className={`${showRounds ? 'hidden' : 'flex'} flex-1 items-center justify-center space-x-2 md:flex md:flex-none`}>
                        <div className="flex items-center space-x-2">
                            {/* Winning Team */}
                            <div
                                className={`whitespace-nowrap text-sm font-semibold md:text-base ${
                                    Match?.Teams[winningTeamId].Side === 3
                                        ? 'text-blue-400'
                                        : 'text-orange-400'
                                }`}
                            >
                                <Link
                                    to={`/team/${winningTeamId}`}
                                    onClick={(event) => event.stopPropagation()}
                                    className="hover:underline"
                                >
                                    {Match?.Teams[winningTeamId].TeamName}
                                </Link>
                            </div>

                            {/* Score */}
                            <button
                                type="button"
                                onClick={() => setShowRounds(true)}
                                aria-label="Show individual rounds"
                                className="grid w-14 grid-cols-2 items-center rounded-sm bg-gray-800 px-1.5 py-0.5 md:flex md:w-auto md:grid-cols-3 md:space-x-2 md:px-2"
                            >
                                <span
                                    className={`w-[2ch] justify-self-start text-center text-sm font-semibold md:w-auto md:justify-self-auto md:text-base ${
                                        Match?.Teams[winningTeamId].Side === 3
                                            ? 'text-blue-400'
                                            : 'text-orange-400'
                                    }`}
                                >
                                    {Match?.Teams[winningTeamId].Score}
                                </span>

                                <span className="hidden text-center text-gray-400 md:inline">:</span>

                                <span
                                    className={`w-[2ch] justify-self-end text-center text-sm font-semibold md:w-auto md:justify-self-auto md:text-base ${
                                        Match?.Teams[losingTeamId].Side === 3
                                            ? 'text-blue-400'
                                            : 'text-orange-400'
                                    }`}
                                >
                                    {Match?.Teams[losingTeamId].Score}
                                </span>
                            </button>

                            {/* Losing Team */}
                            <div
                                className={`whitespace-nowrap text-sm font-semibold md:text-base ${
                                    Match?.Teams[losingTeamId].Side === 3
                                        ? 'text-blue-400'
                                        : 'text-orange-400'
                                }`}
                            >
                                <Link
                                    to={`/team/${losingTeamId}`}
                                    onClick={(event) => event.stopPropagation()}
                                    className="hover:underline"
                                >
                                    {Match?.Teams[losingTeamId].TeamName}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Tables */}
            {[winningTeamId, losingTeamId].map((teamId) => (
                <div key={teamId} className="p-2">
                    <div
                        ref={(element) => {
                            tableScrollContainers.current[teamId] = element;
                        }}
                        onScroll={(event) => syncTableScroll(teamId, event.currentTarget.scrollLeft)}
                        className="overflow-x-auto"
                    >
                        <table className="w-full min-w-max table-fixed max-md:[&_th]:px-2 max-md:[&_td]:px-2 md:min-w-[64rem]">
                            <colgroup>
                                <col
                                    style={teamColumnStyle}
                                    className="w-[var(--team-column-mobile-width)] md:w-[var(--team-column-desktop-width)]"
                                />
                                {MATCH_STAT_HEADERS.map((header) => (
                                    <col
                                        key={header.id}
                                        className={`w-16 ${header.id.startsWith('empty-') ? 'hidden md:table-column' : ''}`}
                                    />
                                ))}
                            </colgroup>
                            <thead>
                                <tr
                                    className={`border-b ${
                                        Match?.Teams[teamId].Side === 2
                                            ? 'border-orange-500/50'
                                            : 'border-blue-500/50'
                                    }`}
                                >
                                    <th className="sticky left-0 z-20 whitespace-nowrap bg-gray-800 py-2 px-2 text-left font-medium text-gray-300 md:px-3">
                                        <div className="flex items-center gap-1">
                                            <span
                                                className={`shrink-0 text-[10px] font-medium ${
                                                    Match?.Teams[teamId].Side === 2
                                                        ? 'text-orange-400'
                                                        : 'text-blue-400'
                                                }`}
                                            >
                                                {(Match?.Teams[teamId].DeltaELO ?? 0) >= 0 ? '+' : ''}
                                                {Match?.Teams[teamId].DeltaELO ?? 0}
                                            </span>

                                            <Link
                                                to={`/team/${teamId}`}
                                                className="min-w-0 truncate text-xs hover:text-blue-400 transition-colors md:overflow-visible md:text-clip md:whitespace-normal"
                                                title={Match?.Teams[teamId].TeamName}
                                            >
                                                <span className="md:hidden">
                                                    {truncateTeamName(Match?.Teams[teamId].TeamName ?? "")}
                                                </span>
                                                <span className="hidden md:inline">
                                                    {Match?.Teams[teamId].TeamName}
                                                </span>
                                            </Link>
                                        </div>
                                    </th>

                                    {MATCH_STAT_HEADERS.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`py-2 px-3 text-center text-[10px] font-medium text-gray-400 w-16 ${
                                                header.id.startsWith('empty-')
                                                    ? 'hidden md:table-cell'
                                                    : ''
                                            }`}
                                        >
                                            {header.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="md:[&>tr>td]:py-2.5">
                                {Match?.Teams[teamId]?.Players &&
                                    Object.values(Match.Teams[teamId].Players)
                                        .sort(
                                            (a, b) =>
                                                b.Overall.Rating -
                                                a.Overall.Rating
                                        )
                                        .map((player) => (
                                            <tr
                                                key={player.Overall.PlayerID}
                                                className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                                            >
                                                <td className="sticky left-0 z-10 whitespace-nowrap bg-gray-800 py-1.5 px-2 md:px-3">
                                                    <Link
                                                        to={`/player/${player.Overall.PlayerID}`}
                                                        className="text-xs text-gray-200 hover:text-blue-400 transition-colors md:block md:max-w-48 md:truncate"
                                                    >
                                                        {player.Overall.Username}
                                                    </Link>
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {player.Overall.Kills}
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {player.Overall.Assists}
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {player.Overall.Deaths}
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {(
                                                        player.Overall.Kills /
                                                        player.Overall.Deaths
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {(
                                                        player.Overall.Damage /
                                                        Match.Rounds.length
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="hidden py-1.5 px-3 md:table-cell"></td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {player.Overall.UtilityDamage}
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {player.Overall.Blinds.Count}
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {(
                                                        player.Overall.Blinds
                                                            .Count > 0
                                                            ? player.Overall.Blinds
                                                                  .TotalDuration /
                                                              player.Overall.Blinds
                                                                  .Count
                                                            : 0
                                                    ).toFixed(2)}
                                                    s
                                                </td>

                                                <td className="hidden py-1.5 px-3 md:table-cell"></td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {player.Overall.KAST.toFixed(2)}
                                                    %
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs">
                                                    {player.Overall.Impact.toFixed(2)}
                                                </td>

                                                <td className="py-1.5 px-3 text-center text-xs font-medium">
                                                    {player.Overall.Rating.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MatchPanel;
