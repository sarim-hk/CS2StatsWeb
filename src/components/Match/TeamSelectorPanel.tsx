import FullMatchInterface from "../../interfaces/FullMatchInterface";

interface TeamSelectorPanelProps {
    Match: FullMatchInterface;
    selectedTeamId: string;
    onTeamSelect: (teamId: string) => void;
    activePanel: "clutch" | "headtohead";
    onPanelChange: (panel: "clutch" | "headtohead") => void;
}

function TeamSelectorPanel({
    Match,
    selectedTeamId,
    onTeamSelect,
    activePanel,
    onPanelChange
}: TeamSelectorPanelProps) {
    return (
        <div className="bg-gray-700 flex flex-col items-center p-1">
            <div className="flex justify-center gap-2 p-1">
                <button
                    key="clutchButton"
                    onClick={() => onPanelChange("clutch")}
                    className={`w-40 py-1 text-xs text-white bg-gray-600 text-center
                        ${activePanel === "clutch"
                            ? "border border-green-500 ring-1 ring-green-500"
                            : "border border-transparent"}`}
                >
                    Clutches
                </button>

                <button
                    key="headtoheadButton"
                    onClick={() => onPanelChange("headtohead")}
                    className={`w-40 py-1 text-xs text-white bg-gray-600 text-center
                        ${activePanel === "headtohead"
                            ? "border border-green-500 ring-1 ring-green-500"
                            : "border border-transparent"}`}
                >
                    Head-to-Head
                </button>
            </div>

            <div className="flex justify-center gap-2 p-1">
                {Object.entries(Match.Teams).map(([teamId, team]) => (
                    <button
                        key={teamId}
                        onClick={() => onTeamSelect(teamId)}
                        className={`w-40 py-1 text-xs text-white bg-gray-600 text-center
                            ${selectedTeamId === teamId
                                ? team.Side === 2
                                    ? "border border-orange-500 ring-1 ring-orange-500"
                                    : "border border-blue-500 ring-1 ring-blue-500"
                                : "border border-transparent"}`}
                    >
                        {team.TeamName}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TeamSelectorPanel;
