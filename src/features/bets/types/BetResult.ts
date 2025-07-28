import GameScore from './GameScore';

export default interface BetResult {
	gameScore: GameScore | undefined;
	betStatus: string;
}
