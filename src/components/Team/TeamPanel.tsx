import { useEffect, useState } from 'react';
import apiClient, { isRequestCanceled } from '../../apiClient';
import TeamInfoInterface from '../../interfaces/TeamInfoInterface';
import PlayersPanel from '../Player/PlayersPanel';

interface TeamPanelProps {
    TeamID: string;
}

function TeamPanel({ TeamID }: TeamPanelProps) {
    const [Team, setTeam] = useState<TeamInfoInterface>();

    useEffect(() => {
        const controller = new AbortController();

        apiClient
            .get<TeamInfoInterface>("/team_panel", {
                params: { team_id: TeamID },
                signal: controller.signal,
            })
            .then((response) => {
                setTeam(response.data);
            })
            .catch((error) => {
                if (!isRequestCanceled(error)) {
                    console.error("Error fetching team data:", error);
                }
            });

        return () => controller.abort();
    }, [TeamID]);

    return (
        <div className="bg-gray-800">
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
                <PlayersPanel TeamID={TeamID} switcherModeEnabled={false} />
            </div>
        
        </div>
    );
}

export default TeamPanel;
