import FullMatchInterface from "../../interfaces/FullMatchInterface";

interface TeamSelectorPanelProps {
    Match: FullMatchInterface;
    selectedTeamId: string;
    onTeamSelect: (teamId: string) => void;
    activePanel: "clutch" | "openingduel" | "ratingbreakdown";
    onPanelChange: (panel: "clutch" | "openingduel" | "ratingbreakdown") => void;
}

function TeamSelectorPanel({
    Match,
    selectedTeamId,
    onTeamSelect,
    activePanel,
    onPanelChange
}: TeamSelectorPanelProps) {
    
    return (
        <div className="bg-gray-800 p-3 border-b border-gray-700">
            <div className="flex flex-col gap-3">
                
                {/* Panel Type Selector */}
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => onPanelChange("clutch")}
                        className={`
                            px-3 py-1 rounded text-xs font-medium transition-all duration-200
                            ${activePanel === "clutch"
                                ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50"
                                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                            }
                        `}
                    >
                        Clutches
                    </button>

                    <button
                        onClick={() => onPanelChange("openingduel")}
                        className={`
                            px-3 py-1 rounded text-xs font-medium transition-all duration-200
                            ${activePanel === "openingduel"
                                ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50"
                                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                            }
                        `}
                    >
                        Opening Duels
                    </button>

                    <button
                        onClick={() => onPanelChange("ratingbreakdown")}
                        className={`
                            px-3 py-1 rounded text-xs font-medium transition-all duration-200
                            ${activePanel === "ratingbreakdown"
                                ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50"
                                : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                            }
                        `}
                    >
                        Rating Breakdown
                    </button>

                </div>

                {/* Team Selector */}
                <div className="flex justify-center gap-2">
                    {Object.entries(Match.Teams).map(([teamId, team]) => (
                        <button
                            key={teamId}
                            onClick={() => onTeamSelect(teamId)}
                            className={`
                                px-3 py-1 rounded text-xs font-medium transition-all duration-200
                                ${selectedTeamId === teamId
                                    ? team.Side === 2
                                        ? "bg-orange-500/20 text-orange-500 ring-1 ring-orange-500/50"
                                        : "bg-blue-500/20 text-blue-500 ring-1 ring-blue-500/50"
                                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                                }
                            `}
                        >
                            {team.TeamName}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TeamSelectorPanel;