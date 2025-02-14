import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Layout from "../components/Layout";
import MatchPanel from "../components/Match/MatchPanel";
import FullMatchInterface from "../interfaces/FullMatchInterface";
import ClutchPanel from "../components/Match/ClutchPanel";
import TeamSelectorPanel from "../components/Match/TeamSelectorPanel";
import OpeningDuelPanel from "../components/Match/OpeningDuelPanel";

const API_URL = import.meta.env.VITE_API_URL;

function Match() {
    const { MatchID } = useParams<{ MatchID: string }>();
    const [match, setMatch] = useState<FullMatchInterface>();
    const [selectedTeamId, setSelectedTeamId] = useState<string>();
    const [activePanel, setActivePanel] = useState<"clutch" | "openingduel">("clutch");

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
            <div className="flex gap-4 flex-col">
                <div className="bg-gray-800">
                    <MatchPanel Match={match} />
                </div>

                <div className="bg-gray-800 p-1">
                    <div>
                        <TeamSelectorPanel
                            Match={match}
                            selectedTeamId={selectedTeamId!}
                            onTeamSelect={setSelectedTeamId}
                            activePanel={activePanel}
                            onPanelChange={setActivePanel}
                        />
                    </div>

                    <div className="pt-1">
                        {selectedTeamId && activePanel === "clutch" && (
                            <ClutchPanel Match={match} TeamID={selectedTeamId} />
                        )}
                        {selectedTeamId && activePanel === "openingduel" && (
                            <OpeningDuelPanel Match={match} TeamID={selectedTeamId} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Match;