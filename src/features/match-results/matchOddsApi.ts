import { apiFetch } from '../../shared/apiClient';
import { OddsEventMarkets } from '../../components/odds/oddsTypes';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function getOddsEventMarkets(gameResultId: string): Promise<OddsEventMarkets> {
	const result = await apiFetch(apiUrl(`/api/odds/events/${encodeURIComponent(gameResultId)}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
