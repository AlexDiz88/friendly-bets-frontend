import { apiFetch } from '../../../shared/apiClient';
import Season from './types/Season';
import { SeasonWithoutDates } from './types/Season';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function getSeasonsWithoutDates(): Promise<{ seasons: SeasonWithoutDates[] }> {
	const result = await apiFetch(apiUrl('/api/seasons/without-dates'));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function assignSeasonDates(
	seasonId: string,
	startDate: string,
	endDate: string
): Promise<Season> {
	const result = await apiFetch(apiUrl(`/api/seasons/${seasonId}/dates`), {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ startDate, endDate }),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
