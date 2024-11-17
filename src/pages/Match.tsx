import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Layout from "../components/Layout";
import MatchPanel from '../components/Match/MatchPanel';
import FullMatchInterface from '../interfaces/FullMatchInterface';
import ClutchPanel from '../components/Match/ClutchPanel';

const API_URL = import.meta.env.VITE_API_URL;

function Match() {
    const { MatchID } = useParams<{ MatchID: string }>();
    const [match, setMatch] = useState<FullMatchInterface>();

    useEffect(() => {
        axios
            .get<FullMatchInterface>(`${API_URL}/match_panel_by_match_id?match_id=${MatchID}`)
            .then((response) => setMatch((response.data)))
            .catch((error) => console.error("Error fetching data:", error));
    }, [MatchID]);

    return (
        <Layout>
            <div>
                <MatchPanel Match={match}/>
                <ClutchPanel Match={match}/>
            </div>
        </Layout>
    );
}

export default Match;
