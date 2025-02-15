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
        <div className="bg-gray-800">
            <div className="flex flex-col">
                <div className={`${horizontal ? 'flex divide-x divide-gray-700' : 'divide-y divide-gray-700'}`}>
                    <div className={`${horizontal ? 'flex-1' : ''}`}>
                        {Object.entries(timePeriodLabels).map(([period, label]) => (
                            <button
                                key={period}
                                className={`w-full px-2 py-2 text-xs font-medium text-left border-b border-gray-700 last:border-b-0
                                    transition-colors duration-200
                                    ${selectedFilter === period
                                        ? 'bg-green-500/20 text-green-400 border-l-2 border-l-green-500'
                                        : 'text-gray-300 hover:bg-gray-700/50 border-l-2 border-l-transparent'
                                    }`}
                                onClick={() => handleFilterClick(period as TimePeriod)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className={`${horizontal ? 'flex-1' : ''}`}>
                        {Object.entries(matchCountLabels).map(([match, label]) => (
                            <button
                                key={match}
                                className={`w-full px-2 py-2 text-xs font-medium text-left border-b border-gray-700 last:border-b-0
                                    transition-colors duration-200
                                    ${selectedFilter === match
                                        ? 'bg-green-500/20 text-green-400 border-l-2 border-l-green-500'
                                        : 'text-gray-300 hover:bg-gray-700/50 border-l-2 border-l-transparent'
                                    }`}
                                onClick={() => handleFilterClick(match as MatchCount)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-700">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Filter by Map Name"
                            value={mapId}
                            onChange={(e) => setMapId(e.target.value)}
                            className={`w-full px-2 py-1 bg-gray-700/50 text-white text-sm font-medium
                            focus:outline-none transition-all duration-200 hover:bg-gray-700
                            ${mapId.trim() ? "ring-1 ring-green-500/50 bg-green-500/20 text-green-400" : ""}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterPanel;