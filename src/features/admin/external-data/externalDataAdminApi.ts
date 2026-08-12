import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type ExternalDataLayer = 'SCHEDULE' | 'ODDS' | 'LIVE' | 'FULL_MATCH' | 'STANDINGS';

export type LayerAssignment = {
	enabled?: boolean;
	primaryProvider?: string | null;
	secondaryProvider?: string | null;
};

export type ExternalDataLayerConfig = {
	layers: Partial<Record<ExternalDataLayer, LayerAssignment>>;
	capabilities: Record<string, string[]>;
	/** ODDS: hours before kickoff for force-refresh / existing-odds window. */
	oddsRefreshWithinHours?: number | null;
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
	body: Pick<ExternalDataLayerConfig, 'layers' | 'oddsRefreshWithinHours'>
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

export async function syncExternalLive(): Promise<{
	httpRequests: number;
	trackedCount: number;
	updated: number;
	finishedDetected: number;
	message?: string;
	datesSynced?: string[];
}> {
	const result = await apiFetch(apiUrl('/api/admin/external-data/live/sync'), {
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
	overwrittenCount: number;
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

export type ExternalStandingsSyncResult = {
	leagueCode: string;
	seasonId: string;
	leagueId: string;
	provider: string;
	rowsSaved: number;
	skippedUnmapped: number;
	unmappedNames: string[];
};

export async function fetchExternalTeamNames(
	provider: string,
	leagueCode: string,
	forceOverwrite = false
): Promise<ExternalTeamNamesLoadResult> {
	const params = new URLSearchParams({ provider, leagueCode });
	if (forceOverwrite) {
		params.set('forceOverwrite', 'true');
	}
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

export async function syncExternalStandings(
	leagueCode: string
): Promise<ExternalStandingsSyncResult> {
	const params = new URLSearchParams({ leagueCode });
	const result = await apiFetch(apiUrl(`/api/admin/external-data/standings/sync?${params}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export type OddsProviderSyncResult = {
	message: string;
	tournamentFetched: boolean;
	matchesEligible: number;
	matchesMatched: number;
	mergedSaved: number;
	sseCalls: number;
	mappingFailures: number;
	failedMatchScheduleIds?: string[];
};

/** Alias for existing call sites. */
export type MarathonbetOddsSyncResult = OddsProviderSyncResult;

/** Manual ODDS sync for a concrete provider (marathonbet / melbet). */
export async function syncOddsProviderSlot(params: {
	provider: string;
	leagueId: string;
	season?: string;
	force?: boolean;
	matchday?: number;
	matchScheduleIds?: string[];
}): Promise<OddsProviderSyncResult> {
	const provider = params.provider.trim().toLowerCase();
	const path =
		provider === 'melbet'
			? '/api/admin/melbet/sync-slot'
			: '/api/admin/marathonbet/sync-slot';
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
	const result = await apiFetch(apiUrl(`${path}?${search}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

/** Manual ODDS sync. Default: current matchday, missing odds only. Force: matchday + match ids. */
export async function syncMarathonbetOdds(params: {
	leagueId: string;
	season?: string;
	force?: boolean;
	matchday?: number;
	matchScheduleIds?: string[];
}): Promise<OddsProviderSyncResult> {
	return syncOddsProviderSlot({ ...params, provider: 'marathonbet' });
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
