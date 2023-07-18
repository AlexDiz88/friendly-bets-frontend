import Team from '../../teams/types/Team';

export default interface League {
  id: string;
  name: string;
  displayNameRu: string;
  displayNameEn: string;
  teams: Team[];
}

export type LeagueId = League['id'];
