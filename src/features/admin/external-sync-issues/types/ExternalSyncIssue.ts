export type ExternalSyncIssue = {
	id: string;
	createdAt?: string;
	provider?: string;
	issueType?: string;
	leagueCode?: string;
	season?: string;
	matchday?: number;
	externalMatchId?: number;
	homeTeamName?: string;
	awayTeamName?: string;
	homeTeamExternalId?: string | number;
	awayTeamExternalId?: string | number;
	message?: string;
};

