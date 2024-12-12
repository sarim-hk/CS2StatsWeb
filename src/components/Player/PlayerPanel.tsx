import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerInfoInterface from '../../interfaces/PlayerInfoInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerPanelProps {
    PlayerID: string;
}

function getCurrentWeek(date: Date): number {
    const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNumber = (currentDate.getUTCDay() + 6) % 7;
    currentDate.setUTCDate(currentDate.getUTCDate() - dayNumber + 3);
    const firstThursday = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 4));
    const weekNumber = Math.round(((currentDate.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7 + 1);
    return weekNumber;
}

function PlayerPanel({ PlayerID }: PlayerPanelProps) {
    const [player, setPlayer] = useState<PlayerInfoInterface>();
    const [week, setWeek] = useState<number>(0);

    useEffect(() => {
        axios
            .get<PlayerInfoInterface>(`${API_URL}/player_panel_by_player_id?player_id=${PlayerID}`)
            .then((response) => setPlayer(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);

    useEffect(() => {
        const currentWeek = getCurrentWeek(new Date());
        setWeek(currentWeek);
    }, []);

    return (
        <div className="p-1 bg-gray-800">
            {!player?.PlayerOfTheWeek ? (
                <div className="flex p-4 bg-gray-600 items-center">
                    <>
                        <img
                            className="object-fill w-24 h-24 mr-2 border-gray-800 border-solid border-2"
                            src={player?.AvatarL}
                        />
                        <div className="pl-1">
                            <a href={`https://steamcommunity.com/profiles/${PlayerID}`}>
                                <h1 className="text-3xl">{player?.Username}</h1>
                                <div>ELO: {player?.ELO}</div>
                            </a>
                        </div>
                    </>
                </div>

            ) : (

                <div className="flex p-1 bg-gray-600 items-center">
                    <div className="bg-gradient-to-br from-[#3f5a8c] to-[#9B1A9B] overflow-hidden relative w-80 h-80 flex justify-center items-center outline outline-2 shadow-[0_0_25px_#FFFFFF]">
                        
                        {/* ELO */}
                        <div className="absolute top-4 text-xs text-white">
                            {player?.ELO} ELO
                        </div>

                        {/* Week */}
                            <div className="absolute top-8 text-white text-4xl font-semibold drop-shadow-[0_1px_1px_#000000]">
                            Week {week-1}
                        </div>

                        {/* Profile Picture */}
                        <div className="absolute inset-0 pattern">
                            <img
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 object-contain outline outline-2"
                                src={player?.AvatarL}
                            />
                        </div>

                        <div className="absolute inset-0">
                            <img className="absolute top-1/2 left-1/2 transform -translate-x-2 -translate-y-16 object-contain w-48 h-48"
                                src="https://i.imgur.com/OjaNoWp.png" />
                        </div>

                        {/* MVP */}
                        <div className="absolute text-6xl font-bold bottom-4 gold-text drop-shadow-[0_3px_3px_#000000]">
                            MVP
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayerPanel;
