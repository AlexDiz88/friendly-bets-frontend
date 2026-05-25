import type { ExpandedMatchdaySlot } from '../../tournament-formats/types/TournamentFormat';
import Team from '../../teams/types/Team';

export default interface League {
	id: string;
	leagueCode: string;
	name: string;
	currentMatchDay: string;
	tournamentFormatId?: string;
	matchdaySlots?: ExpandedMatchdaySlot[];
	teams: Team[];
}

export type LeagueId = League['id'];
export type LeagueCode = League['leagueCode'];
