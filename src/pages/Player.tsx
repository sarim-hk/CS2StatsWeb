import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Layout from "../components/Layout";
import PlayerPanel from '../components/Player/PlayerPanel';
import MatchesPanel from '../components/Match/MatchesPanel';
import PlayerStatsPanel from '../components/Player/PlayerStatsPanel';
import PlayerELOPanel from '../components/Player/PlayerELOPanel';
import FilterPanel from '../components/Player/FilterPanel';
import PlayerWeaponsPanel from '../components/Player/PlayerWeaponsPanel';
import NotFound from './NotFound';

function Player() {
    const { PlayerID } = useParams<{ PlayerID: string }>();
    const [filter, setFilter] = useState<string>("");
    const [showPlayerELO, setShowPlayerELO] = useState(false);
    const [autoSwitchPaused, setAutoSwitchPaused] = useState(false);
    const profileTouchStart = useRef<{ x: number; y: number } | null>(null);
    const [showFilter, setShowFilter] = useState(true);
    const [filterAutoSwitchPaused, setFilterAutoSwitchPaused] = useState(false);
    const filterTouchStart = useRef<{ x: number; y: number } | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [hasError, setHasError] = useState(false);
    const handleNotFound = useCallback(() => setNotFound(true), []);
    const handleError = useCallback(() => setHasError(true), []);

    useEffect(() => {
        if (autoSwitchPaused || !window.matchMedia("(max-width: 767px)").matches) return;

        const interval = window.setInterval(() => {
            setShowPlayerELO((current) => !current);
        }, 5000);

        return () => window.clearInterval(interval);
    }, [autoSwitchPaused]);

    useEffect(() => {
        if (filterAutoSwitchPaused || !window.matchMedia("(max-width: 767px)").matches) return;

        const interval = window.setInterval(() => {
            setShowFilter((current) => !current);
        }, 5000);

        return () => window.clearInterval(interval);
    }, [filterAutoSwitchPaused]);
    const handleProfileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        profileTouchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
    };
    const handleProfileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (profileTouchStart.current === null) return;

        const touch = event.changedTouches[0];
        const horizontalDistance = touch.clientX - profileTouchStart.current.x;
        const verticalDistance = touch.clientY - profileTouchStart.current.y;
        if (Math.abs(horizontalDistance) >= 40 && Math.abs(horizontalDistance) >= Math.abs(verticalDistance) * 1.5) {
            setAutoSwitchPaused(true);
            setShowPlayerELO((current) => !current);
        }

        profileTouchStart.current = null;
    };
    const handleFilterTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        filterTouchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
    };
    const handleFilterTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (filterTouchStart.current === null) return;

        const touch = event.changedTouches[0];
        const horizontalDistance = touch.clientX - filterTouchStart.current.x;
        const verticalDistance = touch.clientY - filterTouchStart.current.y;
        if (Math.abs(horizontalDistance) >= 40 && Math.abs(horizontalDistance) >= Math.abs(verticalDistance) * 1.5) {
            setFilterAutoSwitchPaused(true);
            setShowFilter((current) => !current);
        }

        filterTouchStart.current = null;
    };

    if (PlayerID === undefined || PlayerID.trim() === "") {
        return <NotFound resource="player" />;
    }

    if (notFound) {
        return <NotFound resource="player" />;
    }

    if (hasError) {
        return <NotFound resource="player" error />;
    }

    return (
        <Layout>
            <div className="flex min-h-0 flex-col gap-2 overflow-y-auto md:relative md:flex-row md:h-[calc(100dvh_-_6rem_-_2px)]">
                <div className="min-w-0 md:flex md:flex-1 md:flex-col">
                    <div
                        className="relative h-32 touch-pan-y overflow-hidden rounded-sm border border-gray-700 bg-gray-800 md:h-auto md:overflow-visible md:rounded-none md:border-0 md:bg-transparent"
                        onTouchStart={handleProfileTouchStart}
                        onTouchEnd={handleProfileTouchEnd}
                    >
                        <div className={`absolute inset-0 transition-opacity duration-300 md:static md:h-auto md:pointer-events-auto md:opacity-100 md:transition-none ${showPlayerELO ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                            <PlayerPanel PlayerID={PlayerID} onNotFound={handleNotFound} onError={handleError} />
                        </div>
                        <div className={`absolute inset-0 border-t border-gray-700 transition-opacity duration-300 md:static md:h-auto md:pointer-events-auto md:border-0 md:pt-2 md:opacity-100 md:transition-none ${showPlayerELO ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                            <PlayerELOPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                        </div>
                    </div>

                    <div
                        className="relative order-2 mt-2 h-[300px] touch-pan-y overflow-hidden md:order-1 md:contents"
                        onTouchStart={handleFilterTouchStart}
                        onTouchEnd={handleFilterTouchEnd}
                    >
                        <div className={`absolute inset-0 transition-opacity duration-300 md:static md:w-full md:pointer-events-auto md:opacity-100 md:pt-2 md:transition-none ${showFilter ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                            <PlayerWeaponsPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                        </div>

                        <div className={`absolute inset-0 transition-opacity duration-300 md:absolute md:left-[calc(33.333%+0.5rem)] md:right-0 md:top-[552px] md:pointer-events-auto md:opacity-100 md:transition-none ${showFilter ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                            <PlayerStatsPanel PlayerID={PlayerID} filter={filter} onError={handleError} className="h-full md:h-auto" />
                        </div>
                    </div>

                    <div className="order-1 pt-2 md:order-2">
                        <FilterPanel onFilterChange={setFilter} />
                    </div>

                </div>

                <div className="min-w-0 md:flex-2">
                    <div>
                        <MatchesPanel
                            PlayerID={PlayerID}
                            filter={filter}
                            panelSize={544}
                            mobileNaturalHeight
                            onError={handleError}
                        />
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Player;
