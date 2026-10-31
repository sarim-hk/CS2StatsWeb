import FullMatchInterface from '../../interfaces/FullMatchInterface';
import { ui } from '../ui';

interface RatingBreakdownPanelProps {
    Match: FullMatchInterface | undefined;
    TeamID: string;
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
        <div className={ui.panel}>
            {Object.values(team.Players).map(player => {

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
                                        <div className={ui.statLabel}>Overall Rating</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${ui.statValue} text-green-400`}>
                                                {player.Overall.Rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={ui.statCard}>
                                        <div className="flex justify-between items-start">
                                            <div className={ui.statLabel}>Counter-Terrorist Rating</div>
                                            <div className="relative group">
                                                <div className="w-4 h-4 flex items-center justify-center text-gray-400 text-sm cursor-help">
                                                    <span className="font-medium">i</span>
                                                </div>
                                                <div className="absolute hidden group-hover:block right-0 w-64 p-2 mt-1 text-xs text-gray-300 bg-gray-900 rounded-sm shadow-lg z-10 top-full">
                                                    Per-side ratings for matches before 15/02/2025 may be slightly inaccurate.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${ui.statValue} text-blue-500`}>
                                                {player.CounterTerrorist.Rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={ui.statCard}>
                                        <div className="flex justify-between items-start">
                                            <div className={ui.statLabel}>Terrorist Rating</div>
                                            <div className="relative group">
                                                <div className="w-4 h-4 flex items-center justify-center text-gray-400 text-sm cursor-help">
                                                    <span className="font-medium">i</span>
                                                </div>
                                                <div className="absolute hidden group-hover:block right-0 w-64 p-2 mt-1 text-xs text-gray-300 bg-gray-900 rounded-sm shadow-lg z-10 top-full">
                                                    Per-side ratings for matches before 15/02/2025 may be slightly inaccurate.
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${ui.statValue} text-orange-500`}>
                                            {player.Terrorist.Rating}
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

export default RatingBreakdownPanel;
