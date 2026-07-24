import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type Soccer365TeamNameChip = {
	externalName: string;
	provider: string;
	alreadyMapped: boolean;
};

export type Soccer365ScheduleSyncResult = {
	leagueCode: string;
	seasonId: string;
	currentMatchday: number;
	nextMatchday?: number | null;
	upserted: number;
	skippedUnmapped: number;
	roundsParsed: number;
	unmappedNames: string[];
};

export async function fetchSoccer365TeamNames(leagueCode: string): Promise<Soccer365TeamNameChip[]> {
	const params = new URLSearchParams({ leagueCode });
	const result = await apiFetch(apiUrl(`/api/admin/soccer365/team-names?${params}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function syncSoccer365Schedule(leagueCode: string): Promise<Soccer365ScheduleSyncResult> {
	const params = new URLSearchParams({ leagueCode });
	const result = await apiFetch(apiUrl(`/api/admin/soccer365/sync-schedule?${params}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
