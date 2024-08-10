import TeamInterface from "./TeamInterface";

interface FullMatchInterface {
    MatchID: number;
    Map: string;
    MatchDate: string;
    TeamT: TeamInterface;
    TeamCT: TeamInterface;
    TeamTScore: number;
    TeamCTScore: number;
}

export default FullMatchInterface;
