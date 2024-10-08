import { useEffect, useState } from "react";
import axios from "axios";
import MatchInterface from "../../interfaces/MatchInterface";

const API_URL = import.meta.env.VITE_API_URL;

interface MatchesPanelProps {
    PlayerID?: string;
    fullscreen?: boolean;
    searchEnabled?: boolean;
}
function MatchesPanel({ PlayerID, fullscreen = false, searchEnabled = false }: MatchesPanelProps) { // Default searchEnabled is false
    const [matches, setMatches] = useState<MatchInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const url = PlayerID
            ? `${API_URL}/get_matches_by_player_id?player_id=${PlayerID}`
            : `${API_URL}/get_matches`;

        axios
            .get<MatchInterface[]>(url)
            .then((response) => setMatches(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);

    const filteredMatches = matches.filter(match =>
        match.Map.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-1 bg-gray-800 divide-y divide-white">

            {searchEnabled && (
                <div className="p-4 bg-gray-700">
                    <input
                        type="text"
                        placeholder="Search by Map Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded bg-gray-600 text-white"
                    />
                </div>
            )}

            {filteredMatches.length > 0 ? (
                filteredMatches.map((match, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-600 ">
                        <div className="grid grid-cols-4 flex-1">
                            <a href={`/match/${match.MatchID}`} className={`flex justify-start ${fullscreen ? 'col-span-2' : 'col-span-1'}`}>
                                <div className="flex items-center justify-center">{match.MatchDate}</div>
                            </a>
                            <a href={`/match/${match.MatchID}`} className={`flex justify-end ${fullscreen ? 'col-span-2' : 'col-span-3'}`}>
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
                ))
            ) : (
                <div className="p-2 text-white">No matches found for the given map name.</div>
            )}
        </div>
    );
}

export default MatchesPanel;
