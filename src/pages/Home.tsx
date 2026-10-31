import { useCallback, useRef, useState, type TouchEvent } from "react";

import Layout from "../components/Layout";
import MatchesPanel from "../components/Match/MatchesPanel";
import MobileSwipeHint from "../components/MobileSwipeHint";
import PlayersPanel from "../components/Player/PlayersPanel";

type SlideDirection = "forward" | "backward";

function Home() {
	const [showMatches, setShowMatches] = useState(false);
	const [isSliding, setIsSliding] = useState(false);
	const [slideDirection, setSlideDirection] = useState<SlideDirection>("forward");
	const touchStart = useRef<{ x: number; y: number } | null>(null);
	const moveView = useCallback((direction: SlideDirection) => {
		if (isSliding) return;

		setSlideDirection(direction);
		window.requestAnimationFrame(() => {
			setShowMatches((current) => !current);
			setIsSliding(true);
		});
	}, [isSliding]);

	const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
		const touch = event.touches[0];
		touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
	};

	const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
		if (touchStart.current === null) return;

		const touch = event.changedTouches[0];
		const horizontalDistance = touch.clientX - touchStart.current.x;
		const verticalDistance = touch.clientY - touchStart.current.y;
		if (Math.abs(horizontalDistance) >= 40 && Math.abs(horizontalDistance) >= Math.abs(verticalDistance) * 1.5) {
			moveView(horizontalDistance < 0 ? "forward" : "backward");
		}

		touchStart.current = null;
	};

	return (		
		<Layout>
			<div
				className="relative h-[calc(100dvh_-_6rem_-_2px)] min-h-0 touch-pan-y overflow-hidden md:grid md:grid-cols-[1fr_2fr] md:gap-2"
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<div
					className={`absolute inset-0 min-h-0 min-w-0 ${isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:pointer-events-auto md:translate-x-0 md:transition-none ${showMatches ? `${isSliding ? (slideDirection === "forward" ? "-translate-x-full" : "translate-x-full") : (slideDirection === "forward" ? "translate-x-full" : "-translate-x-full")} pointer-events-none` : "translate-x-0"}`}
					onTransitionEnd={(event) => {
						if (event.target === event.currentTarget) setIsSliding(false);
					}}
				>
					<PlayersPanel searchEnabled={true} />
				</div>

				<div
					className={`absolute inset-0 min-h-0 min-w-0 ${isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:pointer-events-auto md:translate-x-0 md:transition-none ${showMatches ? "translate-x-0" : `${isSliding ? (slideDirection === "forward" ? "-translate-x-full" : "translate-x-full") : (slideDirection === "forward" ? "translate-x-full" : "-translate-x-full")} pointer-events-none`}`}
					onTransitionEnd={(event) => {
						if (event.target === event.currentTarget) setIsSliding(false);
					}}
				>
					<MatchesPanel searchEnabled={true} />
				</div>

				<MobileSwipeHint
					activeIndex={showMatches ? 1 : 0}
					direction={slideDirection}
					isSliding={isSliding}
				/>
			</div>
		</Layout>
	);
}

export default Home;
