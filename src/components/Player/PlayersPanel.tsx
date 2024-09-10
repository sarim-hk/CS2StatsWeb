import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerInterface from '../../interfaces/PlayerInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayersPanelProps {
    searchEnabled?: boolean;
}

function PlayersPanel({ searchEnabled = false }: PlayersPanelProps) {
    const [players, setPlayers] = useState<PlayerInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        axios
            .get<PlayerInterface[]>(`${API_URL}/get_players`)
            .then((response) => {
                setPlayers(response.data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filteredPlayers = players.filter(player =>
        player.Username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-1 bg-gray-800 divide-y divide-white">
            
            {searchEnabled && (
                <div className="p-4 bg-gray-700">
                    <input
                        type="text"
                        placeholder="Search by Username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded bg-gray-600 text-white"
                    />
                </div>
            )}

            {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                    <div key={index} className="flex items-start pl-1 bg-gray-600">
                        <div>
                            <a href={`/player/${player.PlayerID}`} className="flex items-center pt-1 pb-1">
                                <img className="object-contain h-12 w-12 mr-2 border-gray-800 border-solid border-2" src={player.AvatarM} alt={player.Username} />
                                <div>
                                    <div>{player.Username}</div>
                                    <div className="text-xs text-left">ELO: {player.ELO}</div>
                                </div>
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-2 text-white">No players found with that username.</div>
            )}
        </div>
    );
}

export default PlayersPanel;
