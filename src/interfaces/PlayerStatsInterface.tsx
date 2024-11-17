interface PlayerStatsInterface {
    PlayerID: string;
    Kills: number,
    Headshots: number,
    Assists: number,
    DamageAmount: number,
    UtilityDamage: number,
    EnemiesFlashed: number,
    GrenadesThrown: number,
    CLutchAttempts: number,
    DuelWins: number,
    DuelAttempts: number,
    KAST: number,
    Rounds: number,
    ADR: number,
    KPR: number,
    DPR: number
}

export default PlayerStatsInterface;