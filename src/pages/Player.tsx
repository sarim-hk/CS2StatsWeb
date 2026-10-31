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
            <div className="flex min-h-0 flex-col gap-2 overflow-y-auto md:flex-row md:h-[calc(100dvh_-_6rem_-_2px)]">
                <div className="min-w-0 flex-none md:flex-1">
                    <div className="overflow-hidden rounded-sm border border-gray-700 bg-gray-800 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent">
                        <PlayerPanel PlayerID={PlayerID} onNotFound={handleNotFound} onError={handleError} />
                        <div className="border-t border-gray-700 md:border-0 md:pt-2">
                            <PlayerELOPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                        </div>
                    </div>

                    <div className="pt-2">
                        <PlayerWeaponsPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                    </div>

                    <div className="pt-2">
                        <FilterPanel onFilterChange={setFilter} />
                    </div>

                </div>

                <div className="flex min-w-0 flex-none flex-col md:flex-2">
                    <div className="order-2 pt-2 md:order-1 md:pt-0">
                        <MatchesPanel
                            PlayerID={PlayerID}
                            filter={filter}
                            panelSize={544}
                            mobileNaturalHeight
                            onError={handleError}
                        />
                    </div>

                    <div className="order-1 pt-2 md:order-2">
                        <PlayerStatsPanel PlayerID={PlayerID} filter={filter} onError={handleError} />
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Player;
