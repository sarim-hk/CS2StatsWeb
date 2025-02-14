import Layout from "../components/Layout";
import MatchesPanel from "../components/Match/MatchesPanel";

function Matches() {
    return (
        <Layout>
            <div className="flex">
                <div className="flex-1">
                    <MatchesPanel fullscreen={true} searchEnabled={true} />
                </div>
            </div>
        </Layout>
    );
}

export default Matches;
