import Team from './types/Team';
import { TEAM_EXTERNAL_ALIAS_FIELDS, TeamFormValues } from './teamFormUtils';

export type TeamMappingRef = {
	provider: string;
	externalId?: string;
	externalName?: string;
};

export const TEAM_MAPPING_SEARCH_PARAM_KEYS = [
	'provider',
	'externalId',
	'externalName',
	'teamId',
	'openTeamEdit',
] as const;

export function readTeamMappingFromSearchParams(
	searchParams: URLSearchParams
): TeamMappingRef | null {
	const provider = searchParams.get('provider');
	if (!provider) {
		return null;
	}
	const externalId = searchParams.get('externalId') ?? undefined;
	const externalName = searchParams.get('externalName') ?? undefined;
	if (!externalId && !externalName) {
		return null;
	}
	return { provider, externalId, externalName };
}

export function clearTeamMappingSearchParams(
	setSearchParams: (
		next: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
		opts?: { replace?: boolean }
	) => void
): void {
	setSearchParams(
		(prev) => {
			const next = new URLSearchParams(prev);
			for (const key of TEAM_MAPPING_SEARCH_PARAM_KEYS) {
				next.delete(key);
			}
			return next;
		},
		{ replace: true }
	);
}

export function findTeamByExternalAlias(
	teams: Team[],
	provider: string,
	externalId?: string,
	externalName?: string
): Team | undefined {
	return teams.find((team) =>
		team.externalAliases?.some((alias) => {
			if (alias.provider !== provider) {
				return false;
			}
			if (externalId && alias.externalId != null && String(alias.externalId) === externalId) {
				return true;
			}
			return Boolean(externalName && alias.externalName === externalName);
		})
	);
}

export function buildExternalAliasPrefill(
	provider: string,
	_externalId?: string,
	externalName?: string
): Partial<TeamFormValues> {
	if (!externalName) {
		return {};
	}
	const entry = TEAM_EXTERNAL_ALIAS_FIELDS.find((e) => e.provider === provider);
	if (!entry) {
		return {};
	}
	return { [entry.field]: externalName };
}
