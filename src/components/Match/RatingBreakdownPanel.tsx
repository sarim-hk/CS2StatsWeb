import FullMatchInterface from '../../interfaces/FullMatchInterface';
import { ui } from '../ui';

interface RatingBreakdownPanelProps {
    Match: FullMatchInterface | undefined;
    TeamID: string;
}

const SIDE_RATING_NOTE = 'Per-side ratings for matches before 15/02/2025 may be slightly inaccurate.';

function InfoTip({ text }: { text: string }) {
    return (
        <div className="relative group">
            <div className="flex h-4 w-4 cursor-help items-center justify-center text-sm text-gray-400">
                <span className="font-medium">i</span>
            </div>
            <div className="absolute right-0 top-full z-10 mt-1 hidden w-64 rounded-sm bg-gray-900 p-2 text-xs text-gray-300 shadow-lg group-hover:block">
                {text}
            </div>
        </div>
    );
}

function RatingBreakdownPanel({ Match, TeamID }: RatingBreakdownPanelProps) {
    if (!Match) {
        return null;
    }

    const team = Match.Teams[TeamID];

    if (!team) {
        return null;
    }

    return (
        <div className={ui.panelFlat}>
            {Object.values(team.Players).map(player => (
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
                                    <div className={ui.statLabel}>Overall Rating</div>
                                    <div className="flex items-baseline space-x-2">
                                        <span className={`${ui.statValue} text-green-400`}>
                                            {player.Overall.Rating}
                                        </span>
                                    </div>
                                </div>

                                <div className={ui.statCard}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className={ui.statLabel}>Counter-Terrorist Rating</div>
                                        <InfoTip text={SIDE_RATING_NOTE} />
                                    </div>
                                    <div className="flex items-baseline space-x-2">
                                        <span className={`${ui.statValue} text-blue-500`}>
                                            {player.CounterTerrorist.Rating}
                                        </span>
                                    </div>
                                </div>

                                <div className={ui.statCard}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className={ui.statLabel}>Terrorist Rating</div>
                                        <InfoTip text={SIDE_RATING_NOTE} />
                                    </div>
                                    <div className={`${ui.statValue} text-orange-500`}>
                                        {player.Terrorist.Rating}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RatingBreakdownPanel;