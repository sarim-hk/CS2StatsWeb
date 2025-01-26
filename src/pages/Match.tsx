import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Layout from "../components/Layout";
import MatchPanel from '../components/Match/MatchPanel';
import FullMatchInterface from '../interfaces/FullMatchInterface';
import ClutchPanel from '../components/Match/ClutchPanel';
import TeamSelectorPanel from '../components/Match/TeamSelectorPanel';

const API_URL = import.meta.env.VITE_API_URL;

function Match() {
    const { MatchID } = useParams<{ MatchID: string }>();
    const [match, setMatch] = useState<FullMatchInterface>();
    const [selectedTeamId, setSelectedTeamId] = useState<string>();

    useEffect(() => {
        axios
            .get<FullMatchInterface>(`${API_URL}/match_panel_by_match_id?match_id=${MatchID}`)
            .then((response) => {
                setMatch(response.data);
                if (response.data?.Teams) {
                    setSelectedTeamId(Object.keys(response.data.Teams)[0]);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [MatchID]);

    if (!match) {
        return null;
    }

    return (
        <Layout>
            <div>
                <MatchPanel Match={match} />

                <TeamSelectorPanel
                    Match={match}
                    selectedTeamId={selectedTeamId!}
                    onTeamSelect={setSelectedTeamId}
                />

                {selectedTeamId && <ClutchPanel Match={match} TeamID={selectedTeamId} />}


            </div>
        </Layout>
    );
}

export default Match;