import SimpleUser from '../../../auth/types/SimpleUser';

export interface SeasonSummaryLeague {
	id: string;
	leagueCode: string;
	name: string;
	currentMatchDay?: string;
	tournamentFormatId?: string;
}

export default interface SeasonSummary {
	id: string;
	title: string;
	startDate?: string;
	endDate?: string;
	status: string;
	players: SimpleUser[];
	leagues: SeasonSummaryLeague[];
}
