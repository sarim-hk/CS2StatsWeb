import { useEffect, useState } from 'react';
import apiClient, { isRequestCanceled } from '../../apiClient';
import CompletePlayerStatsInterface from '../../interfaces/PlayerStatsInterface';
import { ui } from '../ui';

interface PlayerStatsPanelProps {
    PlayerID: string;
    filter: string;
}

function PlayerStatsPanel({ PlayerID, filter }: PlayerStatsPanelProps) {
    const [playerStats, setPlayerStats] = useState<CompletePlayerStatsInterface>();
    const [selectedStatType, setSelectedStatType] = useState<'Overall' | 'Terrorist' | 'CounterTerrorist'>('Overall');

    useEffect(() => {
        const controller = new AbortController();
        const params = new URLSearchParams(filter);
        params.set("player_id", PlayerID);
        apiClient
            .get<CompletePlayerStatsInterface>("/playerstats_panel", {
                params,
                signal: controller.signal,
            })
            .then((response) => {
                setPlayerStats(response.data);
            })
            .catch((error) => {
                if (!isRequestCanceled(error)) {
                    console.error("Error fetching player stats data:", error);
                }
            });

        return () => controller.abort();
    }, [PlayerID, filter]);

    const getButtonStyle = (type: 'Overall' | 'Terrorist' | 'CounterTerrorist') => `
        ${ui.control}
        ${selectedStatType === type
            ? type === 'Overall'
                ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                : type === 'Terrorist'
                    ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                    : 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50'
            : ui.controlIdle
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
                        <span className="text-xs text-gray-500">Time / EF</span>
                        <span className="text-gray-300">
                            {stats?.UtilityDamage && stats?.RoundsPlayed
                                ? (Number(stats.Blinds.TotalDuration) / Number(stats.Blinds.Count)).toFixed(1)
                                : "0.0"}s
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
        <div className={ui.panelFlat}>
            <div className={ui.panelHeader}>
                <div className="flex justify-center gap-2 p-2">
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
                {statRows.map((row) => (
                    <div key={row.label} className={ui.panelRow}>
                        <div className={ui.panelRowContent}>
                            <div className="flex items-center justify-between">
                                <div className={ui.statRowLabel}>{row.label}</div>
                                <div className="text-base font-semibold">{row.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlayerStatsPanel;
