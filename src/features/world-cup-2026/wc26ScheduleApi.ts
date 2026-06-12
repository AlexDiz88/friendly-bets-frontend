import { apiFetch } from '../../shared/apiClient';
import type { Wc26Match, Wc26Stage } from './wc26Schedule';
import type { Wc26TeamId } from './wc26Teams';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export interface Wc26ScheduleMatchApi {
	id: number;
	date: string;
	timeLocal: string;
	venueKey: string;
	stage: Wc26Stage;
	group?: string;
	home?: string;
	away?: string;
	labelKey?: string;
	kickoffUtc?: string;
	scoreView: string;
	status?: string;
	finalized?: boolean;
	utcDate?: string;
}

export interface Wc26SchedulePageApi {
	matches: Wc26ScheduleMatchApi[];
}

export interface Wc26MatchWithResult extends Wc26Match {
	kickoffUtc?: string;
	scoreView?: string;
	status?: string;
	finalized?: boolean;
	utcDate?: string;
}

function toMatch(entry: Wc26ScheduleMatchApi): Wc26MatchWithResult {
	return {
		id: entry.id,
		date: entry.date,
		timeLocal: entry.timeLocal,
		venueKey: entry.venueKey,
		stage: entry.stage,
		group: entry.group,
		home: entry.home as Wc26TeamId | undefined,
		away: entry.away as Wc26TeamId | undefined,
		labelKey: entry.labelKey,
		kickoffUtc: entry.kickoffUtc,
		scoreView: entry.scoreView !== '—' ? entry.scoreView : undefined,
		status: entry.status,
		finalized: entry.finalized,
		utcDate: entry.utcDate,
	};
}

export async function fetchWc26SchedulePage(season?: string): Promise<Wc26MatchWithResult[]> {
	const params = new URLSearchParams();
	if (season) {
		params.set('season', season);
	}
	const query = params.toString();
	const result = await apiFetch(apiUrl(`/api/wc26/schedule${query ? `?${query}` : ''}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const body = (await result.json()) as Wc26SchedulePageApi;
	return (body.matches ?? []).map(toMatch);
}
