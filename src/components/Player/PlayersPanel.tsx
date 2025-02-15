import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerInfoInterface from '../../interfaces/PlayerInfoInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayersPanelProps {
    searchEnabled?: boolean;
    selectionEnabled?: boolean;
    onPlayersSelected?: (players: PlayerInfoInterface[]) => void;
}

function PlayersPanel({ searchEnabled = false, selectionEnabled = false, onPlayersSelected }: PlayersPanelProps) {
    const [players, setPlayers] = useState<PlayerInfoInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedPlayerIDs, setSelectedPlayerIDs] = useState<string[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerInfoInterface[]>([]);

    useEffect(() => {
        axios
            .get<PlayerInfoInterface[]>(`${API_URL}/players_panel`)
            .then((response) => {
                setPlayers(response.data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        if (onPlayersSelected) {
            onPlayersSelected(selectedPlayers);
        }
    }, [selectedPlayers, onPlayersSelected]);

    const filteredPlayers = players.filter(player =>
        player.Username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const togglePlayerSelection = (player: PlayerInfoInterface) => {
        setSelectedPlayerIDs(prevSelected =>
            prevSelected.includes(player.PlayerID)
                ? prevSelected.filter(id => id !== player.PlayerID)
                : [...prevSelected, player.PlayerID]
        );

        setSelectedPlayers(prevSelected =>
            prevSelected.some(p => p.PlayerID === player.PlayerID)
                ? prevSelected.filter(p => p.PlayerID !== player.PlayerID)
                : [...prevSelected, player]
        );
    };

    return (
        <div className="bg-gray-800">
            {(searchEnabled || selectionEnabled) && (
                <div className="p-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        {searchEnabled && (
                            <input
                                type="text"
                                placeholder="Search by Username"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`flex-1 px-2 py-1 bg-gray-700/50 text-white text-sm font-medium
                                focus:outline-none transition-all duration-200 hover:bg-gray-700
                                ${searchTerm.trim() ? "ring-1 ring-green-500/50 bg-green-500/20 text-green-400" : ""}`}
                            />
                        )}

                        {selectionEnabled && (
                            <div className={`px-2 py-1 text-sm font-medium
                                ${selectedPlayerIDs.length === 0
                                    ? 'text-gray-400 bg-gray-700/50'
                                    : selectedPlayerIDs.length % 2 === 0
                                        ? 'text-green-400 bg-green-500/20 ring-1 ring-green-500/50'
                                        : 'text-red-400 bg-red-500/20 ring-1 ring-red-500/50'
                                }`}
                            >
                                Selected: {selectedPlayerIDs.length}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div>
                {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                        <div key={player.PlayerID} className="border-b border-gray-700 last:border-b-0">
                            <div className="p-2 hover:bg-gray-700/50 transition-colors duration-200">
                                <div className="flex items-center justify-between gap-3">
                                    <a href={`/player/${player.PlayerID}`} className="flex items-center gap-3 flex-1">
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
                                            <div className="text-xs font-medium text-gray-300 mt-0.5">
                                                ELO: {player.ELO}
                                            </div>
                                        </div>
                                    </a>

                                    {selectionEnabled && (
                                        <button
                                            onClick={() => togglePlayerSelection(player)}
                                            className={`px-2 py-1 text-sm font-medium transition-all duration-200 flex-shrink-0
                                                ${selectedPlayerIDs.includes(player.PlayerID)
                                                    ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                                                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                                                }`}
                                        >
                                            {selectedPlayerIDs.includes(player.PlayerID) ? 'Deselect' : 'Select'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-3 text-gray-300 text-sm font-medium">No players found.</div>
                )}
            </div>
        </div>
    );
}

export default PlayersPanel;