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
            <div className="flex min-h-0 flex-col gap-2 overflow-y-auto md:flex-row md:h-[calc(100dvh_-_6rem_-_2px)]">
                <div className="min-w-0 flex-none md:flex-1">
                    <div className="overflow-hidden rounded-sm border border-gray-700 bg-gray-800 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent">
                        <TeamPanel TeamID={TeamID} onNotFound={handleNotFound} onError={handleError} />
                        <div className="border-t border-gray-700 md:border-0 md:pt-2">
                            <TeamELOPanel TeamID={TeamID} onError={handleError} />
                        </div>
                    </div>

                </div>

                <div className="min-w-0 flex-none md:flex-2">
                    <MatchesPanel TeamID={TeamID} onError={handleError} />
                </div>
            </div>
        </Layout>
    );
}

export default Team;
