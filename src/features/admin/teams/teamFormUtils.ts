import i18n from '../../../i18n';
import NewTeam from './types/NewTeam';
import Team, { TeamDisplayNames, TeamExternalAlias } from './types/Team';
import {
	FOOTBALL_DATA_PROVIDER,
	FOURSCORE_PROVIDER,
	MARATHONBET_PROVIDER,
	ODDS_API_PROVIDER,
} from './teamProviderConstants';

export type TeamFormValues = {
	title: string;
	country: string;
	nameEn: string;
	nameRu: string;
	nameDe: string;
	footballDataTeamId: string;
	footballDataExternalName: string;
	oddsApiTeamId: string;
	oddsApiExternalName: string;
	marathonbetExternalName: string;
	fourscoreExternalName: string;
};

export function emptyTeamFormValues(): TeamFormValues {
	return {
		title: '',
		country: '',
		nameEn: '',
		nameRu: '',
		nameDe: '',
		footballDataTeamId: '',
		footballDataExternalName: '',
		oddsApiTeamId: '',
		oddsApiExternalName: '',
		marathonbetExternalName: '',
		fourscoreExternalName: '',
	};
}

export function hasFootballDataApiMapping(values: TeamFormValues): boolean {
	return values.footballDataTeamId.trim() !== '' && values.footballDataExternalName.trim() !== '';
}

export function hasOddsApiMapping(values: TeamFormValues): boolean {
	return values.oddsApiTeamId.trim() !== '' && values.oddsApiExternalName.trim() !== '';
}

function formFieldFilled(value: string): boolean {
	return value.trim() !== '';
}

/** All editable team fields (country, i18n names, football-data id + API name). */
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
	return (
		formFieldFilled(values.country) &&
		formFieldFilled(values.nameEn) &&
		formFieldFilled(values.nameRu) &&
		formFieldFilled(values.nameDe) &&
		hasFootballDataApiMapping(values) &&
		hasOddsApiMapping(values)
	);
}

export function teamToFormValues(team: Team): TeamFormValues {
	const fdAlias = team.externalAliases?.find((a) => a.provider === FOOTBALL_DATA_PROVIDER);
	const oddsAlias = team.externalAliases?.find((a) => a.provider === ODDS_API_PROVIDER);
	const marathonAlias = team.externalAliases?.find((a) => a.provider === MARATHONBET_PROVIDER);
	const fourScoreAlias = team.externalAliases?.find((a) => a.provider === FOURSCORE_PROVIDER);
	return applyI18nDisplayNamesToFormValues(
		{
			title: team.title ?? '',
			country: team.country ?? '',
			nameEn: team.displayNames?.en ?? '',
			nameRu: team.displayNames?.ru ?? '',
			nameDe: team.displayNames?.de ?? '',
			footballDataTeamId:
				team.footballDataTeamId != null
					? String(team.footballDataTeamId)
					: fdAlias?.externalId != null
						? String(fdAlias.externalId)
						: '',
			footballDataExternalName: fdAlias?.externalName ?? '',
			oddsApiTeamId: oddsAlias?.externalId != null ? String(oddsAlias.externalId) : '',
			oddsApiExternalName: oddsAlias?.externalName ?? '',
			marathonbetExternalName: marathonAlias?.externalName ?? '',
			fourscoreExternalName: fourScoreAlias?.externalName ?? '',
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

function buildFootballDataAlias(values: TeamFormValues): TeamExternalAlias | undefined {
	const name = values.footballDataExternalName.trim();
	const idRaw = values.footballDataTeamId.trim();
	if (!name && !idRaw) {
		return undefined;
	}
	return {
		provider: FOOTBALL_DATA_PROVIDER,
		externalId: parseOptionalExternalId(values.footballDataTeamId),
		externalName: name || undefined,
	};
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
		if (alias.provider && alias.provider !== 'wc26') {
			byProvider.set(alias.provider, alias);
		}
	}
	const fd = buildFootballDataAlias(values);
	if (fd) {
		byProvider.set(FOOTBALL_DATA_PROVIDER, fd);
	} else {
		byProvider.delete(FOOTBALL_DATA_PROVIDER);
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
	return [...byProvider.values()];
}

export function formValuesToCreatePayload(values: TeamFormValues): NewTeam {
	const fdId = parseOptionalExternalId(values.footballDataTeamId);
	return {
		title: values.title.trim(),
		country: values.country.trim(),
		displayNames: buildDisplayNames(values.nameEn, values.nameRu, values.nameDe),
		externalAliases: buildExternalAliases(values),
		footballDataTeamId: fdId,
	};
}

export interface UpdateTeamPayload {
	country?: string;
	displayNames?: TeamDisplayNames;
	externalAliases?: TeamExternalAlias[];
	footballDataTeamId?: number;
}

export function formValuesToUpdatePayload(
	values: TeamFormValues,
	existingExternalAliases?: TeamExternalAlias[]
): UpdateTeamPayload {
	const fdId = parseOptionalExternalId(values.footballDataTeamId);
	return {
		country: values.country.trim() || undefined,
		displayNames: buildDisplayNames(values.nameEn, values.nameRu, values.nameDe),
		externalAliases: buildExternalAliases(values, existingExternalAliases),
		footballDataTeamId: fdId,
	};
}
