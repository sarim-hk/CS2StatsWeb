interface PlayerInterface {
    PlayerID: string;
    Username: string;
    AvatarS: string;
    AvatarM: string;
    AvatarL: string;
    ELO: number;
    Kills: number;
    Headshots: number;
    Assists: number;
    Deaths: number;
    Damage: number;
    UtilityDamage: number;
    RoundsKAST: number;
    MatchesPlayed: number
}

export default PlayerInterface;