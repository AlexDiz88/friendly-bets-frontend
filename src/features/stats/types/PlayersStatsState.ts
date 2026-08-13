import LeagueStats from './LeagueStats';
import PlayerHighlight from './PlayerHighlight';
import PlayerStats from './PlayerStats';
import { PlayerStatsByBetTitles } from './PlayerStatsByBetTitles';
import { PlayerStatsByBetValues } from './PlayerStatsByBetValues';
import PlayerStatsByTeams from './PlayerStatsByTeams';

export default interface PlayersStatsState {
	playersStats: PlayerStats[];
	playersStatsByLeague: LeagueStats[];
	playersStatsByTeams: PlayerStatsByTeams[];
	playersStatsByBetTitles: PlayerStatsByBetTitles[];
	playersStatsByBetValues: PlayerStatsByBetValues[];
	statsByTeams: PlayerStatsByTeams | undefined;
	playerHighlights: PlayerHighlight[];
	playerHighlightsSeasonId?: string;
	error?: string;
}
