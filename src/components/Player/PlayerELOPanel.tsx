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
                borderColor: "#22c55e", // green-500
                backgroundColor: "rgba(34, 197, 94, 0.2)", // green-500 with opacity
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: "#22c55e",
                pointHoverBorderColor: "#ffffff",
                pointHoverBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {

            legend: {
                display: false,
            },

            tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                titleColor: "#9ca3af",
                bodyColor: "#ffffff",
                padding: 8,
                displayColors: false,
                callbacks: {
                    title: () => "ELO",
                    label: (context: any) => context.raw,
                },
            },
        },

        scales: {
            x: {
                display: false,
                grid: {
                    display: false,
                },
            },
            y: {
                border: {
                    display: false,
                },
                grid: {
                    color: "rgba(75, 85, 99, 0.2)",
                },
                ticks: {
                    color: "#9ca3af",
                    font: {
                        size: 11,
                    },
                    padding: 8,
                },
            },
        },

        interaction: {
            intersect: false,
            mode: 'index',
        },
        
        layout: {
            padding: {
                left: 0,
                right: 8,
                top: 8,
                bottom: 8
            }
        }
    };

    return (
        <div className="bg-gray-800">
            <div className="h-48">
                <Line data={data} options={options as any} />
            </div>
        </div>
    );
}

export default PlayerELOPanel;
