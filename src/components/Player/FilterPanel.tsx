import { useState, useEffect, useRef } from "react";

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

type TimePeriod = "7days" | "14days" | "1month" | "3months" | "6months" | "1year";
type MatchCount = "5matches" | "10matches" | "15matches" | "20matches" | "25matches" | "50matches";

type Filter = TimePeriod | MatchCount | null;

interface FilterPanelProps {
    onFilterChange: (filter: string) => void;
}

const timePeriodLabels: { [key in TimePeriod]: string } = {
    "7days": "7 Days",
    "14days": "14 Days",
    "1month": "1 Month",
    "3months": "3 Months",
    "6months": "6 Months",
    "1year": "1 Year",
};

const matchCountLabels: { [key in MatchCount]: string } = {
    "5matches": "5 Matches",
    "10matches": "10 Matches",
    "15matches": "15 Matches",
    "20matches": "20 Matches",
    "25matches": "25 Matches",
    "50matches": "50 Matches",
};

const timePeriods = Object.keys(timePeriodLabels) as TimePeriod[];
const matchCounts = Object.keys(matchCountLabels) as MatchCount[];

function isTimePeriod(value: Filter): value is TimePeriod {
    return value !== null && value in timePeriodLabels;
}

function isMatchCount(value: Filter): value is MatchCount {
    return value !== null && value in matchCountLabels;
}

/** A single compact dropdown that can select from either the time-period or match-count set. */
function FilterDropdown({
    label,
    activeValue,
    options,
    optionLabels,
    onSelect,
}: {
    label: string;
    activeValue: Filter;
    options: (TimePeriod | MatchCount)[];
    optionLabels: Record<string, string>;
    onSelect: (value: Filter) => void;
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = activeValue !== null && activeValue in optionLabels;
    const displayLabel = isActive ? optionLabels[activeValue as string] : label;

    return (
        <div ref={containerRef} className="relative flex-1">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-1.5 whitespace-nowrap px-3 py-1 text-xs font-medium
                    transition-colors duration-200
                    ${isActive
                        ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    }`}
            >
                {displayLabel}
                <ChevronDownIcon
                    className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-10 mt-1 w-full min-w-[9rem] overflow-hidden rounded-sm border border-gray-700 bg-gray-800 shadow-lg">
                    {options.map((option) => {
                        const selected = activeValue === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onSelect(selected ? null : option);
                                    setOpen(false);
                                }}
                                className={`block w-full px-3 py-1.5 text-left text-xs font-medium transition-colors duration-200
                                    ${selected
                                        ? "bg-green-500/20 text-green-400"
                                        : "text-gray-300 hover:bg-gray-700/50"
                                    }`}
                            >
                                {optionLabels[option]}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [selectedFilter, setSelectedFilter] = useState<Filter>(null);
    const [mapId, setMapId] = useState<string>("");

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

    return (
        <div className="bg-gray-800">
            <div className="p-2">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <FilterDropdown
                            label="Time Range"
                            activeValue={isTimePeriod(selectedFilter) ? selectedFilter : null}
                            options={timePeriods}
                            optionLabels={timePeriodLabels}
                            onSelect={setSelectedFilter}
                        />

                        <FilterDropdown
                            label="Match Count"
                            activeValue={isMatchCount(selectedFilter) ? selectedFilter : null}
                            options={matchCounts}
                            optionLabels={matchCountLabels}
                            onSelect={setSelectedFilter}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Filter by Map Name"
                        value={mapId}
                        onChange={(e) => setMapId(e.target.value)}
                        className={`flex-1 px-3 py-1 text-xs font-medium bg-gray-700/50 text-white
                            focus:outline-none transition-colors duration-200 hover:bg-gray-700
                            ${mapId.trim() ? "ring-1 ring-green-500/50 bg-green-500/20 text-green-400" : ""}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default FilterPanel;