import { useEffect, useState } from "react";
import axios from "axios";
import MatchInterface from '../interfaces/MatchInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface MatchesPanelProps {
    PlayerID?: string; // Optional prop
}

function MatchesPanel({ PlayerID }: MatchesPanelProps) {

    const [matches, setMatches] = useState<MatchInterface[]>([]);

    useEffect(() => {
        const url = PlayerID
            ? `${API_URL}/get_player_matches?player_id=${PlayerID}`
            : `${API_URL}/get_matches_or_match`;

        axios
            .get<MatchInterface[]>(url)
            .then((response) => setMatches(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);

    return (
        <div className="p-1 bg-gray-800 font-display divide-y divide-white">
            {matches.map((match, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-600 ">
                    <div className="grid grid-cols-4 flex-1">
                        <a href="{yourLink1}" className="flex justify-start col-span-1">
                            <div className="flex items-center justify-center">
                                {match.MatchDate}
                            </div>
                        </a>
                        <a href="{yourLink1}" className="flex justify-end col-span-3">
                            <div>
                                <div className="flex items-center justify-center">
                                    <div className="pr-1 flex font-semibold text-blue-500">Counter-Terrorists {match.TeamCTScore}</div>
                                    <div className="pl-1 font-semibold text-orange-500">{match.TeamTScore} Terrorists</div>
                                </div>
                                <div className="text-xs text-right">{match.Map}</div>
                            </div>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MatchesPanel;
