import Layout from "./Layout";
import MatchesPanel from "./MatchesPanel";
import PlayersPanel from "./PlayersPanel";

function Home() {
  return (
    <Layout>
      <div className="flex gap-4">
        <div className="flex-2">
          <PlayersPanel />
        </div>
        <div className="flex-5">
          <MatchesPanel />
        </div>
      </div>
    </Layout>
  );
}

export default Home;
