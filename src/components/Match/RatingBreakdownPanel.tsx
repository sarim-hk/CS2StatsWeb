import FullMatchInterface from '../../interfaces/FullMatchInterface';

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

    const sharedStyles = {
        container: "bg-gray-800",
        row: "border-b border-gray-700 last:border-b-0",
        rowContent: "p-4 hover:bg-gray-700/50 transition-colors duration-200",
        avatarContainer: "flex flex-col items-center pt-2 w-24",
        avatarWrapper: "relative",
        avatar: "w-16 h-16 ring-2 ring-gray-600 shadow-md",
        username: "mt-2 text-xs font-medium text-gray-200",
        gridContainer: "flex-1 grid grid-cols-3 gap-6",
        card: "bg-gray-700/50 rounded-sm p-4 hover:bg-gray-700 transition-colors duration-200",
        cardLabel: "text-sm font-medium text-gray-400 mb-1",
        statValue: "text-2xl font-semibold",
        statSecondary: "text-sm text-gray-500"
    };

    return (
        <div className={sharedStyles.container}>
            {Object.values(team.Players).map(player => {

                return (
                    <div key={player.Overall.PlayerID} className={sharedStyles.row}>
                        <div className={sharedStyles.rowContent}>
                            <div className="flex items-center space-x-6">
                                <div className={sharedStyles.avatarContainer}>
                                    <div className="relative">
                                        <img
                                            src={player.Overall.AvatarL}
                                            className={sharedStyles.avatar}
                                            alt={player.Overall.Username}
                                        />
                                    </div>
                                    <div className={sharedStyles.username}>{player.Overall.Username}</div>
                                </div>

                                <div className={sharedStyles.gridContainer}>
                                    <div className={sharedStyles.card}>
                                        <div className={sharedStyles.cardLabel}>Overall Rating</div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${sharedStyles.statValue} text-green-400`}>
                                                {player.Overall.Rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={sharedStyles.card}>
                                        <div className="flex justify-between items-start">
                                            <div className={sharedStyles.cardLabel}>Counter-Terrorist Rating</div>
                                            <div className="relative group">
                                                <div className="w-4 h-4 flex items-center justify-center text-gray-400 text-sm cursor-help">
                                                    <span className="font-medium">i</span>
                                                </div>
                                                <div className="absolute hidden group-hover:block right-0 w-64 p-2 mt-1 text-xs text-gray-300 bg-gray-900 rounded-md shadow-lg z-10">
                                                    Per-side ratings for matches before 15/02/2024 may be slightly inaccurate.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline space-x-2">
                                            <span className={`${sharedStyles.statValue} text-blue-500`}>
                                                {player.CounterTerrorist.Rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={sharedStyles.card}>
                                        <div className="flex justify-between items-start">
                                            <div className={sharedStyles.cardLabel}>Terrorist Rating</div>
                                            <div className="relative group">
                                                <div className="w-4 h-4 flex items-center justify-center text-gray-400 text-sm cursor-help">
                                                    <span className="font-medium">i</span>
                                                </div>
                                                <div className="absolute hidden group-hover:block right-0 w-64 p-2 mt-1 text-xs text-gray-300 bg-gray-900 rounded-md shadow-lg z-10">
                                                    Per-side ratings for matches before 15/02/2024 may be slightly inaccurate.
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${sharedStyles.statValue} text-orange-500`}>
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