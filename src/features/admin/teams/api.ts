/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Team from './types/Team';

export async function createTeam(
	fullTitleRu: string,
	fullTitleEn: string,
	country: string
): Promise<Team> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/teams`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/teams';
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify({ fullTitleRu, fullTitleEn, country }),
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

export async function getAllTeams(): Promise<{ teams: Team[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/teams`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/teams';
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getLeagueTeams(leagueId: string): Promise<{ teams: Team[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/teams/${leagueId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/teams/${leagueId}`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
