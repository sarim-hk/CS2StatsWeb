import { useEffect, useMemo, useState } from 'react';
import apiClient, { isRequestCanceled } from '../../apiClient';
import { Link } from 'react-router-dom';
import PlayerInfoInterface from '../../interfaces/PlayerInfoInterface';
import { ui } from '../ui';

interface PlayersPanelProps {
    TeamID?: string;
    searchEnabled?: boolean;
    switcherModeEnabled?: boolean;
    panelSize?: number;
}

function PlayersPanel({
    TeamID,
    searchEnabled = false,
    switcherModeEnabled = true,
    panelSize,
}: PlayersPanelProps) {
    const [players, setPlayers] = useState<PlayerInfoInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [switcherEnabled, setswitcherEnabled] = useState<boolean>(switcherModeEnabled);

    useEffect(() => {
        const controller = new AbortController();

        apiClient
            .get<PlayerInfoInterface[]>("/players_panel", {
                params: TeamID ? { team_id: TeamID } : undefined,
                signal: controller.signal,
            })
            .then((response) => {
                setPlayers(response.data);
            })
            .catch((error) => {
                if (!isRequestCanceled(error)) {
                    console.error("Error fetching players data:", error);
                }
            });

        return () => controller.abort();
    }, [TeamID]);

    useEffect(() => {
        // If the selector is disabled, always use ELO mode.
        if (!switcherModeEnabled) {
            setswitcherEnabled(false);
        }
    }, [switcherModeEnabled]);

    const filteredPlayers = useMemo(() => {
        return players
            .filter(player =>
                player.Username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(player => {
                // When a team is supplied, show all players regardless
                // of matches played or rating eligibility.
                if (TeamID) {
                    return true;
                }

                if (switcherEnabled) {
                    return (player.MatchesPlayed ?? 0) >= 9;
                }

                // ELO mode should include every player returned by the API.
                return true;
            })
            .sort((a, b) => {
                if (switcherEnabled) {
                    return (b.Rating ?? 0) - (a.Rating ?? 0);
                }

                return (b.ELO ?? 0) - (a.ELO ?? 0);
            });
    }, [players, searchTerm, switcherEnabled, TeamID]);

    return (
        <div
            className={`${ui.panelFlat} ${panelSize ? "" : "h-full"} scrollbar-hide`}
            style={{
                height: panelSize ? `${panelSize}px` : undefined,
                overflowY: "auto",
            }}
        >
            {/* Controls */}
            <div className="sticky top-0 z-10 p-2 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center gap-2">

                    {/* Search */}
                    {searchEnabled && (
                        <input
                            type="text"
                            placeholder="Search by Username"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${ui.input} flex-1
                            ${
                                searchTerm.trim()
                                    ? "ring-1 ring-green-500/50 bg-green-500/20 text-green-400"
                                    : ""
                            }`}
                        />
                    )}

                    {/* Rating / ELO switcher */}
                    {switcherModeEnabled && (
                        <div className="flex items-center space-x-2">

                            {/* Rating button */}
                            <button
                                onClick={() => setswitcherEnabled(true)}
                                className={`${ui.control} ${
                                    switcherEnabled
                                        ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                                        : ui.controlIdle
                                }`}
                            >
                                Rating
                            </button>

                            {/* ELO button */}
                            <button
                                onClick={() => setswitcherEnabled(false)}
                                className={`${ui.control} ${
                                    !switcherEnabled
                                        ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                                        : ui.controlIdle
                                }`}
                            >
                                ELO
                            </button>

                            {/* Tooltip */}
                            <div className="relative group flex items-center justify-center">
                                <span className="font-medium text-gray-400 text-sm cursor-help">
                                    i
                                </span>

                                <div className="absolute hidden group-hover:block right-0 w-64 p-2 mt-1 text-xs text-gray-300 bg-gray-900 rounded-sm shadow-lg z-10 top-full">
                                    {switcherEnabled ? (
                                        <>
                                            <div>
                                                Only players with 9 or more matches played in the last 90 days are included.
                                            </div>

                                            {players.length > 0 && players[0].RatingUpdateDate && (
                                                <div className="text-gray-500 mt-1">
                                                    Last updated:{" "}
                                                    {new Date(
                                                        players[0].RatingUpdateDate
                                                    ).toLocaleString()} UTC
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                All players are included, regardless of match count.
                                            </div>

                                            {players.length > 0 && players[0].RatingUpdateDate && (
                                                <div className="text-gray-500 mt-1">
                                                    Last updated:{" "}
                                                    {new Date(
                                                        players[0].RatingUpdateDate
                                                    ).toLocaleString()} UTC
                                                </div>
                                            )}
                                        </>                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Players */}
            <div>
                {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                        <div
                            key={player.PlayerID}
                            className="border-b border-gray-700 last:border-b-0"
                        >
                            <div className="p-2 hover:bg-gray-700/50 transition-colors duration-200">
                                <div className="flex items-center justify-between gap-3">

                                    {/* Player info */}
                                    <Link
                                        to={`/player/${player.PlayerID}`}
                                        className="flex items-center gap-3 flex-1"
                                    >
                                        <div className="relative">
                                            <img
                                                className="h-12 w-12 object-cover border-2 border-gray-700 hover:border-gray-600 transition-colors"
                                                src={player.AvatarM}
                                                alt={player.Username}
                                            />
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <div className="font-medium text-sm text-gray-300 truncate">
                                                {player.Username}
                                            </div>

                                            <div className="text-xs font-medium text-gray-300 mt-1">
                                                {switcherEnabled ? (
                                                    <>
                                                        Rating: {player.Rating != null ? Number(player.Rating).toFixed(2) : 'N/A'}
                                                    </>
                                                ) : (
                                                    <>
                                                        ELO: {player.ELO ?? 'N/A'}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-3 text-gray-300 text-sm font-medium">
                        No players found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlayersPanel;
