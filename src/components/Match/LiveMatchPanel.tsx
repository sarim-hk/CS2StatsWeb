import { useEffect, useState } from "react";
import axios from "axios";
import LiveMatchInterface from "../../interfaces/LiveMatchInterface";
import LivePlayerInterface from "../../interfaces/LivePlayerInterface";

const API_URL = import.meta.env.VITE_API_URL;

function LiveMatchPanel() {
    const [liveMatch, setLiveMatch] = useState<LiveMatchInterface>();

    useEffect(() => {
        fetchLiveMatch(setLiveMatch);
        const intervalId = setInterval(() => fetchLiveMatch(setLiveMatch), 15000);
        return () => clearInterval(intervalId);
    }, []);

    if (!liveMatch || liveMatch.InsertDate < Math.floor(Date.now() / 1000) - 120) {
        return null;
    }

    let tPlayers, ctPlayers = []
    if (liveMatch?.TPlayers && liveMatch?.CTPlayers) {
        tPlayers = JSON.parse(liveMatch.TPlayers)
        ctPlayers = JSON.parse(liveMatch.CTPlayers)
    }

    return (
        <div className="bg-gray-800">
            <div className="p-1 pb-0">
                <div className="bg-gray-600 relative p-4 pb-0 flex justify-center items-center">
                    <div className="absolute left-4 text-xs leading-normal">Bomb: {getBombStatusLabel(liveMatch?.BombStatus)}</div>
                    <div className="flex items-center font-semibold text-lg space-x-1">
                        <div className="text-orange-500">{liveMatch?.TScore ?? 0}</div>
                        <div className="text-xs">:</div>
                        <div className="text-blue-500">{liveMatch?.CTScore ?? 0}</div>
                    </div>
                    <div className="absolute right-4 text-xs leading-normal">Round: {(liveMatch?.TScore ?? 0) + (liveMatch?.CTScore ?? 1)}</div>
                </div>

                <div className="bg-gray-600 pt-4F pb-4">
                    <table className="min-w-full text-center text-xs">

                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b w-36 text-left">Player</th>
                                <th className="py-2 px-4 border-b w-24">KDA</th>
                                <th className="py-2 px-4 border-b w-24">ADR</th>
                                <th className="py-2 px-4 border-b w-24">Health</th>
                                <th className="py-2 px-4 border-b w-24">Money</th>
                            </tr>
                        </thead>

                        {tPlayers && tPlayers.length > 0 ? (
                            <tbody>
                                {tPlayers.map((player: LivePlayerInterface, index: number) => (
                                    <tr key={index} className="bg-orange-500 bg-opacity-25">
                                        <td className="py-2 px-4 border-b text-left">{player.Username}</td>
                                        <td className="py-2 px-4 border-b">{player.Kills}-{player.Deaths}-{player.Assists}</td>
                                        <td className="py-2 px-4 border-b">{((player.Damage / ((liveMatch?.TScore ?? 0) + (liveMatch?.CTScore ?? 1))) || 0).toFixed(2)}</td>
                                        <td className="py-2 px-4 border-b">{player.Health}</td>
                                        <td className="py-2 px-4 border-b">{player.MoneySaved}$</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (<></>)}

                        {ctPlayers && ctPlayers.length > 0 ? (
                            <tbody>
                                {ctPlayers.map((player: LivePlayerInterface, index: number) => (
                                    <tr key={index} className="bg-blue-500 bg-opacity-25">
                                        <td className="py-2 px-4 border-b text-left">{player.Username}</td>
                                        <td className="py-2 px-4 border-b">{player.Kills}-{player.Deaths}-{player.Assists}</td>
                                        <td className="py-2 px-4 border-b">{((player.Damage / ((liveMatch?.TScore ?? 0) + (liveMatch?.CTScore ?? 1))) || 0).toFixed(2)}</td>
                                        <td className="py-2 px-4 border-b">{player.Health}</td>
                                        <td className="py-2 px-4 border-b">{player.MoneySaved}$</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (<></>)}

                    </table>
                </div>

            </div>
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

function fetchLiveMatch(setLiveMatch: React.Dispatch<React.SetStateAction<LiveMatchInterface | undefined>>) {
    const url = `${API_URL}/live_match_panel`;
    axios
        .get<LiveMatchInterface>(url)
        .then((response) => setLiveMatch(response.data))
        .catch((error) => {
            console.error("Error fetching data:", error);
            setLiveMatch(undefined);
        });
}

export default LiveMatchPanel;
