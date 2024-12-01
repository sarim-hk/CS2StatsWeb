import { useState } from "react";

type TimePeriod = "7days" | "14days" | "1month" | "3months" | "6months" | "1year";
type MatchCount = "5matches" | "10matches" | "15matches" | "20matches" | "25matches" | "50matches" | "100matches";

type Filter = TimePeriod | MatchCount | null;

interface FilterPanelProps {
    onFilterChange: (filter: string) => void;
}

function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [selectedFilter, setSelectedFilter] = useState<Filter>(null);
    const [mapId, setMapId] = useState<string>("");
    const [pendingMapId, setPendingMapId] = useState<string>("");

    const timePeriodLabels: { [key in TimePeriod]: string } = {
        "7days": "7 Days",
        "14days": "14 Days",
        "1month": "1 Month",
        "3months": "3 Months",
        "6months": "6 Months",
        "1year": "1 Year"
    };

    const matchCountLabels: { [key in MatchCount]: string } = {
        "5matches": "5 Matches",
        "10matches": "10 Matches",
        "15matches": "15 Matches",
        "20matches": "20 Matches",
        "25matches": "25 Matches",
        "50matches": "50 Matches",
        "100matches": "100 Matches"
    };

    const handleFilterClick = (filter: Filter) => {
        const newFilter = selectedFilter === filter ? null : filter;
        setSelectedFilter(newFilter);
        generateAndApplyFilter(newFilter, mapId);
    };

    const generateAndApplyFilter = (filter: Filter, currentMapId: string) => {
        let generatedFilter = "";

        if (filter) {
            generatedFilter += `range=${filter}&`;
        }

        if (currentMapId.trim()) {
            generatedFilter += `map_id=${currentMapId}&`;
        }

        onFilterChange(generatedFilter.replace(/&$/, ""));
    };

    const handleMapSearch = () => {
        setMapId(pendingMapId);
        generateAndApplyFilter(selectedFilter, pendingMapId);
    };

    return (
        <div className="p-1 bg-gray-800">
            <div className="bg-gray-700 p-1">
                <div className="flex flex-col p-1 bg-gray-600">
                    {["7days", "14days", "1month", "3months", "6months", "1year"].map((period) => (
                        <button
                            key={period}
                            className={`flex p-1 m-0.5 ml-0 mr-0 text-xs bg-gray-700
                                ${selectedFilter === period
                                    ? "border border-green-500 ring-1 ring-green-500"
                                    : "border border-transparent"}`}
                            onClick={() => handleFilterClick(period as TimePeriod)}
                        >
                            {timePeriodLabels[period as TimePeriod]}
                        </button>
                    ))}

                    <div className="p-1"></div>

                    {["5matches", "10matches", "15matches", "20matches", "25matches", "50matches", "100matches"].map((match) => (
                        <button
                            key={match}
                            className={`flex p-1 m-0.5 ml-0 mr-0 text-xs bg-gray-700
                                ${selectedFilter === match
                                    ? "border border-green-500 ring-1 ring-green-500"
                                    : "border border-transparent"}`}
                            onClick={() => handleFilterClick(match as MatchCount)}
                        >
                            {matchCountLabels[match as MatchCount]}
                        </button>
                    ))}

                    <div className="flex items-center mt-1">
                        <input
                            type="text"
                            placeholder="Enter Map Name"
                            value={pendingMapId}
                            onChange={(e) => setPendingMapId(e.target.value)}
                            className="flex-grow p-1 bg-gray-700 text-white text-xs 
                                border border-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 mr-2"
                        />

                        <button
                            onClick={handleMapSearch}
                            className="bg-gray-700 text-white text-xs px-3 py-1 border border-gray-500 focus:outline-none">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterPanel;