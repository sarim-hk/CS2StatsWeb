interface CompletePlayerStatsInterface {
    [playerID: string]: FullPlayerStatsInterface;
}

interface FullPlayerStatsInterface {
    Overall: PlayerStatsInterface;
    Terrorist: PlayerStatsInterface;
    CounterTerrorist: PlayerStatsInterface;
    MatchesPlayed: number;
    MatchesWon: number;
}

interface PlayerStatsInterface {
    PlayerID: string;
    Kills: number;
    Headshots: number;
    Assists: number;
    Damage: number;
    UtilityDamage: number;
    Blinds: {
        Count: number;
        TotalDuration: number;
    };
    Deaths: number;
    KAST: number;
    ADR: number;
    KPR: number;
    APR: number;
    DPR: number;
    Rating: number;
    Impact: number;
    RoundsPlayed: number;
}

export default CompletePlayerStatsInterface;
