import FullMatchInterface from '../../interfaces/FullMatchInterface';

interface ClutchPanelProps {
    Match: FullMatchInterface | undefined;
}

function ClutchPanel({ Match }: ClutchPanelProps) {

    const sideToTeamID: { [side: number]: string } = {};
    if (Match) {
        for (const [teamID, team] of Object.entries(Match.Teams)) {
            sideToTeamID[team.Side] = teamID;
        }
    }
    
    else {
        return null;
    }

    return (
        <div className="bg-gray-800 p-1 pt-0">
            <div className="bg-gray-600 flex justify-center flex-col">
                {
                    Object.entries(Match.Teams).map(([_, team]) =>
                        Object.values(team.Players).map(player => (

                            <div key={player.PlayerID} className="bg-gray-600 p-1 ">

                                <div className="bg-gray-700 flex flex-row items-start w-full p-4">
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center">
                                        <img src={player.AvatarL} className="w-16 h-16 mb-2" />
                                        <div className="text-xs text-center">{player.Username}</div>
                                    </div>

                                    <div className="flex flex-grow justify-between ml-4">
                                        <div className="flex flex-col w-1/2 pr-2">
                                            {Match.Clutches.filter(clutch => clutch.PlayerID === player.PlayerID && clutch.Result === 'Win').map(clutch => (
                                                <div
                                                    key={`win-clutch-${clutch.ClutchID}`}
                                                    className="py-1 px-2 text-xs mt-0.5 mb-0.5 bg-green-600 bg-opacity-75"
                                                >
                                                    Round {clutch.RoundID - Match.Rounds[0].RoundID + 1}: 1v{clutch.EnemyCount}
                                                </div>
                                            ))}

                                            {Match.Duels.filter(duel => duel.WinnerID === player.PlayerID).map(duel => (
                                                <div
                                                    key={`duel-${duel.DuelID}`}
                                                    className="py-1 px-2 text-xs mt-0.5 mb-0.5 bg-green-600 bg-opacity-75"
                                                >
                                                    Round {duel.RoundID - Match.Rounds[0].RoundID + 1}: 1v1
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col w-1/2 pl-2">
                                            {Match.Clutches.filter(clutch => clutch.PlayerID === player.PlayerID && clutch.Result === 'Loss').map(clutch => (
                                                <div
                                                    key={`loss-clutch-${clutch.ClutchID}`}
                                                    className="py-1 px-2 text-xs mt-0.5 mb-0.5 bg-red-600 bg-opacity-25"
                                                >
                                                    Round {clutch.RoundID - Match.Rounds[0].RoundID + 1}: 1v{clutch.EnemyCount}
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                    )}
            </div>
        </div>
    );


}

export default ClutchPanel;
