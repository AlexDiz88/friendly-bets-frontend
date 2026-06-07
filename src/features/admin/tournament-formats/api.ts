import { apiFetch } from '../../../shared/apiClient';
import TournamentFormat, { NewTournamentFormat, UpdateTournamentFormat } from './types/TournamentFormat';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function getTournamentFormats(): Promise<{ formats: TournamentFormat[] }> {
	const result = await apiFetch(apiUrl('/api/tournament-formats'));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function createTournamentFormat(body: NewTournamentFormat): Promise<TournamentFormat> {
	const result = await apiFetch(apiUrl('/api/tournament-formats'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function updateTournamentFormat(
	id: string,
	body: UpdateTournamentFormat
): Promise<TournamentFormat> {
	const result = await apiFetch(apiUrl(`/api/tournament-formats/${encodeURIComponent(id)}`), {
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

/** @deprecated use updateTournamentFormat */
export async function updateTournamentFormatName(
	id: string,
	name: string
): Promise<TournamentFormat> {
	return updateTournamentFormat(id, {
		name,
		regularStage: null,
		groupStage: null,
		playoff: null,
	});
}

export async function deleteTournamentFormat(id: string): Promise<void> {
	const result = await apiFetch(apiUrl(`/api/tournament-formats/${encodeURIComponent(id)}`), {
		method: 'DELETE',
	});
	if (result.status >= 400) {
		const body = await result.json().catch(() => ({ message: '' }));
		const { message } = body as { message?: string };
		throw new Error(message || 'delete failed');
	}
}
