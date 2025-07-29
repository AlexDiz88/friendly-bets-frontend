import Team from '../../admin/teams/types/Team';
import SimpleUser from '../../auth/types/SimpleUser';
import BetTitle from './BetTitle';

export default interface BetSummary {
	message: string;
	player: SimpleUser | undefined;
	leagueCode: string;
	matchDay: string;
	homeTeam: Team | undefined;
	awayTeam: Team | undefined;
	betTitle: BetTitle | undefined;
	betOdds: string;
	betSize: string;
	betStatus?: string;
	gameScoreInput?: string;
}
