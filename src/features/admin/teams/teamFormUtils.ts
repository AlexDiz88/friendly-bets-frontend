import i18n from '../../../i18n';
import NewTeam from './types/NewTeam';
import Team, { TeamDisplayNames, TeamExternalAlias } from './types/Team';

export type TeamFormValues = {
	title: string;
	country: string;
	nameEn: string;
	nameRu: string;
	nameDe: string;
	footballDataTeamId: string;
	footballDataExternalName: string;
};

const FOOTBALL_DATA_PROVIDER = 'football-data';

export function emptyTeamFormValues(): TeamFormValues {
	return {
		title: '',
		country: '',
		nameEn: '',
		nameRu: '',
		nameDe: '',
		footballDataTeamId: '',
		footballDataExternalName: '',
	};
}

export function hasFootballDataApiMapping(values: TeamFormValues): boolean {
	return values.footballDataTeamId.trim() !== '' && values.footballDataExternalName.trim() !== '';
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
		hasFootballDataApiMapping(values)
	);
}

export function teamToFormValues(team: Team): TeamFormValues {
	const fdAlias = team.externalAliases?.find((a) => a.provider === FOOTBALL_DATA_PROVIDER);
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

function buildFootballDataAliases(
	footballDataTeamId: string,
	footballDataExternalName: string
): TeamExternalAlias[] | undefined {
	const name = footballDataExternalName.trim();
	const idRaw = footballDataTeamId.trim();
	if (!name && !idRaw) {
		return undefined;
	}
	const externalId = idRaw ? Number(idRaw) : undefined;
	return [
		{
			provider: FOOTBALL_DATA_PROVIDER,
			externalId: Number.isFinite(externalId) ? externalId : undefined,
			externalName: name || undefined,
		},
	];
}

export function formValuesToCreatePayload(values: TeamFormValues): NewTeam {
	const fdIdRaw = values.footballDataTeamId.trim();
	const fdId = fdIdRaw ? Number(fdIdRaw) : undefined;
	return {
		title: values.title.trim(),
		country: values.country.trim(),
		displayNames: buildDisplayNames(values.nameEn, values.nameRu, values.nameDe),
		externalAliases: buildFootballDataAliases(
			values.footballDataTeamId,
			values.footballDataExternalName
		),
		footballDataTeamId: Number.isFinite(fdId) ? fdId : undefined,
	};
}

export interface UpdateTeamPayload {
	country?: string;
	displayNames?: TeamDisplayNames;
	externalAliases?: TeamExternalAlias[];
	footballDataTeamId?: number;
}

export function formValuesToUpdatePayload(values: TeamFormValues): UpdateTeamPayload {
	const fdIdRaw = values.footballDataTeamId.trim();
	const fdId = fdIdRaw ? Number(fdIdRaw) : undefined;
	const aliases = buildFootballDataAliases(
		values.footballDataTeamId,
		values.footballDataExternalName
	);
	return {
		country: values.country.trim() || undefined,
		displayNames: buildDisplayNames(values.nameEn, values.nameRu, values.nameDe),
		externalAliases: aliases ?? [],
		footballDataTeamId: Number.isFinite(fdId) ? fdId : undefined,
	};
}
