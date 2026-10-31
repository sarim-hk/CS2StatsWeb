import FullMatchInterface from '../../interfaces/FullMatchInterface';
import { ui } from '../ui';

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
                    mostKilledPlayerName = team.Players[mostKilledPlayer].Overall.Username;
                }
            });
        }

        return {
            attemptPercentage: attemptRate.toFixed(1),
            successPercentage: successRate.toFixed(1),
            mostKilledPlayerName: mostKilledPlayerName || 'N/A',
            totalSuccesses: playerSuccesses,
            totalAttempts: playerAttempts,
            totalOpeningDeaths: totalOpeningDeaths
        };
    };

    return (
        <div className={ui.panel}>
            {Object.values(team.Players).map(player => {
                const stats = calculateOpeningDuelStats(player.Overall.PlayerID);

                return (
                    <div key={player.Overall.PlayerID} className={ui.panelRow}>
                        <div className={ui.panelRowContent}>
                            <div className="flex items-center space-x-6">
                                <div className="flex w-24 flex-col items-center pt-2">
                                    <div className="relative">
                                        <img
                                            src={player.Overall.AvatarL}
                                            className={ui.detailAvatar}
                                            alt={player.Overall.Username}
                                        />
                                    </div>
                                    <div className={ui.detailUsername}>{player.Overall.Username}</div>
                                </div>

                                <div className={ui.detailGrid}>
                                    <div className={ui.statCard}>
                                        <div className={ui.statLabel}>Attempt Rate</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${ui.statValue} text-blue-400`}>
                                                {stats.attemptPercentage}%
                                            </span>
                                            <span className={ui.statSecondary}>
                                                ({stats.totalAttempts}/{stats.totalOpeningDeaths})
                                            </span>
                                        </div>
                                    </div>

                                    <div className={ui.statCard}>
                                        <div className={ui.statLabel}>Success Rate</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${ui.statValue} text-green-400`}>
                                                {stats.successPercentage}%
                                            </span>
                                            <span className={ui.statSecondary}>
                                                ({stats.totalSuccesses}/{stats.totalAttempts})
                                            </span>
                                        </div>
                                    </div>

                                    <div className={ui.statCard}>
                                        <div className={ui.statLabel}>Most Killed</div>
                                        <div className={`${ui.statValue} truncate text-purple-400`}>
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
