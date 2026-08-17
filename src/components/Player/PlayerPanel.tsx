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
            .get<PlayerInfoInterface>(`${API_URL}/player_panel?player_id=${PlayerID}`)
            .then((response) => {
                setPlayer(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    }, [PlayerID]);

    return (
        <div className="bg-gray-800">
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <a
                        href={`https://steamcommunity.com/profiles/${PlayerID}`}
                        className="flex items-center gap-4 flex-1"
                    >
                        <div className="relative">
                            <img
                                className="h-24 w-24 object-cover border-2 border-gray-700 hover:border-gray-600 transition-colors"
                                src={player?.AvatarL}
                                alt={player?.Username}
                            />
                        </div>

                        <div className="flex flex-col min-w-0">
                            <div className="font-medium text-xl text-gray-300 truncate">
                                {player?.Username}
                            </div>

                            <div className="text-base font-medium text-gray-300 mt-1.5">
                                <span className="bg-gray-700/50 px-3 py-1">
                                    ELO: {player?.ELO}
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default PlayerPanel;