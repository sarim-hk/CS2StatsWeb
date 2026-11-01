import { useState } from "react";
import apiClient from "../../apiClient";
import useApiRequest from "../../useApiRequest";
import { Doughnut } from "react-chartjs-2";
import { ui } from "../ui";
import EmptyState from "../EmptyState";
import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip,
} from "chart.js";

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
    onError?: () => void;
}

function PlayerWeaponsPanel({ PlayerID, filter = "", onError }: PlayerWeaponsPanelProps) {
    const [playerWeapons, setPlayerWeapons] = useState<PlayerWeapons>();
    const [hasLoaded, setHasLoaded] = useState(false);

    useApiRequest<PlayerWeaponsResponse>({
        request: (signal) => {
        const query = new URLSearchParams({ player_id: PlayerID });
        new URLSearchParams(filter).forEach((value, key) => query.set(key, value));
            return apiClient.get("/playerweapons_panel", { params: query, signal });
        },
        onSuccess: (data) => {
            setPlayerWeapons(data?.[PlayerID]);
            setHasLoaded(true);
        },
        onError: () => {
            setPlayerWeapons(undefined);
            setHasLoaded(true);
            onError?.();
        },
        dependencies: [PlayerID, filter],
    });

    if (!playerWeapons) {
        if (!hasLoaded) {
            return <div aria-busy="true" className={`${ui.panelFlat} h-full`} />;
        }

        return hasLoaded ? (
            <div className={`${ui.panelFlat} flex h-full flex-col p-4`}>
                <EmptyState message="No weapon stats found." className="flex flex-1 items-center justify-center text-center" />
            </div>
        ) : null;
    }

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
        <div className={`${ui.panelFlat} flex h-full flex-col p-4`}>
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
                <EmptyState message="No weapon stats found." className="flex flex-1 items-center justify-center text-center" />
            )}
        </div>
    );
}

export default PlayerWeaponsPanel;
