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

        const backtrack = (
            index: number,
            team1: string[],
            team2: string[],
            team1Sum: number,
            team2Sum: number
        ) => {
            
            if (team1.length === teamSize && team2.length === teamSize) {
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
        <div className="bg-gray-800">
            <div className="p-2 border-b border-gray-700">
                <div className="flex items-center justify-center">
                    <button
                        onClick={handleBalance}
                        disabled={isLoading || selectedPlayers.length === 0 || selectedPlayers.length % 2 !== 0}
                        className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 flex-shrink-0
                            ${isLoading || selectedPlayers.length === 0 || selectedPlayers.length % 2 !== 0
                                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                                : 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50 hover:bg-green-500/30'
                            }`}
                    >
                        {isLoading ? 'Balancing...' : `Balance Teams`}
                    </button>
                </div>
            </div>

            {balancedTeams && (
                <div className="grid grid-cols-2 divide-x divide-gray-700">

                    {/* Team 1 */}
                    <div className="divide-y divide-gray-700/50">
                        {balancedTeams.team1
                            .sort((a, b) => (playerStats[b]?.Overall.Rating || 0) - (playerStats[a]?.Overall.Rating || 0))
                            .map((playerID) => {
                                const player = lastBalancedPlayers.find(p => p.PlayerID === playerID);
                                const rating = playerStats[playerID]?.Overall.Rating;
                                const matchesPlayed = playerStats[playerID]?.MatchesPlayed;

                                return (
                                    <div key={playerID} className="hover:bg-gray-700/50 transition-colors duration-200">
                                        <div className="p-2">
                                            <div className="flex items-center gap-3">
                                                <a href={`/player/${player?.PlayerID}`} className="flex items-center gap-3 flex-1">
                                                    <div className="relative">
                                                        <img
                                                            className="h-12 w-12 object-cover border-2 border-gray-700 hover:border-gray-600 transition-colors"
                                                            src={player?.AvatarM}
                                                            alt={player?.Username}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="font-medium text-sm text-gray-300 truncate">
                                                            {player?.Username}
                                                        </div>
                                                        <div className="flex gap-2 text-xs font-medium text-gray-300 mt-0.5">
                                                            <span>Rating: {rating?.toFixed(2)}</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span>Matches: {matchesPlayed}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Team 2 */}
                    <div className="divide-y divide-gray-700/50">
                        {balancedTeams.team2
                            .sort((a, b) => (playerStats[b]?.Overall.Rating || 0) - (playerStats[a]?.Overall.Rating || 0))
                            .map((playerID) => {
                                const player = lastBalancedPlayers.find(p => p.PlayerID === playerID);
                                const rating = playerStats[playerID]?.Overall.Rating;
                                const matchesPlayed = playerStats[playerID]?.MatchesPlayed || 0;

                                return (
                                    <div key={playerID} className="hover:bg-gray-700/50 transition-colors duration-200">
                                        <div className="p-2">
                                            <div className="flex items-center gap-3">
                                                <a href={`/player/${player?.PlayerID}`} className="flex items-center gap-3 flex-1">
                                                    <div className="relative">
                                                        <img
                                                            className="h-12 w-12 object-cover border-2 border-gray-700 hover:border-gray-600 transition-colors"
                                                            src={player?.AvatarM}
                                                            alt={player?.Username}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="font-medium text-sm text-gray-300 truncate">
                                                            {player?.Username}
                                                        </div>
                                                        <div className="flex gap-2 text-xs font-medium text-gray-300 mt-0.5">
                                                            <span>Rating: {rating?.toFixed(2)}</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span>Matches: {matchesPlayed}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
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