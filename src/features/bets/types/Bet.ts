import Team from '../../admin/teams/types/Team';
import SimpleUser from '../../auth/types/SimpleUser';

export default interface Bet {
	id: string;
	seasonId: string;
	leagueId: string;
	leagueCode: string;
	createdAt: Date;
	player: SimpleUser;
	isPlayoff: boolean;
	matchDay: string;
	playoffRound: string;
	homeTeam: Team;
	awayTeam: Team;
	betTitle: string;
	betOdds: number;
	betSize: number;
	gameResult?: string;
	betResultAddedAt: Date;
	betStatus: string;
	balanceChange?: number;
	updatedAt: Date;
	calendarNodeId?: string;
}

export type BetId = Bet['id'];
