import { type TouchEvent } from "react";

import Layout from "../components/Layout";
import MatchesPanel from "../components/Match/MatchesPanel";
import SwipeHint from "../components/SwipeHint";
import PlayersPanel from "../components/Player/PlayersPanel";
import useSwipeCarousel from "../useSwipeCarousel";

function Home() {
	const carousel = useSwipeCarousel(2);

	const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
		const touch = event.touches[0];
		if (touch) carousel.startSwipe({ x: touch.clientX, y: touch.clientY });
	};

	const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
		const touch = event.changedTouches[0];
		if (touch) carousel.endSwipe({ x: touch.clientX, y: touch.clientY });
	};

	return (		
		<Layout>
			<div
				className="relative h-[calc(100dvh_-_6rem_-_2px)] min-h-0 touch-pan-y overflow-hidden md:grid md:grid-cols-[1fr_2fr] md:gap-2"
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<div
					className={`absolute inset-0 min-h-0 min-w-0 ${carousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:pointer-events-auto md:translate-x-0 md:transition-none ${carousel.getTransform(0)} ${carousel.activeIndex !== 0 ? "pointer-events-none" : ""}`}
					onTransitionEnd={(event) => {
						if (event.target === event.currentTarget) carousel.finishSlide();
					}}
				>
					<PlayersPanel searchEnabled={true} />
				</div>

				<div
					className={`absolute inset-0 min-h-0 min-w-0 ${carousel.isSliding ? "transition-transform duration-300 ease-out" : "transition-none"} md:static md:pointer-events-auto md:translate-x-0 md:transition-none ${carousel.getTransform(1)} ${carousel.activeIndex !== 1 ? "pointer-events-none" : ""}`}
					onTransitionEnd={(event) => {
						if (event.target === event.currentTarget) carousel.finishSlide();
					}}
				>
					<MatchesPanel searchEnabled={true} />
				</div>

				<SwipeHint
					activeIndex={carousel.activeIndex}
					viewCount={2}
					direction={carousel.direction}
					isSliding={carousel.isSliding}
				/>
			</div>
		</Layout>
	);
}

export default Home;
