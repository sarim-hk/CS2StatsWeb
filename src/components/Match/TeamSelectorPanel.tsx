import FullMatchInterface from '../../interfaces/FullMatchInterface';

interface TeamSelectorPanelProps {
    Match: FullMatchInterface;
    selectedTeamId: string;
    onTeamSelect: (teamId: string) => void;
}

function TeamSelectorPanel({ Match, selectedTeamId, onTeamSelect }: TeamSelectorPanelProps) {
    return (
        <div className="bg-gray-800">
            <div className="bg-gray-600 p-1">
                <div className="bg-gray-600 flex flex-col items-start justify-start w-full">
                    <div className="flex justify-center space-x-2">
                        
                        {Object.entries(Match.Teams).map(([teamId, team]) => (
                            <button
                                key={teamId}
                                onClick={() => onTeamSelect(teamId)}
                                className={`px-3 py-1 text-xs text-white bg-gray-600 
                                ${selectedTeamId === teamId
                                        ? team.Side === 2
                                            ? 'border border-orange-500 ring-1 ring-orange-500'
                                            : 'border border-blue-500 ring-1 ring-blue-500'
                                        : 'border border-transparent'}`}
                            >
                                {team.TeamName}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default TeamSelectorPanel;