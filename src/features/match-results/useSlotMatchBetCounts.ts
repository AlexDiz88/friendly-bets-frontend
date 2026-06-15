import { useEffect, useMemo, useState } from 'react';
import { getSlotMatchBetCounts } from '../bets/api';

export function useSlotMatchBetCounts({
	enabled,
	contextReady,
	seasonId,
	leagueId,
	matchDay,
	refreshKey,
}: {
	enabled: boolean;
	contextReady: boolean;
	seasonId: string | undefined;
	leagueId: string | undefined;
	matchDay: string;
	refreshKey?: unknown;
}): { countsByMatch: Map<string, number>; loading: boolean } {
	const [counts, setCounts] = useState<Record<string, number>>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!enabled || !contextReady || !seasonId || !leagueId) {
			setCounts({});
			setLoading(false);
			return;
		}

		let cancelled = false;
		setLoading(true);

		const load = async (): Promise<void> => {
			try {
				const { counts: slotCounts } = await getSlotMatchBetCounts(seasonId, leagueId, matchDay);
				if (cancelled) {
					return;
				}
				setCounts(slotCounts ?? {});
			} catch {
				if (!cancelled) {
					setCounts({});
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [enabled, contextReady, seasonId, leagueId, matchDay, refreshKey]);

	const countsByMatch = useMemo(() => new Map(Object.entries(counts)), [counts]);

	return { countsByMatch, loading: loading && enabled };
}

export function matchBetCountKey(homeTeamId: string, awayTeamId: string): string {
	return `${homeTeamId}_${awayTeamId}`;
}
