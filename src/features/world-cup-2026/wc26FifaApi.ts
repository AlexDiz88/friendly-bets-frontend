import { apiFetch } from '../../shared/apiClient';
import type { Wc26Stage } from './wc26Schedule';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type Wc26QualificationStatus = 'direct' | 'best_third' | 'eliminated' | 'pending';

export interface Wc26FifaStandingRow {
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
	liveNow: boolean;
	liveMatchGoals?: number | null;
	liveMatchScore?: string | null;
}

export interface Wc26FifaGroupTable {
	group: string;
	rows: Wc26FifaStandingRow[];
}

export interface Wc26FifaBestThirdRow {
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

export interface Wc26FifaStandingsPage {
	groups: Wc26FifaGroupTable[];
	bestThirdPlaces: Wc26FifaBestThirdRow[];
	fetchedAt?: string;
	sourceUrl?: string;
}

export interface Wc26FifaBracketMatch {
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
	liveMinuteLabel?: string | null;
	utcDate?: string;
}

export interface Wc26FifaBracketPage {
	matches: Wc26FifaBracketMatch[];
	fetchedAt?: string;
	sourceUrl?: string;
}

export async function fetchWc26FifaStandings(group?: string): Promise<Wc26FifaStandingsPage> {
	const params = new URLSearchParams();
	if (group && group !== 'all') {
		params.set('group', group);
	}
	const query = params.toString();
	const result = await apiFetch(apiUrl(`/api/wc26/fifa/standings${query ? `?${query}` : ''}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return (await result.json()) as Wc26FifaStandingsPage;
}

export async function fetchWc26FifaBracket(stage?: string): Promise<Wc26FifaBracketPage> {
	const params = new URLSearchParams();
	if (stage && stage !== 'all') {
		params.set('stage', stage);
	}
	const query = params.toString();
	const result = await apiFetch(apiUrl(`/api/wc26/fifa/bracket${query ? `?${query}` : ''}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return (await result.json()) as Wc26FifaBracketPage;
}
