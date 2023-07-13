import Team from '../../teams/types/Team';

export default interface League {
  id: string;
  name: string;
  displayName: string;
  teams: Team[];
}

export type LeagueId = League['id'];
