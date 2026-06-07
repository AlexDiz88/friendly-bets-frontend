import dayjs, { Dayjs } from 'dayjs';
import Calendar from '../admin/calendars/types/Calendar';
import Bet from '../bets/types/Bet';

/** Порядок лиг в сетке ставок участника на странице «По турам». */
export const GAMEWEEK_LEAGUE_SORT_ORDER = ['EPL', 'BL', 'CL', 'LE'] as const;

function gameweekLeagueSortIndex(leagueCode: string | undefined): number {
	const idx = GAMEWEEK_LEAGUE_SORT_ORDER.indexOf(
		leagueCode as (typeof GAMEWEEK_LEAGUE_SORT_ORDER)[number]
	);
	return idx === -1 ? GAMEWEEK_LEAGUE_SORT_ORDER.length : idx;
}

export function sortGameweekBetsByLeagueCode(bets: Bet[]): Bet[] {
	return [...bets].sort(
		(a, b) => gameweekLeagueSortIndex(a.leagueCode) - gameweekLeagueSortIndex(b.leagueCode)
	);
}

/**
 * Тур по умолчанию при открытии «По турам»:
 * 1) текущий по датам start/end (с учётом «вчера»);
 * 2) иначе ближайший к сегодня по startDate.
 */
export function pickDefaultCalendarNode(calendarNodes: Calendar[]): Calendar | undefined {
	if (calendarNodes.length === 0) {
		return undefined;
	}

	const now: Dayjs = dayjs().add(-1, 'day');

	const activeNode = calendarNodes.find(
		(node) =>
			node.startDate &&
			node.endDate &&
			now.isAfter(node.startDate) &&
			now.isBefore(node.endDate)
	);
	if (activeNode) {
		return activeNode;
	}

	return calendarNodes.reduce((prev, curr) => {
		const prevDiff = prev.startDate ? Math.abs(now.diff(prev.startDate)) : Infinity;
		const currDiff = curr.startDate ? Math.abs(now.diff(curr.startDate)) : Infinity;
		return currDiff < prevDiff ? curr : prev;
	});
}

export const GAMEWEEK_NEIGHBOR_PREFETCH_DELAY_MS = 1500;

/** Предыдущий и следующий тур в списке (порядок как в селекте). */
export function prefetchGameweekNeighborBets(
	calendarNodes: Calendar[],
	currentNodeId: string,
	prefetch: (nodeId: string) => void
): void {
	const index = calendarNodes.findIndex((n) => n.id === currentNodeId);
	if (index < 0) {
		return;
	}
	const prev = calendarNodes[index - 1];
	const next = calendarNodes[index + 1];
	if (prev) {
		prefetch(prev.id);
	}
	if (next) {
		prefetch(next.id);
	}
}
