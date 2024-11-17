import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

const API_URL = import.meta.env.VITE_API_URL;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PlayerELOPanelProps {
    PlayerID: string;
}

function PlayerELOPanel({ PlayerID }: PlayerELOPanelProps) {
    const [playerELOHistory, setPlayerELOHistory] = useState<any>(null);

    useEffect(() => {
        axios
            .get(`${API_URL}/playerelo_panel_bp_by_player_id?player_id=${PlayerID}`)
            .then((response) => setPlayerELOHistory(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, [PlayerID]);

    if (!playerELOHistory) {
        return null;
    }

    const eloData = [];
    const matchLabels: string[] = [];

    eloData.unshift(playerELOHistory.CurrentELO)
    matchLabels.unshift("")

    for (let i = 0; i < playerELOHistory.ELOHistory.length; i++) {
        const match = playerELOHistory.ELOHistory[i];
        eloData.unshift(match.ELOBeforeMatch);
        matchLabels.unshift("");
    }

    const data = {
        labels: matchLabels,
        datasets: [
            {
                data: eloData,
                borderColor: "white",
                backgroundColor: "grey",
                borderWidth: 2,
                tension: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `ELO: ${context.raw}`,
                },
            },
        },
        
        scales: {
            x: {
                display: false,
            },
            y: {
                display: true,
                ticks: {
                    color: "white",
                },
            },
        },
    };

    return (
        <div className="p-1 bg-gray-800 text-white">
            <div className="bg-gray-700 p-2">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}

export default PlayerELOPanel;
