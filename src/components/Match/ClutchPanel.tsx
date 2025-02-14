import FullMatchInterface from '../../interfaces/FullMatchInterface';

interface ClutchPanelProps {
    Match: FullMatchInterface | undefined;
    TeamID: string;
}

function ClutchPanel({ Match, TeamID }: ClutchPanelProps) {
    if (!Match) {
        return null;
    }

    const team = Match.Teams[TeamID];

    if (!team) {
        return null;
    }

    const calculateClutchStats = (playerID: string) => {
        const clutchAttempts = Match.Clutches.filter(clutch =>
            clutch.PlayerID === playerID
        );
        const duelWins = Match.Duels.filter(duel =>
            duel.WinnerID === playerID
        );

        const totalClutchAttempts = clutchAttempts.length;
        const successfulClutches = clutchAttempts.filter(clutch =>
            clutch.Result === 'Win'
        ).length;
        const totalSuccesses = successfulClutches + duelWins.length;
        const totalAttempts = totalClutchAttempts + duelWins.length;

        const successRate = totalAttempts > 0 ?
            (totalSuccesses / totalAttempts) * 100 : 0;

        return {
            successRate: successRate.toFixed(1),
            totalSuccesses,
            totalAttempts
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
                const stats = calculateClutchStats(player.PlayerID);
                const events = [
                    ...Match.Clutches.filter(clutch => clutch.PlayerID === player.PlayerID),
                    ...Match.Duels.filter(duel => duel.WinnerID === player.PlayerID),
                ].sort((a, b) => a.RoundID - b.RoundID);

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
                                        <div className={sharedStyles.cardLabel}>Success Rate</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${sharedStyles.statValue} text-green-400`}>
                                                {stats.successRate}%
                                            </span>
                                            <span className={sharedStyles.statSecondary}>
                                                ({stats.totalSuccesses}/{stats.totalAttempts})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200">
                                        <div className={sharedStyles.cardLabel}>Clutch Timeline</div>
                                        <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap h-8">
                                            <div className="inline-flex gap-2">
                                                {events.map((event, index) => {
                                                    const isClutch = 'EnemyCount' in event;
                                                    return (
                                                        <div
                                                            key={`${event.RoundID}-${index}`}
                                                            className={`
                                                                px-3 py-1 rounded-full text-xs font-medium flex-shrink-0
                                                                ${isClutch
                                                                    ? (event as any).Result === 'Win'
                                                                        ? 'bg-green-500/20 text-green-400'
                                                                        : 'bg-red-500/20 text-red-400'
                                                                    : 'bg-green-500/20 text-green-400'
                                                                }
                                                            `}
                                                        >
                                                            R{event.RoundID - Match.Rounds[0].RoundID + 1}:
                                                            {isClutch ? ` 1v${(event as any).EnemyCount}` : ' 1v1'}
                                                        </div>
                                                    );
                                                })}
                                            </div>
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

export default ClutchPanel;