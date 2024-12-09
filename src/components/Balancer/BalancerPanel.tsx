import { useState } from 'react';
import axios from 'axios';

import CompletePlayerStatsInterface from '../../interfaces/PlayerStatsInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface BalancerContentProps {
    selectedPlayers: string[];
    filter: string;
}

interface BalancedTeam {
    team1: string[];
    team2: string[];
}

function BalancerPanel({ selectedPlayers, filter }: BalancerContentProps) {
    const [playerStats, setPlayerStats] = useState<{ [playerID: string]: CompletePlayerStatsInterface }>({});
    const [balancedTeams, setBalancedTeams] = useState<BalancedTeam | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleBalance = async () => {
        if (selectedPlayers.length === 0) {
            return;
        }

        setIsLoading(true);
        setPlayerStats({});
        setBalancedTeams(null);

        try {
            const allPlayerStats: { [playerID: string]: CompletePlayerStatsInterface } = {};

            for (const playerID of selectedPlayers) {
                const url = `${API_URL}/playerstats_panel_by_player_id?player_id=${playerID}${filter ? `&${filter}` : ''}`;
                const response = await axios.get<CompletePlayerStatsInterface>(url);
                allPlayerStats[playerID] = response.data;
            }

            setPlayerStats(allPlayerStats);
            setBalancedTeams(balanceTeams(selectedPlayers, allPlayerStats));

        } catch (error) {
            console.error("Error fetching player stats:", error);

        } finally {
            setIsLoading(false);
        }
    };

    const balanceTeams = (playerIDs: string[], stats: { [playerID: string]: CompletePlayerStatsInterface }): BalancedTeam => {
        const players = playerIDs.map(id => ({
            id,
            rating: stats[id].Overall.Rating || 0,
        }));

        let bestDifference = Infinity;
        let bestTeams: BalancedTeam = { team1: [], team2: [] };

        const backtrack = (index: number, team1: string[], team2: string[], team1Sum: number, team2Sum: number) => {
            if (index === players.length) {
                const difference = Math.abs(team1Sum - team2Sum);
                if (difference < bestDifference) {
                    bestDifference = difference;
                    bestTeams = { team1: [...team1], team2: [...team2] };
                }
                return;
            }

            const player = players[index];

            team1.push(player.id);
            backtrack(index + 1, team1, team2, team1Sum + player.rating, team2Sum);
            team1.pop();

            team2.push(player.id);
            backtrack(index + 1, team1, team2, team1Sum, team2Sum + player.rating);
            team2.pop();
        };

        backtrack(0, [], [], 0, 0);

        console.log(`Best Difference: ${bestDifference}`);
        return bestTeams;
    };

    return (
        <div className="flex-1 bg-gray-800 p-1">
            <div className="flex-1 bg-gray-700 p-2">

                <div className="flex justify-center items-center">
                    <button
                        onClick={handleBalance}
                        disabled={isLoading || selectedPlayers.length === 0}
                        className={`px-4 py-2 ${isLoading || selectedPlayers.length === 0
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}>
                        {isLoading ? 'Balancing...' : 'Balance'}
                    </button>
                </div>

                <div>
                    {balancedTeams && (
                        <div className="mt-4">

                            <div className="flex gap-4">
                                <div className="flex-1 bg-gray-700 p-2">
                                    {balancedTeams.team1.map((playerID) => (
                                        <div key={playerID} className="text-white">
                                            {playerID} (Rating: {playerStats[playerID]?.Overall.Rating})
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 bg-gray-700 p-2 pb-0">
                                    {balancedTeams.team2.map((playerID) => (
                                        <div key={playerID} className="text-white">
                                            {playerID} (Rating: {playerStats[playerID]?.Overall.Rating})
                                        </div>
                                    ))}
                                </div>
                                
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default BalancerPanel;