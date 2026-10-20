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
	/** Родитель владеет GET .../current — не стартовать свой запрос (даже пока ready=false). */
	preferPrefetchedNode = false,
	prefetchedNode,
	prefetchedNodeReady = false,
}: {
	enabled: boolean;
	seasonId: string | undefined;
	refreshKey?: unknown;
	preferPrefetchedNode?: boolean;
	prefetchedNode?: Calendar | null;
	prefetchedNodeReady?: boolean;
}): {
	node: Calendar | undefined;
	items: NearestGameweekBetProgressItem[];
	complete: boolean;
	loading: boolean;
	calendarsReady: boolean;
} {
	const [fetchedNode, setFetchedNode] = useState<Calendar | undefined>(undefined);
	const [fetchedNodeReady, setFetchedNodeReady] = useState(false);
	const [items, setItems] = useState<NearestGameweekBetProgressItem[]>([]);
	const [progressLoading, setProgressLoading] = useState(false);

	useEffect(() => {
		if (preferPrefetchedNode) {
			return;
		}
		if (!enabled || !seasonId) {
			setFetchedNode(undefined);
			setFetchedNodeReady(false);
			return;
		}

		let cancelled = false;
		setFetchedNodeReady(false);

		const load = async (): Promise<void> => {
			try {
				const current = await getCurrentSeasonCalendarNode(seasonId);
				if (!cancelled) {
					setFetchedNode(current);
				}
			} catch {
				if (!cancelled) {
					setFetchedNode(undefined);
				}
			} finally {
				if (!cancelled) {
					setFetchedNodeReady(true);
				}
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [enabled, seasonId, refreshKey, preferPrefetchedNode]);

	const node = preferPrefetchedNode ? prefetchedNode ?? undefined : fetchedNode;
	const nodeReady = preferPrefetchedNode ? prefetchedNodeReady : fetchedNodeReady;

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
