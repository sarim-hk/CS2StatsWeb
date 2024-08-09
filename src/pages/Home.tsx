import Layout from "../components/Layout";
import MatchesPanel from "../components/MatchesPanel";
import PlayersPanel from "../components/PlayersPanel";


function Home() {
  return (
    <Layout>
      <div className="flex gap-4">
        <div className="flex-1">
          <PlayersPanel />
        </div>
        <div className="flex-2">
          <MatchesPanel/>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
