import { useEffect, useState } from 'react';
import axios from 'axios';
import FullMatchInterface from '../interfaces/FullMatchInterface';

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
        <div>
            <div className="p-1 bg-gray-800 font-display">
                <div className="flex p-4 bg-gray-600 items-center">
                    <div className="">
                        <div className="text-xs">{match?.Map}</div>
                    </div>
                </div>
            </div>

            <div className="p-1 bg-gray-800 font-display">
                <table className="min-w-full bg-gray-600">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-300">Player ID</th>
                            <th className="py-2 px-4 border-b border-gray-300">Kills</th>
                            <th className="py-2 px-4 border-b border-gray-300">Deaths</th>
                            <th className="py-2 px-4 border-b border-gray-300">Assists</th>
                            <th className="py-2 px-4 border-b border-gray-300">Headshots</th>
                            <th className="py-2 px-4 border-b border-gray-300">Total Damage</th>
                            <th className="py-2 px-4 border-b border-gray-300">Utility Damage</th>
                            <th className="py-2 px-4 border-b border-gray-300">Rounds Played</th>
                        </tr>
                    </thead>
                    <tbody>
                        {match?.TeamCT.Players.map((player, index) => (
                            <tr key={index} className="text-center">
                                <td className="py-2 px-4 border-b border-gray-300">{player.PlayerID}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{player.Kills}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{player.Deaths}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{player.Assists}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{player.Headshots}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{player.TotalDamage}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{player.UtilityDamage}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{player.RoundsPlayed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default MatchPanel;