import FullMatchInterface from '../../interfaces/FullMatchInterface';

interface ClutchPanelProps {
    Match: FullMatchInterface | undefined;
    TeamID: string;
}

function ClutchPanel({ Match, TeamID }: ClutchPanelProps) {
    if (!Match) {
        return null;
    }

    const team = Match.Teams[TeamID];

    if (!team) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-1">
            <div className="bg-gray-600 flex flex-col items-start justify-start w-full">

                {Object.values(team.Players).map(player => {
                    const combinedEvents = [
                        ...Match.Clutches.filter(clutch => clutch.PlayerID === player.PlayerID),
                        ...Match.Duels.filter(duel => duel.WinnerID === player.PlayerID),
                    ];

                    const sortedEvents = combinedEvents.sort((a, b) => a.RoundID - b.RoundID);

                    return (
                        <div key={player.PlayerID} className="bg-gray-600 p-1 w-full">
                            
                            <div className="bg-gray-700 flex items-start w-full p-4">
                                <div className="flex-shrink-0 flex flex-col items-center justify-center w-16">
                                    <img src={player.AvatarL} className="w-16 h-16 mb-2" />
                                    <div className="text-xs text-center">{player.Username}</div>
                                </div>

                                <div className="flex flex-col ml-4 w-full">
                                    <div className="flex flex-col w-full">

                                        {sortedEvents.map(event => {
                                            const isClutch = 'EnemyCount' in event;
                                            return (
                                                <div
                                                    key={isClutch ? `${event.PlayerID}-${event.RoundID}-Clutch` : `${event.WinnerID}-${event.RoundID}-Duel`}
                                                    className={`py-1 px-2 text-xs mt-0.5 mb-0.5 ${isClutch
                                                        ? event.Result === 'Win'
                                                            ? 'bg-green-600 bg-opacity-75'
                                                            : 'bg-red-600 bg-opacity-50'
                                                        : 'bg-green-600 bg-opacity-75'
                                                        }`}
                                                >
                                                    Round {event.RoundID - Match.Rounds[0].RoundID + 1}:
                                                    {isClutch ? ` 1v${event.EnemyCount}` : ' 1v1'}
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ClutchPanel;