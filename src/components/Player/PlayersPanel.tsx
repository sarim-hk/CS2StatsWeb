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
        <div className="p-1 bg-gray-800">
            {/* Only render the top bar if search or selection is enabled */}
            {(searchEnabled || selectionEnabled) && (
                <div className="bg-gray-600 p-1 flex items-center gap-2 mb-1">
                    {searchEnabled && (
                        <input
                            type="text"
                            placeholder="Search by Username"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`flex-1 p-1 bg-gray-700 text-white text-xs 
                            border border-gray-500 focus:outline-none
                            ${searchTerm.trim() ? "border-green-500 ring-1 ring-green-500" : ""}`}
                        />
                    )}

                    {selectionEnabled && (
                        <div
                            className={`flex-3 p-1 bg-gray-700 border text-white text-xs focus:outline-none
                            ${selectedPlayerIDs.length === 0
                                    ? 'border-gray-500'
                                    : selectedPlayerIDs.length % 2 === 0
                                        ? 'border-green-500'
                                        : 'border-red-500'
                                }`}
                        >
                            Selected: {selectedPlayerIDs.length}
                        </div>
                    )}


                </div>
            )}

            <div className="divide-y divide-white">
                {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player, index) => (
                        <div key={index} className="flex items-center justify-between pl-1 bg-gray-600">
                            <div>
                                <a href={`/player/${player.PlayerID}`} className="flex items-center pt-1 pb-1">
                                    <img
                                        className="object-contain h-12 w-12 mr-2 border-gray-800 border-solid border-2"
                                        src={player.AvatarM}
                                        alt={player.Username}
                                    />
                                    <div>
                                        <div>{player.Username}</div>
                                        <div className="text-xs text-left">ELO: {player.ELO}</div>
                                    </div>
                                </a>
                            </div>

                            {selectionEnabled && (
                                <button
                                    onClick={() => togglePlayerSelection(player)}
                                    className={`mr-2 px-2 py-1 rounded ${selectedPlayerIDs.includes(player.PlayerID)
                                        ? 'bg-green-500 text-white'
                                        : 'bg-blue-500 text-white'
                                        }`}
                                >
                                    {selectedPlayerIDs.includes(player.PlayerID) ? 'Deselect' : 'Select'}
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-2 text-white">No players found with that username.</div>
                )}
            </div>
        </div>
    );
}

export default PlayersPanel;