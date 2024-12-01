import { useEffect, useState } from 'react';
import axios from 'axios';
import CompletePlayerStatsInterface from '../../interfaces/PlayerStatsInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerStatsPanelProps {
    PlayerID: string;
}

function PlayerStatsPanel({ PlayerID }: PlayerStatsPanelProps) {
    const [playerStats, setPlayerStats] = useState<CompletePlayerStatsInterface>();
    const [selectedStatType, setSelectedStatType] = useState<'Overall' | 'Terrorist' | 'CounterTerrorist'>('Overall');

    useEffect(() => {
        axios
            .get<CompletePlayerStatsInterface>(`${API_URL}/playerstats_panel_by_player_id?player_id=${PlayerID}`)
            .then((response) => setPlayerStats(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);

    const stats = playerStats?.[selectedStatType];

    return (
        <div className="p-1 bg-gray-800">

            <div className="flex justify-center space-x-2 mb-1 bg-gray-700 p-2">
                <button
                    onClick={() => setSelectedStatType('Overall')}
                    className={`px-3 py-1 text-xs text-white ${selectedStatType === 'Overall' ? 'bg-green-500' : 'bg-gray-600'}`}>
                    Overall
                </button>

                <button
                    onClick={() => setSelectedStatType('Terrorist')}
                    className={`px-3 py-1 text-xs text-white ${selectedStatType === 'Terrorist' ? 'bg-orange-500' : 'bg-gray-600'}`}>
                    Terrorist
                </button>

                <button
                    onClick={() => setSelectedStatType('CounterTerrorist')}
                    className={`px-3 py-1 text-xs text-white ${selectedStatType === 'CounterTerrorist' ? 'bg-blue-500' : 'bg-gray-600'}`}>
                    Counter-Terrorist
                </button>
            </div>

            <div className="bg-gray-700 p-1">
                <div className="grid grid-cols-3 gap-1">
                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> CS2S Rating 1.0 </div>
                        <div className="text-xl font-semibold"> {stats?.Rating} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> KPR </div>
                        <div className="text-xl font-semibold"> {stats?.KPR} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> DPR </div>
                        <div className="text-xl font-semibold"> {stats?.DPR} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Impact </div>
                        <div className="text-xl font-semibold"> {stats?.Impact} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> KAST </div>
                        <div className="text-xl font-semibold"> {stats?.KAST}% </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> ADR </div>
                        <div className="text-xl font-semibold"> {stats?.ADR} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Matches Played </div>
                        <div className="text-xl font-semibold"> {playerStats?.MatchesPlayed} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Matches Won </div>
                        <div className="text-xl font-semibold"> {playerStats?.MatchesWon} </div>
                    </div>


                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Win Rate </div>
                        <div className="text-xl font-semibold">
                            {playerStats?.MatchesWon && playerStats?.MatchesPlayed
                                ? ((playerStats.MatchesWon / playerStats.MatchesPlayed) * 100).toFixed(2)
                                : "0"}%
                        </div>                    </div>

                </div>
            </div>
        </div>
    );
}

export default PlayerStatsPanel;
