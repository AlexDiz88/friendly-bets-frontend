import Team from '../../teams/types/Team';

export default interface League {
	id: string;
	name: string;
	displayNameRu: string;
	displayNameEn: string;
	shortNameRu: string;
	shortNameEn: string;
	currentMatchDay: string;
	teams: Team[];
}

export type LeagueId = League['id'];
export type LeagueDisplayNameRu = League['displayNameRu'];
