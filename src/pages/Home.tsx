import Layout from "../components/Layout";
import MatchesPanel from "../components/Match/MatchesPanel";
import PlayersPanel from "../components/Player/PlayersPanel";

function Home() {
	return (		
		<Layout>
			<div className="flex gap-2">
				<div className="flex-1">
					<PlayersPanel searchEnabled={true} />
				</div>

				<div className="flex-2">
					<MatchesPanel searchEnabled={true} />
				</div>
				
			</div>
		</Layout>
	);
}

export default Home;
