import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerInfoInterface from '../../interfaces/PlayerInfoInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerPanelProps {
    PlayerID: string;
}

function PlayerPanel({ PlayerID }: PlayerPanelProps) {
    const [player, setPlayer] = useState<PlayerInfoInterface>();

    useEffect(() => {
        axios
            .get<PlayerInfoInterface>(`${API_URL}/player_panel_by_player_id?player_id=${PlayerID}`)
            .then((response) => setPlayer((response.data)))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);


    return (
        <div className="p-1 bg-gray-800">
            <div className="flex p-4 bg-gray-600 items-center">
                <img className="object-fill w-24 h-24 mr-2 border-gray-800 border-solid border-2" src={player?.AvatarL}/>
                <div className="pl-1">
                    <a href={`https://steamcommunity.com/profiles/${PlayerID}`}>
                        <h1 className="text-3xl">{player?.Username}</h1>
                        <div>ELO: {player?.ELO}</div>
                    </a>
                </div>
            </div>
        </div>
    );

}

export default PlayerPanel;