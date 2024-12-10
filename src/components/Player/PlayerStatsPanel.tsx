import { useEffect, useState } from 'react';
import axios from 'axios';
import CompletePlayerStatsInterface from '../../interfaces/PlayerStatsInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerStatsPanelProps {
    PlayerID: string;
    filter: string;
}

function PlayerStatsPanel({ PlayerID, filter }: PlayerStatsPanelProps) {
    const [playerStats, setPlayerStats] = useState<CompletePlayerStatsInterface>();
    const [selectedStatType, setSelectedStatType] = useState<'Overall' | 'Terrorist' | 'CounterTerrorist'>('Overall');

    useEffect(() => {
        const url = `${API_URL}/playerstats_panel_by_player_id?player_id=${PlayerID}${filter ? `&${filter}` : ''}`;
        axios
            .get<CompletePlayerStatsInterface>(url)
            .then((response) => setPlayerStats(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID, filter]);

    const stats = playerStats?.[PlayerID][selectedStatType];

    return (
        <div className="p-1 bg-gray-800">
            <div className="flex justify-center space-x-2 mb-1 bg-gray-700 p-2">
                <button
                    onClick={() => setSelectedStatType('Overall')}
                    className={`px-3 py-1 text-xs text-white bg-gray-600
                        ${selectedStatType === 'Overall'
                            ? 'border border-green-500 ring-1 ring-green-500'
                            : 'border border-transparent'}`}>
                    Overall
                </button>

                <button
                    onClick={() => setSelectedStatType('Terrorist')}
                    className={`px-3 py-1 text-xs text-white bg-gray-600
                        ${selectedStatType === 'Terrorist'
                        ? 'border border-orange-500 ring-1 ring-orange-500'
                            : 'border border-transparent'}`}>
                    Terrorist
                </button>

                <button
                    onClick={() => setSelectedStatType('CounterTerrorist')}
                    className={`px-3 py-1 text-xs text-white bg-gray-600
                        ${selectedStatType === 'CounterTerrorist'
                        ? 'border border-blue-500 ring-1 ring-blue-500'
                            : 'border border-transparent'}`}>
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
                        <div className="text-xs"> Impact </div>
                        <div className="text-xl font-semibold"> {stats?.Impact} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> KAST </div>
                        <div className="text-xl font-semibold"> {stats?.KAST}% </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> K/D </div>
                        <div className="text-xl font-semibold">
                            {stats?.Kills && stats?.Deaths
                                ? ((stats?.Kills / stats?.Deaths)).toFixed(2) : "0"}
                        </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Headshots </div>
                        <div className="text-xl font-semibold">
                            {stats?.Headshots && stats?.Kills
                                ? ((stats?.Headshots / stats?.Kills) * 100).toFixed(2) : "0"}%
                        </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> ADR </div>
                        <div className="text-xl font-semibold"> {stats?.ADR} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Enemies Flashed / Round </div>
                        <div className="text-xl font-semibold">
                            {stats?.Blinds.Count && stats?.RoundsPlayed
                                ? ((stats?.Blinds.Count / stats?.RoundsPlayed)).toFixed(2) : "0"}
                        </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Time / Enemy Flashed </div>
                        <div className="text-xl font-semibold">
                            {stats?.Blinds.TotalDuration && stats?.Blinds.Count
                                ? ((stats?.Blinds.TotalDuration / stats?.Blinds.Count)).toFixed(2) : "0"}s
                        </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Utility Damage / Round </div>
                        <div className="text-xl font-semibold">
                            {stats?.UtilityDamage && stats?.RoundsPlayed
                                ? ((stats?.UtilityDamage / stats?.RoundsPlayed)).toFixed(2) : "0"}
                        </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Rounds Played </div>
                        <div className="text-xl font-semibold"> {stats?.RoundsPlayed} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Matches Played </div>
                        <div className="text-xl font-semibold"> {playerStats?.[PlayerID].MatchesPlayed} </div>
                    </div>

                    <div className="text-center p-1 bg-gray-600">
                        <div className="text-xs"> Match Win Rate </div>
                        <div className="text-xl font-semibold">
                            {playerStats?.MatchesWon && playerStats?.MatchesPlayed
                                ? ((playerStats?.[PlayerID].MatchesWon / playerStats?.[PlayerID].MatchesPlayed) * 100).toFixed(2) : "0"}%
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PlayerStatsPanel;