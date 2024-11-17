interface ClutchInterface {
    ClutchID: number;
    EnemyCount: number;
    MatchID: number;
    PlayerID: string;
    Result: string;
    RoundID: number;
}

interface DuelInterface {
    DuelID: number;
    LoserID: string;
    MatchID: number;
    RoundID: number;
    WinnerID: string;
}

interface RoundInterface {
    EndTick: number;
    LosingTeamID: string;
    MatchID: number;
    RoundEndReason: number;
    RoundID: number;
    StartTick: number;
    WinningSide: number;
    WinningTeamID: string;
}

interface PlayerInterface {
    PlayerID: string;
    ADR: number;
    Assists: number;
    AvatarL: string;
    Blinds: {
        Count: number;
        TotalDuration: number;
    };
    
    DPR: number;
    Damage: number;
    Deaths: number;
    Headshots: number;
    Impact: number;
    KAST: number;
    KPR: number;
    Kills: number;
    Rating: number;
    Rounds: number;
    Username: string;
    UtilityDamage: number;
}

interface TeamInterface {
    DeltaELO: number;
    MatchID: number;
    Players: {
        [playerId: string]: PlayerInterface;
    };
    Result: string;
    Score: number;
    Side: number;
    TeamID: string;
}

interface FullMatchInterface {
    Clutches: ClutchInterface[];
    Duels: DuelInterface[];
    EndTick: number;
    MapID: string;
    MatchDate: string;
    MatchID: number;
    Rounds: RoundInterface[];
    StartTick: number;
    Teams: {
        [TeamID: string]: TeamInterface;
    };
}

export default FullMatchInterface;
