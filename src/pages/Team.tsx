import { useParams } from 'react-router-dom';

import Layout from "../components/Layout";
import TeamPanel from '../components/Team/TeamPanel';
import MatchesPanel from '../components/Match/MatchesPanel';
import TeamELOPanel from '../components/Team/TeamELOPanel';

function Team() {
    const { TeamID } = useParams<{ TeamID: string }>();

    if (TeamID === undefined || TeamID.trim() === "") {
        return <div>Team ID is missing.</div>;
    }

    return (
        <Layout>
            <div className="flex gap-2">
                <div className="flex-1">
                    <div>
                        <TeamPanel TeamID={TeamID} />
                    </div>
                    

                    <div className="pt-2">
                        <TeamELOPanel TeamID={TeamID} />
                    </div>

                </div>

                <div className="flex-2">
                    <div>
                        <MatchesPanel TeamID={TeamID} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Team;