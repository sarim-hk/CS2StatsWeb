import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Layout from "../components/Layout";
import PlayerPanel from '../components/Player/PlayerPanel';
import MatchesPanel from '../components/Match/MatchesPanel';
import PlayerStatsPanel from '../components/Player/PlayerStatsPanel';
import PlayerELOPanel from '../components/Player/PlayerELOPanel';
import FilterPanel from '../components/Player/FilterPanel';
import PlayerWeaponsPanel from '../components/Player/PlayerWeaponsPanel';

function Player() {
    const { PlayerID } = useParams<{ PlayerID: string }>();
    const [filter, setFilter] = useState<string>("");

    if (PlayerID === undefined || PlayerID.trim() === "") {
        return <div>Player ID is missing.</div>;
    }

    return (
        <Layout>
            <div className="flex gap-2">
                <div className="flex-1">
                    <div>
                        <PlayerPanel PlayerID={PlayerID} />
                    </div>

                    <div className="pt-2">
                        <PlayerELOPanel PlayerID={PlayerID} filter={filter} />
                    </div>

                    <div className="pt-2">
                        <PlayerWeaponsPanel PlayerID={PlayerID} filter={filter} />
                    </div>

                    <div className="pt-2">
                        <FilterPanel onFilterChange={setFilter} />
                    </div>

                </div>

                <div className="flex-2">
                    <div>
                        <MatchesPanel PlayerID={PlayerID} filter={filter} panelSize={544} />
                    </div>

                    <div className="pt-2">
                        <PlayerStatsPanel PlayerID={PlayerID} filter={filter} />
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Player;
