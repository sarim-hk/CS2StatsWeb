interface CompletePlayerStatsInterface {
    Overall: PlayerStatsInterface;
    Terrorist: PlayerStatsInterface;
    CounterTerrorist: PlayerStatsInterface;
}

interface PlayerStatsInterface {
    PlayerID: string;
    Kills: number;
    Headshots: number;
    Assists: number;
    DamageAmount: number;
    UtilityDamage: number;
    EnemiesFlashed: number;
    GrenadesThrown: number;
    ClutchAttempts: number;
    DuelWins: number;
    DuelAttempts: number;
    Deaths: number;
    KAST: number;
    Rounds: number;
    ADR: number;
    KPR: number;
    APR: number;
    DPR: number;
    Rating: number;
    Impact: number;
}

export default CompletePlayerStatsInterface;
