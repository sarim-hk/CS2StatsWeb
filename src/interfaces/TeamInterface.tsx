import PlayerStatsInterface from "./PlayerStatsInterface";

interface TeamInterface {
    TeamID: number;
    Players: PlayerStatsInterface[];
}

export default TeamInterface;