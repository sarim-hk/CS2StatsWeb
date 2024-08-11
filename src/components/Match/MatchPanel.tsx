import { useEffect, useState } from 'react';
import axios from 'axios';
import FullMatchInterface from '../../interfaces/FullMatchInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface MatchPanelProps {
    MatchID: number;
}

function MatchPanel({ MatchID }: MatchPanelProps) {
    const [match, setMatch] = useState<FullMatchInterface>();
    console.log(match)

    useEffect(() => {
        axios
            .get<FullMatchInterface>(`${API_URL}/get_match_by_match_id?match_id=${MatchID}`)
            .then((response) => setMatch((response.data)))
            .catch((error) => console.error("Error fetching data:", error));
    }, [MatchID]);
    
    return (
        <div className="bg-gray-800">
            <div className="p-1">
                <div className="flex p-4 bg-gray-600">
                    <div className="text-s flex-1">{match?.Map}</div>
                    <div className="text-s flex-3">
                        Counter-Terrorists {match?.TeamCTScore} | {match?.TeamTScore} Terrorists
                    </div>
                </div>
            </div>

            {/* Counter-Terrorists Table */}
            <div className="p-1">
                <table className="min-w-full bg-gray-600 text-xs h-auto">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-blue-500 w-36 text-left">Counter-Terrorists</th>
                            <th className="py-2 px-4 border-b border-blue-500 w-24">KDA</th>
                            <th className="py-2 px-4 border-b border-blue-500 w-24">Headshots</th>
                            <th className="py-2 px-4 border-b border-blue-500 w-24">ADR</th>
                            <th className="py-2 px-4 border-b border-blue-500 w-24">UD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {match?.TeamCT.Players
                            .sort((a, b) => b.Kills - a.Kills) // Sort players by Kills in descending order
                            .map((player, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 text-left">
                                        <a href={`/player/${player.PlayerID}`}>{player.Username}</a>
                                    </td>
                                    <td className="py-2 px-4">{player.Kills}-{player.Deaths}-{player.Assists}</td>
                                    <td className="py-2 px-4">
                                        {player?.Kills && player?.Headshots ? (player.Headshots / player.Kills * 100).toFixed(2) : 0}%
                                    </td>
                                    <td className="py-2 px-4">
                                        {player?.TotalDamage && player?.RoundsPlayed ? (player.TotalDamage / player.RoundsPlayed).toFixed(2) : 0}
                                    </td>
                                    <td className="py-2 px-4">{player.UtilityDamage}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Terrorists Table */}
            <div className="p-1">
                <table className="min-w-full bg-gray-600 text-xs h-auto">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-orange-500 w-36 text-left">Terrorists</th>
                            <th className="py-2 px-4 border-b border-orange-500 w-24">KDA</th>
                            <th className="py-2 px-4 border-b border-orange-500 w-24">Headshots</th>
                            <th className="py-2 px-4 border-b border-orange-500 w-24">ADR</th>
                            <th className="py-2 px-4 border-b border-orange-500 w-24">UD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {match?.TeamT.Players
                            .sort((a, b) => b.Kills - a.Kills) // Sort players by Kills in descending order
                            .map((player, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 text-left">
                                        <a href={`/player/${player.PlayerID}`}>{player.Username}</a>
                                    </td>
                                    <td className="py-2 px-4">{player.Kills}-{player.Deaths}-{player.Assists}</td>
                                    <td className="py-2 px-4">
                                        {player?.Kills && player?.Headshots ? (player.Headshots / player.Kills * 100).toFixed(2) : 0}%
                                    </td>
                                    <td className="py-2 px-4">
                                        {player?.TotalDamage && player?.RoundsPlayed ? (player.TotalDamage / player.RoundsPlayed).toFixed(2) : 0}
                                    </td>
                                    <td className="py-2 px-4">{player.UtilityDamage}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );


}

export default MatchPanel;