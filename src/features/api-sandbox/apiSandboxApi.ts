import { apiFetch } from '../../shared/apiClient';
import type { ExternalDataLayer } from '../admin/external-data/externalDataAdminApi';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type SandboxResult = {
	success: boolean;
	layer: ExternalDataLayer | string;
	provider: string;
	durationMs?: number | null;
	errorKey?: string | null;
	errorDetail?: string | null;
	parsed?: unknown;
};

async function postSandbox(path: string, body: unknown): Promise<SandboxResult> {
	const result = await apiFetch(apiUrl(path), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function sandboxSchedule(body: {
	provider: string;
	competitionId?: number;
	round?: number;
	limit?: number;
}): Promise<SandboxResult> {
	return postSandbox('/api/admin/external-data/sandbox/schedule', body);
}

export async function sandboxOdds(body: {
	provider: string;
	mode: 'tournament' | 'event';
	treeId: number;
}): Promise<SandboxResult> {
	return postSandbox('/api/admin/external-data/sandbox/odds', body);
}

export async function sandboxLive(body: {
	provider: string;
	date: string;
	titleContains?: string;
}): Promise<SandboxResult> {
	return postSandbox('/api/admin/external-data/sandbox/live', body);
}

export async function sandboxFullMatch(body: {
	provider: string;
	gameId: string;
}): Promise<SandboxResult> {
	return postSandbox('/api/admin/external-data/sandbox/full-match', body);
}
