import { useState } from 'react';
import axios from 'axios';
import PlayerInfoInterface from '../../interfaces/PlayerInfoInterface';
import CompletePlayerStatsInterface from '../../interfaces/PlayerStatsInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface BalancerContentProps {
    selectedPlayers: PlayerInfoInterface[];
    filter: string;
}

interface BalancedTeam {
    team1: string[];
    team2: string[];
}

function BalancerPanel({ selectedPlayers, filter }: BalancerContentProps) {
    const [playerStats, setPlayerStats] = useState<CompletePlayerStatsInterface>({});
    const [balancedTeams, setBalancedTeams] = useState<BalancedTeam | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastBalancedPlayers, setLastBalancedPlayers] = useState<PlayerInfoInterface[]>([]);

    const handleBalance = async () => {
        if (selectedPlayers.length === 0) {
            return;
        }

        setIsLoading(true);
        setPlayerStats({});
        setBalancedTeams(null);

        try {
            const playerIDs = selectedPlayers.map(player => player.PlayerID).join(',');
            const url = `${API_URL}/playerstats_panel_by_player_id?player_id=${playerIDs}${filter ? `&${filter}` : ''}`;
            const response = await axios.get<CompletePlayerStatsInterface>(url);

            setPlayerStats(response.data);
            setLastBalancedPlayers(selectedPlayers);
            setBalancedTeams(balanceTeams(selectedPlayers.map(p => p.PlayerID), response.data));

        } catch (error) {
            console.error("Error fetching player stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const balanceTeams = (playerIDs: string[], stats: CompletePlayerStatsInterface): BalancedTeam => {
        if (playerIDs.length % 2 !== 0) {
            console.warn("Odd number of players cannot be perfectly balanced");
            return { team1: [], team2: [] };
        }

        // Convert ratings to exponential scale to better reflect skill differences
        const players = playerIDs.map(id => {
            const rating = stats[id].Overall.Rating || 0;
            return {
                id,
                rating,
                // Apply exponential scaling to ratings above 1.0
                // This makes higher ratings count more towards team strength
                scaledRating: rating <= 1.0
                    ? rating
                    : Math.pow(rating, 2.5) // You can adjust this exponent to tune the scaling
            }
        });

        const teamSize = playerIDs.length / 2;
        let bestDifference = Infinity;
        let bestTeams: BalancedTeam = { team1: [], team2: [] };

        // Helper function to calculate team strength
        const calculateTeamStrength = (team: string[]): number => {
            return team.reduce((sum, id) => {
                const player = players.find(p => p.id === id);
                return sum + (player?.scaledRating || 0);
            }, 0);
        };

        // Additional constraint: limit the number of high-rated players per team
        const isValidTeamComposition = (team: string[]): boolean => {
            const highRatedPlayers = team.filter(id => {
                const player = players.find(p => p.id === id);
                return (player?.rating || 0) > 1.2; // Adjust this threshold as needed
            }).length;

            return highRatedPlayers <= Math.ceil(teamSize / 3); // Maximum 1/3 of team can be high-rated
        };

        const backtrack = (
            index: number,
            team1: string[],
            team2: string[],
            team1Sum: number,
            team2Sum: number
        ) => {
            if (team1.length === teamSize && team2.length === teamSize) {
                // Check if this distribution is valid
                if (!isValidTeamComposition(team1) || !isValidTeamComposition(team2)) {
                    return;
                }

                const difference = Math.abs(team1Sum - team2Sum);
                if (difference < bestDifference) {
                    bestDifference = difference;
                    bestTeams = { team1: [...team1], team2: [...team2] };
                }
                return;
            }

            if (index === players.length ||
                team1.length > teamSize ||
                team2.length > teamSize) {
                return;
            }

            const player = players[index];

            if (team1.length < teamSize) {
                team1.push(player.id);
                backtrack(
                    index + 1,
                    team1,
                    team2,
                    team1Sum + player.scaledRating,
                    team2Sum
                );
                team1.pop();
            }

            if (team2.length < teamSize) {
                team2.push(player.id);
                backtrack(
                    index + 1,
                    team1,
                    team2,
                    team1Sum,
                    team2Sum + player.scaledRating
                );
                team2.pop();
            }
        };

        backtrack(0, [], [], 0, 0);

        // Log the actual team strengths for verification
        if (bestTeams.team1.length > 0) {
            console.log('Team 1 Strength:', calculateTeamStrength(bestTeams.team1));
            console.log('Team 2 Strength:', calculateTeamStrength(bestTeams.team2));
        }

        return bestTeams;
    };

    return (
        <div className="p-1 bg-gray-800">
            <div className="p-4 bg-gray-700 flex justify-center items-center">
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

            {balancedTeams && (
                <div className="flex gap-1 mt-1">
                    <div className="flex-1 bg-gray-700 divide-y divide-white">
                        {balancedTeams.team1
                            .sort((a, b) => (playerStats[b].Overall.Rating || 0) - (playerStats[a].Overall.Rating || 0))
                            .map((playerID) => {
                                const player = lastBalancedPlayers.find(p => p.PlayerID === playerID);

                                return (
                                    <div key={playerID} className="flex items-center justify-between pl-1 bg-gray-600">
                                        <a href={`/player/${player?.PlayerID}`} className="flex items-center pt-1 pb-1 w-full">
                                            <img
                                                className="object-contain h-12 w-12 mr-2 border-gray-800 border-solid border-2"
                                                src={player?.AvatarM}
                                                alt={player?.Username}
                                            />
                                            <div>
                                                <div>{player?.Username}</div>
                                                <div className="text-xs text-left">Rating: {playerStats[playerID]?.Overall.Rating}</div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className="flex-1 bg-gray-700 divide-y divide-white">
                        {balancedTeams.team2
                            .sort((a, b) => (playerStats[b]?.Overall.Rating || 0) - (playerStats[a]?.Overall.Rating || 0))
                            .map((playerID) => {
                                const player = lastBalancedPlayers.find(p => p.PlayerID === playerID);

                                return (
                                    <div key={playerID} className="flex items-center justify-between pl-1 bg-gray-600">
                                        <a href={`/player/${player?.PlayerID}`} className="flex items-center pt-1 pb-1 w-full">
                                            <img
                                                className="object-contain h-12 w-12 mr-2 border-gray-800 border-solid border-2"
                                                src={player?.AvatarM}
                                                alt={player?.Username}
                                            />
                                            <div>
                                                <div>{player?.Username}</div>
                                                <div className="text-xs text-left">Rating: {playerStats?.[playerID].Overall.Rating}</div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BalancerPanel;