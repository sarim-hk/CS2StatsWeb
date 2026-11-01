import { useCallback, useRef, useState } from "react";

export type SlideDirection = "forward" | "backward";

interface PointerPosition {
    x: number;
    y: number;
}

const SWIPE_THRESHOLD = 40;
const SWIPE_DIRECTION_RATIO = 1.5;

function getNextIndex(currentIndex: number, direction: SlideDirection, viewCount: number) {
    return direction === "forward"
        ? (currentIndex + 1) % viewCount
        : (currentIndex + viewCount - 1) % viewCount;
}

function getSwipeDirection(start: PointerPosition, end: PointerPosition): SlideDirection | null {
    const horizontalDistance = end.x - start.x;
    const verticalDistance = end.y - start.y;

    if (
        Math.abs(horizontalDistance) < SWIPE_THRESHOLD ||
        Math.abs(horizontalDistance) < Math.abs(verticalDistance) * SWIPE_DIRECTION_RATIO
    ) {
        return null;
    }

    return horizontalDistance < 0 ? "forward" : "backward";
}

function getPanelTransform(
    panelIndex: number,
    activeIndex: number,
    isSliding: boolean,
    direction: SlideDirection,
    viewCount: number,
) {
    if (panelIndex === activeIndex) return "translate-x-0";

    if (!isSliding) {
        return direction === "forward" ? "translate-x-full" : "-translate-x-full";
    }

    const outgoingIndex = direction === "forward"
        ? (activeIndex + viewCount - 1) % viewCount
        : (activeIndex + 1) % viewCount;

    if (panelIndex === outgoingIndex) {
        return direction === "forward" ? "-translate-x-full" : "translate-x-full";
    }

    return direction === "forward" ? "translate-x-full" : "-translate-x-full";
}

function useSwipeCarousel(viewCount: number) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const [direction, setDirection] = useState<SlideDirection>("forward");
    const pointerStart = useRef<PointerPosition | null>(null);

    const move = useCallback((nextDirection: SlideDirection) => {
        if (isSliding) return;

        setDirection(nextDirection);
        window.requestAnimationFrame(() => {
            setActiveIndex((current) => getNextIndex(current, nextDirection, viewCount));
            setIsSliding(true);
        });
    }, [isSliding, viewCount]);

    const startSwipe = useCallback((position: PointerPosition) => {
        pointerStart.current = position;
    }, []);

    const endSwipe = useCallback((position: PointerPosition) => {
        const start = pointerStart.current;
        pointerStart.current = null;
        if (!start) return;

        const swipeDirection = getSwipeDirection(start, position);
        if (swipeDirection) move(swipeDirection);
    }, [move]);

    const getTransform = useCallback((panelIndex: number) => getPanelTransform(
        panelIndex,
        activeIndex,
        isSliding,
        direction,
        viewCount,
    ), [activeIndex, direction, isSliding, viewCount]);

    return {
        activeIndex,
        direction,
        isSliding,
        move,
        startSwipe,
        endSwipe,
        getTransform,
        finishSlide: () => setIsSliding(false),
    };
}

export default useSwipeCarousel;
