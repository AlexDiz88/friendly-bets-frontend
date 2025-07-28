import Team from '../../admin/teams/types/Team';
import SimpleUser from '../../auth/types/SimpleUser';
import GameScore from './GameScore';

export default interface CompletedBet {
	id: string;
	seasonId: string;
	leagueId: string;
	leagueCode: string;
	createdAt: Date;
	player: SimpleUser;
	matchDay: string;
	homeTeam: Team;
	awayTeam: Team;
	betTitle: string;
	betOdds: number;
	betSize: number;
	betResultAddedAt: Date;
	gameResult: GameScore;
	betStatus: string;
	balanceChange: number;
	updatedAt?: Date;
	calendarNodeId?: string;
}
