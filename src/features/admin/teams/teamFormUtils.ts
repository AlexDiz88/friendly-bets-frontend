import i18n from '../../../i18n';
import NewTeam from './types/NewTeam';
import Team, { TeamDisplayNames, TeamExternalAlias } from './types/Team';
import {
	FOURSCORE_PROVIDER,
	MARATHONBET_PROVIDER,
	ODDS_API_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
} from './teamProviderConstants';

export type TeamFormValues = {
	title: string;
	country: string;
	nameEn: string;
	nameRu: string;
	nameDe: string;
	oddsApiTeamId: string;
	oddsApiExternalName: string;
	marathonbetExternalName: string;
	fourscoreExternalName: string;
	twentyFourScoreExternalName: string;
};

export function emptyTeamFormValues(): TeamFormValues {
	return {
		title: '',
		country: '',
		nameEn: '',
		nameRu: '',
		nameDe: '',
		oddsApiTeamId: '',
		oddsApiExternalName: '',
		marathonbetExternalName: '',
		fourscoreExternalName: '',
		twentyFourScoreExternalName: '',
	};
}

export function hasFourScoreApiMapping(values: TeamFormValues): boolean {
	return values.fourscoreExternalName.trim() !== '';
}

export function hasTwentyFourScoreApiMapping(values: TeamFormValues): boolean {
	return values.twentyFourScoreExternalName.trim() !== '';
}

export function hasOddsApiMapping(values: TeamFormValues): boolean {
	return values.oddsApiTeamId.trim() !== '' && values.oddsApiExternalName.trim() !== '';
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

export function hasMarathonbetApiMapping(values: TeamFormValues): boolean {
	return values.marathonbetExternalName.trim() !== '';
}

export function isTeamFormComplete(values: TeamFormValues): boolean {
	return (
		formFieldFilled(values.country) &&
		formFieldFilled(values.nameEn) &&
		formFieldFilled(values.nameRu) &&
		formFieldFilled(values.nameDe) &&
		hasFourScoreApiMapping(values) &&
		hasTwentyFourScoreApiMapping(values) &&
		hasMarathonbetApiMapping(values) &&
		hasOddsApiMapping(values)
	);
}

export function isTeamComplete(team: Team): boolean {
	return isTeamFormComplete(teamToFormValues(team));
}

export function teamToFormValues(team: Team): TeamFormValues {
	const oddsAlias = team.externalAliases?.find((a) => a.provider === ODDS_API_PROVIDER);
	const marathonAlias = team.externalAliases?.find((a) => a.provider === MARATHONBET_PROVIDER);
	const fourScoreAlias = team.externalAliases?.find((a) => a.provider === FOURSCORE_PROVIDER);
	const twentyFourScoreAlias = team.externalAliases?.find(
		(a) => a.provider === TWENTYFOUR_SCORE_PROVIDER
	);
	return applyI18nDisplayNamesToFormValues(
		{
			title: team.title ?? '',
			country: team.country ?? '',
			nameEn: team.displayNames?.en ?? '',
			nameRu: team.displayNames?.ru ?? '',
			nameDe: team.displayNames?.de ?? '',
			oddsApiTeamId: oddsAlias?.externalId != null ? String(oddsAlias.externalId) : '',
			oddsApiExternalName: oddsAlias?.externalName ?? '',
			marathonbetExternalName: marathonAlias?.externalName ?? '',
			fourscoreExternalName: fourScoreAlias?.externalName ?? '',
			twentyFourScoreExternalName: twentyFourScoreAlias?.externalName ?? '',
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

function parseOptionalExternalId(raw: string): number | undefined {
	const idRaw = raw.trim();
	if (!idRaw) {
		return undefined;
	}
	const externalId = Number(idRaw);
	return Number.isFinite(externalId) ? externalId : undefined;
}

function buildFourScoreAlias(values: TeamFormValues): TeamExternalAlias | undefined {
	const name = values.fourscoreExternalName.trim();
	if (!name) {
		return undefined;
	}
	return {
		provider: FOURSCORE_PROVIDER,
		externalName: name,
	};
}

function buildTwentyFourScoreAlias(values: TeamFormValues): TeamExternalAlias | undefined {
	const name = values.twentyFourScoreExternalName.trim();
	if (!name) {
		return undefined;
	}
	return {
		provider: TWENTYFOUR_SCORE_PROVIDER,
		externalName: name,
	};
}

function buildMarathonbetAlias(values: TeamFormValues): TeamExternalAlias | undefined {
	const name = values.marathonbetExternalName.trim();
	if (!name) {
		return undefined;
	}
	return {
		provider: MARATHONBET_PROVIDER,
		externalName: name,
	};
}

function buildOddsApiAlias(values: TeamFormValues): TeamExternalAlias | undefined {
	const name = values.oddsApiExternalName.trim();
	const idRaw = values.oddsApiTeamId.trim();
	if (!name && !idRaw) {
		return undefined;
	}
	return {
		provider: ODDS_API_PROVIDER,
		externalId: parseOptionalExternalId(values.oddsApiTeamId),
		externalName: name || undefined,
	};
}

/** Merge form aliases; legacy wc26 provider entries are dropped on save. */
export function buildExternalAliases(
	values: TeamFormValues,
	existing?: TeamExternalAlias[]
): TeamExternalAlias[] {
	const byProvider = new Map<string, TeamExternalAlias>();
	for (const alias of existing ?? []) {
		if (alias.provider && alias.provider !== 'wc26' && alias.provider !== 'football-data' && alias.provider !== 'api-football') {
			byProvider.set(alias.provider, alias);
		}
	}
	const odds = buildOddsApiAlias(values);
	if (odds) {
		byProvider.set(ODDS_API_PROVIDER, odds);
	} else {
		byProvider.delete(ODDS_API_PROVIDER);
	}
	const marathon = buildMarathonbetAlias(values);
	if (marathon) {
		byProvider.set(MARATHONBET_PROVIDER, marathon);
	} else {
		byProvider.delete(MARATHONBET_PROVIDER);
	}
	const fourScore = buildFourScoreAlias(values);
	if (fourScore) {
		byProvider.set(FOURSCORE_PROVIDER, fourScore);
	} else {
		byProvider.delete(FOURSCORE_PROVIDER);
	}
	const twentyFourScore = buildTwentyFourScoreAlias(values);
	if (twentyFourScore) {
		byProvider.set(TWENTYFOUR_SCORE_PROVIDER, twentyFourScore);
	} else {
		byProvider.delete(TWENTYFOUR_SCORE_PROVIDER);
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
