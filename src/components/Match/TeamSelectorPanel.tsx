import FullMatchInterface from "../../interfaces/FullMatchInterface";
import { ui } from "../ui";
import apiClient from "../../apiClient";

const DEMO_RETENTION_MS = 14 * 24 * 60 * 60 * 1000;

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
    const hasMatchName = typeof Match.MatchName === "string" && Match.MatchName.trim().length > 0;
    const matchDate = new Date(Match.MatchDate);
    const isDemoExpired = !Number.isNaN(matchDate.getTime())
        && Date.now() - matchDate.getTime() >= DEMO_RETENTION_MS;
    const demoDownloadUrl = hasMatchName && !isDemoExpired
        ? apiClient.getUri({ url: `/download_demo/${encodeURIComponent(String(Match.MatchID))}` })
        : undefined;
    
    return (
        <div className={`${ui.panelHeader} relative p-3`}>
            {demoDownloadUrl && (
                <a
                    href={demoDownloadUrl}
                    className="absolute right-2 top-2 rounded-sm px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-blue-300"
                    aria-label="Download match demo"
                >
                    Download demo
                </a>
            )}
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
