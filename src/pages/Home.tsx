import Layout from "../components/Layout";
import MatchesPanel from "../components/Match/MatchesPanel";
import PlayersPanel from "../components/Player/PlayersPanel";

function Home() {
	return (		
		<Layout>
			<div className="grid min-h-0 grid-cols-1 gap-2 overflow-hidden md:grid-cols-[1fr_2fr] md:h-[calc(100dvh_-_6rem_-_2px)]">
				<div className="min-h-0 min-w-0">
					<PlayersPanel searchEnabled={true} />
				</div>

				<div className="min-h-0 min-w-0">
					<MatchesPanel searchEnabled={true} />
				</div>
				
			</div>
		</Layout>
	);
}

export default Home;
