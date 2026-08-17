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
    MatchResult: "Win" | "Loss" | "Tie" | null;
    }

export default Match;