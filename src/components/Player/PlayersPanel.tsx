import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import PlayerInfoInterface from '../../interfaces/PlayerInfoInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayersPanelProps {
    TeamID?: string;
    searchEnabled?: boolean;
    switcherModeEnabled?: boolean;
}

function PlayersPanel({
    TeamID,
    searchEnabled = false,
    switcherModeEnabled = true
}: PlayersPanelProps) {
    const [players, setPlayers] = useState<PlayerInfoInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [switcherEnabled, setswitcherEnabled] = useState<boolean>(switcherModeEnabled);

    useEffect(() => {
        let url = `${API_URL}/players_panel`;

        if (TeamID) {
            url += `?team_id=${encodeURIComponent(TeamID)}`;
        }

        axios
            .get<PlayerInfoInterface[]>(url)
            .then((response) => {
                setPlayers(response.data);
            })
            .catch((error) => console.error("Error fetching data:", error));
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
                if (switcherEnabled) {
                    return (player.MatchesPlayed ?? 0) >= 9;
                }

                return (
                    (player.MatchesPlayed ?? 0) >= 1 &&
                    player.Rating != null
                );
            })
            .sort((a, b) => {
                if (switcherEnabled) {
                    return (b.Rating ?? 0) - (a.Rating ?? 0);
                }

                return (b.ELO ?? 0) - (a.ELO ?? 0);
            });
    }, [players, searchTerm, switcherEnabled]);

    return (
        <div className="bg-gray-800">
            {/* Controls */}
            <div className="p-2 border-b border-gray-700">
                <div className="flex items-center gap-2">

                    {/* Search */}
                    {searchEnabled && (
                        <input
                            type="text"
                            placeholder="Search by Username"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`flex-1 px-3 py-1 text-xs font-medium bg-gray-700/50 text-white
                            focus:outline-none transition-colors duration-200 hover:bg-gray-700
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
                                className={`px-3 py-1 text-xs font-medium transition-colors duration-200 ${
                                    switcherEnabled
                                        ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                                }`}
                            >
                                Rating
                            </button>

                            {/* ELO button */}
                            <button
                                onClick={() => setswitcherEnabled(false)}
                                className={`px-3 py-1 text-xs font-medium transition-colors duration-200 ${
                                    !switcherEnabled
                                        ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                                }`}
                            >
                                ELO
                            </button>

                            {/* Tooltip */}
                            <div className="relative group flex items-center justify-center">
                                <span className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-500 text-[10px] font-bold text-gray-400 cursor-help">
                                    i
                                </span>

                                <div className="absolute hidden group-hover:block right-0 w-64 p-2 mt-1 text-xs text-gray-300 bg-gray-900 rounded-sm shadow-lg z-10 top-full">
                                    {switcherEnabled ? (
                                        <>
                                            <div>
                                                Only players with 9 or more games in the last 90 days are included.
                                            </div>

                                            {players.length > 0 && players[0].RatingUpdateDate && (
                                                <div className="text-gray-500 mt-1">
                                                    Rating updated:{" "}
                                                    {new Date(
                                                        players[0].RatingUpdateDate
                                                    ).toLocaleString()}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div>
                                            Only players with a game in the last 90 days are included.
                                        </div>
                                    )}
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
                                    <a
                                        href={`/player/${player.PlayerID}`}
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
                                                        Rating: {player.Rating ?? 'N/A'}
                                                    </>
                                                ) : (
                                                    <>
                                                        ELO: {player.ELO ?? 'N/A'}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </a>
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