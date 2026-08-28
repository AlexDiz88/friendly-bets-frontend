import {
	MARATHONBET_PROVIDER,
	MELBET_PROVIDER,
	SOCCER365_PROVIDER,
	SPORTS_RU_PROVIDER,
	FOOTBALL24_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
	CHAMPIONAT_PROVIDER,
	EURO_FOOTBALL_PROVIDER,
	RUSCORE_PROVIDER,
	FLASHSCORE_PROVIDER,
	LIVERESULT_PROVIDER,
	FLASHSCORE_UA_PROVIDER,
} from '../admin/teams/teamProviderConstants';
import type { ExternalDataLayer } from '../../shared/externalDataLayerColors';

export type SandboxIdHint = {
	/** League / short label, e.g. EPL */
	label: string;
	/** Value to copy / apply into the form field */
	value: string;
};

/**
 * Known competition / tournament / filter IDs for API sandbox quick-fill.
 * Keep in sync with backend application.properties defaults.
 */
export const SANDBOX_ID_HINTS: Partial<
	Record<ExternalDataLayer, Record<string, SandboxIdHint[]>>
> = {
	SCHEDULE: {
		[SOCCER365_PROVIDER]: [
			{ label: 'EPL', value: '12' },
			{ label: 'BL', value: '17' },
			{ label: 'CL', value: '19' },
			{ label: 'LE', value: '20' },
			{ label: 'EC', value: '24' },
			{ label: 'WC', value: '742' },
		],
		[SPORTS_RU_PROVIDER]: [
			{ label: 'EPL', value: 'premier-league' },
			{ label: 'BL', value: 'bundesliga' },
			{ label: 'CL', value: 'ucl' },
			{ label: 'LE', value: 'uel' },
		],
		[FOOTBALL24_PROVIDER]: [
			{ label: 'EPL', value: '3' },
			{ label: 'BL', value: '7' },
			{ label: 'CL', value: '1' },
			{ label: 'LE', value: '2' },
		],
	},
	ODDS: {
		[MARATHONBET_PROVIDER]: [
			{ label: 'EPL', value: '21520' },
			{ label: 'BL', value: '22436' },
			{ label: 'CL', value: '21255' },
			{ label: 'LE', value: '21366' },
			{ label: 'WC', value: '2253726' },
		],
		[MELBET_PROVIDER]: [
			{ label: 'EPL', value: '4485' },
			{ label: 'BL', value: '4261' },
		],
	},
	LIVE: {
		// 24score.pro date-page titles are Russian (e.g. «Англия Премьер-лига»).
		// Substrings align with TwentyFourScoreLeagueTitles on the backend.
		[TWENTYFOUR_SCORE_PROVIDER]: [
			{ label: 'EPL', value: 'Англия Премьер' },
			{ label: 'BL', value: 'Бундеслига' },
			{ label: 'CL', value: 'Лига чемпионов' },
			{ label: 'LE', value: 'Лига Европы' },
			{ label: 'WC', value: 'Чемпионат мира' },
			{ label: 'EC', value: 'Чемпионат Европы' },
		],
		[CHAMPIONAT_PROVIDER]: [
			{ label: 'EPL', value: 'Премьер-лига' },
			{ label: 'BL', value: 'Бундеслига' },
		],
		[EURO_FOOTBALL_PROVIDER]: [
			{ label: 'EPL', value: 'Англия' },
			{ label: 'BL', value: 'Бундеслига' },
			{ label: 'CL', value: 'Лига чемпионов' },
			{ label: 'LE', value: 'Лига Европы' },
		],
	},
	FULL_MATCH: {
		[SOCCER365_PROVIDER]: [
			{ label: 'EPL', value: '12' },
			{ label: 'BL', value: '17' },
			{ label: 'CL', value: '19' },
			{ label: 'LE', value: '20' },
			{ label: 'EC', value: '24' },
			{ label: 'WC', value: '742' },
		],
		[RUSCORE_PROVIDER]: [
			{ label: 'EPL', value: '5379' },
			{ label: 'BL', value: '5456' },
			{ label: 'CL', value: '5358' },
			{ label: 'LE', value: '5360' },
			{ label: '2.BL', value: 'Вторая Бундеслига' },
			{ label: 'EPL name', value: 'england-premier-league' },
		],
		[FLASHSCORE_PROVIDER]: [
			{ label: 'EPL', value: 'Premier League' },
			{ label: 'BL', value: 'Bundesliga' },
			{ label: 'EPL stage', value: 'CfoA8Dmm' },
			{ label: 'BL stage', value: 'jg0MwVuC' },
		],
	},
	STANDINGS: {
		[LIVERESULT_PROVIDER]: [
			{ label: 'EPL', value: 'EPL' },
			{ label: 'BL', value: 'BL' },
		],
		[FLASHSCORE_UA_PROVIDER]: [
			{ label: 'EPL', value: 'EPL' },
			{ label: 'BL', value: 'BL' },
		],
	},
};

export function sandboxIdHintsFor(
	layer: ExternalDataLayer,
	provider: string
): SandboxIdHint[] {
	if (!provider) {
		return [];
	}
	return SANDBOX_ID_HINTS[layer]?.[provider] ?? [];
}
