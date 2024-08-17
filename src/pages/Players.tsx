import Layout from "../components/Layout";
import PlayersPanel from "../components/Player/PlayersPanel";

function Players() {
    return (
        <Layout>
            <div className="flex gap-4">
                <div className="flex-1">
                    <PlayersPanel />
                </div>
            </div>
        </Layout>
    );
}

export default Players;
