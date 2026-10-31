import { useEffect, useRef, useState, type TouchEvent } from "react";

import Layout from "../components/Layout";
import MatchesPanel from "../components/Match/MatchesPanel";
import PlayersPanel from "../components/Player/PlayersPanel";

function Home() {
	const [showMatches, setShowMatches] = useState(false);
	const [autoSwitchPaused, setAutoSwitchPaused] = useState(false);
	const touchStart = useRef<{ x: number; y: number } | null>(null);

	useEffect(() => {
		if (autoSwitchPaused || !window.matchMedia("(max-width: 767px)").matches) return;

		const interval = window.setInterval(() => {
			setShowMatches((current) => !current);
		}, 5000);

		return () => window.clearInterval(interval);
	}, [autoSwitchPaused]);

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
			setAutoSwitchPaused(true);
			setShowMatches((current) => !current);
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
				<div className={`absolute inset-0 min-h-0 min-w-0 transition-opacity duration-300 md:static md:pointer-events-auto md:opacity-100 md:transition-none ${showMatches ? "pointer-events-none opacity-0" : "opacity-100"}`}>
					<PlayersPanel searchEnabled={true} />
				</div>

				<div className={`absolute inset-0 min-h-0 min-w-0 transition-opacity duration-300 md:static md:pointer-events-auto md:opacity-100 md:transition-none ${showMatches ? "opacity-100" : "pointer-events-none opacity-0"}`}>
					<MatchesPanel searchEnabled={true} />
				</div>
			</div>
		</Layout>
	);
}

export default Home;
