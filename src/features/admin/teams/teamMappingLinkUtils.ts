import { ExternalSyncIssue } from '../external-sync-issues/types/ExternalSyncIssue';
import Team from './types/Team';
import { FOOTBALL_DATA_PROVIDER, MARATHONBET_PROVIDER, ODDS_API_PROVIDER } from './teamProviderConstants';
import { TeamFormValues } from './teamFormUtils';

export type TeamMappingRef = {
	provider: string;
	externalId?: string;
	externalName?: string;
};

export function extractTeamMappingFromIssue(issue: ExternalSyncIssue): TeamMappingRef | null {
	if (issue.issueType !== 'TEAM_MAPPING_MISSING') {
		return null;
	}
	const provider = issue.provider ?? FOOTBALL_DATA_PROVIDER;
	if (issue.homeTeamName || issue.homeTeamExternalId) {
		return {
			provider,
			externalName: issue.homeTeamName,
			externalId:
				issue.homeTeamExternalId != null ? String(issue.homeTeamExternalId) : undefined,
		};
	}
	if (issue.awayTeamName || issue.awayTeamExternalId) {
		return {
			provider,
			externalName: issue.awayTeamName,
			externalId:
				issue.awayTeamExternalId != null ? String(issue.awayTeamExternalId) : undefined,
		};
	}
	return null;
}

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

export function buildTeamMappingAdminLink(mapping: TeamMappingRef): string {
	const params = new URLSearchParams({ openTeamEdit: '1', provider: mapping.provider });
	if (mapping.externalId) {
		params.set('externalId', mapping.externalId);
	}
	if (mapping.externalName) {
		params.set('externalName', mapping.externalName);
	}
	return `/admin/cabinet?${params.toString()}`;
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
	if (provider === ODDS_API_PROVIDER) {
		const patch: Partial<TeamFormValues> = {};
		if (externalName) {
			patch.oddsApiExternalName = externalName;
		}
		if (externalId) {
			patch.oddsApiTeamId = externalId;
		}
		return patch;
	}
	if (provider === FOOTBALL_DATA_PROVIDER) {
		const patch: Partial<TeamFormValues> = {};
		if (externalName) {
			patch.footballDataExternalName = externalName;
		}
		if (externalId) {
			patch.footballDataTeamId = externalId;
		}
		return patch;
	}
	if (provider === MARATHONBET_PROVIDER) {
		const patch: Partial<TeamFormValues> = {};
		if (externalName) {
			patch.marathonbetExternalName = externalName;
		}
		return patch;
	}
	return {};
}
