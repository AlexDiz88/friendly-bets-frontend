import { apiFetch } from '../../../shared/apiClient';
import { UpdateTeamPayload } from './teamFormUtils';
import NewTeam from './types/NewTeam';
import Team from './types/Team';

function teamsBaseUrl(): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return '/api/teams';
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/teams`;
}

export async function createTeam(payload: NewTeam): Promise<Team> {
	const result = await apiFetch(teamsBaseUrl(), {
		method: 'POST',
		body: JSON.stringify(payload),
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

export async function updateTeam(teamId: string, payload: UpdateTeamPayload): Promise<Team> {
	const result = await apiFetch(`${teamsBaseUrl()}/${teamId}`, {
		method: 'PATCH',
		body: JSON.stringify(payload),
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
	const result = await apiFetch(teamsBaseUrl());
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getLeagueTeams(leagueId: string): Promise<{ teams: Team[] }> {
	const result = await apiFetch(`${teamsBaseUrl()}/${leagueId}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
