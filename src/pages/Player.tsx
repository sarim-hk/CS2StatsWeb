import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import PlayerPanel from '../components/Player/PlayerPanel';
import MatchesPanel from '../components/Match/MatchesPanel';

function Player() {
    const { PlayerID } = useParams<{ PlayerID: string }>();

    if (PlayerID === undefined || PlayerID.trim() === "") {
        return <div>Player ID is missing.</div>;
    }

    return (
        <Layout>
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="pb-4"><PlayerPanel PlayerID={PlayerID} /></div>
                </div>

                <div className="flex-2">
                    <MatchesPanel PlayerID={PlayerID} panelSize={350} />
                </div>
            </div>
        </Layout>
    );
}

export default Player;
