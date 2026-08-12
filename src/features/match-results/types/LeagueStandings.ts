export type StandingZoneRule = {
	code: string;
	label: string;
	cssClass: string;
};

export type LeagueStandingRow = {
	rank: number;
	teamId: string;
	teamTitle: string;
	logoKey?: string | null;
	played: number;
	wins: number;
	draws: number;
	losses: number;
	goalsFor: number;
	goalsAgainst: number;
	goalDifference: number;
	points: number;
	zoneCode?: string | null;
};

export type LeagueStandingsPage = {
	seasonId: string;
	leagueId: string;
	leagueCode: string;
	provider?: string | null;
	sourceUrl?: string | null;
	zoneRules: StandingZoneRule[];
	rows: LeagueStandingRow[];
	updatedAt?: string | null;
};
