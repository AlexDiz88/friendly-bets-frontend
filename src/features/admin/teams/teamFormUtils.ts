import NewTeam from './types/NewTeam';
import Team, { TeamDisplayNames, TeamExternalAlias } from './types/Team';
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
	FLASHSCORE_UA_PROVIDER,
	LIVERESULT_PROVIDER,
	isInactiveExternalProvider,
} from './teamProviderConstants';

const DROPPED_PROVIDERS = new Set([
	'wc26',
	'football-data',
	'api-football',
	'odds-api.io',
	'4score.ru',
	'aiscore.com',
]);

/**
 * Single source of truth for external API alias fields in the team admin form.
 * Completeness ignores inactive providers (`INACTIVE_EXTERNAL_PROVIDERS`); fields stay editable.
 */
/** Logo files live at `/upload/api-logos/{provider}.png` (marathonbet → marathonbet.png). */
export function teamApiLogoSrc(provider: string): string {
	return `/upload/api-logos/${provider}.png`;
}

export const TEAM_EXTERNAL_ALIAS_FIELDS = [
	{
		provider: SOCCER365_PROVIDER,
		field: 'soccer365ExternalName',
		sectionKey: 'teamSoccer365Section',
		labelKey: 'teamSoccer365ExternalName',
		inputId: 'soccer365-external-name',
	},
	{
		provider: SPORTS_RU_PROVIDER,
		field: 'sportsRuExternalName',
		sectionKey: 'teamSportsRuSection',
		labelKey: 'teamSportsRuExternalName',
		inputId: 'sportsru-external-name',
	},
	{
		provider: FOOTBALL24_PROVIDER,
		field: 'football24ExternalName',
		sectionKey: 'teamFootball24Section',
		labelKey: 'teamFootball24ExternalName',
		inputId: 'football24-external-name',
	},
	{
		provider: TWENTYFOUR_SCORE_PROVIDER,
		field: 'twentyFourScoreExternalName',
		sectionKey: 'teamTwentyFourScoreSection',
		labelKey: 'teamTwentyFourScoreExternalName',
		inputId: 'twentyfourscore-external-name',
	},
	{
		provider: CHAMPIONAT_PROVIDER,
		field: 'championatExternalName',
		sectionKey: 'teamChampionatSection',
		labelKey: 'teamChampionatExternalName',
		inputId: 'championat-external-name',
	},
	{
		provider: EURO_FOOTBALL_PROVIDER,
		field: 'euroFootballExternalName',
		sectionKey: 'teamEuroFootballSection',
		labelKey: 'teamEuroFootballExternalName',
		inputId: 'eurofootball-external-name',
	},
	{
		provider: RUSCORE_PROVIDER,
		field: 'ruscoreExternalName',
		sectionKey: 'teamRuscoreSection',
		labelKey: 'teamRuscoreExternalName',
		inputId: 'ruscore-external-name',
	},
	{
		provider: FLASHSCORE_PROVIDER,
		field: 'flashscoreExternalName',
		sectionKey: 'teamFlashscoreSection',
		labelKey: 'teamFlashscoreExternalName',
		inputId: 'flashscore-external-name',
	},
	{
		provider: FLASHSCORE_UA_PROVIDER,
		field: 'flashscoreUaExternalName',
		sectionKey: 'teamFlashscoreUaSection',
		labelKey: 'teamFlashscoreUaExternalName',
		inputId: 'flashscoreua-external-name',
	},
	{
		provider: LIVERESULT_PROVIDER,
		field: 'liveresultExternalName',
		sectionKey: 'teamLiveresultSection',
		labelKey: 'teamLiveresultExternalName',
		inputId: 'liveresult-external-name',
	},
	{
		provider: MARATHONBET_PROVIDER,
		field: 'marathonbetExternalName',
		sectionKey: 'teamMarathonbetSection',
		labelKey: 'teamMarathonbetExternalName',
		inputId: 'marathonbet-external-name',
	},
	{
		provider: MELBET_PROVIDER,
		field: 'melbetExternalName',
		sectionKey: 'teamMelbetSection',
		labelKey: 'teamMelbetExternalName',
		inputId: 'melbet-external-name',
	},
] as const;

export type TeamExternalAliasFormField =
	(typeof TEAM_EXTERNAL_ALIAS_FIELDS)[number]['field'];

export type TeamFormValues = {
	title: string;
	country: string;
	nameEn: string;
	nameRu: string;
	nameDe: string;
} & Record<TeamExternalAliasFormField, string>;

function emptyExternalAliasFormFields(): Record<TeamExternalAliasFormField, string> {
	const result = {} as Record<TeamExternalAliasFormField, string>;
	for (const { field } of TEAM_EXTERNAL_ALIAS_FIELDS) {
		result[field] = '';
	}
	return result;
}

export function emptyTeamFormValues(): TeamFormValues {
	return {
		title: '',
		country: '',
		nameEn: '',
		nameRu: '',
		nameDe: '',
		...emptyExternalAliasFormFields(),
	};
}

function formFieldFilled(value: string): boolean {
	return value.trim() !== '';
}

export function mergeTeamFormPatch(
	prev: TeamFormValues,
	patch: Partial<TeamFormValues>
): TeamFormValues {
	return { ...prev, ...patch };
}

export function isTeamFormComplete(values: TeamFormValues): boolean {
	if (
		!formFieldFilled(values.country) ||
		!formFieldFilled(values.nameEn) ||
		!formFieldFilled(values.nameRu) ||
		!formFieldFilled(values.nameDe)
	) {
		return false;
	}
	return TEAM_EXTERNAL_ALIAS_FIELDS.filter(({ provider }) => !isInactiveExternalProvider(provider)).every(
		({ field }) => formFieldFilled(values[field])
	);
}

export function isTeamComplete(team: Team): boolean {
	return isTeamFormComplete(teamToFormValues(team));
}

export function teamToFormValues(team: Team): TeamFormValues {
	const aliasValues = emptyExternalAliasFormFields();
	for (const { provider, field } of TEAM_EXTERNAL_ALIAS_FIELDS) {
		const alias = team.externalAliases?.find((a) => a.provider === provider);
		aliasValues[field] = alias?.externalName ?? '';
	}
	return {
		title: team.title ?? '',
		country: team.country ?? '',
		nameEn: team.displayNames?.en ?? '',
		nameRu: team.displayNames?.ru ?? '',
		nameDe: team.displayNames?.de ?? '',
		...aliasValues,
	};
}

function buildDisplayNames(
	nameEn: string,
	nameRu: string,
	nameDe: string
): TeamDisplayNames {
	const en = nameEn.trim();
	const ru = nameRu.trim();
	const de = nameDe.trim();
	return {
		en: en || undefined,
		ru: ru || undefined,
		de: de || undefined,
	};
}

/** Merge form aliases; legacy providers (incl. odds-api.io / 4score.ru) are dropped on save. */
export function buildExternalAliases(
	values: TeamFormValues,
	existing?: TeamExternalAlias[]
): TeamExternalAlias[] {
	const byProvider = new Map<string, TeamExternalAlias>();
	for (const alias of existing ?? []) {
		if (alias.provider && !DROPPED_PROVIDERS.has(alias.provider)) {
			byProvider.set(alias.provider, alias);
		}
	}
	byProvider.delete('odds-api.io');
	byProvider.delete('4score.ru');
	for (const { provider, field } of TEAM_EXTERNAL_ALIAS_FIELDS) {
		const name = values[field].trim();
		if (name) {
			byProvider.set(provider, { provider, externalName: name });
		} else {
			byProvider.delete(provider);
		}
	}
	return [...byProvider.values()];
}

export function formValuesToCreatePayload(values: TeamFormValues): NewTeam {
	return {
		title: values.title.trim(),
		country: values.country.trim(),
		displayNames: buildDisplayNames(values.nameEn, values.nameRu, values.nameDe),
		externalAliases: buildExternalAliases(values),
	};
}

export interface UpdateTeamPayload {
	country?: string;
	displayNames?: TeamDisplayNames;
	externalAliases?: TeamExternalAlias[];
}

export function formValuesToUpdatePayload(
	values: TeamFormValues,
	existingExternalAliases?: TeamExternalAlias[]
): UpdateTeamPayload {
	return {
		country: values.country.trim() || undefined,
		displayNames: buildDisplayNames(values.nameEn, values.nameRu, values.nameDe),
		externalAliases: buildExternalAliases(values, existingExternalAliases),
	};
}
