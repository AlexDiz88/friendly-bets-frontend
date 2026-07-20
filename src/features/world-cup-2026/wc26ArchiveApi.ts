import { apiFetch } from '../../shared/apiClient';
import type { Wc26Stage } from './wc26Schedule';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type Wc26QualificationStatus = 'direct' | 'best_third' | 'eliminated' | 'pending';

export interface Wc26StandingRow {
	rank: number;
	fifaCode: string;
	sourceGroup?: string;
	played: number;
	wins: number;
	draws: number;
	losses: number;
	goalsFor: number;
	goalsAgainst: number;
	goalDifference: number;
	points: number;
	form: string[];
	qualificationStatus: Wc26QualificationStatus;
}

export interface Wc26GroupTable {
	group: string;
	rows: Wc26StandingRow[];
}

export interface Wc26BestThirdRow {
	rank: number;
	group: string;
	fifaCode: string;
	played: number;
	wins: number;
	draws: number;
	losses: number;
	points: number;
	goalDifference: number;
	goalsFor: number;
	goalsAgainst: number;
	qualifies: boolean;
}

export interface Wc26StandingsPage {
	groups: Wc26GroupTable[];
	bestThirdPlaces: Wc26BestThirdRow[];
	fetchedAt?: string;
}

export interface Wc26BracketMatch {
	matchNumber: number;
	stage: Wc26Stage;
	homeFifaCode?: string | null;
	awayFifaCode?: string | null;
	placeholderHome?: string | null;
	placeholderAway?: string | null;
	homeScore?: number | null;
	awayScore?: number | null;
	homePenaltyScore?: number | null;
	awayPenaltyScore?: number | null;
	winnerFifaCode?: string | null;
	status?: string;
	utcDate?: string;
}

export interface Wc26BracketPage {
	matches: Wc26BracketMatch[];
	fetchedAt?: string;
}

export async function fetchWc26Standings(group?: string): Promise<Wc26StandingsPage> {
	const params = new URLSearchParams();
	if (group && group !== 'all') {
		params.set('group', group);
	}
	const query = params.toString();
	const result = await apiFetch(apiUrl(`/api/wc26/standings${query ? `?${query}` : ''}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return (await result.json()) as Wc26StandingsPage;
}

export async function fetchWc26Bracket(stage?: string): Promise<Wc26BracketPage> {
	const params = new URLSearchParams();
	if (stage && stage !== 'all') {
		params.set('stage', stage);
	}
	const query = params.toString();
	const result = await apiFetch(apiUrl(`/api/wc26/bracket${query ? `?${query}` : ''}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return (await result.json()) as Wc26BracketPage;
}
