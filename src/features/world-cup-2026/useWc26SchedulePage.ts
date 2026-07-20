import { useCallback, useEffect, useState } from 'react';
import { fetchWc26SchedulePage, type Wc26MatchWithResult } from './wc26ScheduleApi';

export interface Wc26SchedulePageState {
	matches: Wc26MatchWithResult[];
	loading: boolean;
	error: string | null;
}

export function useWc26SchedulePage(): Wc26SchedulePageState {
	const [matches, setMatches] = useState<Wc26MatchWithResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadSchedule = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			setMatches(await fetchWc26SchedulePage());
		} catch (err) {
			setMatches([]);
			setError(err instanceof Error ? err.message : 'wc26ScheduleLoadError');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadSchedule();
	}, [loadSchedule]);

	return { matches, loading, error };
}
