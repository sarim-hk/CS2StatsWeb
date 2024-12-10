import { useState } from 'react';
import Layout from "../components/Layout";
import PlayersPanel from '../components/Player/PlayersPanel';
import BalancerPanel from '../components/Balancer/BalancerPanel';
import FilterPanel from '../components/Player/FilterPanel';
import PlayerInfoInterface from '../interfaces/PlayerInfoInterface';

function Balancer() {
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerInfoInterface[]>([]);
    const [filter, setFilter] = useState<string>("");

    const handlePlayersSelected = (players: PlayerInfoInterface[]) => {
        setSelectedPlayers(players);
    };

    return (
        <Layout>
            <div className="flex gap-4">
                <div className="flex-1">
                    <PlayersPanel
                        selectionEnabled={true}
                        onPlayersSelected={handlePlayersSelected}
                    />
                </div>

                <div className="flex-2">
                    <div>
                        <FilterPanel onFilterChange={setFilter} horizontal={true} />
                    </div>

                    <div className="pt-1">
                        <BalancerPanel
                            selectedPlayers={selectedPlayers}
                            filter={filter}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Balancer;