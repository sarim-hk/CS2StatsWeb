import Layout from "../components/Layout";
import MatchesPanel from "../components/Match/MatchesPanel";

function Matches() {
    return (
        <Layout>
            <div className="flex gap-4">
                <div className="flex-1">
                    <MatchesPanel fullscreen={true} />
                </div>
            </div>
        </Layout>
    );
}

export default Matches;
