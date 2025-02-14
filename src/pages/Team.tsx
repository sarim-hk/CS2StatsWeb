import { useParams } from "react-router-dom";
import Layout from "../components/Layout";

function Team() {
    const { TeamID } = useParams<{ TeamID: string }>();

    return (
        <Layout>
            <div className="flex gap-2">
                <div className="flex-1">
                    WIP!!! {TeamID}
                </div>

                <div className="flex-2">
                    WIP!!! {TeamID}
                </div>

            </div>
        </Layout>
    );
}

export default Team;