import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type ExternalDataLayer = 'SCHEDULE' | 'ODDS' | 'LIVE' | 'FULL_MATCH';

export type LayerAssignment = {
	enabled?: boolean;
	primaryProvider?: string | null;
	secondaryProvider?: string | null;
};

export type ExternalDataLayerConfig = {
	layers: Partial<Record<ExternalDataLayer, LayerAssignment>>;
	capabilities: Record<string, string[]>;
};

export async function fetchExternalDataLayerConfig(): Promise<ExternalDataLayerConfig> {
	const result = await apiFetch(apiUrl('/api/admin/external-data/layers'), { method: 'GET' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function patchExternalDataLayerConfig(
	body: Pick<ExternalDataLayerConfig, 'layers'>
): Promise<ExternalDataLayerConfig> {
	const result = await apiFetch(apiUrl('/api/admin/external-data/layers'), {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function syncExternalLive(leagueCode: string): Promise<{
	leagueCode: string;
	updated: number;
	finishedDetected: number;
	message?: string;
}> {
	const params = new URLSearchParams({ leagueCode });
	const result = await apiFetch(apiUrl(`/api/admin/external-data/live/sync?${params}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export type ExternalTeamNameChip = {
	externalName: string;
	provider: string;
	alreadyMapped: boolean;
};

export type ExternalTeamNamesLoadResult = {
	unmapped: ExternalTeamNameChip[];
	autoBoundCount: number;
	mismatchCount: number;
	alreadyMappedCount: number;
	totalNames: number;
};

export type ExternalScheduleSyncResult = {
	leagueCode: string;
	seasonId: string;
	currentMatchday: number;
	nextMatchday?: number | null;
	upserted: number;
	skippedUnmapped: number;
	roundsParsed: number;
	unmappedNames: string[];
};

export async function fetchExternalTeamNames(
	provider: string,
	leagueCode: string
): Promise<ExternalTeamNamesLoadResult> {
	const params = new URLSearchParams({ provider, leagueCode });
	const result = await apiFetch(apiUrl(`/api/admin/external-data/team-names?${params}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function syncExternalSchedule(
	leagueCode: string,
	matchday?: number
): Promise<ExternalScheduleSyncResult> {
	const params = new URLSearchParams({ leagueCode });
	if (matchday != null) {
		params.set('matchday', String(matchday));
	}
	const result = await apiFetch(apiUrl(`/api/admin/external-data/schedule/sync?${params}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export type MarathonbetOddsSyncResult = {
	message: string;
	tournamentFetched: boolean;
	matchesEligible: number;
	matchesMatched: number;
	mergedSaved: number;
	sseCalls: number;
	mappingFailures: number;
	failedMatchScheduleIds?: string[];
};

/** Manual ODDS sync. Default: current matchday, missing odds only. Force: matchday + match ids. */
export async function syncMarathonbetOdds(params: {
	leagueId: string;
	season?: string;
	force?: boolean;
	matchday?: number;
	matchScheduleIds?: string[];
}): Promise<MarathonbetOddsSyncResult> {
	const search = new URLSearchParams({ leagueId: params.leagueId });
	if (params.season) {
		search.set('season', params.season);
	}
	if (params.force) {
		search.set('force', 'true');
		if (params.matchday != null) {
			search.set('matchday', String(params.matchday));
		}
		params.matchScheduleIds?.forEach((id) => search.append('matchScheduleIds', id));
	}
	const result = await apiFetch(apiUrl(`/api/admin/marathonbet/sync-slot?${search}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export type SiteAccessProbeVerdict =
	| 'PASS'
	| 'CLOUDFLARE_JS_CHALLENGE'
	| 'HTTP_BLOCKED'
	| 'NETWORK_ERROR';

export type SiteAccessProbeResult = {
	verdict: SiteAccessProbeVerdict | string;
	requestedUrl?: string | null;
	finalUrl?: string | null;
	httpStatus?: number | null;
	durationMs?: number | null;
	serverHeader?: string | null;
	cfRay?: string | null;
	cfMitigated?: string | null;
	cloudflareDetected?: boolean;
	jsChallengeSuspected?: boolean;
	bodySnippet?: string | null;
	errorDetail?: string | null;
};

export async function probeSiteAccess(url: string): Promise<SiteAccessProbeResult> {
	const result = await apiFetch(apiUrl('/api/admin/external-data/site-access-probe'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ url }),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
