import GameResult from './GameResult';

export default interface BetResult {
	gameResult: GameResult | undefined;
	betStatus: string;
}
