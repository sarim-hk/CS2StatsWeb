import { Link } from "react-router-dom";

import Layout from "../components/Layout";

interface NotFoundProps {
    resource?: "page" | "match" | "team" | "player";
    error?: boolean;
}

const resourceLabels = {
    page: "page",
    match: "match",
    team: "team",
    player: "player",
} as const;

function NotFound({ resource = "page", error = false }: NotFoundProps) {
    const label = resourceLabels[resource];

    return (
        <Layout>
            <section className="flex min-h-[calc(100dvh_-_6rem_-_2px)] items-center justify-center px-4 py-12 text-center">
                <div className="max-w-md rounded-sm border border-gray-700 bg-gray-800 p-8 shadow-xl">
                    <p className="text-6xl font-semibold tracking-tight text-green-400">404</p>
                    <h1 className="mt-4 text-xl font-semibold text-gray-200">
                        {error
                            ? `Unable to load ${label}`
                            : label === "page"
                                ? "Page not found"
                                : `${label[0].toUpperCase()}${label.slice(1)} not found`}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        {error
                            ? "Something went wrong while loading this resource. Please try again later."
                            : label === "page"
                            ? "The page you are looking for does not exist or may have been moved."
                            : `We couldn't find that ${label}. Check the ID and try again.`}
                    </p>
                    <Link
                        to="/"
                        className="mt-6 inline-flex rounded-sm bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400 ring-1 ring-green-500/50 transition-colors hover:bg-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Back to home
                    </Link>
                </div>
            </section>
        </Layout>
    );
}

export default NotFound;
