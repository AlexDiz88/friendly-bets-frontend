import League from '../../admin/leagues/types/League';
import Team from '../../admin/teams/types/Team';
import User from '../../auth/types/User';

export default interface BetSummary {
  player: User;
  league: League;
  matchDay: string;
  homeTeam: Team;
  awayTeam: Team;
  betTitle: string;
  isNot: boolean;
  betOdds: number;
  betSize: number;
  gameResult?: string;
  betStatus?: string;
}
