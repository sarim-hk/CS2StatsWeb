import FullMatchInterface from '../../interfaces/FullMatchInterface';
import { ui } from '../ui';

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

    return (
        <div className={ui.panelFlat}>
            {Object.values(team.Players).map(player => {
                const stats = calculateClutchStats(player.Overall.PlayerID);
                const events = [
                    ...Match.Clutches.filter(clutch => clutch.PlayerID === player.Overall.PlayerID),
                    ...Match.Duels.filter(duel => duel.WinnerID === player.Overall.PlayerID),
                ].sort((a, b) => a.RoundID - b.RoundID);

                return (
                    <div key={player.Overall.PlayerID} className={ui.panelRow}>
                        <div className={ui.panelRowContent}>
                            <div className={ui.detailRow}>
                                <div className={ui.detailIdentity}>
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
                                        <div className={ui.statLabel}>Success Rate</div>
                                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                            <span className={`${ui.statValue} text-green-400`}>
                                                {stats.successRate}%
                                            </span>
                                            <span className={ui.statSecondary}>
                                                ({stats.totalSuccesses}/{stats.totalAttempts})
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`${ui.statCard} col-span-1 h-16 flex-col items-center justify-center gap-1 md:col-span-2 md:block md:h-auto`}>
                                        <div className="flex h-full w-full flex-col items-center justify-center gap-0 md:block">
                                            <div className={`${ui.statLabel} text-center md:text-left`}>Clutch Timeline</div>
                                            {/* Scrolls inside its own card. Chips are centred with auto margins
                                                (not justify-center), so the first chips stay reachable when they overflow. */}
                                            <div className="h-8 w-full min-w-0 flex-none overflow-x-auto overflow-y-hidden whitespace-nowrap md:w-auto">
                                                <div className="flex h-full min-w-full items-center gap-2">
                                                    {events.map((event) => {
                                                        const isClutch = 'EnemyCount' in event;
                                                        return (
                                                            <div
                                                                key={isClutch ? `clutch-${event.ClutchID}` : `duel-${event.DuelID}`}
                                                                className={`
                                                                    flex-shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-medium first:ml-auto last:mr-auto md:first:ml-0 md:last:mr-0 md:px-3 md:py-1 md:text-xs
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
                    </div>
                );
            })}
        </div>
    );
}

export default ClutchPanel;
