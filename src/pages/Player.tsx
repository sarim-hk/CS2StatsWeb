import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import Layout from "../components/Layout";
import PlayerPanel from '../components/Player/PlayerPanel';
import MatchesPanel from '../components/Match/MatchesPanel';
import PlayerStatsPanel from '../components/Player/PlayerStatsPanel';
import PlayerELOPanel from '../components/Player/PlayerELOPanel';
import FilterPanel from '../components/Player/FilterPanel';
import PlayerWeaponsPanel from '../components/Player/PlayerWeaponsPanel';
import PlayerHitgroupsPanel from '../components/Player/PlayerHitgroupsPanel';
import SwipeHint from '../components/SwipeHint';
import useSwipeCarousel from '../useSwipeCarousel';
import NotFound from './NotFound';

function Player() {
    const { PlayerID } = useParams<{ PlayerID: string }>();
    const [filter, setFilter] = useState<string>("");
    const profileCarousel = useSwipeCarousel(2);
    const statsCarousel = useSwipeCarousel(3);
    const desktopBreakdownCarousel = useSwipeCarousel(2);
    const [notFound, setNotFound] = useState(false);
    const [hasError, setHasError] = useState(false);
    const handleNotFound = useCallback(() => setNotFound(true), []);
    const handleError = useCallback(() => setHasError(true), []);
    const handleProfileTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        if (touch) profileCarousel.startSwipe({ x: touch.clientX, y: touch.clientY });
    };
    const handleProfileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.changedTouches[0];
        if (touch) profileCarousel.endSwipe({ x: touch.clientX, y: touch.clientY });
    };
    const handleFilterTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        if (touch) statsCarousel.startSwipe({ x: touch.clientX, y: touch.clientY });
    };
    const handleFilterTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.changedTouches[0];
        if (touch) statsCarousel.endSwipe({ x: touch.clientX, y: touch.clientY });
    };

    const handleDesktopBreakdownPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "mouse") return;

        desktopBreakdownCarousel.startSwipe({ x: event.clientX, y: event.clientY });
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleDesktopBreakdownPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") {
            desktopBreakdownCarousel.endSwipe({ x: event.clientX, y: event.clientY });
        }
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
                <div className="min-w-0 md:flex md:flex-1 md:flex-col md:self-start">
                    <div
                        className="relative h-32 touch-pan-y overflow-hidden rounded-sm border border-gray-700 bg-gray-800 md:h-auto md:shrink-0 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent"
                        onTouchStart={handleProfileTouchStart}
                        onTouchEnd={handleProfileTouchEnd}
                    >
                        <div
                            className={`absolute inset-0 ${profileCarousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:h-auto md:pointer-events-auto md:translate-x-0 md:transition-none ${profileCarousel.getTransform(0)} ${profileCarousel.activeIndex !== 0 ? "pointer-events-none" : ""}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) profileCarousel.finishSlide();
                            }}
                        >
                            <PlayerPanel PlayerID={PlayerID} onNotFound={handleNotFound} onError={handleError} />
                        </div>
                        <div
                            className={`absolute inset-0 border-t border-gray-700 ${profileCarousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:h-auto md:pointer-events-auto md:translate-x-0 md:border-0 md:pt-2 md:transition-none ${profileCarousel.getTransform(1)} ${profileCarousel.activeIndex === 1 ? "" : "pointer-events-none"}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) profileCarousel.finishSlide();
                            }}
                        >
                            <PlayerELOPanel PlayerID={PlayerID} filter={filter} />
                        </div>
                        <SwipeHint
                            activeIndex={profileCarousel.activeIndex}
                            viewCount={2}
                            direction={profileCarousel.direction}
                            isSliding={profileCarousel.isSliding}
                        />
                    </div>

                    <div
                        className="relative order-2 mt-2 h-[300px] touch-pan-y overflow-hidden md:order-1 md:contents"
                        onTouchStart={handleFilterTouchStart}
                        onTouchEnd={handleFilterTouchEnd}
                    >
                        <div
                            className={`absolute inset-0 ${statsCarousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:hidden ${statsCarousel.getTransform(1)} ${statsCarousel.activeIndex !== 1 ? "pointer-events-none" : ""}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) statsCarousel.finishSlide();
                            }}
                        >
                            <PlayerWeaponsPanel PlayerID={PlayerID} filter={filter} />
                        </div>

                        <div
                            className={`absolute inset-0 ${statsCarousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:absolute md:left-[calc(33.333%+0.5rem)] md:right-0 md:top-[552px] md:pointer-events-auto md:translate-x-0 md:transition-none ${statsCarousel.getTransform(0)} ${statsCarousel.activeIndex !== 0 ? "pointer-events-none" : ""}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) statsCarousel.finishSlide();
                            }}
                        >
                            <PlayerStatsPanel PlayerID={PlayerID} filter={filter} className="h-full md:h-auto" />
                        </div>
                        <div
                            className={`absolute inset-0 ${statsCarousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:hidden ${statsCarousel.getTransform(2)} ${statsCarousel.activeIndex !== 2 ? "pointer-events-none" : ""}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) statsCarousel.finishSlide();
                            }}
                        >
                            <PlayerHitgroupsPanel PlayerID={PlayerID} filter={filter} />
                        </div>
                        <SwipeHint
                            activeIndex={statsCarousel.activeIndex}
                            viewCount={3}
                            direction={statsCarousel.direction}
                            isSliding={statsCarousel.isSliding}
                        />
                    </div>

                    <div
                        className="relative hidden h-[238px] shrink-0 cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing md:block md:[&_*]:select-none"
                        onPointerDown={handleDesktopBreakdownPointerDown}
                        onPointerUp={handleDesktopBreakdownPointerUp}
                    >
                        <div
                            className={`absolute inset-x-0 bottom-0 top-2 ${desktopBreakdownCarousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} ${desktopBreakdownCarousel.getTransform(0)} ${desktopBreakdownCarousel.activeIndex !== 0 ? "pointer-events-none" : ""}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) desktopBreakdownCarousel.finishSlide();
                            }}
                        >
                            <PlayerWeaponsPanel PlayerID={PlayerID} filter={filter} />
                        </div>
                        <div
                            className={`absolute inset-x-0 bottom-0 top-2 ${desktopBreakdownCarousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} ${desktopBreakdownCarousel.getTransform(1)} ${desktopBreakdownCarousel.activeIndex !== 1 ? "pointer-events-none" : ""}`}
                            onTransitionEnd={(event) => {
                                if (event.target === event.currentTarget) desktopBreakdownCarousel.finishSlide();
                            }}
                        >
                            <PlayerHitgroupsPanel PlayerID={PlayerID} filter={filter} />
                        </div>
                        <button
                            type="button"
                            aria-label="Show previous breakdown"
                            onClick={() => desktopBreakdownCarousel.move("backward")}
                            onPointerDown={(event) => event.stopPropagation()}
                            onPointerUp={(event) => event.stopPropagation()}
                            className="absolute left-2 top-1/2 z-20 flex -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-gray-200"
                        >
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            aria-label="Show next breakdown"
                            onClick={() => desktopBreakdownCarousel.move("forward")}
                            onPointerDown={(event) => event.stopPropagation()}
                            onPointerUp={(event) => event.stopPropagation()}
                            className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-gray-200"
                        >
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                        <SwipeHint
                            activeIndex={desktopBreakdownCarousel.activeIndex}
                            viewCount={2}
                            direction={desktopBreakdownCarousel.direction}
                            isSliding={desktopBreakdownCarousel.isSliding}
                            visibility="all"
                        />
                    </div>

                    <div className="order-1 pt-2 md:order-2 md:shrink-0">
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
