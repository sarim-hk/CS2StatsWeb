interface PlayerStatsInterface {
    PlayerStatID: number;
    PlayerID: string,
    Username: string,
    Kills: number;
    Headshots: number;
    Assists: number;
    Deaths: number;
    TotalDamage: number;
    UtilityDamage: number;
    RoundsPlayed: number;
}

export default PlayerStatsInterface;