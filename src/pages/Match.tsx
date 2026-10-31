import { useState } from "react";
import { useParams } from "react-router-dom";
import apiClient, { ApiError } from "../apiClient";
import useApiRequest from "../useApiRequest";

import Layout from "../components/Layout";
import MatchPanel from "../components/Match/MatchPanel";
import FullMatchInterface from "../interfaces/FullMatchInterface";
import ClutchPanel from "../components/Match/ClutchPanel";
import TeamSelectorPanel from "../components/Match/TeamSelectorPanel";
import OpeningDuelPanel from "../components/Match/OpeningDuelPanel";
import RatingBreakdownPanel from "../components/Match/RatingBreakdownPanel";
import NotFound from "./NotFound";
function Match() {
    const { MatchID } = useParams<{ MatchID: string }>();
    const [match, setMatch] = useState<FullMatchInterface>();
    const [selectedTeamId, setSelectedTeamId] = useState<string>();
    const [notFound, setNotFound] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [activePanel, setActivePanel] = useState<"clutch" | "openingduel" | "ratingbreakdown">("clutch");

    useApiRequest<FullMatchInterface>({
        request: (signal) => apiClient.get("/match_panel", {
            params: { match_id: MatchID },
            signal,
        }),
        onSuccess: (data) => {
            setMatch(data);
            if (data.Teams) setSelectedTeamId(Object.keys(data.Teams)[0]);
        },
        onError: (error: ApiError) => {
            if (error.status === 404) setNotFound(true);
            else setHasError(true);
        },
        dependencies: [MatchID],
    });

    if (notFound || !MatchID) {
        return <NotFound resource="match" />;
    }

    if (hasError) {
        return <NotFound resource="match" error />;
    }

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
