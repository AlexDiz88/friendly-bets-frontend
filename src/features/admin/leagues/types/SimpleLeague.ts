export default interface SimpleLeague {
	id: string;
	leagueCode: string;
	name: string;
	currentMatchDay: string;
}

export type LeagueId = SimpleLeague['id'];
export type LeagueCode = SimpleLeague['leagueCode'];
