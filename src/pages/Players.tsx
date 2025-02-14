import Layout from "../components/Layout";
import PlayersPanel from "../components/Player/PlayersPanel";

function Players() {
    return (
        <Layout>
            <div className="flex">
                <div className="flex-1">
                    <PlayersPanel searchEnabled={true} />
                </div>
            </div>
        </Layout>
    );
}

export default Players;
