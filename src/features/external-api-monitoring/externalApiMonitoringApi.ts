import { apiFetch } from '../../shared/apiClient';

function apiUrl(path: string): string {
	const isLocalhost =
		window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	return isLocalhost ? path : `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type ExternalDataLayer = 'SCHEDULE' | 'ODDS' | 'LIVE' | 'FULL_MATCH';
export type MonitoringStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
export type MonitoringTrigger = 'CRON' | 'ADMIN' | 'ORCHESTRATOR';

export type MonitoringCounters = {
	requested?: number | null;
	upserted?: number | null;
	updated?: number | null;
	matched?: number | null;
	saved?: number | null;
	skipped?: number | null;
	skippedFar?: number | null;
	skippedNoBookieEvent?: number | null;
	skippedMissingKickoff?: number | null;
	mappingFailures?: number | null;
	sseCalls?: number | null;
	roundsParsed?: number | null;
	finishedDetected?: number | null;
	tournamentFetched?: boolean | null;
	eligible?: number | null;
};

export type MonitoringHttpLog = {
	requestType?: string | null;
	target?: string | null;
	httpStatus?: number | null;
	outcome?: string | null;
	durationMs?: number;
	detail?: string | null;
	retryAfterSeconds?: number | null;
	requestedAt?: string | null;
};

export type MonitoringRun = {
	id: string;
	layer: ExternalDataLayer;
	provider?: string | null;
	trigger?: MonitoringTrigger | null;
	status?: MonitoringStatus | null;
	startedAt?: string | null;
	finishedAt?: string | null;
	durationMs?: number | null;
	leagueCode?: string | null;
	season?: string | null;
	matchday?: number | null;
	slotOrders?: number[] | null;
	slotScope?: string | null;
	manual?: boolean;
	counters?: MonitoringCounters | null;
	httpRequestsTotal?: number;
	httpRequestsFailed?: number;
	httpLogs?: MonitoringHttpLog[];
	errorSummary?: string | null;
	failedMatchScheduleIds?: string[] | null;
	failoverUsed?: boolean;
};

export const MONITORING_LAYERS: ExternalDataLayer[] = [
	'SCHEDULE',
	'ODDS',
	'LIVE',
	'FULL_MATCH',
];

export async function fetchMonitoringRuns(
	layer: ExternalDataLayer,
	hours = 24,
	limit = 50
): Promise<MonitoringRun[]> {
	const params = new URLSearchParams({
		layer,
		hours: String(hours),
		limit: String(limit),
	});
	const result = await apiFetch(apiUrl(`/api/admin/external-api-monitoring?${params}`));
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function fetchMonitoringLatest(): Promise<Partial<Record<ExternalDataLayer, MonitoringRun>>> {
	const result = await apiFetch(apiUrl('/api/admin/external-api-monitoring/latest'));
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function fetchMonitoringRun(id: string): Promise<MonitoringRun> {
	const result = await apiFetch(apiUrl(`/api/admin/external-api-monitoring/${encodeURIComponent(id)}`));
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function deleteMonitoringRunsByLayer(layer: ExternalDataLayer): Promise<number> {
	const params = new URLSearchParams({ layer });
	const result = await apiFetch(apiUrl(`/api/admin/external-api-monitoring?${params}`), {
		method: 'DELETE',
	});
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	const body: { deleted?: number } = await result.json();
	return body.deleted ?? 0;
}
