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

export function teamToFormValues(team: Team): TeamFormValues {
	const fdAlias = team.externalAliases?.find((a) => a.provider === FOOTBALL_DATA_PROVIDER);
	return {
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
	};
}

function buildDisplayNames(
	nameEn: string,
	nameRu: string,
	nameDe: string
): TeamDisplayNames | undefined {
	const en = nameEn.trim();
	const ru = nameRu.trim();
	const de = nameDe.trim();
	if (!en && !ru && !de) {
		return undefined;
	}
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
