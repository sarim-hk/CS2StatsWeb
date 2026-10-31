import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient, { isRequestCanceled } from "../apiClient";

import Layout from "../components/Layout";
import MatchPanel from "../components/Match/MatchPanel";
import FullMatchInterface from "../interfaces/FullMatchInterface";
import ClutchPanel from "../components/Match/ClutchPanel";
import TeamSelectorPanel from "../components/Match/TeamSelectorPanel";
import OpeningDuelPanel from "../components/Match/OpeningDuelPanel";
import RatingBreakdownPanel from "../components/Match/RatingBreakdownPanel";
function Match() {
    const { MatchID } = useParams<{ MatchID: string }>();
    const [match, setMatch] = useState<FullMatchInterface>();
    const [selectedTeamId, setSelectedTeamId] = useState<string>();
    const [activePanel, setActivePanel] = useState<"clutch" | "openingduel" | "ratingbreakdown">("clutch");

    useEffect(() => {
        const controller = new AbortController();

        apiClient
            .get<FullMatchInterface>("/match_panel", {
                params: { match_id: MatchID },
                signal: controller.signal,
            })
            .then((response) => {
                setMatch(response.data);
                if (response.data?.Teams) {
                    setSelectedTeamId(Object.keys(response.data.Teams)[0]);
                }
            })
            .catch((error) => {
                if (!isRequestCanceled(error)) {
                    console.error("Error fetching match data:", error);
                }
            });

        return () => controller.abort();
    }, [MatchID]);

    if (!match) {
        return null;
    }

    return (
        <Layout>
            <div className="flex min-h-0 flex-col gap-2 overflow-y-auto md:h-[calc(100dvh_-_6rem_-_2px)]">
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
                        {selectedTeamId && activePanel === "ratingbreakdown" && (
                            <RatingBreakdownPanel Match={match} TeamID={selectedTeamId} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Match;
