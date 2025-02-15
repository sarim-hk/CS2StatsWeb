import { useEffect, useState } from "react";
import axios from "axios";
import MatchInterface from "../../interfaces/MatchInterface";

const API_URL = import.meta.env.VITE_API_URL;

interface MatchesPanelProps {
    PlayerID?: string;
    fullscreen?: boolean;
    searchEnabled?: boolean;
    panelSize?: number;
    filteredMatchIds?: number[]; // New prop to filter matches
}

function MatchesPanel({
    PlayerID,
    fullscreen = false,
    searchEnabled = false,
    panelSize,
    filteredMatchIds
}: MatchesPanelProps) {
    const [matches, setMatches] = useState<MatchInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const url = PlayerID
            ? `${API_URL}/matches_panel_by_player_id?player_id=${PlayerID}`
            : `${API_URL}/matches_panel`;

        axios
            .get<MatchInterface[]>(url)
            .then((response) => setMatches(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);

    const filteredMatches = matches.filter(match => {
        const matchIdMatch = filteredMatchIds ? filteredMatchIds.includes(Number(match.MatchID)) : true;
        const searchMatch = match.MapID.toLowerCase().includes(searchTerm.toLowerCase());
        return matchIdMatch && searchMatch;
    });

    return (
        <div 
            className={`bg-gray-800 ${panelSize ? '' : 'h-full'} scrollbar-hide`}
            style={{
                height: panelSize ? `${panelSize}px` : 'auto',
                overflowY: "auto",
            }}
        >
            {searchEnabled && (
                <div className="p-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search by Map Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`flex-1 px-2 py-1 bg-gray-700/50 text-white text-sm font-medium
                            focus:outline-none transition-all duration-200 hover:bg-gray-700
                            ${searchTerm.trim() ? "ring-1 ring-green-500/50 bg-green-500/20 text-green-400" : ""}`}
                        />
                    </div>
                </div>
            )}

            {filteredMatches.length > 0 ? (
                filteredMatches.map((match, index) => (
                    <div key={index} className="border-b border-gray-700 last:border-b-0">
                        <div className="p-3 hover:bg-gray-700/50 transition-colors duration-200">
                            <div className="grid grid-cols-4 gap-4">
                                <a href={`/match/${match.MatchID}`} className={`flex items-center ${fullscreen ? 'col-span-2' : 'col-span-1'}`}>
                                    <div className="text-base font-medium text-gray-300 w-full">{match.MatchDate}</div>
                                </a>

                                <a href={`/match/${match.MatchID}`} className={`${fullscreen ? 'col-span-2' : 'col-span-3'}`}>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2 font-medium">
                                            {match.WinningSide === 2 ? (
                                                <>
                                                    <a href={`/team/${match.WinningTeamID}`} 
                                                       className="text-orange-500 hover:text-orange-400 transition-colors">
                                                        {match.WinningTeamName} <span className="font-semibold">{match.WinningTeamScore}</span>
                                                    </a>
                                                    <a href={`/team/${match.LosingTeamID}`} 
                                                       className="text-blue-500 hover:text-blue-400 transition-colors">
                                                        <span className="font-semibold">{match.LosingTeamScore}</span> {match.LosingTeamName}
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    <a href={`/team/${match.WinningTeamID}`} 
                                                       className="text-blue-500 hover:text-blue-400 transition-colors">
                                                        {match.WinningTeamName} <span className="font-semibold">{match.WinningTeamScore}</span>
                                                    </a>
                                                    <a href={`/team/${match.LosingTeamID}`} 
                                                       className="text-orange-500 hover:text-orange-400 transition-colors">
                                                        <span className="font-semibold">{match.LosingTeamScore}</span> {match.LosingTeamName}
                                                    </a>
                                                </>
                                            )}
                                        </div>

                                        <div className="text-[12px] font-medium text-gray-300">{match.MapID}</div>
                                        
                                        <div className="text-[10px] font-medium text-gray-300">
                                            {match.WinningDeltaELO > 0 ? '+' : ''}{match.WinningDeltaELO} / {match.LosingDeltaELO}
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-3 text-gray-300 text-sm font-medium">No matches found.</div>
            )}
        </div>
    );
}

export default MatchesPanel;
