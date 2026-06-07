/**
 * Обёртка над fetch для API Friendly Bets: всегда отправляет session / remember-me cookies.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
	return fetch(input, {
		...init,
		credentials: 'include',
	});
}
