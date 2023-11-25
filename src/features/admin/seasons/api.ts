/* eslint-disable @typescript-eslint/restrict-template-expressions */
import League from '../leagues/types/League';
import Season from './types/Season';

export async function dbRework(): Promise<{ seasons: Season[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons/db-rework`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/seasons/db-rework';
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function addSeason(title: string, betCountPerMatchDay: number): Promise<Season> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/seasons';
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify({ title, betCountPerMatchDay }),
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

export async function getSeasons(): Promise<{ seasons: Season[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/seasons';
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getSeasonStatusList(): Promise<string[]> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons/statuses`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/seasons/statuses';
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function changeSeasonStatus(id: string, status: string): Promise<Season> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons/${id}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/seasons/${id}`;
	}
	const result = await fetch(`${url}`, {
		method: 'PATCH',
		body: JSON.stringify(status),
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

export async function getActiveSeason(): Promise<Season> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons/active`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/seasons/active';
	}
	const result = await fetch(`${url}`);

	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getActiveSeasonId(): Promise<{ value: string }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons/active/id`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/seasons/active/id';
	}
	const result = await fetch(`${url}`);

	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getScheduledSeason(): Promise<Season> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons/scheduled`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/seasons/scheduled';
	}
	const result = await fetch(`${url}`);

	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function registrationInSeason(seasonId: string): Promise<Season> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/seasons/registration/${seasonId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/seasons/registration/${seasonId}`;
	}
	const result = await fetch(`${url}`, {
		method: 'PUT',
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

// export async function getLeaguesBySeason(seasonId: string): Promise<Season> {
//   let url = `${import.meta.env.VITE_PRODUCT_SERVER}/login`;
//   if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
//     url = '/login';
//   }
//   const result = await fetch(`/api/seasons/${seasonId}/leagues`);
//   if (result.status >= 400) {
//     const { message }: { message: string } = await result.json();
//     throw new Error(message);
//   }
//   return result.json();
// }

export async function addLeagueToSeason(
	seasonId: string,
	displayNameRu: string,
	displayNameEn: string,
	shortNameRu: string,
	shortNameEn: string
): Promise<Season> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/seasons/${seasonId}/leagues`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/seasons/${seasonId}/leagues`;
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify({
			displayNameRu,
			displayNameEn,
			shortNameRu,
			shortNameEn,
		}),
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

export async function addTeamToLeagueInSeason(
	seasonId: string,
	leagueId: string,
	teamId: string
): Promise<League> {
	let url = `${
		import.meta.env.VITE_PRODUCT_SERVER || ''
	}/api/seasons/${seasonId}/leagues/${leagueId}/teams/${teamId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/seasons/${seasonId}/leagues/${leagueId}/teams/${teamId}`;
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
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
