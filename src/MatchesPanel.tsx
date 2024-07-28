import { useEffect, useState } from "react";
import axios from "axios";

interface Match {
    Map: string;
    MatchDate: string;
    MatchID: number;
    TeamCTID: number;
    TeamCTScore: number;
    TeamTID: number;
    TeamTScore: number;
}

function MatchesPanel() {

    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        axios
            .get<Match[]>("http://127.0.0.1:5000/api/get_matches_or_match?API_KEY=3D2VKCUX8FXQB7G5")
            .then((response) => setMatches(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="p-1 bg-gray-800 font-display divide-y divide-white">
            {matches.map((match: any, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-600 ">

                    <div className="grid grid-cols-4 flex-1">
                        <a href="{yourLink1}" className="flex justify-start col-span-1">
                            <div className="flex items-center justify-center">
                                {match.MatchDate}
                            </div>
                        </a>

                        <a href="{yourLink1}" className="flex justify-end  col-span-3">
                            <div>
                                <div className="flex items-center justify-center">
                                    <div className="pr-1 flex font-semibold text-blue-700">Counter-Terrorists {match.TeamCTScore}</div>
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