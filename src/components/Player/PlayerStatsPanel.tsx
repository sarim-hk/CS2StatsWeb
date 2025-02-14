import { useEffect, useState } from 'react';
import axios from 'axios';
import CompletePlayerStatsInterface from '../../interfaces/PlayerStatsInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerStatsPanelProps {
    PlayerID: string;
    filter: string;
    onMatchIdsUpdate: (matchIds: number[]) => void;
}

function PlayerStatsPanel({ PlayerID, filter, onMatchIdsUpdate }: PlayerStatsPanelProps) {
    const [playerStats, setPlayerStats] = useState<CompletePlayerStatsInterface>();
    const [selectedStatType, setSelectedStatType] = useState<'Overall' | 'Terrorist' | 'CounterTerrorist'>('Overall');

    useEffect(() => {
        const url = `${API_URL}/playerstats_panel_by_player_id?player_id=${PlayerID}${filter ? `&${filter}` : ''}`;
        axios
            .get<CompletePlayerStatsInterface>(url)
            .then((response) => {
                setPlayerStats(response.data);
                const extractedMatchIds = response.data?.[PlayerID]?.MatchIDs || [];
                onMatchIdsUpdate(extractedMatchIds);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID, filter, onMatchIdsUpdate]);

    const sharedStyles = {
        container: "bg-gray-800",
        header: "border-b border-gray-700",
        headerContent: "p-2 flex justify-center space-x-2",
        button: "px-3 py-1 text-xs font-medium transition-colors duration-200",
        statsContainer: "p-4",
        row: "border-b border-gray-700 last:border-b-0",
        rowContent: "p-3 hover:bg-gray-700/50 transition-colors duration-200",
        statLabel: "text-sm font-medium text-gray-400",
        statValue: "text-base font-bold"
    };

    const getButtonStyle = (type: 'Overall' | 'Terrorist' | 'CounterTerrorist') => `
        ${sharedStyles.button}
        ${selectedStatType === type
            ? type === 'Overall'
                ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                : type === 'Terrorist'
                    ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                    : 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
    }`;

    const stats = playerStats?.[PlayerID][selectedStatType];

    const statRows = [
        {
            label: "Performance",
            value: (
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Rating</span>
                        <span className="text-gray-300">{Number(stats?.Rating ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Impact</span>
                        <span className="text-gray-300">{Number(stats?.Impact ?? 0).toFixed(2)}</span>
                    </div>
                </div>
            )
        },
        {
            label: "Firepower",
            value: (
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">K/D</span>
                        <span className="text-gray-300">
                            {stats?.Kills && stats?.Deaths ? (Number(stats.Kills) / Number(stats.Deaths)).toFixed(2) : "0.00"}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">ADR</span>
                        <span className="text-gray-300">{Number(stats?.ADR ?? 0).toFixed(0)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">HS%</span>
                        <span className="text-gray-300">
                            {stats?.Headshots && stats?.Kills ? ((Number(stats.Headshots) / Number(stats.Kills)) * 100).toFixed(0) : "0"}%
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">KAST</span>
                        <span className="text-gray-300">{Number(stats?.KAST ?? 0).toFixed(0)}%</span>
                    </div>
                </div>
            )
        },
        {
            label: "Utility",
            value: (
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">EF / Round</span>
                        <span className="text-gray-300">
                            {stats?.Blinds?.Count && stats?.RoundsPlayed
                                ? (Number(stats.Blinds.Count) / Number(stats.RoundsPlayed)).toFixed(1)
                                : "0.0"}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">UD / Round</span>
                        <span className="text-gray-300">
                            {stats?.UtilityDamage && stats?.RoundsPlayed
                                ? (Number(stats.UtilityDamage) / Number(stats.RoundsPlayed)).toFixed(1)
                                : "0.0"}
                        </span>
                    </div>
                </div>
            )
        },
        {
            label: "Overview",
            value: (
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Rounds</span>
                        <span className="text-gray-300">{Number(stats?.RoundsPlayed ?? 0)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Matches</span>
                        <span className="text-gray-300">{Number(playerStats?.[PlayerID]?.MatchesPlayed ?? 0)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">Win Rate</span>
                        <span className="text-gray-300">
                            {playerStats?.[PlayerID]?.MatchesWon && playerStats?.[PlayerID]?.MatchesPlayed
                                ? ((Number(playerStats[PlayerID].MatchesWon) / Number(playerStats[PlayerID].MatchesPlayed)) * 100).toFixed(0)
                                : "0"}%
                        </span>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className={sharedStyles.container}>
            <div className={sharedStyles.header}>
                <div className={sharedStyles.headerContent}>
                    <button
                        onClick={() => setSelectedStatType('Overall')}
                        className={getButtonStyle('Overall')}>
                        Overall
                    </button>
                    <button
                        onClick={() => setSelectedStatType('Terrorist')}
                        className={getButtonStyle('Terrorist')}>
                        Terrorist
                    </button>
                    <button
                        onClick={() => setSelectedStatType('CounterTerrorist')}
                        className={getButtonStyle('CounterTerrorist')}>
                        Counter-Terrorist
                    </button>
                </div>
            </div>

            <div>
                {statRows.map((row, index) => (
                    <div key={index} className={sharedStyles.row}>
                        <div className={sharedStyles.rowContent}>
                            <div className="flex items-center justify-between">
                                <div className={sharedStyles.statLabel}>{row.label}</div>
                                <div className={sharedStyles.statValue}>{row.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlayerStatsPanel;