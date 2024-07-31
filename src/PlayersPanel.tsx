import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface Player {
    Avatar: string;
    ELO: number;
    PlayerID: number;
    Username: string;
}

function PlayersPanel() {

    const [matches, setMatches] = useState<Player[]>([]);

    useEffect(() => {
        axios
            .get<Player[]>(API_URL + "/get_players_or_player")
            .then((response) => setMatches(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="p-1 bg-gray-800 font-display divide-y divide-white">
            {matches.map((player: any, index) => (
                <div key={index} className="flex items-start pl-1 bg-gray-600">
                    <div>
                        <a href="{yourLink1}" className="flex items-center pt-1 pb-1 ">
                            <img className="object-contain h-12 w-12 mr-2 border-gray-800 border-solid border-2" src={player.Avatar} />
                            <div>
                                {player.Username}
                                <div className="text-xs text-left">ELO: {player.ELO}</div>
                            </div>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PlayersPanel;