import Team from '../../admin/teams/types/Team';
import SimpleUser from '../../auth/types/SimpleUser';
import GameResult from './GameResult';

export default interface Bet {
	id: string;
	seasonId: string;
	leagueId: string;
	leagueCode: string;
	createdAt: Date;
	player: SimpleUser;
	matchDay: string;
	homeTeam?: Team;
	awayTeam?: Team;
	betTitle?: string;
	betOdds?: number;
	betSize: number;
	betResultAddedAt?: Date;
	gameResult?: GameResult;
	betStatus: string;
	balanceChange?: number;
	updatedAt?: Date;
	calendarNodeId?: string;
}

export type BetId = Bet['id'];
