import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);

		const load = async (): Promise<void> => {
			try {
				const page = await fetchWc26SchedulePage(externalSeason);
				if (!cancelled) {
					setMatches(page);
				}
			} catch (err) {
				if (!cancelled) {
					setMatches([]);
					setError(err instanceof Error ? err.message : 'wc26ScheduleLoadError');
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
	}, [externalSeason]);

	return { matches, loading, error };
}
