import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type UtcTimestampsMigrationResult = {
	collections?: Record<string, { scanned?: number; modified?: number }>;
	accountsTimezoneBackfilled?: number;
	message?: string;
};

export type MatchScheduleExternalIdsMigrationResult = {
	matched?: number;
	modified?: number;
	message?: string;
};

export async function migrateTimestampsToUtcInstant(): Promise<UtcTimestampsMigrationResult> {
	const result = await apiFetch(apiUrl('/api/admin/scripts/migrate-timestamps-to-utc-instant'), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function unsetMatchScheduleExternalIds(): Promise<MatchScheduleExternalIdsMigrationResult> {
	const result = await apiFetch(apiUrl('/api/admin/scripts/unset-match-schedule-external-ids'), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
