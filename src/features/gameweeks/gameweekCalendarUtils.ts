import dayjs, { Dayjs } from 'dayjs';
import Calendar from '../admin/calendars/types/Calendar';
import SimpleUser from '../auth/types/SimpleUser';
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

export function sortLeagueMatchdayNodesByLeagueCode<T extends { leagueCode?: string }>(
	nodes: T[]
): T[] {
	return [...nodes].sort(
		(a, b) => gameweekLeagueSortIndex(a.leagueCode) - gameweekLeagueSortIndex(b.leagueCode)
	);
}

/**
 * Запасной выбор тура только по датам start/end (якорь = вчера).
 * Основной выбор текущего gameweek — backend
 * {@code GET /api/calendars/seasons/{id}/current} (матчи → даты).
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

/** Аватар игрока на «По турам» берётся из сезона, а не из каждой ставки. */
export function attachSeasonPlayersToBets(bets: Bet[], players: SimpleUser[]): Bet[] {
	if (bets.length === 0 || players.length === 0) {
		return bets;
	}
	const byId = new Map(players.map((player) => [player.id, player]));
	return bets.map((bet) => {
		const player = bet.player?.id ? byId.get(bet.player.id) : undefined;
		if (!player) {
			return bet;
		}
		return {
			...bet,
			player: {
				id: player.id,
				username: player.username,
				avatar: player.avatar,
			},
		};
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
