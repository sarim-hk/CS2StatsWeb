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
        <div className="bg-gray-800">
            <div className="p-1">
                <div className="flex p-4 bg-gray-600">
                    <div className="text-s flex-1">{Match?.MapID}</div>
                    <div className="text-s flex-3">
                        {Match?.Teams[winningTeamId].TeamName} {Match?.Teams[winningTeamId].Score} | {Match?.Teams[losingTeamId].Score} {Match?.Teams[losingTeamId].TeamName}
                    </div>
                </div>
            </div>

            <div className="p-1 pt-0">
                <div className="flex flex-wrap gap-1 justify-center bg-gray-600 p-1">
                    {Match?.Rounds.map((round) => (
                        <div
                            key={round.RoundID}
                            className={`py-1 px-2 rounded text-xs font-semibold ${round.WinnerSide === 3 ? 'text-blue-500' : 'text-orange-500'
                                }`}
                        >
                            {(round.RoundID - Match?.Rounds[0].RoundID) + 1}
                        </div>
                    ))}
                </div>
            </div>

            {[winningTeamId, losingTeamId].map((teamId, index) => (
                <div key={teamId} className="p-1 pt-0">
                    <table className="min-w-full bg-gray-600 text-xs h-auto">
                        <thead>
                            <tr>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-96 text-left`}>
                                    {Match?.Teams[teamId].TeamName}
                                </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> Kills </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> Assists </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> Deaths </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> K/D </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> ADR </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-12`}> </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> UD </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> EF </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> Time/EF </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-12`}> </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> KAST </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> Impact </th>
                                <th className={`py-2 px-4 border-b ${index === 0 ? 'border-blue-500' : 'border-orange-500'} w-8`}> CS2S Rating </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Match?.Teams[teamId]?.Players && (
                                Object.values(Match.Teams[teamId].Players)
                                    .sort((a, b) => b.Rating - a.Rating)
                                    .map((player, playerIndex) => (
                                        <tr key={playerIndex} className="text-center">
                                            <td className="py-2 px-4 text-left"> <a href={`/player/${player.PlayerID}`}>{player.Username}</a> </td>
                                            <td className="py-2 px-4"> {player.Kills} </td>
                                            <td className="py-2 px-4"> {player.Assists} </td>
                                            <td className="py-2 px-4"> {player.Deaths} </td>
                                            <td className="py-2 px-4"> {(player.Kills / player.Deaths).toFixed(2)} </td>
                                            <td className="py-2 px-4"> {(player?.Damage / Match?.Rounds.length).toFixed(2)} </td>
                                            <td></td>
                                            <td className="py-2 px-4"> {player.UtilityDamage} </td>
                                            <td className="py-2 px-4"> {player.Blinds.Count} </td>
                                            <td className="py-2 px-4"> {(player.Blinds.Count > 0 ? (player.Blinds.TotalDuration / player.Blinds.Count).toFixed(2) : 0)}s </td>
                                            <td></td>
                                            <td className="py-2 px-4"> {player.KAST.toFixed(2)}% </td>
                                            <td className="py-2 px-4"> {player.Impact.toFixed(2)} </td>
                                            <td className="py-2 px-4"> {player.Rating.toFixed(2)} </td>
                                        </tr>
                                    )))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default MatchPanel;