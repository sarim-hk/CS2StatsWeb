import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import PlayerPanel from "../components/PlayerPanel";
import MatchesPanel from "../components/MatchesPanel";
import PlayerStatsPanel from '../components/PlayerStatsPanel';


function Player() {
    const { PlayerID } = useParams<{ PlayerID: string }>();

    // this doesnt work properly lol - missing player id wont trigger it
    if (!PlayerID) {
        return <div>Player ID is missing.</div>;
    }

    return (
        <Layout>
            <div className="flex gap-4">

                <div className="flex-1">
                    <div className="pb-4"><PlayerPanel PlayerID={PlayerID} /></div>
                    <PlayerStatsPanel PlayerID={PlayerID}/>
                </div>

                <div className="flex-2">
                    <MatchesPanel PlayerID={PlayerID} />
                </div>
                
            </div>
        </Layout>
    );
}

export default Player;
