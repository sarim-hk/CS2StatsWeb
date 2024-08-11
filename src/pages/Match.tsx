import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import MatchPanel from '../components/Match/MatchPanel';

function Match() {
    const { MatchID } = useParams<{ MatchID: string }>();
    const numericalMatchID = Number(MatchID)

    if (!MatchID) {
        return <div>Match ID is missing.</div>;
    }

    return (
        <Layout>
            <div>
                <MatchPanel MatchID={numericalMatchID}/>
            </div>
        </Layout>
    );
}

export default Match;
