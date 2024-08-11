import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerInterface from '../../interfaces/PlayerInterface';

const API_URL = import.meta.env.VITE_API_URL;

function PlayersPanel() {
    const [players, setPlayers] = useState<PlayerInterface[]>([]);

    useEffect(() => {
        axios
            .get<PlayerInterface[]>(`${API_URL}/get_players`)
            .then((response) => {
                setPlayers(response.data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="p-1 bg-gray-800 divide-y divide-white">
            {players.map((player, index) => (
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
            ))}
        </div>
    );
}

export default PlayersPanel;
