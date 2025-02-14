import FullMatchInterface from '../../interfaces/FullMatchInterface';

import React from 'react';

interface OpeningDuelProps {
    Match: FullMatchInterface | undefined;
    TeamID: string;
}

function OpeningDuelPanel({ Match, TeamID }: OpeningDuelProps) {
    if (!Match) {
        return null;
    }

    const team = Match.Teams[TeamID];

    if (!team) {
        return null;
    }

    const calculateOpeningDuelStats = (playerID: string) => {
        const openingDeaths = Match.Deaths.filter(death => death.OpeningDeath === 1);
        const totalOpeningDeaths = openingDeaths.length;

        // Player's attempts (when player is either attacker or victim)
        const playerAttempts = openingDeaths.filter(death =>
            death.AttackerID === playerID || death.VictimID === playerID
        ).length;

        // Player's successes (when player is the attacker)
        const playerSuccesses = openingDeaths.filter(death =>
            death.AttackerID === playerID
        ).length;

        // Attempt rate = player's attempts / total opening deaths
        const attemptRate = totalOpeningDeaths > 0 ?
            (playerAttempts / totalOpeningDeaths) * 100 : 0;

        // Success rate = player's successes / player's attempts
        const successRate = playerAttempts > 0 ?
            (playerSuccesses / playerAttempts) * 100 : 0;

        // Most killed player calculation
        const kills = openingDeaths.filter(death =>
            death.AttackerID === playerID
        ).reduce((acc, death) => {
            acc[death.VictimID] = (acc[death.VictimID] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        let mostKilledPlayer = '';
        let maxKills = 0;

        Object.entries(kills).forEach(([victimID, killCount]) => {
            if (killCount > maxKills) {
                maxKills = killCount;
                mostKilledPlayer = victimID;
            }
        });

        let mostKilledPlayerName = '';
        if (mostKilledPlayer) {
            Object.values(Match.Teams).forEach(team => {
                if (team.Players[mostKilledPlayer]) {
                    mostKilledPlayerName = team.Players[mostKilledPlayer].Username;
                }
            });
        }

        return {
            attemptPercentage: attemptRate.toFixed(1),
            successPercentage: successRate.toFixed(1),
            mostKilledPlayerName: mostKilledPlayerName || 'N/A',
            totalSuccesses: playerSuccesses,
            totalAttempts: playerAttempts
        };
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            {Object.values(team.Players).map(player => {
                const stats = calculateOpeningDuelStats(player.PlayerID);

                return (
                    <div key={player.PlayerID} className="border-b border-gray-700 last:border-b-0">
                        <div className="p-4 hover:bg-gray-700/50 transition-colors duration-200">
                            <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0 flex flex-col items-center justify-center w-20">
                                    <div className="relative">
                                        <img
                                            src={player.AvatarL}
                                            className="w-16 h-16 rounded-full ring-2 ring-gray-600 shadow-md"
                                            alt={player.Username}
                                        />
                                    </div>
                                    <div className="mt-2 text-sm font-medium text-gray-200">{player.Username}</div>
                                </div>

                                <div className="flex-1 grid grid-cols-3 gap-6">
                                    <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200">
                                        <div className="text-sm font-medium text-gray-400 mb-1">Attempt Rate</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-2xl font-bold text-blue-400">
                                                {stats.attemptPercentage}%
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({stats.totalAttempts})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200">
                                        <div className="text-sm font-medium text-gray-400 mb-1">Success Rate</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-2xl font-bold text-green-400">
                                                {stats.successPercentage}%
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({stats.totalSuccesses})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200">
                                        <div className="text-sm font-medium text-gray-400 mb-1">Most Killed</div>
                                        <div className="text-lg font-semibold text-purple-400 truncate">
                                            {stats.mostKilledPlayerName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default OpeningDuelPanel;