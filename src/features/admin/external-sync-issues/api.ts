import { apiFetch } from '../../../shared/apiClient';
import { ExternalSyncIssue } from './types/ExternalSyncIssue';
import { UnmappedExternalTeamName } from './types/UnmappedExternalTeamName';

export const API_SYNC_ISSUES_CHANGED_EVENT = 'friendlybets:api-sync-issues-changed';

/** @deprecated use API_SYNC_ISSUES_CHANGED_EVENT */
export const EXTERNAL_SYNC_ISSUES_CHANGED_EVENT = API_SYNC_ISSUES_CHANGED_EVENT;

export function notifyApiSyncIssuesChanged(): void {
	window.dispatchEvent(new Event(API_SYNC_ISSUES_CHANGED_EVENT));
}

export function notifyExternalSyncIssuesChanged(): void {
	notifyApiSyncIssuesChanged();
}

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function getUnmappedExternalTeamNames(): Promise<UnmappedExternalTeamName[]> {
	const result = await apiFetch(apiUrl('/api/admin/api-sync-issues/unmapped-team-names'));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getExternalSyncIssuesStatus(): Promise<{
	hasIssues: boolean;
	hasScoreChangeIssues: boolean;
}> {
	const result = await apiFetch(apiUrl('/api/admin/api-sync-issues/status'));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getExternalSyncIssues(): Promise<ExternalSyncIssue[]> {
	const result = await apiFetch(apiUrl('/api/admin/api-sync-issues'));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function clearExternalSyncIssues(): Promise<void> {
	const result = await apiFetch(apiUrl('/api/admin/api-sync-issues'), { method: 'DELETE' });
	if (result.status >= 400) {
		const body = await result.json().catch(() => ({ message: '' }));
		const { message } = body as { message?: string };
		throw new Error(message || 'clear failed');
	}
}

export async function deleteExternalSyncIssue(id: string): Promise<void> {
	const result = await apiFetch(apiUrl(`/api/admin/api-sync-issues/${encodeURIComponent(id)}`), {
		method: 'DELETE',
	});
	if (result.status >= 400) {
		const body = await result.json().catch(() => ({ message: '' }));
		const { message } = body as { message?: string };
		throw new Error(message || 'delete failed');
	}
}

