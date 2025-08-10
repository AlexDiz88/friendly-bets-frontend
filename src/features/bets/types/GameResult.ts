import GameScore from './GameScore';

export default interface GameResult {
	leagueId: string;
	homeTeamId: string;
	awayTeamId: string;
	gameScore: GameScore;
}
