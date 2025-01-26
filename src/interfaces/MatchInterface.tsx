interface Match {
    MatchID: number;
    MapID: string;
    MatchDate: string;
    WinningTeamID: string;
    WinningTeamName: string;
    LosingTeamID: string;
    LosingTeamName: string;
    WinningTeamScore: number;
    LosingTeamScore: number;
    WinningSide: number;
    WinningDeltaELO: number;
    LosingDeltaELO: number;
    }

export default Match;