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
        <div className="p-8 bg-gray-700">
            {matches.map((match: any, index) => (
                <div key={index} className="bg-gray-400 p-4 mb-4 shadow flex items-start text-white font-display">

                    <div className="flex-1 pl-1 pr-1">{match.MatchDate}</div>
                    
                    <div className="items-center">
                        <div className="flex">
                            <div className="pl-1 pr-1 flex font-semibold text-blue-700">Counter-Terrorists {match.TeamCTScore}</div>
                            <div className="pl-1 pr-1 font-semibold text-orange-500">{match.TeamTScore} Terrorists</div>
                        </div>
                        <div className="text-xs text-center">{match.Map}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MatchesPanel;