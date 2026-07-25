import { apiFetch } from '../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

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
	context?: Record<string, string> | null;
};

export async function fetchErrorLogs(): Promise<ErrorLogEntry[]> {
	const result = await apiFetch(apiUrl('/api/error-logs'), { method: 'GET' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function fetchErrorLogsCount(): Promise<number> {
	const result = await apiFetch(apiUrl('/api/error-logs/count'), { method: 'GET' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const body: { count?: number } = await result.json();
	return body.count ?? 0;
}

export async function deleteErrorLog(id: string): Promise<void> {
	const result = await apiFetch(apiUrl(`/api/error-logs/${id}`), { method: 'DELETE' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}

export async function clearErrorLogs(): Promise<number> {
	const result = await apiFetch(apiUrl('/api/error-logs'), { method: 'DELETE' });
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const body: { cleared?: number } = await result.json();
	return body.cleared ?? 0;
}
