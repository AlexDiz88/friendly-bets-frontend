import { useEffect, useMemo, useState } from 'react';
import type Calendar from '../admin/calendars/types/Calendar';
import { getCurrentSeasonCalendarNode } from '../admin/calendars/api';
import { getUserSlotBets } from '../bets/api';
import { sortLeagueMatchdayNodesByLeagueCode } from './gameweekCalendarUtils';

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
	const [node, setNode] = useState<Calendar | undefined>(undefined);
	const [nodeReady, setNodeReady] = useState(false);
	const [items, setItems] = useState<NearestGameweekBetProgressItem[]>([]);
	const [progressLoading, setProgressLoading] = useState(false);

	useEffect(() => {
		if (!enabled || !seasonId) {
			setNode(undefined);
			setNodeReady(false);
			return;
		}

		let cancelled = false;
		setNodeReady(false);

		const load = async (): Promise<void> => {
			try {
				const current = await getCurrentSeasonCalendarNode(seasonId);
				if (!cancelled) {
					setNode(current);
				}
			} catch {
				if (!cancelled) {
					setNode(undefined);
				}
			} finally {
				if (!cancelled) {
					setNodeReady(true);
				}
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [enabled, seasonId, refreshKey]);

	const nearestNodeId = node?.id;
	const nearestLeagueNodes = node?.leagueMatchdayNodes;

	useEffect(() => {
		if (!enabled || !seasonId || !nodeReady || !nearestNodeId || !nearestLeagueNodes) {
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
	}, [enabled, seasonId, nodeReady, nearestNodeId, nearestLeagueNodes, refreshKey]);

	const complete = useMemo(() => {
		if (items.length === 0) {
			return false;
		}
		return items.every((item) => item.limit > 0 && item.used >= item.limit);
	}, [items]);

	return {
		node,
		items,
		complete,
		loading: enabled && (!nodeReady || progressLoading),
		calendarsReady: nodeReady,
	};
}
