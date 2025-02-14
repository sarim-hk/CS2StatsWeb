import FullMatchInterface from '../../interfaces/FullMatchInterface';

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
            totalAttempts: playerAttempts,
            totalOpeningDeaths: totalOpeningDeaths
        };
    };

    const sharedStyles = {
        container: "bg-gray-800",
        row: "border-b border-gray-700 last:border-b-0",
        rowContent: "p-4 hover:bg-gray-700/50 transition-colors duration-200",
        avatarContainer: "flex flex-col items-center pt-2 w-24",
        avatarWrapper: "relative",
        avatar: "w-16 h-16 ring-2 ring-gray-600 shadow-md",
        username: "mt-2 text-xs font-medium text-gray-200",
        gridContainer: "flex-1 grid grid-cols-3 gap-6",
        card: "bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200",
        cardLabel: "text-sm font-medium text-gray-400 mb-1",
        statValue: "text-2xl font-bold",
        statSecondary: "text-sm text-gray-500"
    };
    
    return (
        <div className={sharedStyles.container}>
            {Object.values(team.Players).map(player => {
                const stats = calculateOpeningDuelStats(player.PlayerID);

                return (
                    <div key={player.PlayerID} className={sharedStyles.row}>
                        <div className={sharedStyles.rowContent}>
                            <div className="flex items-center space-x-6">
                                <div className={sharedStyles.avatarContainer}>
                                    <div className="relative">
                                        <img
                                            src={player.AvatarL}
                                            className={sharedStyles.avatar}
                                            alt={player.Username}
                                        />
                                    </div>
                                    <div className={sharedStyles.username}>{player.Username}</div>
                                </div>

                                <div className={sharedStyles.gridContainer}>
                                    <div className={sharedStyles.card}>
                                        <div className={sharedStyles.cardLabel}>Attempt Rate</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${sharedStyles.statValue} text-blue-400`}>
                                                {stats.attemptPercentage}%
                                            </span>
                                            <span className={sharedStyles.statSecondary}>
                                                ({stats.totalAttempts}/{stats.totalOpeningDeaths})
                                            </span>
                                        </div>
                                    </div>

                                    <div className={sharedStyles.card}>
                                        <div className={sharedStyles.cardLabel}>Success Rate</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${sharedStyles.statValue} text-green-400`}>
                                                {stats.successPercentage}%
                                            </span>
                                            <span className={sharedStyles.statSecondary}>
                                                ({stats.totalSuccesses}/{stats.totalAttempts})
                                            </span>
                                        </div>
                                    </div>

                                    <div className={sharedStyles.card}>
                                        <div className={sharedStyles.cardLabel}>Most Killed</div>
                                        <div className={`${sharedStyles.statValue} text-purple-400 truncate`}>
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