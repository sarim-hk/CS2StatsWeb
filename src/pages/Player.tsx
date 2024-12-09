import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from "../components/Layout";
import PlayerPanel from '../components/Player/PlayerPanel';
import MatchesPanel from '../components/Match/MatchesPanel';
import PlayerStatsPanel from '../components/Player/PlayerStatsPanel';
import PlayerELOPanel from '../components/Player/PlayerELOPanel';
import FilterPanel from '../components/Player/FilterPanel';

function Player() {
    const { PlayerID } = useParams<{ PlayerID: string }>();
    const [filter, setFilter] = useState<string>("");

    if (PlayerID === undefined || PlayerID.trim() === "") {
        return <div>Player ID is missing.</div>;
    }

    return (
        <Layout>
            <div className="flex gap-4">
                <div className="flex-1">
                    <div>
                        <PlayerPanel PlayerID={PlayerID} />
                    </div>

                    <div className="pt-1">
                        <PlayerELOPanel PlayerID={PlayerID} />
                    </div>

                    <div className="pt-1">
                        <FilterPanel onFilterChange={setFilter} />
                    </div>
                </div>

                <div className="flex-2">
                    <div>
                        <MatchesPanel PlayerID={PlayerID} panelSize={550} />
                    </div>

                    <div className="pt-4">
                        <PlayerStatsPanel PlayerID={PlayerID} filter={filter} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Player;