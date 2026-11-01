import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import apiClient from "../../apiClient";
import useApiRequest from "../../useApiRequest";
import EmptyState from "../EmptyState";
import { ui } from "../ui";

interface HitgroupStat {
    Hitgroup: number;
    Kills: number;
}

interface PlayerHitgroups {
    PlayerID: string;
    Hitgroups: HitgroupStat[];
    MatchIDs: number[];
}

interface PlayerHitgroupsResponse {
    [playerId: string]: PlayerHitgroups;
}

// The generated SVG's light-gray paths are ordered by these hitgroups.
const bodyModelHitgroupOrder = [7, 6, 2, 3, 4, 5, 1, 8] as const;

const displayHitgroups = [
    { id: "head", label: "Head", hitgroups: [1] },
    { id: "chest", label: "Chest", hitgroups: [2] },
    { id: "stomach", label: "Stomach", hitgroups: [3] },
    { id: "arms", label: "Arms", hitgroups: [4, 5] },
    { id: "legs", label: "Legs", hitgroups: [6, 7] },
    { id: "neck", label: "Neck", hitgroups: [8] },
] as const;

interface PlayerHitgroupsPanelProps {
    PlayerID: string;
    filter?: string;
    onError?: () => void;
}

function PlayerHitgroupsPanel({ PlayerID, filter = "", onError }: PlayerHitgroupsPanelProps) {
    const [playerHitgroups, setPlayerHitgroups] = useState<PlayerHitgroups>();
    const [hasLoaded, setHasLoaded] = useState(false);
    const bodyModelRef = useRef<HTMLObjectElement>(null);

    useApiRequest<PlayerHitgroupsResponse>({
        request: (signal) => {
            const query = new URLSearchParams({ player_id: PlayerID });
            new URLSearchParams(filter).forEach((value, key) => query.set(key, value));
            return apiClient.get("/playerhitgroups_panel", { params: query, signal });
        },
        onSuccess: (data) => {
            setPlayerHitgroups(data?.[PlayerID]);
            setHasLoaded(true);
        },
        onError: () => {
            setPlayerHitgroups(undefined);
            setHasLoaded(true);
            onError?.();
        },
        dependencies: [PlayerID, filter],
    });

    const hitgroups = useMemo(() => {
        const rawHitgroups = playerHitgroups?.Hitgroups ?? [];
        const killsByIndividualHitgroup = new Map(
            rawHitgroups.map((hitgroup) => [hitgroup.Hitgroup, Number(hitgroup.Kills)]),
        );
        const otherKills = rawHitgroups
            .filter((hitgroup) => hitgroup.Hitgroup < 1 || hitgroup.Hitgroup > 8)
            .reduce((total, hitgroup) => total + Number(hitgroup.Kills), 0);

        const groupedHitgroups = displayHitgroups
            .map((hitgroup) => ({
                ...hitgroup,
                kills: hitgroup.hitgroups.reduce(
                    (total, individualHitgroup) => total + (killsByIndividualHitgroup.get(individualHitgroup) ?? 0),
                    0,
                ),
            }))
            .filter((hitgroup) => hitgroup.kills > 0)
            .sort((first, second) => second.kills - first.kills);

        return otherKills > 0
            ? [...groupedHitgroups, { id: "other", label: "Other", hitgroups: [], kills: otherKills }]
            : groupedHitgroups;
    }, [playerHitgroups]);
    const totalKills = useMemo(
        () => hitgroups.reduce((total, hitgroup) => total + hitgroup.kills, 0),
        [hitgroups],
    );
    const maxKills = useMemo(
        () => Math.max(0, ...hitgroups.map((hitgroup) => hitgroup.kills)),
        [hitgroups],
    );
    const killsByHitgroup = useMemo(
        () => new Map<number, number>(
            hitgroups.flatMap((hitgroup) => hitgroup.hitgroups.map((individualHitgroup) => [individualHitgroup, hitgroup.kills])),
        ),
        [hitgroups],
    );

    const getHitgroupColor = useCallback((hitgroup: number) => {
        const kills = killsByHitgroup.get(hitgroup) ?? 0;
        if (kills === 0 || maxKills === 0) return "#374151";

        const intensity = kills / maxKills;
        if (intensity >= 0.85) return "#ef4444"; // red-500
        if (intensity >= 0.55) return "#f97316"; // orange-500
        if (intensity >= 0.25) return "#eab308"; // yellow-500
        return "#22c55e"; // green-500
    }, [killsByHitgroup, maxKills]);

    const applyBodyModelColors = useCallback(() => {
        const bodyModel = bodyModelRef.current?.contentDocument;
        if (!bodyModel) return;

        const hitgroupPaths = Array.from(
            bodyModel.querySelectorAll<SVGPathElement>('path[fill="rgb(85,85,85)"]'),
        );

        hitgroupPaths.forEach((path, index) => {
            const hitgroup = bodyModelHitgroupOrder[index];
            if (!hitgroup) return;

            path.style.fill = getHitgroupColor(hitgroup);
            path.style.transition = "fill 300ms ease";
        });
    }, [getHitgroupColor]);

    useEffect(() => {
        applyBodyModelColors();
    }, [applyBodyModelColors]);

    if (!playerHitgroups) {
        if (!hasLoaded) {
            return <div aria-busy="true" className={`${ui.panelFlat} h-full`} />;
        }

        return hasLoaded ? (
            <div className={`${ui.panelFlat} flex h-full flex-col p-4`}>
                <EmptyState message="No hitgroup stats found." className="flex flex-1 items-center justify-center text-center" />
            </div>
        ) : null;
    }

    return (
        <div className={`${ui.panelFlat} flex h-full flex-col p-4`}>
            <div className="mb-2 flex shrink-0 items-center justify-between">
                <h2 className="text-xs font-medium text-gray-300">Kills / Hitgroup</h2>
                <span className="text-[10px] text-gray-500">{totalKills} total</span>
            </div>

            {hitgroups.length > 0 ? (
                <div className="flex min-h-0 flex-1 gap-3">
                    <div className="flex min-w-0 flex-[0.8] items-center justify-center">
                        <object
                            ref={bodyModelRef}
                            data="/cs_hitgroup_body.svg"
                            type="image/svg+xml"
                            aria-label="Player hitgroup heatmap"
                            className="pointer-events-none h-full max-h-full w-auto max-w-full"
                            onLoad={applyBodyModelColors}
                        />
                    </div>
                    <div className="grid min-w-0 flex-1 grid-cols-2 content-center gap-x-3 gap-y-1 overflow-y-auto pr-1">
                    {hitgroups.map((hitgroup) => {
                        const kills = hitgroup.kills;
                        const percentage = totalKills > 0 ? (kills / totalKills) * 100 : 0;
                        const color = hitgroup.id === "other"
                            ? "#6b7280"
                            : getHitgroupColor(hitgroup.hitgroups[0]);

                        return (
                            <div key={hitgroup.id} className="min-w-0">
                                <div className="flex items-center justify-between gap-2 text-[10px]">
                                    <span className="flex min-w-0 items-center gap-1.5 text-gray-400">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                                        <span className="truncate">{hitgroup.label}</span>
                                    </span>
                                    <span className="shrink-0 font-medium text-gray-200">{kills}</span>
                                </div>
                                <div className="mt-0.5 h-1 overflow-hidden bg-gray-700/70">
                                    <div className="h-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            ) : (
                <EmptyState message="No hitgroup stats found." className="flex flex-1 items-center justify-center text-center" />
            )}
        </div>
    );
}

export default PlayerHitgroupsPanel;
