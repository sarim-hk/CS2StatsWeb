import FullMatchInterface from '../../interfaces/FullMatchInterface';

interface MatchPanelProps {
    Match: FullMatchInterface | undefined;
}

function MatchPanel({ Match }: MatchPanelProps) {

    const sideToTeamID: { [side: number]: string } = {};
    if (Match) {
        for (const [teamID, team] of Object.entries(Match.Teams)) {
            sideToTeamID[team.Side] = teamID;
        }
    }

    return (
        <div className="bg-gray-800">
            
            <div className="p-1">
                <div className="flex p-4 bg-gray-600">
                    <div className="text-s flex-1">{Match?.MapID}</div>
                    <div className="text-s flex-3">
                        Counter-Terrorists {Match?.Teams[sideToTeamID[3]].Score} | {Match?.Teams[sideToTeamID[2]].Score} Terrorists
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


            {/* Player Stats for Counter-Terrorists */}
            <div className="p-1 pt-0">
                <table className="min-w-full bg-gray-600 text-xs h-auto">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-blue-500 w-96 text-left"> Counter-Terrorists </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> Kills </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> Assists </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> Deaths </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> K/D </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> ADR </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-12"> </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> UD </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> EF </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> Time/EF </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-12"> </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> KAST </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> Impact </th>
                            <th className="py-2 px-4 border-b border-blue-500 w-8"> CS2S Rating </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Match?.Teams[sideToTeamID[3]]?.Players && (
                            Object.values(Match.Teams[sideToTeamID[3]].Players)
                                .sort((a, b) => b.Rating - a.Rating)
                                .map((player, index) => (
                                    <tr key={index} className="text-center">
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

            {/* Player Stats for Terrorists */}
            <div className="p-1 pt-0">
                <table className="min-w-full bg-gray-600 text-xs h-auto">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-orange-500 w-96 text-left"> Terrorists </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> Kills </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> Assists </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> Deaths </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> K/D </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> ADR </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-12"> </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> UD </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> EF </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> Time/EF </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-12"> </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> KAST </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> Impact </th>
                            <th className="py-2 px-4 border-b border-orange-500 w-8"> CS2S Rating </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Match?.Teams[sideToTeamID[2]]?.Players && (
                            Object.values(Match.Teams[sideToTeamID[2]].Players)
                                .sort((a, b) => b.Rating - a.Rating)
                                .map((player, index) => (
                                    <tr key={index} className="text-center">
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
            
        </div>
    );
}

export default MatchPanel;
