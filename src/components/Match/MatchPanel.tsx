import FullMatchInterface from '../../interfaces/FullMatchInterface';

interface MatchPanelProps {
    Match: FullMatchInterface | undefined;
}

function MatchPanel({ Match }: MatchPanelProps) {
    const resultOrder = { "Win": -1, "Loss": 1, "Tie": 0 };

    const sortedTeams = Match ? Object.entries(Match.Teams)
        .sort((a, b) => {
            const resultComparison = (resultOrder[a[1].Result as keyof typeof resultOrder] || 0) -
                (resultOrder[b[1].Result as keyof typeof resultOrder] || 0);

            return resultComparison !== 0
                ? resultComparison
                : a[1].TeamName.localeCompare(b[1].TeamName);
        }) : [];

    const [winningTeamId, losingTeamId] = sortedTeams.map(team => team[0]);

    return (
        <div className="rounded-sm overflow-hidden shadow-lg bg-gray-800 border border-gray-700">
            
            {/* Match Header */}
            <div className="p-3 bg-gray-700 border-b border-gray-600">
                <div className="flex items-center">
                    <div className="text-base font-semibold text-gray-300">{Match?.MapID}</div>
                    <div className="flex-1 flex justify-center">
                        <div className="flex flex-wrap gap-1">
                            {Match?.Rounds.map((round) => (
                                <div
                                    key={round.RoundID}
                                    className={`h-6 w-6 flex items-center justify-center rounded-full 
                                        ${round.WinnerSide === 3 
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                                        } text-[10px] font-medium`}
                                >
                                    {(round.RoundID - Match?.Rounds[0].RoundID) + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 justify-center">

                        <div className={`text-base font-semibold ${
                            Match?.Teams[winningTeamId].Side === 3 ? 'text-blue-400' : 'text-orange-400'
                        }`}>
                            {Match?.Teams[winningTeamId].TeamName}
                        </div>

                        <div className="flex items-center space-x-2 px-2 py-0.5 bg-gray-800 rounded-sm">
                            <span className={`text-base font-semibold ${
                                Match?.Teams[winningTeamId].Side === 3 ? 'text-blue-400' : 'text-orange-400'
                            }`}>{Match?.Teams[winningTeamId].Score}</span>
                            <span className="text-gray-400">:</span>
                            <span className={`text-base font-semibold ${
                                Match?.Teams[losingTeamId].Side === 3 ? 'text-blue-400' : 'text-orange-400'
                            }`}>{Match?.Teams[losingTeamId].Score}</span>
                        </div>
                        
                        <div className={`text-base font-semibold ${
                            Match?.Teams[losingTeamId].Side === 3 ? 'text-blue-400' : 'text-orange-400'
                        }`}>
                            {Match?.Teams[losingTeamId].TeamName}
                        </div>

                    </div>
                </div>
            </div>

            {/* Team Tables */}
            {[winningTeamId, losingTeamId].map((teamId) => (
                <div key={teamId} className="p-2">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${Match?.Teams[teamId].Side === 2 ? 'border-orange-500/50' : 'border-blue-500/50'}`}>
                                    <th className="py-2 px-3 text-left font-medium text-gray-300 w-48">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${Match?.Teams[teamId].Side === 2 ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                                            <span>
                                                <span className="text-xs truncate">{Match?.Teams[teamId].TeamName}</span>
                                                <span className="text-[10px] truncate text-gray-400 pl-1">{(Match?.Teams[teamId].DeltaELO ?? 0) >= 0 ? '+' : ''}{Match?.Teams[teamId].DeltaELO ?? 0}</span>
                                            </span>
                                        </div>
                                    </th>
                                    {['K', 'A', 'D', 'K/D', 'ADR', '', 'UD', 'EF', 'Time/EF', '', 'KAST', 'Impact', 'Rating'].map((header, index) => (
                                        <th key={index} className="py-2 px-3 text-center text-[10px] font-medium text-gray-400 w-16">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Match?.Teams[teamId]?.Players && (
                                    Object.values(Match.Teams[teamId].Players)
                                        .sort((a, b) => b.Overall.Rating - a.Overall.Rating)
                                        .map((player, playerIndex) => (
                                            <tr key={playerIndex} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                                <td className="py-1.5 px-3">
                                                    <a href={`/player/${player.Overall.PlayerID}`} className="text-xs text-gray-200 hover:text-blue-400 transition-colors">
                                                        {player.Overall.Username}
                                                    </a>
                                                </td>
                                                <td className="py-1.5 px-3 text-center text-xs">{player.Overall.Kills}</td>
                                                <td className="py-1.5 px-3 text-center text-xs">{player.Overall.Assists}</td>
                                                <td className="py-1.5 px-3 text-center text-xs">{player.Overall.Deaths}</td>
                                                <td className="py-1.5 px-3 text-center text-xs">{(player.Overall.Kills / player.Overall.Deaths).toFixed(2)}</td>
                                                <td className="py-1.5 px-3 text-center text-xs">{(player.Overall.Damage / Match?.Rounds.length).toFixed(2)}</td>
                                                <td className="py-1.5 px-3"></td>
                                                <td className="py-1.5 px-3 text-center text-xs">{player.Overall.UtilityDamage}</td>
                                                <td className="py-1.5 px-3 text-center text-xs">{player.Overall.Blinds.Count}</td>
                                                <td className="py-1.5 px-3 text-center text-xs">{(player.Overall.Blinds.Count > 0 ? (player.Overall.Blinds.TotalDuration / player.Overall.Blinds.Count).toFixed(2) : 0)}s</td>
                                                <td className="py-1.5 px-3"></td>
                                                <td className="py-1.5 px-3 text-center text-xs">{player.Overall.KAST.toFixed(2)}%</td>
                                                <td className="py-1.5 px-3 text-center text-xs">{player.Overall.Impact.toFixed(2)}</td>
                                                <td className="py-1.5 px-3 text-center text-xs font-medium">{player.Overall.Rating.toFixed(2)}</td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MatchPanel;