import Team from './types/Team';
import {
	FOURSCORE_PROVIDER,
	MARATHONBET_PROVIDER,
	SOCCER365_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
} from './teamProviderConstants';
import { TeamFormValues } from './teamFormUtils';

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
	externalId?: string,
	externalName?: string
): Partial<TeamFormValues> {
	if (provider === MARATHONBET_PROVIDER) {
		const patch: Partial<TeamFormValues> = {};
		if (externalName) {
			patch.marathonbetExternalName = externalName;
		}
		return patch;
	}
	if (provider === FOURSCORE_PROVIDER) {
		const patch: Partial<TeamFormValues> = {};
		if (externalName) {
			patch.fourscoreExternalName = externalName;
		}
		return patch;
	}
	if (provider === TWENTYFOUR_SCORE_PROVIDER) {
		const patch: Partial<TeamFormValues> = {};
		if (externalName) {
			patch.twentyFourScoreExternalName = externalName;
		}
		return patch;
	}
	if (provider === SOCCER365_PROVIDER) {
		const patch: Partial<TeamFormValues> = {};
		if (externalName) {
			patch.soccer365ExternalName = externalName;
		}
		return patch;
	}
	return {};
}
