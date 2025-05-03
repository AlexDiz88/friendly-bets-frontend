import Bet from '../../../bets/types/Bet';

export default interface LeagueMatchdayNode {
	leagueId: string;
	leagueCode: string;
	matchDay: string;
	betCountLimit: number;
	bets: Bet[];
}
