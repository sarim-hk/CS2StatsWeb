import { useState, useEffect } from "react";

type TimePeriod = "7days" | "14days" | "1month" | "3months" | "6months" | "1year";
type MatchCount = "5matches" | "10matches" | "15matches" | "20matches" | "25matches" | "50matches";

type Filter = TimePeriod | MatchCount | null;

interface FilterPanelProps {
    onFilterChange: (filter: string) => void;
    horizontal?: boolean;
}

function FilterPanel({ onFilterChange, horizontal = false }: FilterPanelProps) {
    const [selectedFilter, setSelectedFilter] = useState<Filter>(null);
    const [mapId, setMapId] = useState<string>("");

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
    };

    useEffect(() => {
        let generatedFilter = "";

        if (selectedFilter) {
            generatedFilter += `range=${selectedFilter}&`;
        }

        if (mapId.trim()) {
            generatedFilter += `map_id=${mapId}&`;
        }

        onFilterChange(generatedFilter.replace(/&$/, ""));
    }, [selectedFilter, mapId, onFilterChange]);

    const handleFilterClick = (filter: Filter) => {
        setSelectedFilter(prevFilter => prevFilter === filter ? null : filter);
    };

    return (
        <div className={`p-1 bg-gray-800 ${horizontal ? 'flex flex-col' : ''}`}>
            <div className={`flex ${horizontal ? 'flex-row' : 'flex-col'}`}>
                <div className={`bg-gray-700 p-1 ${horizontal ? 'flex-grow mr-1' : ''}`}>
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
                    </div>
                </div>

                <div className={`bg-gray-700 p-1 ${horizontal ? 'flex-grow ml-1' : ''}`}>
                    <div className="flex flex-col p-1 bg-gray-600">
                        {["5matches", "10matches", "15matches", "20matches", "25matches", "50matches"].map((match) => (
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
                    </div>
                </div>
            </div>

            {horizontal && (
                <div className="bg-gray-700 p-1 mt-1">
                    <div className="bg-gray-600 p-1">
                        <input
                            type="text"
                            placeholder="Enter Map Name"
                            value={mapId}
                            onChange={(e) => setMapId(e.target.value)}
                            className={`w-full p-1 bg-gray-700 text-white text-xs 
                                border border-gray-500 focus:outline-none
                                ${mapId.trim() ? "border-green-500 ring-1 ring-green-500" : ""}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterPanel;