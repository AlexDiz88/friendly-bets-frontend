import i18n from '../../../i18n';
import NewTeam from './types/NewTeam';
import Team, { TeamDisplayNames, TeamExternalAlias } from './types/Team';
import {
	AISCORE_PROVIDER,
	MARATHONBET_PROVIDER,
	SOCCER365_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
} from './teamProviderConstants';

const DROPPED_PROVIDERS = new Set([
	'wc26',
	'football-data',
	'api-football',
	'odds-api.io',
	'4score.ru',
]);

/**
 * Single source of truth for external API alias fields in the team admin form.
 * When adding a new provider alias: append an entry here (and i18n keys).
 * Completeness check, load, save, and form fields all derive from this list.
 */
export const TEAM_EXTERNAL_ALIAS_FIELDS = [
	{
		provider: SOCCER365_PROVIDER,
		field: 'soccer365ExternalName',
		sectionKey: 'teamSoccer365Section',
		labelKey: 'teamSoccer365ExternalName',
		inputId: 'soccer365-external-name',
	},
	{
		provider: AISCORE_PROVIDER,
		field: 'aiscoreExternalName',
		sectionKey: 'teamAiscoreSection',
		labelKey: 'teamAiscoreExternalName',
		inputId: 'aiscore-external-name',
	},
	{
		provider: TWENTYFOUR_SCORE_PROVIDER,
		field: 'twentyFourScoreExternalName',
		sectionKey: 'teamTwentyFourScoreSection',
		labelKey: 'teamTwentyFourScoreExternalName',
		inputId: 'twentyfourscore-external-name',
	},
	{
		provider: MARATHONBET_PROVIDER,
		field: 'marathonbetExternalName',
		sectionKey: 'teamMarathonbetSection',
		labelKey: 'teamMarathonbetExternalName',
		inputId: 'marathonbet-external-name',
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

/** All editable team fields (country, i18n names, provider aliases). */
const TEAM_I18N_LANGS: { lng: string; field: keyof Pick<TeamFormValues, 'nameEn' | 'nameRu' | 'nameDe'> }[] =
	[
		{ lng: 'en', field: 'nameEn' },
		{ lng: 'ru', field: 'nameRu' },
		{ lng: 'de', field: 'nameDe' },
	];

/** Display names from teams.json by title key (en → nameEn, ru → nameRu, de → nameDe). */
export function resolveDisplayNamesFromTeamTitle(
	title: string
): Partial<Pick<TeamFormValues, 'nameEn' | 'nameRu' | 'nameDe'>> {
	const key = title.trim();
	if (!key) {
		return {};
	}
	const result: Partial<Pick<TeamFormValues, 'nameEn' | 'nameRu' | 'nameDe'>> = {};
	for (const { lng, field } of TEAM_I18N_LANGS) {
		if (i18n.exists(key, { lng, ns: 'teams' })) {
			result[field] = i18n.t(key, { lng, ns: 'teams' });
		}
	}
	return result;
}

/** Fill nameEn/nameRu/nameDe from i18n when empty (or all fields when onlyEmptyFields is false). */
export function applyI18nDisplayNamesToFormValues(
	values: TeamFormValues,
	onlyEmptyFields = true
): TeamFormValues {
	const fromI18n = resolveDisplayNamesFromTeamTitle(values.title);
	if (!fromI18n.nameEn && !fromI18n.nameRu && !fromI18n.nameDe) {
		return values;
	}
	return {
		...values,
		nameEn:
			onlyEmptyFields && values.nameEn.trim()
				? values.nameEn
				: (fromI18n.nameEn ?? values.nameEn),
		nameRu:
			onlyEmptyFields && values.nameRu.trim()
				? values.nameRu
				: (fromI18n.nameRu ?? values.nameRu),
		nameDe:
			onlyEmptyFields && values.nameDe.trim()
				? values.nameDe
				: (fromI18n.nameDe ?? values.nameDe),
	};
}

export function mergeTeamFormPatch(
	prev: TeamFormValues,
	patch: Partial<TeamFormValues>
): TeamFormValues {
	const next = { ...prev, ...patch };
	if (patch.title !== undefined) {
		return applyI18nDisplayNamesToFormValues(next, true);
	}
	return next;
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
	return TEAM_EXTERNAL_ALIAS_FIELDS.every(({ field }) => formFieldFilled(values[field]));
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
	return applyI18nDisplayNamesToFormValues(
		{
			title: team.title ?? '',
			country: team.country ?? '',
			nameEn: team.displayNames?.en ?? '',
			nameRu: team.displayNames?.ru ?? '',
			nameDe: team.displayNames?.de ?? '',
			...aliasValues,
		},
		true
	);
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
