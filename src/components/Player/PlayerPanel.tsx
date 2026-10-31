import { useState } from 'react';
import apiClient, { ApiError } from '../../apiClient';
import useApiRequest from '../../useApiRequest';
import PlayerInfoInterface from '../../interfaces/PlayerInfoInterface';
import { ui } from '../ui';

interface PlayerPanelProps {
    PlayerID: string;
    onNotFound?: () => void;
    onError?: () => void;
}

function PlayerPanel({ PlayerID, onNotFound, onError }: PlayerPanelProps) {
    const [player, setPlayer] = useState<PlayerInfoInterface>();

    useApiRequest<PlayerInfoInterface>({
        request: (signal) => apiClient.get("/player_panel", {
            params: { player_id: PlayerID },
            signal,
        }),
        onSuccess: setPlayer,
        onError: (error: ApiError) => {
            if (error.status === 404) onNotFound?.();
            else onError?.();
        },
        dependencies: [PlayerID],
    });

    return (
        <div className={ui.panelFlat}>
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <a
                        href={`https://steamcommunity.com/profiles/${PlayerID}`}
                        className="flex items-center gap-4 flex-1"
                    >
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
        </div>
    );
}

export default PlayerPanel;
