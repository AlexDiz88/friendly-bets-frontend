import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type ExternalDataLayer = 'SCHEDULE' | 'ODDS' | 'LIVE' | 'FULL_MATCH';

export type LayerAssignment = {
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
