import { useEffect, useState } from 'react';
import axios from 'axios';
import PlayerInfoInterface from '../../interfaces/PlayerInfoInterface';

const API_URL = import.meta.env.VITE_API_URL;

interface PlayerPanelProps {
    PlayerID: string;
}

function getPreviousWeek(date: Date): number {
    const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNumber = (currentDate.getUTCDay() + 6) % 7;
    currentDate.setUTCDate(currentDate.getUTCDate() - dayNumber + 3);
    const firstThursday = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 4));
    const weekNumber = Math.round(((currentDate.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7 + 1);

    return weekNumber === 1 ? 52 : weekNumber - 1;
}

function interpolateColor(color1: string, color2: string, factor: number): string {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getWeekGradient(week: number): { from: string, to: string } {
    const colorSections = [
        { start: 1, end: 5, from: '#8B0000', to: '#800080' },     // Dark Red/Garnet to Purple/Amethyst
        { start: 5, end: 9, from: '#800080', to: '#7FFFD4' },     // Purple/Amethyst to Light Blue/Aquamarine
        { start: 9, end: 13, from: '#7FFFD4', to: '#C0C0C0' },    // Light Blue/Aquamarine to Silver/Diamond
        { start: 13, end: 17, from: '#C0C0C0', to: '#50C878' },   // Silver/Diamond to Green/Emerald
        { start: 17, end: 22, from: '#50C878', to: '#9370DB' },   // Green/Emerald to Light Purple/Alexandrite
        { start: 22, end: 26, from: '#9370DB', to: '#FF0000' },   // Light Purple/Alexandrite to Red/Ruby
        { start: 26, end: 30, from: '#FF0000', to: '#90EE90' },   // Red/Ruby to Light Green/Peridot
        { start: 30, end: 35, from: '#90EE90', to: '#00008B' },   // Light Green/Peridot to Deep Blue/Sapphire
        { start: 35, end: 39, from: '#00008B', to: '#FFC0CB' },   // Deep Blue/Sapphire to Pink/Opal
        { start: 39, end: 43, from: '#FFC0CB', to: '#FFD700' },   // Pink/Opal to Yellow/Citrine
        { start: 43, end: 48, from: '#FFD700', to: '#40E0D0' },   // Yellow/Citrine to Turquoise/Blue Topaz
        { start: 48, end: 53, from: '#40E0D0', to: '#8B0000' }    // Turquoise/Blue Topaz back to Dark Red/Garnet
    ];

    const section = colorSections.find(s => week >= s.start && week < s.end);

    if (!section) {
        return {
            from: '#3f5a8c',
            to: '#9B1A9B'
        };
    }

    const factor = (week - section.start) / (section.end - section.start);

    return {
        from: interpolateColor(section.from, section.to, factor),
        to: interpolateColor(section.to, section.from, factor)
    };
}

function PlayerPanel({ PlayerID }: PlayerPanelProps) {
    const [player, setPlayer] = useState<PlayerInfoInterface>();
    const [week, setWeek] = useState<number>(0);
    const [gradient, setGradient] = useState<{ from: string, to: string }>({
        from: '#3f5a8c',
        to: '#9B1A9B'
    });

    useEffect(() => {
        axios
            .get<PlayerInfoInterface>(`${API_URL}/player_panel_by_player_id?player_id=${PlayerID}`)
            .then((response) => {
                setPlayer(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    }, [PlayerID]);

    useEffect(() => {
        const previousWeek = getPreviousWeek(new Date());
        setWeek(previousWeek);
        setGradient(getWeekGradient(previousWeek));
    }, []);

    return (
        <div className="bg-gray-800">
            {(player?.WeekPosition == null || player?.WeekPosition > 3) ? (
                <div className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        <a href={`https://steamcommunity.com/profiles/${PlayerID}`} 
                           className="flex items-center gap-4 flex-1">
                            <div className="relative">
                                <img
                                    className="h-24 w-24 object-cover border-2 border-gray-700 hover:border-gray-600 transition-colors"
                                    src={player?.AvatarL}
                                    alt={player?.Username}
                                />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="font-medium text-xl text-gray-300 truncate">
                                    {player?.Username}
                                </div>
                                <div className="text-base font-medium text-gray-300 mt-1.5">
                                    <span className="bg-gray-700/50 px-3 py-1">
                                        ELO: {player?.ELO}
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            ) : (
                <div className="flex p-1 bg-gray-600 items-center">
                    <div
                        style={{
                            background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})`
                        }}
                        className="overflow-hidden relative w-80 h-80 flex justify-center items-center outline outline-2 shadow-[0_0_25px_#FFFFFF]"
                    >
                        <div className="absolute top-4 text-xs text-white">
                            {player?.ELO} ELO
                        </div>

                        <div className="absolute top-8 text-white text-4xl font-semibold drop-shadow-[0_1px_1px_#000000]">
                            Week {week}
                        </div>

                        <div className="absolute inset-0 pattern">
                            <img
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 object-contain outline outline-2"
                                src={player?.AvatarL}
                            />
                        </div>

                        <div className="absolute inset-0">
                            <img
                                className="absolute top-1/2 left-1/2 transform -translate-x-2 -translate-y-16 object-contain w-48 h-48"
                                src="https://i.imgur.com/OjaNoWp.png"
                            />
                        </div>

                        {player?.WeekPosition === 1 && (
                            <div className="absolute text-6xl font-bold bottom-4 gold-text drop-shadow-[0_3px_3px_#000000]">
                                #1
                            </div>
                        )}
                        {player?.WeekPosition === 2 && (
                            <div className="absolute text-6xl font-bold bottom-4 silver-text drop-shadow-[0_3px_3px_#000000]">
                                #2
                            </div>
                        )}
                        {player?.WeekPosition === 3 && (
                            <div className="absolute text-6xl font-bold bottom-4 bronze-text drop-shadow-[0_3px_3px_#000000]">
                                #3
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayerPanel;