/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Bet, { BetId } from './types/Bet';
import BetsPage from './types/BetsPage';
import NewBet from './types/NewBet';
import NewEmptyBet from './types/NewEmptyBet';
import NewGameResult from './types/NewGameResult';
import UpdatedBet from './types/UpdatedBet';

export async function addBet(newBet: NewBet): Promise<Bet> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/bets/add`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/bets/add`;
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify(newBet),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function addEmptyBet(newEmptyBet: NewEmptyBet): Promise<Bet> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/bets/add/empty`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/bets/add/empty`;
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify(newEmptyBet),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function setBetResult(betId: string, newGameResult: NewGameResult): Promise<Bet> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/bets/${betId}/set-bet-result`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/bets/${betId}/set-bet-result`;
	}
	const result = await fetch(`${url}`, {
		method: 'PUT',
		body: JSON.stringify(newGameResult),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getOpenedBets(seasonId: string): Promise<{ bets: Bet[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/bets/opened/seasons/${seasonId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/bets/opened/seasons/${seasonId}`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

// export async function getCompletedBets(
// 	seasonId: string,
// 	playerId?: string,
// 	leagueId?: string,
// 	size?: string,
// 	pageNumber?: number
// ): Promise<BetsPage> {
// 	const queryParams = new URLSearchParams({
// 		...(playerId && { playerId }),
// 		...(leagueId && { leagueId }),
// 		...(size && { size }),
// 		...(pageNumber && { page: pageNumber.toString() }),
// 	});

// 	const queryString = queryParams.toString();
// 	const baseUrl =
// 		import.meta.env.VITE_PRODUCT_SERVER === 'localhost' ? '' : import.meta.env.VITE_PRODUCT_SERVER;

// 	const url = `${baseUrl}/api/bets/completed/seasons/${seasonId}${
// 		queryString ? `?${queryString}` : ''
// 	}`;

// 	const result = await fetch(url);

// 	if (result.status >= 400) {
// 		const { message }: { message: string } = await result.json();
// 		throw new Error(message);
// 	}

// 	return result.json();
// }

export async function getCompletedBets(
	seasonId: string,
	playerId?: string,
	leagueId?: string,
	size?: string,
	pageNumber?: number
): Promise<BetsPage> {
	const queryParams = new URLSearchParams();
	if (playerId) queryParams.append('playerId', playerId);
	if (leagueId) queryParams.append('leagueId', leagueId);
	if (size) queryParams.append('size', size);
	if (pageNumber) queryParams.append('page', pageNumber.toString());
	const queryString = queryParams.toString();
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/bets/completed/seasons/${seasonId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/bets/completed/seasons/${seasonId}`;
	}
	if (queryString) {
		url += `?${queryString}`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getAllBets(
	seasonId: string,
	size?: string,
	pageNumber?: number
): Promise<BetsPage> {
	const queryParams = new URLSearchParams();
	if (size) queryParams.append('size', size);
	if (pageNumber) queryParams.append('page', pageNumber.toString());
	const queryString = queryParams.toString();
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/bets/all/seasons/${seasonId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/bets/all/seasons/${seasonId}`;
	}
	if (queryString) {
		url += `?${queryString}`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function updateBet(betId: string, editedBet: UpdatedBet): Promise<Bet> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/bets/${betId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/bets/${betId}`;
	}
	const result = await fetch(`${url}`, {
		method: 'PUT',
		body: JSON.stringify(editedBet),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function deleteBet(
	betId: BetId,
	seasonId: string,
	leagueId: string,
	calendarNodeId: string
): Promise<Bet> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/bets/${betId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/bets/${betId}`;
	}
	const result = await fetch(`${url}`, {
		method: 'DELETE',
		body: JSON.stringify({ seasonId, leagueId, calendarNodeId }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
