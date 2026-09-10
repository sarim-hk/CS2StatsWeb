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
            <div className="flex min-h-0 gap-2 overflow-y-auto md:h-[calc(100dvh_-_6rem_-_2px)]">
                <div className="min-w-0 flex-1">
                    <div>
                        <TeamPanel TeamID={TeamID} />
                    </div>
                    
                    <div className="pt-2">
                        <TeamELOPanel TeamID={TeamID} />
                    </div>

                </div>

                <div className="min-w-0 flex-2">
                    <div>
                        <MatchesPanel TeamID={TeamID} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Team;
