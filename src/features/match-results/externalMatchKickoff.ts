import { parseUtcDate } from '../../shared/utcDate';
import { wc26DateLocale } from '../world-cup-2026/wc26Time';
import { isMatchNotStarted } from './matchStatusI18n';
import type { ExternalMatch } from './types/ExternalMatch';

export interface ExternalMatchBerlinKickoff {
	kickoff: string;
	dateLabel: string;
	kickoffUtcMs: number;
}

function formatUtcTime(utcDate: string | null | undefined): string {
	const d = parseUtcDate(utcDate);
	if (!d) {
		return '';
	}
	const hh = String(d.getUTCHours()).padStart(2, '0');
	const mm = String(d.getUTCMinutes()).padStart(2, '0');
	return `${hh}:${mm}`;
}

function formatUtcDateLabel(utcDate: string | null | undefined, language: string): string {
	const date = parseUtcDate(utcDate);
	if (!date) {
		return '—';
	}
	return new Intl.DateTimeFormat(wc26DateLocale(language), {
		timeZone: 'UTC',
		day: 'numeric',
		month: 'short',
	}).format(date);
}

/** Kickoff UTC (ms) from stored utcDate only. */
export function resolveExternalMatchKickoffUtcMs(match: ExternalMatch): number {
	return parseUtcDate(match.utcDate)?.getTime() ?? 0;
}

/** Display time/date from stored utcDate (UTC+0). */
export function resolveExternalMatchBerlinKickoff(
	match: ExternalMatch,
	_slotId?: string,
	language?: string
): ExternalMatchBerlinKickoff {
	return {
		kickoff: formatUtcTime(match.utcDate),
		dateLabel: formatUtcDateLabel(match.utcDate, language ?? 'ru'),
		kickoffUtcMs: parseUtcDate(match.utcDate)?.getTime() ?? 0,
	};
}

/** Пуск прошёл, но провайдер ещё не обновил статус (SCHEDULED/TIMED). */
export function isExternalMatchAwaitingLiveSync(
	matchStatus: string,
	kickoffUtcMs: number
): boolean {
	return kickoffUtcMs > 0 && Date.now() >= kickoffUtcMs && isMatchNotStarted(matchStatus);
}
