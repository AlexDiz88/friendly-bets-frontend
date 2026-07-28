import {
	MARATHONBET_PROVIDER,
	SOCCER365_PROVIDER,
	SPORTS_RU_PROVIDER,
	FOOTBALL24_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
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
	},
	LIVE: {
		[TWENTYFOUR_SCORE_PROVIDER]: [
			{ label: 'EPL', value: 'Premier' },
			{ label: 'BL', value: 'Bundesliga' },
			{ label: 'CL', value: 'Champions League' },
			{ label: 'LE', value: 'Europa League' },
			{ label: 'WC', value: 'World Cup' },
			{ label: 'EC', value: 'Euro' },
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
