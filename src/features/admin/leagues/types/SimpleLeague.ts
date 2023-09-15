export default interface SimpleLeague {
  id: string;
  name: string;
  displayNameRu: string;
  displayNameEn: string;
  shortNameRu: string;
  shortNameEn: string;
  currentMatchDay: string;
}

export type LeagueId = SimpleLeague['id'];
export type LeagueDisplayNameRu = SimpleLeague['displayNameRu'];
