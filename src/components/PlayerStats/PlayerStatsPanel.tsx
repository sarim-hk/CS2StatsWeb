import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerStatsInterface from '../../interfaces/PlayerStatsInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerStatsPanelProps {
    PlayerID: string;
}

function combinePlayerStats(playerStatsList: PlayerStatsInterface[]): PlayerStatsInterface {
    const combinedStats: PlayerStatsInterface = {
        PlayerStatID: -1,
        PlayerID: "",
        Username: "",
        Kills: 0,
        Headshots: 0,
        Assists: 0,
        Deaths: 0,
        TotalDamage: 0,
        UtilityDamage: 0,
        RoundsPlayed: 0
    };

    for (const stats of playerStatsList) {
        combinedStats.Kills += stats.Kills;
        combinedStats.Headshots += stats.Headshots;
        combinedStats.Assists += stats.Assists;
        combinedStats.Deaths += stats.Deaths;
        combinedStats.TotalDamage += stats.TotalDamage;
        combinedStats.UtilityDamage += stats.UtilityDamage;
        combinedStats.RoundsPlayed += stats.RoundsPlayed;
    }

    return combinedStats;
}

function PlayerStatsPanel({ PlayerID }: PlayerStatsPanelProps) {
    const [playerStats, setPlayerStats] = useState<PlayerStatsInterface>();

    useEffect(() => {
        axios
            .get<PlayerStatsInterface[]>(`${API_URL}/get_player_playerstats_by_player_id?player_id=${PlayerID}`)
            .then((response) => {
                const playerStats = combinePlayerStats(response.data);
                setPlayerStats(playerStats);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);

    return (
        <div className="p-1 bg-gray-800">
            <div className="p-4 bg-gray-600">

                <div className="flex justify-between">
                    <div className="flex">
                        <div>Kills</div>
                        <div className="ml-1 text-[8px]">per round</div>
                    </div>
                    <div>{playerStats?.Kills && playerStats?.RoundsPlayed ? (playerStats.Kills / playerStats.RoundsPlayed).toFixed(2) : 0}</div>
                </div>

                <div className="flex justify-between">
                    <div className="flex">
                        <div>Assists</div>
                        <div className="ml-1 text-[8px]">per round</div>
                    </div>
                    <div>{playerStats?.Assists && playerStats?.RoundsPlayed ? (playerStats.Assists / playerStats.RoundsPlayed).toFixed(2) : 0}</div>
                </div>

                <div className="flex justify-between">
                    <div className="flex">
                        <div>Deaths</div>
                        <div className="ml-1 text-[8px]">per round</div>
                    </div>
                    <div>{playerStats?.Deaths && playerStats?.RoundsPlayed ? (playerStats.Deaths / playerStats.RoundsPlayed).toFixed(2) : 0}</div>
                </div>

                <div className="flex justify-between">
                    <div className="flex">
                        <div>Damage</div>
                        <div className="ml-1 text-[8px]">per round</div>
                    </div>
                    <div>{playerStats?.TotalDamage && playerStats?.RoundsPlayed ? (playerStats.TotalDamage / playerStats.RoundsPlayed).toFixed(2) : 0}</div>
                </div>

                <div className="flex justify-between">
                    <div className="flex">
                        <div>Utility Damage</div>
                        <div className="ml-1 text-[8px]">per round</div>
                    </div>
                    <div>{playerStats?.UtilityDamage && playerStats?.RoundsPlayed ? (playerStats.UtilityDamage / playerStats.RoundsPlayed).toFixed(2) : 0}</div>
                </div>

                <div className="flex justify-between">
                    <div>Headshots</div>
                    <div>{playerStats?.Kills && playerStats?.Headshots ? (playerStats.Headshots / playerStats.Kills * 100).toFixed(2) : 0}%</div>
                </div>
                
            </div>
        </div>
    );
}

export default PlayerStatsPanel;
