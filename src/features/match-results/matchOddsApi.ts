import { apiFetch } from '../../shared/apiClient';
import { OddsEventMarkets } from '../../components/odds/oddsTypes';

function apiUrl(path: string): string {
	const isLocalhost =
		window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	return isLocalhost ? path : `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function getOddsEventMarkets(matchScheduleId: string): Promise<OddsEventMarkets> {
	const result = await apiFetch(apiUrl(`/api/odds/events/${encodeURIComponent(matchScheduleId)}`));
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
