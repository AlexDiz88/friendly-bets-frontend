import Team from '../../admin/teams/types/Team';
import SimpleUser from '../../auth/types/SimpleUser';
import BetTitle from './BetTitle';
import GameScore from './GameScore';

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
	betTitle?: BetTitle;
	betOdds?: number;
	betSize: number;
	betResultAddedAt?: Date;
	gameScore?: GameScore;
	betStatus: string;
	balanceChange?: number;
	updatedAt?: Date;
	calendarNodeId?: string;
}

export type BetId = Bet['id'];
