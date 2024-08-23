import Team from '../../admin/teams/types/Team';
import SimpleUser from '../../auth/types/SimpleUser';

export default interface BetSummary {
	message: string;
	player: SimpleUser | undefined;
	leagueCode: string;
	matchDay: string;
	homeTeam: Team | undefined;
	awayTeam: Team | undefined;
	betTitle: string;
	isNot: boolean;
	betOdds: string;
	betSize: string;
	gameResultInput?: string;
	betStatus?: string;
}
