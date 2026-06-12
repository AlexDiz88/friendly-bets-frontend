import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { pageHasLiveMatches } from '../../shared/livePagePolling';
import { useLivePagePolling } from '../../shared/useLivePagePolling';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { resolveExternalSeasonForLeague } from '../football-data/seasonExternalYear';
import { fetchWc26SchedulePage, type Wc26MatchWithResult } from './wc26ScheduleApi';

export interface Wc26SchedulePageState {
	matches: Wc26MatchWithResult[];
	loading: boolean;
	error: string | null;
}

export function useWc26SchedulePage(): Wc26SchedulePageState {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const [matches, setMatches] = useState<Wc26MatchWithResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const externalSeason = resolveExternalSeasonForLeague(activeSeason, 'WC');

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	const loadSchedule = useCallback(
		async (options?: { silent?: boolean }): Promise<void> => {
			const silent = options?.silent ?? false;
			if (!silent) {
				setLoading(true);
			}
			setError(null);
			try {
				const page = await fetchWc26SchedulePage(externalSeason);
				setMatches(page);
			} catch (err) {
				if (!silent) {
					setMatches([]);
					setError(err instanceof Error ? err.message : 'wc26ScheduleLoadError');
				}
			} finally {
				if (!silent) {
					setLoading(false);
				}
			}
		},
		[externalSeason]
	);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			await loadSchedule();
			if (cancelled) {
				return;
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [loadSchedule]);

	const hasLiveMatches = useMemo(() => pageHasLiveMatches(matches), [matches]);

	useLivePagePolling(!loading && !error && hasLiveMatches, () => loadSchedule({ silent: true }));

	return { matches, loading, error };
}
