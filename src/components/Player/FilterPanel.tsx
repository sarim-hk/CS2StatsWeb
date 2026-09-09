import { useState, useEffect } from "react";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
        </svg>
    );
}

interface DateRange {
    start: Date | null;
    end: Date | null;
}

interface FilterPanelProps {
    onFilterChange: (filter: string) => void;
}

const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const datePresets = [
    { key: "7days", label: "7 Days" },
    { key: "1month", label: "1 Month" },
    { key: "3months", label: "3 Months" },
    { key: "6months", label: "6 Months" },
    { key: "1year", label: "1 Year" },
] as const;

type DatePreset = (typeof datePresets)[number]["key"];

function sameDay(first: Date | null, second: Date | null) {
    return Boolean(
        first &&
            second &&
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate(),
    );
}

function formatDateForFilter(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function DateRangePicker({
    value,
    mapId,
    onChange,
    onMapIdChange,
}: {
    value: DateRange;
    mapId: string;
    onChange: (range: DateRange) => void;
    onMapIdChange: (value: string) => void;
}) {
    const [activePreset, setActivePreset] = useState<DatePreset | null>(null);
    const [visibleMonth, setVisibleMonth] = useState(() => {
        const date = value.start ?? new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });

    function selectPreset(preset: DatePreset) {
        const end = new Date();
        end.setHours(0, 0, 0, 0);

        const start = new Date(end);
        if (preset === "7days") {
            start.setDate(start.getDate() - 6);
        } else {
            const months = preset === "1month" ? 1 : preset === "3months" ? 3 : preset === "6months" ? 6 : 12;
            const targetMonth = start.getMonth() - months;
            const targetYear = start.getFullYear() + Math.floor(targetMonth / 12);
            const normalizedMonth = ((targetMonth % 12) + 12) % 12;
            const lastDayOfTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
            start.setFullYear(targetYear, normalizedMonth, Math.min(start.getDate(), lastDayOfTargetMonth));
        }

        setActivePreset(preset);
        setVisibleMonth(new Date(start.getFullYear(), start.getMonth(), 1));
        onChange({ start, end });
    }

    const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: 35 }, (_, index) => {
        const currentMonth = index < daysInMonth;
        return {
            date: currentMonth
                ? new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1)
                : new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, index - daysInMonth + 1),
            currentMonth,
        };
    });
    function selectDate(date: Date) {
        if (!value.start || value.end || date < value.start) {
            setActivePreset(null);
            onChange({ start: date, end: null });
            return;
        }

        setActivePreset(null);
        onChange({ start: value.start, end: date });
    }

    return (
        <div className="flex-1 min-w-0">
            <div className="w-full rounded-sm border border-gray-700 bg-gray-800 p-2 shadow-lg">

                    <div className="mb-2 flex items-center justify-between">
                        <button
                            type="button"
                            aria-label="Previous month"
                            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
                            className="p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
                        >
                            <ChevronIcon direction="left" />
                        </button>
                        <span className="text-xs font-medium text-gray-300">{monthFormatter.format(visibleMonth)}</span>
                        <button
                            type="button"
                            aria-label="Next month"
                            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
                            className="p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
                        >
                            <ChevronIcon direction="right" />
                        </button>
                    </div>

                    <div className="mb-2 flex flex-wrap gap-1">
                        {datePresets.map((preset) => (
                            <button
                                key={preset.key}
                                type="button"
                                onClick={() => selectPreset(preset.key)}
                                className={`flex-1 whitespace-nowrap px-1.5 py-1 text-[10px] font-medium transition-colors ${
                                    activePreset === preset.key
                                        ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/50"
                                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                                }`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1.5 text-center">
                        {days.map(({ date, currentMonth }) => {
                            const inRange = Boolean(value.start && value.end && date > value.start && date < value.end);
                            const selected = sameDay(date, value.start) || sameDay(date, value.end);
                            return (
                                <button
                                    key={date.toISOString()}
                                    type="button"
                                    onClick={() => selectDate(date)}
                                    className={`h-6 text-xs transition-colors ${
                                        selected
                                            ? "bg-green-500 font-semibold text-gray-900"
                                            : inRange
                                                ? "bg-green-500/20 text-green-300"
                                                : currentMonth
                                                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                                    : "text-gray-600 hover:bg-gray-700 hover:text-gray-400"
                                    }`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 border-t border-gray-700 pt-2">
                        <input
                            type="text"
                            placeholder="Filter by Map Name"
                            value={mapId}
                            onChange={(event) => onMapIdChange(event.target.value)}
                            className={`min-w-0 flex-1 px-3 py-1 text-xs font-medium bg-gray-700/50 text-white
                                focus:outline-none transition-colors duration-200 hover:bg-gray-700
                                ${mapId.trim() ? "ring-1 ring-green-500/50 bg-green-500/20 text-green-400" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setActivePreset(null);
                                onChange({ start: null, end: null });
                                onMapIdChange("");
                            }}
                            disabled={!value.start && !mapId.trim()}
                            className="text-[10px] font-medium text-gray-400 transition-colors hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Clear
                        </button>
                    </div>
            </div>
        </div>
    );
}

function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
    const [mapId, setMapId] = useState<string>("");

    useEffect(() => {
        let generatedFilter = "";

        if (dateRange.start && dateRange.end) {
            generatedFilter += `range=${formatDateForFilter(dateRange.start)},${formatDateForFilter(dateRange.end)}&`;
        }

        if (mapId.trim()) {
            generatedFilter += `map_id=${mapId}&`;
        }

        onFilterChange(generatedFilter.replace(/&$/, ""));
    }, [dateRange, mapId, onFilterChange]);

    return (
        <div className="bg-gray-800">
            <div className="p-2">
                <div className="flex flex-col gap-2">
                    <DateRangePicker
                        value={dateRange}
                        mapId={mapId}
                        onChange={setDateRange}
                        onMapIdChange={setMapId}
                    />
                </div>
            </div>
        </div>
    );
}

export default FilterPanel;
