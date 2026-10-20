import { apiFetch } from '../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export const ERROR_LOGS_PAGE_SIZES = [20, 50, 100, 500] as const;
export type ErrorLogsPageSize = (typeof ERROR_LOGS_PAGE_SIZES)[number];
export const DEFAULT_ERROR_LOGS_PAGE_SIZE: ErrorLogsPageSize = 20;

export type ErrorLogEntry = {
	id: string;
	createdAt: string;
	severity: string;
	layer?: string | null;
	provider?: string | null;
	providerRole?: string | null;
	code: string;
	message?: string | null;
	leagueCode?: string | null;
	season?: string | null;
	matchday?: number | null;
	matchScheduleId?: string | null;
	externalMatchId?: string | null;
	homeTeam?: string | null;
	awayTeam?: string | null;
	homeTeamTitle?: string | null;
	awayTeamTitle?: string | null;
	homeTeamLogoKey?: string | null;
	awayTeamLogoKey?: string | null;
	failedMatches?: Array<{
		matchScheduleId?: string | null;
		homeTitle?: string | null;
		awayTitle?: string | null;
		homeLogoKey?: string | null;
		awayLogoKey?: string | null;
	}> | null;
	firstOccurredAt?: string | null;
	lastOccurredAt?: string | null;
	occurredAt?: string[] | null;
	occurrenceCount?: number | null;
	context?: Record<string, string> | null;
	archived?: boolean;
	archivedAt?: string | null;
};

export type ErrorLogsCount = {
	count: number;
	activeCount: number;
	archivedCount: number;
};

export async function fetchErrorLogs(params: {
	page: number;
	size: number;
	includeArchived?: boolean;
}): Promise<ErrorLogEntry[]> {
	const query = new URLSearchParams({
		page: String(params.page),
		size: String(params.size),
		includeArchived: String(params.includeArchived ?? false),
	});
	const result = await apiFetch(apiUrl(`/api/error-logs?${query}`), { method: 'GET' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function fetchErrorLogsCount(includeArchived = false): Promise<ErrorLogsCount> {
	const query = new URLSearchParams({
		includeArchived: String(includeArchived),
	});
	const result = await apiFetch(apiUrl(`/api/error-logs/count?${query}`), { method: 'GET' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const body: Partial<ErrorLogsCount> = await result.json();
	return {
		count: body.count ?? 0,
		activeCount: body.activeCount ?? 0,
		archivedCount: body.archivedCount ?? 0,
	};
}

export async function archiveErrorLog(id: string): Promise<void> {
	const result = await apiFetch(apiUrl(`/api/error-logs/${id}/archive`), { method: 'PATCH' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}

export async function unarchiveErrorLog(id: string): Promise<void> {
	const result = await apiFetch(apiUrl(`/api/error-logs/${id}/unarchive`), { method: 'PATCH' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}

export async function archiveAllErrorLogs(): Promise<number> {
	const result = await apiFetch(apiUrl('/api/error-logs/archive-all'), { method: 'POST' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const body: { archived?: number } = await result.json();
	return body.archived ?? 0;
}

export async function deleteErrorLog(id: string): Promise<void> {
	const result = await apiFetch(apiUrl(`/api/error-logs/${id}`), { method: 'DELETE' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}

/** Hard-delete active (non-archived) entries only. */
export async function clearErrorLogs(): Promise<number> {
	const result = await apiFetch(apiUrl('/api/error-logs'), { method: 'DELETE' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const body: { cleared?: number } = await result.json();
	return body.cleared ?? 0;
}

/** Hard-delete archived entries only. */
export async function clearArchivedErrorLogs(): Promise<number> {
	const result = await apiFetch(apiUrl('/api/error-logs/archived'), { method: 'DELETE' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const body: { cleared?: number } = await result.json();
	return body.cleared ?? 0;
}
