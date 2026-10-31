import FullMatchInterface from "../../interfaces/FullMatchInterface";
import { ui } from "../ui";

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
        <div className={`${ui.panelHeader} p-3`}>
            <div className="flex flex-col gap-3">
                
                {/* Panel Type Selector */}
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => onPanelChange("clutch")}
                        className={`
                            ${ui.control}
                            ${activePanel === "clutch"
                                ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50"
                                : ui.controlIdle
                            }
                        `}
                    >
                        Clutches
                    </button>

                    <button
                        onClick={() => onPanelChange("openingduel")}
                        className={`
                            ${ui.control}
                            ${activePanel === "openingduel"
                                ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50"
                                : ui.controlIdle
                            }
                        `}
                    >
                        Opening Duels
                    </button>

                    <button
                        onClick={() => onPanelChange("ratingbreakdown")}
                        className={`
                            ${ui.control}
                            ${activePanel === "ratingbreakdown"
                                ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50"
                                : ui.controlIdle
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
                                ${ui.control}
                                ${selectedTeamId === teamId
                                    ? team.Side === 2
                                        ? "bg-orange-500/20 text-orange-500 ring-1 ring-orange-500/50"
                                        : "bg-blue-500/20 text-blue-500 ring-1 ring-blue-500/50"
                                    : ui.controlIdle
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
