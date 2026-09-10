import Layout from "../components/Layout";
import MatchesPanel from "../components/Match/MatchesPanel";
import PlayersPanel from "../components/Player/PlayersPanel";

function Home() {
	return (		
		<Layout>
			<div className="flex gap-2">
				<div className="flex-1">
					<PlayersPanel searchEnabled={true} panelSize={852} />
				</div>

				<div className="flex-2">
					<MatchesPanel searchEnabled={true} panelSize={852} />
				</div>
				
			</div>
		</Layout>
	);
}

export default Home;
