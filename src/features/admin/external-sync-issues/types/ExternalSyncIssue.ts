export type ExternalSyncIssue = {
	id: string;
	createdAt?: string;
	provider?: string;
	issueType?: string;
	competitionCode?: string;
	season?: string;
	matchday?: number;
	externalMatchId?: number;
	homeTeamName?: string;
	awayTeamName?: string;
	homeTeamExternalId?: number;
	awayTeamExternalId?: number;
	message?: string;
};

