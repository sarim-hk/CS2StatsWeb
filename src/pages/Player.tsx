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
    const touchStartX = useRef<number | null>(null);
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
    const handleProfileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
    };
    const handleProfileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null) return;

        const distance = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(distance) >= 40) {
            setAutoSwitchPaused(true);
            setShowPlayerELO((current) => !current);
        }

        touchStartX.current = null;
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
            <div className="flex min-h-0 flex-col gap-2 overflow-y-auto md:flex-row md:h-[calc(100dvh_-_6rem_-_2px)]">
                <div className="min-w-0 flex-none md:flex-1">
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

                    <div className="pt-2">
                        <PlayerWeaponsPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                    </div>

                    <div className="pt-2">
                        <FilterPanel onFilterChange={setFilter} />
                    </div>

                </div>

                <div className="flex min-w-0 flex-none flex-col md:flex-2">
                    <div className="order-2 pt-2 md:order-1 md:pt-0">
                        <MatchesPanel
                            PlayerID={PlayerID}
                            filter={filter}
                            panelSize={544}
                            mobileNaturalHeight
                            onError={handleError}
                        />
                    </div>

                    <div className="order-1 pt-2 md:order-2">
                        <PlayerStatsPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Player;
