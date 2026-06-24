import { isLiveMatchStatus } from '../match-results/externalMatchScoreView';
import type { Wc26MatchWithResult } from './wc26ScheduleApi';

/** «2:1 (0:0)» → «2:1»; пусто → «0:0». */
export function compactLiveScore(scoreView?: string | null): string {
	if (!scoreView || scoreView.trim() === '—') {
		return '0:0';
	}
	const trimmed = scoreView.trim();
	const space = trimmed.indexOf(' ');
	return space > 0 ? trimmed.slice(0, space) : trimmed;
}

/** Голы хозяев и гостей из scoreView матча. */
export function parseMatchGoals(scoreView?: string | null): { home: number; away: number } {
	const [homeRaw, awayRaw] = compactLiveScore(scoreView).split(':');
	const home = Number.parseInt(homeRaw, 10);
	const away = Number.parseInt(awayRaw, 10);
	return {
		home: Number.isFinite(home) ? home : 0,
		away: Number.isFinite(away) ? away : 0,
	};
}

export function formatTeamLiveScore(teamGoals: number, opponentGoals: number): string {
	return `${teamGoals}:${opponentGoals}`;
}

export function isWc26ScheduleMatchLive(match: Wc26MatchWithResult): boolean {
	if (match.finalized) {
		return false;
	}
	if (isLiveMatchStatus(match.status ?? '')) {
		return true;
	}
	return Boolean(match.liveMinuteLabel && match.liveMinuteLabel.trim());
}

/** FIFA-код команды → live-счёт с точки зрения команды (её голы : голы соперника). */
export function liveScoresByFifaFromSchedule(
	matches: Wc26MatchWithResult[]
): Record<string, string> {
	const result: Record<string, string> = {};
	for (const match of matches) {
		if (!isWc26ScheduleMatchLive(match) || !match.home || !match.away) {
			continue;
		}
		const { home, away } = parseMatchGoals(match.scoreView);
		result[match.home] = formatTeamLiveScore(home, away);
		result[match.away] = formatTeamLiveScore(away, home);
	}
	return result;
}
