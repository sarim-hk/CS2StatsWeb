import { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Layout from "../components/Layout";
import PlayerPanel from '../components/Player/PlayerPanel';
import MatchesPanel from '../components/Match/MatchesPanel';
import PlayerStatsPanel from '../components/Player/PlayerStatsPanel';
import PlayerELOPanel from '../components/Player/PlayerELOPanel';
import FilterPanel from '../components/Player/FilterPanel';
import PlayerWeaponsPanel from '../components/Player/PlayerWeaponsPanel';
import MobileSwipeHint from '../components/MobileSwipeHint';
import NotFound from './NotFound';

type SlideDirection = "forward" | "backward";

function Player() {
    const { PlayerID } = useParams<{ PlayerID: string }>();
    const [filter, setFilter] = useState<string>("");
    const [showPlayerELO, setShowPlayerELO] = useState(false);
    const [isProfileSliding, setIsProfileSliding] = useState(false);
    const [profileSlideDirection, setProfileSlideDirection] = useState<SlideDirection>("forward");
    const profileTouchStart = useRef<{ x: number; y: number } | null>(null);
    const [showFilter, setShowFilter] = useState(true);
    const [isFilterSliding, setIsFilterSliding] = useState(false);
    const [statsSlideDirection, setStatsSlideDirection] = useState<SlideDirection>("forward");
    const filterTouchStart = useRef<{ x: number; y: number } | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [hasError, setHasError] = useState(false);
    const handleNotFound = useCallback(() => setNotFound(true), []);
    const handleError = useCallback(() => setHasError(true), []);
    const moveProfileView = useCallback((direction: SlideDirection) => {
        if (isProfileSliding) return;

        setProfileSlideDirection(direction);
        window.requestAnimationFrame(() => {
            setShowPlayerELO((current) => !current);
            setIsProfileSliding(true);
        });
    }, [isProfileSliding]);
    const moveStatsView = useCallback((direction: SlideDirection) => {
        if (isFilterSliding) return;

        setStatsSlideDirection(direction);
        window.requestAnimationFrame(() => {
            setShowFilter((current) => !current);
            setIsFilterSliding(true);
        });
    }, [isFilterSliding]);

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
            moveProfileView(horizontalDistance < 0 ? "forward" : "backward");
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
            moveStatsView(horizontalDistance < 0 ? "forward" : "backward");
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
                        <div
                            className={`absolute inset-0 ${isProfileSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:h-auto md:pointer-events-auto md:translate-x-0 md:transition-none ${showPlayerELO ? `${isProfileSliding ? (profileSlideDirection === "forward" ? "-translate-x-full" : "translate-x-full") : (profileSlideDirection === "forward" ? "translate-x-full" : "-translate-x-full")} pointer-events-none` : "translate-x-0"}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) setIsProfileSliding(false);
                            }}
                        >
                            <PlayerPanel PlayerID={PlayerID} onNotFound={handleNotFound} onError={handleError} />
                        </div>
                        <div
                            className={`absolute inset-0 border-t border-gray-700 ${isProfileSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:h-auto md:pointer-events-auto md:translate-x-0 md:border-0 md:pt-2 md:transition-none ${showPlayerELO ? "translate-x-0" : `${isProfileSliding ? (profileSlideDirection === "forward" ? "-translate-x-full" : "translate-x-full") : (profileSlideDirection === "forward" ? "translate-x-full" : "-translate-x-full")} pointer-events-none`}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) setIsProfileSliding(false);
                            }}
                        >
                            <PlayerELOPanel PlayerID={PlayerID} filter={filter} />
                        </div>
                        <MobileSwipeHint
                            activeIndex={showPlayerELO ? 1 : 0}
                            direction={profileSlideDirection}
                            isSliding={isProfileSliding}
                        />
                    </div>

                    <div
                        className="relative order-2 mt-2 h-[300px] touch-pan-y overflow-hidden md:order-1 md:contents"
                        onTouchStart={handleFilterTouchStart}
                        onTouchEnd={handleFilterTouchEnd}
                    >
                        <div
                            className={`absolute inset-0 ${isFilterSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:w-full md:pointer-events-auto md:translate-x-0 md:pt-2 md:transition-none ${showFilter ? `${isFilterSliding ? (statsSlideDirection === "forward" ? "-translate-x-full" : "translate-x-full") : (statsSlideDirection === "forward" ? "translate-x-full" : "-translate-x-full")} pointer-events-none` : "translate-x-0"}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) setIsFilterSliding(false);
                            }}
                        >
                            <PlayerWeaponsPanel PlayerID={PlayerID} filter={filter} />
                        </div>

                        <div
                            className={`absolute inset-0 ${isFilterSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:absolute md:left-[calc(33.333%+0.5rem)] md:right-0 md:top-[552px] md:pointer-events-auto md:translate-x-0 md:transition-none ${showFilter ? "translate-x-0" : `${isFilterSliding ? (statsSlideDirection === "forward" ? "-translate-x-full" : "translate-x-full") : (statsSlideDirection === "forward" ? "translate-x-full" : "-translate-x-full")} pointer-events-none`}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) setIsFilterSliding(false);
                            }}
                        >
                            <PlayerStatsPanel PlayerID={PlayerID} filter={filter} className="h-full md:h-auto" />
                        </div>
                        <MobileSwipeHint
                            activeIndex={showFilter ? 1 : 0}
                            direction={statsSlideDirection}
                            isSliding={isFilterSliding}
                        />
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
                        />
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Player;
