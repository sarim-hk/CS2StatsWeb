import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerStatsInterface from '../../interfaces/PlayerStatsInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerStatsPanelProps {
    PlayerID: string;
}

function PlayerStatsPanel({ PlayerID }: PlayerStatsPanelProps) {
    const [playerStats, setPlayerStats] = useState<PlayerStatsInterface>();

    useEffect(() => {
        axios
            .get<PlayerStatsInterface>(`${API_URL}/playerstats_by_player_id?player_id=${PlayerID}`)
            .then((response) => setPlayerStats((response.data)))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);


    return (
        <div className="p-1 bg-gray-800">
            <div className="flex p-4 bg-gray-600 items-center">
                <div className="pl-1">
                </div>
            </div>
        </div>
    );

}

export default PlayerStatsPanel;