import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from "chart.js";

const API_URL = import.meta.env.VITE_API_URL;

ChartJS.register(ArcElement, Tooltip, Legend);

interface Weapon {
    Weapon: string;
    Kills: number;
}

interface PlayerWeapons {
    PlayerID: string;
    Weapons: Weapon[];
    MatchIDs: number[];
}

interface PlayerWeaponsResponse {
    [playerId: string]: PlayerWeapons;
}

interface PlayerWeaponsPanelProps {
    PlayerID: string;
    filter?: string;
}

function PlayerWeaponsPanel({ PlayerID, filter = "" }: PlayerWeaponsPanelProps) {
    const [playerWeapons, setPlayerWeapons] = useState<PlayerWeapons>();

    useEffect(() => {
        const query = new URLSearchParams({ player_id: PlayerID });
        new URLSearchParams(filter).forEach((value, key) => query.set(key, value));

        axios
            .get<PlayerWeaponsResponse>(`${API_URL}/playerweapons_panel?${query}`)
            .then((response) => setPlayerWeapons(response.data?.[PlayerID]))
            .catch((error) => console.error("Error fetching weapon data:", error));
    }, [PlayerID, filter]);

    if (!playerWeapons) return null;

    const weapons = playerWeapons.Weapons ?? [];
    const totalKills = weapons.reduce(
        (total, weapon) => total + Number(weapon.Kills),
        0
    );

    const visibleWeapons = weapons.filter(
        (weapon) =>
            totalKills > 0 &&
            Number(weapon.Kills) / totalKills >= 0.01
    );

    const colors = [
        "#22c55e",
        "#3b82f6",
        "#f97316",
        "#a855f7",
        "#eab308",
        "#ef4444",
    ];

    const data = {
        labels: visibleWeapons.map((weapon) => weapon.Weapon),
        datasets: [
            {
                data: visibleWeapons.map((weapon) => weapon.Kills),
                backgroundColor: visibleWeapons.map(
                    (_, index) => colors[index % colors.length]
                ),
                borderColor: "#1f2937",
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="bg-gray-800 p-4 h-[230px] flex flex-col">
            <div className="mb-2 flex shrink-0 items-center justify-between">
                <h2 className="text-xs font-medium text-gray-300">
                    Kills / Weapon
                </h2>
                <span className="text-[10px] text-gray-500">
                    {totalKills} total
                </span>
            </div>

            {weapons.length > 0 ? (
                <div className="mx-auto min-h-0 w-full max-w-[220px] flex-1">
                    <Doughnut
                        data={data}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    callbacks: {
                                        label: (context) =>
                                            ` ${context.label}: ${context.raw} kills`,
                                    },
                                },
                            },
                        }}
                    />
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center text-center text-xs font-medium text-gray-400">
                    No weapon kills found.
                </div>
            )}
        </div>
    );
}

export default PlayerWeaponsPanel;
