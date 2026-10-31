import { useEffect, useState } from "react";
import apiClient, { isRequestCanceled } from "../../apiClient";
import LiveMatchInterface from "../../interfaces/LiveMatchInterface";

function LiveMatchPanel() {
    const [liveMatch, setLiveMatch] = useState<LiveMatchInterface>();

    useEffect(() => {
        const controller = new AbortController();
        fetchLiveMatch(setLiveMatch, controller.signal);
        const intervalId = setInterval(
            () => fetchLiveMatch(setLiveMatch, controller.signal),
            15000,
        );
        return () => {
            controller.abort();
            clearInterval(intervalId);
        };
    }, []);

    if (!liveMatch || Math.floor(Date.now() / 1000) - liveMatch.InsertDate > 120) {
        return null;
    }

    const tPlayers = liveMatch?.TPlayers;
    const ctPlayers = liveMatch?.CTPlayers;

    return (
        <div className="rounded-sm overflow-hidden shadow-lg bg-gray-800 border border-gray-700">

            {/* Match Header */}
            <div className="p-3 bg-gray-700 border-b border-gray-600">
                <div className="grid grid-cols-3 items-center">
                    
                    <div className="text-xs text-gray-300">
                        Bomb: {getBombStatusLabel(liveMatch?.BombStatus)}
                    </div>

                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2 px-4 py-1 bg-gray-800 rounded-sm">
                            <span className="text-lg font-semibold text-orange-400">
                                {liveMatch?.TScore ?? 0}
                            </span>
                            <span className="text-lg text-gray-400">:</span>
                            <span className="text-lg font-semibold text-blue-400">
                                {liveMatch?.CTScore ?? 0}
                            </span>
                        </div>
                    </div>

                    <div className="text-xs text-gray-300 text-right">
                        {liveMatch?.MapID}
                    </div>

                </div>
            </div>

            {/* Team Tables */}
            {[
                { players: tPlayers, side: 'T', name: 'Terrorists', colorClass: 'border-orange-500/50' },
                { players: ctPlayers, side: 'CT', name: 'Counter-Terrorists', colorClass: 'border-blue-500/50' }
            ].map((team) => (
                team.players && team.players.length > 0 && (
                    <div key={team.side} className="p-2">
                        <div className="overflow-x-auto">
                            <table className="w-full">

                                <thead>
                                    <tr className={`border-b ${team.colorClass}`}>
                                        <th className="py-2 px-3 text-left font-medium text-gray-300 w-48">
                                            <div className="flex items-center space-x-2">
                                                <span className={`w-1.5 h-1.5 rounded-sm ${team.side === 'T' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                                                <span className="text-xs">{team.name}</span>
                                            </div>
                                        </th>
                                        {['K', 'A', 'D', 'ADR', 'Health', 'Money'].map((header) => (
                                            <th key={header} className="py-2 px-3 text-center text-[10px] font-medium text-gray-400 w-16">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                
                                <tbody>

                                    {team.players.map((player) => (
                                        <tr key={player.PlayerID} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                                            
                                            <td className="py-1.5 px-3">
                                                <span className="text-xs text-gray-200">{player.Username}</span>
                                            </td>

                                            <td className="py-1.5 px-3 text-center text-xs">{player.Kills}</td>
                                            <td className="py-1.5 px-3 text-center text-xs">{player.Assists}</td>
                                            <td className="py-1.5 px-3 text-center text-xs">{player.Deaths}</td>
                                            <td className="py-1.5 px-3 text-center text-xs">{player.ADR.toFixed(2)}</td>

                                            <td className="py-1.5 px-3 text-center text-xs">
                                                {Math.max(0, Math.min(100, player.Health))}
                                            </td>

                                            <td className="py-1.5 px-3 text-center text-xs">{player.Money}$</td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                )
            ))}

        </div>
    );
}

function getBombStatusLabel(bombStatus?: number): string {
    switch (bombStatus) {
        case 1:
            return "Planted";
        case 2:
            return "Defused";
        case 0:
            return "Inactive";
        default:
            return "Inactive";
    }
}

function fetchLiveMatch(
    setLiveMatch: React.Dispatch<React.SetStateAction<LiveMatchInterface | undefined>>,
    signal: AbortSignal,
) {
    apiClient
        .get<LiveMatchInterface>("/live_match_panel", { signal })
        .then((response) => setLiveMatch(response.data))
        .catch((error) => {
            if (!isRequestCanceled(error)) {
                console.error("Error fetching live match data:", error);
                setLiveMatch(undefined);
            }
        });
}

export default LiveMatchPanel;
