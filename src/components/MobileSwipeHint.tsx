import { useEffect, useRef, useState } from "react";

interface MobileSwipeHintProps {
    activeIndex: number;
    viewCount: number;
    direction: "forward" | "backward";
    isSliding: boolean;
}

function MobileSwipeHint({ activeIndex, viewCount, direction, isSliding }: MobileSwipeHintProps) {
    const [progressIndex, setProgressIndex] = useState<number>(activeIndex);
    const [isProgressSliding, setIsProgressSliding] = useState(false);
    const wasSliding = useRef(false);
    const isWrapping = useRef(false);
    const timers = useRef<number[]>([]);

    useEffect(() => {
        if (isSliding && !wasSliding.current) {
            const isForwardWrap = activeIndex === 0 && direction === "forward";
            const isBackwardWrap = activeIndex === viewCount - 1 && direction === "backward";

            if (isForwardWrap || isBackwardWrap) {
                isWrapping.current = true;
                setIsProgressSliding(true);
                setProgressIndex(isForwardWrap ? viewCount : -1);

                timers.current.push(window.setTimeout(() => {
                    setIsProgressSliding(false);
                    setProgressIndex(isForwardWrap ? -1 : viewCount);

                    window.requestAnimationFrame(() => {
                        setIsProgressSliding(true);
                        setProgressIndex(activeIndex);
                    });

                    timers.current.push(window.setTimeout(() => {
                        setIsProgressSliding(false);
                        isWrapping.current = false;
                    }, 150));
                }, 150));
            } else {
                setIsProgressSliding(true);
                setProgressIndex(activeIndex);
            }
        }

        if (!isSliding && !isWrapping.current) {
            setIsProgressSliding(false);
            setProgressIndex(activeIndex);
        }

        wasSliding.current = isSliding;
    }, [activeIndex, direction, isSliding, viewCount]);

    useEffect(() => () => {
        timers.current.forEach((timer) => window.clearTimeout(timer));
    }, []);

    return (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-0.5 overflow-hidden bg-gray-700 md:hidden">
            <div
                className={`h-full bg-green-400 ${isProgressSliding ? "transition-transform duration-150 ease-out" : "transition-none"}`}
                style={{ width: `${100 / viewCount}%`, transform: `translateX(${progressIndex * 100}%)` }}
            />
        </div>
    );
}

export default MobileSwipeHint;
