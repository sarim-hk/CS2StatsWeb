interface Player {
    ADR: number;
    Assists: number;
    Deaths: number;
    Health: number;
    Kills: number;
    Money: number;
    Username: string;
    PlayerID: string;
}

interface LiveMatchInterface {
    TPlayers: Player[];
    CTPlayers: Player[];
    TScore: number;
    CTScore: number;
    BombStatus: number;
    MapID: string;
    InsertDate: number;
}

export default LiveMatchInterface;
