import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export interface MatchResultSyncSettings {
	primaryProvider: string;
	secondaryProvider: string;
	dualVerificationEnabled: boolean;
	allowFinalizeWithoutSecondary: boolean;
	requireStablePolls: number;
	minMinutesAfterKickoff: number;
	minMinutesAfterKickoffKnockout: number;
	minMinutesSinceApiLastUpdated: number;
	autoSettleEnabled: boolean;
	autoSettleOnlyWhenMatchdayCompleted: boolean;
	envDefaults?: MatchResultSyncSettings;
}

export type PatchMatchResultSyncSettings = Partial<
	Pick<
		MatchResultSyncSettings,
		| 'primaryProvider'
		| 'secondaryProvider'
		| 'dualVerificationEnabled'
		| 'allowFinalizeWithoutSecondary'
		| 'requireStablePolls'
		| 'minMinutesAfterKickoff'
		| 'minMinutesAfterKickoffKnockout'
		| 'minMinutesSinceApiLastUpdated'
		| 'autoSettleOnlyWhenMatchdayCompleted'
	>
>;

export async function getMatchResultSyncSettings(): Promise<MatchResultSyncSettings> {
	const result = await apiFetch(apiUrl('/api/admin/match-result-sync-settings'));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function patchMatchResultSyncSettings(
	body: PatchMatchResultSyncSettings
): Promise<MatchResultSyncSettings> {
	const result = await apiFetch(apiUrl('/api/admin/match-result-sync-settings'), {
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
