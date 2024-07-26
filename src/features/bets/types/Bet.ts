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
	gameId?: string;
	gameDate?: string;
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
}

export type BetId = Bet['id'];
