import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import Layout from "../components/Layout";
import TeamPanel from '../components/Team/TeamPanel';
import MatchesPanel from '../components/Match/MatchesPanel';
import TeamELOPanel from '../components/Team/TeamELOPanel';
import NotFound from './NotFound';

function Team() {
    const { TeamID } = useParams<{ TeamID: string }>();
    const [notFound, setNotFound] = useState(false);
    const [hasError, setHasError] = useState(false);
    const handleNotFound = useCallback(() => setNotFound(true), []);
    const handleError = useCallback(() => setHasError(true), []);

    if (TeamID === undefined || TeamID.trim() === "") {
        return <NotFound resource="team" />;
    }

    if (notFound) {
        return <NotFound resource="team" />;
    }

    if (hasError) {
        return <NotFound resource="team" error />;
    }

    return (
        <Layout>
            <div className="flex min-h-0 gap-2 overflow-y-auto md:h-[calc(100dvh_-_6rem_-_2px)]">
                <div className="min-w-0 flex-1">
                    <div>
                        <TeamPanel TeamID={TeamID} onNotFound={handleNotFound} onError={handleError} />
                    </div>
                    
                    <div className="pt-2">
                        <TeamELOPanel TeamID={TeamID} onError={handleError} />
                    </div>

                </div>

                <div className="min-w-0 flex-2">
                    <div>
                        <MatchesPanel TeamID={TeamID} onError={handleError} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Team;
