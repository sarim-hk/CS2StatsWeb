import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import Layout from "../components/Layout";
import PlayerPanel from '../components/Player/PlayerPanel';
import MatchesPanel from '../components/Match/MatchesPanel';
import PlayerStatsPanel from '../components/Player/PlayerStatsPanel';
import PlayerELOPanel from '../components/Player/PlayerELOPanel';
import FilterPanel from '../components/Player/FilterPanel';
import PlayerWeaponsPanel from '../components/Player/PlayerWeaponsPanel';
import NotFound from './NotFound';

function Player() {
    const { PlayerID } = useParams<{ PlayerID: string }>();
    const [filter, setFilter] = useState<string>("");
    const [notFound, setNotFound] = useState(false);
    const [hasError, setHasError] = useState(false);
    const handleNotFound = useCallback(() => setNotFound(true), []);
    const handleError = useCallback(() => setHasError(true), []);

    if (PlayerID === undefined || PlayerID.trim() === "") {
        return <NotFound resource="player" />;
    }

    if (notFound) {
        return <NotFound resource="player" />;
    }

    if (hasError) {
        return <NotFound resource="player" error />;
    }

    return (
        <Layout>
            <div className="flex min-h-0 gap-2 overflow-y-auto md:h-[calc(100dvh_-_6rem_-_2px)]">
                <div className="min-w-0 flex-1">
                    <div>
                        <PlayerPanel PlayerID={PlayerID} onNotFound={handleNotFound} onError={handleError} />
                    </div>

                    <div className="pt-2">
                        <PlayerELOPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                    </div>

                    <div className="pt-2">
                        <PlayerWeaponsPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                    </div>

                    <div className="pt-2">
                        <FilterPanel onFilterChange={setFilter} />
                    </div>

                </div>

                <div className="min-w-0 flex-2">
                    <div>
                        <MatchesPanel PlayerID={PlayerID} filter={filter} panelSize={544} onError={handleError} />
                    </div>

                    <div className="pt-2">
                        <PlayerStatsPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Player;
