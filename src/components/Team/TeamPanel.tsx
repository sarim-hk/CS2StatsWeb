import { useEffect, useState } from 'react';
import axios from 'axios';
import TeamInfoInterface from '../../interfaces/TeamInfoInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface TeamPanelProps {
    TeamID: string;
}

function TeamPanel({ TeamID }: TeamPanelProps) {
    const [Team, setTeam] = useState<TeamInfoInterface>();

    useEffect(() => {
        axios
            .get<TeamInfoInterface>(`${API_URL}/team_panel?team_id=${TeamID}`)
            .then((response) => {
                setTeam(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    }, [TeamID]);

    return (
        <div className="bg-gray-800">
            <div className="p-4">
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
        </div>
    );
}

export default TeamPanel;