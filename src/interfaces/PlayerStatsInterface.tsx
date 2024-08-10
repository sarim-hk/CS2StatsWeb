interface PlayerStatsInterface {
    PlayerStatID: number;
    PlayerID: string,
    Kills: number;
    Headshots: number;
    Assists: number;
    Deaths: number;
    TotalDamage: number;
    UtilityDamage: number;
    RoundsPlayed: number;
}

export default PlayerStatsInterface;