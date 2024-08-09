import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerInterface from '../interfaces/PlayerInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerPanelProps {
    PlayerID: string;
}

function PlayerPanel({ PlayerID }: PlayerPanelProps) {
    const [player, setPlayer] = useState<PlayerInterface>();

    useEffect(() => {
        axios
            .get<PlayerInterface>(`${API_URL}/get_players_or_player?player_id=${PlayerID}`)
            .then((response) => setPlayer((response.data)))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);


    return (
        <div className="p-1 bg-gray-800 font-display">
            <div className="flex p-4 bg-gray-600 items-center">
                <img
                    className="object-fill w-24 h-24 mr-2 border-gray-800 border-solid border-2"
                    src={player?.Avatar}
                    alt={player?.Username}
                />
                <div className="pl-1">
                    <h1 className="text-4xl">{player?.Username}</h1>
                    ELO: {player?.ELO}
                </div>
            </div>
        </div>
    );

}

export default PlayerPanel;