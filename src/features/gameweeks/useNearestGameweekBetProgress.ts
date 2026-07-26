import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllSeasonCalendarNodes } from '../admin/calendars/calendarsSlice';
import { selectAllCalendarNodes } from '../admin/calendars/selectors';
import type Calendar from '../admin/calendars/types/Calendar';
import { getUserSlotBets } from '../bets/api';
import {
	pickDefaultCalendarNode,
	sortLeagueMatchdayNodesByLeagueCode,
} from './gameweekCalendarUtils';

export type NearestGameweekBetProgressItem = {
	leagueId: string;
	leagueCode: string;
	matchDay: string;
	used: number;
	limit: number;
};

export function useNearestGameweekBetProgress({
	enabled,
	seasonId,
	refreshKey,
}: {
	enabled: boolean;
	seasonId: string | undefined;
	refreshKey?: unknown;
}): {
	node: Calendar | undefined;
	items: NearestGameweekBetProgressItem[];
	complete: boolean;
	loading: boolean;
	calendarsReady: boolean;
} {
	const dispatch = useAppDispatch();
	const calendarNodes = useAppSelector(selectAllCalendarNodes);
	const [calendarsReady, setCalendarsReady] = useState(false);
	const [items, setItems] = useState<NearestGameweekBetProgressItem[]>([]);
	const [progressLoading, setProgressLoading] = useState(false);

	useEffect(() => {
		if (!enabled || !seasonId) {
			setCalendarsReady(false);
			return;
		}
		const alreadyLoaded = calendarNodes.some((n) => n.seasonId === seasonId);
		if (alreadyLoaded) {
			setCalendarsReady(true);
		} else {
			setCalendarsReady(false);
		}
		void dispatch(getAllSeasonCalendarNodes(seasonId)).finally(() => {
			setCalendarsReady(true);
		});
	}, [enabled, seasonId, dispatch]);

	const nearestNode = useMemo(() => {
		if (!enabled || !calendarsReady) {
			return undefined;
		}
		return pickDefaultCalendarNode(calendarNodes);
	}, [enabled, calendarsReady, calendarNodes]);

	const nearestNodeId = nearestNode?.id;
	const nearestLeagueNodes = nearestNode?.leagueMatchdayNodes;

	useEffect(() => {
		if (!enabled || !seasonId || !calendarsReady || !nearestNodeId || !nearestLeagueNodes) {
			setItems([]);
			setProgressLoading(false);
			return;
		}

		const nodes = sortLeagueMatchdayNodesByLeagueCode(nearestLeagueNodes).filter(
			(n) => n.leagueId && n.matchDay
		);

		if (nodes.length === 0) {
			setItems([]);
			setProgressLoading(false);
			return;
		}

		let cancelled = false;
		setProgressLoading(true);

		const load = async (): Promise<void> => {
			try {
				const results = await Promise.all(
					nodes.map(async (n) => {
						const limit = Math.max(n.betCountLimit ?? 0, 0);
						const { bets } = await getUserSlotBets(seasonId, n.leagueId, n.matchDay);
						return {
							leagueId: n.leagueId,
							leagueCode: n.leagueCode,
							matchDay: n.matchDay,
							used: bets.length,
							limit,
						};
					})
				);
				if (!cancelled) {
					setItems(results);
				}
			} catch {
				if (!cancelled) {
					setItems([]);
				}
			} finally {
				if (!cancelled) {
					setProgressLoading(false);
				}
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [enabled, seasonId, calendarsReady, nearestNodeId, nearestLeagueNodes, refreshKey]);

	const complete = useMemo(() => {
		if (items.length === 0) {
			return false;
		}
		return items.every((item) => item.limit > 0 && item.used >= item.limit);
	}, [items]);

	return {
		node: nearestNode,
		items,
		complete,
		loading: enabled && (!calendarsReady || progressLoading),
		calendarsReady,
	};
}
