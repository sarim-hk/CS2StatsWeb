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
        const matchIdMatch = !filteredMatchIds || filteredMatchIds.length === 0 || filteredMatchIds.includes(Number(match.MatchID));
        const searchMatch = match.MapID.toLowerCase().includes(searchTerm.toLowerCase());
        return matchIdMatch && searchMatch;
    });

    return (
        <div
            className={`p-1 bg-gray-800 divide-y divide-white ${panelSize ? '' : 'h-full'} scrollbar-hide`}
            style={{
                height: panelSize ? `${panelSize}px` : 'auto',
                overflowY: "auto",
            }}
        >
            {searchEnabled && (
                <div className="bg-gray-600 p-1">
                    <input
                        type="text"
                        placeholder="Search by Map Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full p-1 bg-gray-700 text-white text-xs 
                        border border-gray-500 focus:outline-none
                        ${searchTerm.trim() ? "border-green-500 ring-1 ring-green-500" : ""}`}
                    />
                </div>
            )}

            {filteredMatches.length > 0 ? (
                filteredMatches.map((match, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-600">
                        <div className="grid grid-cols-4 flex-1">
                            <a href={`/match/${match.MatchID}`} className={`flex justify-start ${fullscreen ? 'col-span-2' : 'col-span-1'}`}>
                                <div className="flex items-center justify-center">{match.MatchDate}</div>
                            </a>

                            <a href={`/match/${match.MatchID}`} className={`flex justify-end ${fullscreen ? 'col-span-2' : 'col-span-3'}`}>
                                <div>
                                    <div className="flex items-center justify-center">
                                        {match.WinningSide === 2 ? (
                                            <>
                                                <a href={`/team/${match.WinningTeamID}`} className="pr-1 flex font-semibold text-orange-500">
                                                    {match.WinningTeamName} {match.WinningTeamScore}
                                                </a>
                                                <a href={`/team/${match.LosingTeamID}`} className="pl-1 font-semibold text-blue-500">
                                                    {match.LosingTeamScore} {match.LosingTeamName}
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <a href={`/team/${match.WinningTeamID}`} className="pr-1 flex font-semibold text-blue-500">
                                                    {match.WinningTeamName} {match.WinningTeamScore}
                                                </a>
                                                <a href={`/team/${match.LosingTeamID}`} className="pl-1 font-semibold text-orange-500">
                                                    {match.LosingTeamScore} {match.LosingTeamName}
                                                </a>
                                            </>
                                        )}
                                    </div>

                                    <div className="text-xs text-right">+{match.WinningDeltaELO} / {match.LosingDeltaELO}</div>
                                    <div className="text-xs text-right">{match.MapID}</div>
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
