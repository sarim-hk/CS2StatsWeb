import { useState } from 'react';
import apiClient, { ApiError } from '../../apiClient';
import useApiRequest from '../../useApiRequest';
import TeamInfoInterface from '../../interfaces/TeamInfoInterface';
import PlayersPanel from '../Player/PlayersPanel';
import { ui } from '../ui';

interface TeamPanelProps {
    TeamID: string;
    onNotFound?: () => void;
    onError?: () => void;
}

function TeamPanel({ TeamID, onNotFound, onError }: TeamPanelProps) {
    const [Team, setTeam] = useState<TeamInfoInterface>();

    useApiRequest<TeamInfoInterface>({
        request: (signal) => apiClient.get("/team_panel", {
            params: { team_id: TeamID },
            signal,
        }),
        onSuccess: setTeam,
        onError: (error: ApiError) => {
            if (error.status === 404) onNotFound?.();
            else onError?.();
        },
        dependencies: [TeamID],
    });

    return (
        <div className={ui.panelFlat}>
            <div className="p-4 pb-0">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                            <img
                                className="h-24 w-24 object-cover border-2 border-gray-700 hover:border-gray-600 transition-colors"
                                src={Team?.AvatarL}
                                alt={Team?.TeamName}
                            />
                        </div>

                        <div className="flex flex-col min-w-0">
                            <div className="font-medium text-xl text-gray-300 truncate">
                                {Team?.TeamName}
                            </div>

                            <div className="text-base font-medium text-gray-300 mt-1.5">
                                <span className="bg-gray-700/50 px-3 py-1">
                                    ELO: {Team?.ELO}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                <PlayersPanel TeamID={TeamID} switcherModeEnabled={false} onError={onError} />
            </div>
        
        </div>
    );
}

export default TeamPanel;
