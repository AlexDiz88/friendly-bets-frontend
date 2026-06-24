import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLivePagePolling } from '../../shared/useLivePagePolling';
import {
	fetchWc26FifaBracket,
	fetchWc26FifaStandings,
	type Wc26FifaBracketPage,
	type Wc26FifaStandingsPage,
} from './wc26FifaApi';

export function useWc26FifaStandings(): {
	data: Wc26FifaStandingsPage | null;
	loading: boolean;
	error: string | null;
	reload: () => Promise<void>;
} {
	const [data, setData] = useState<Wc26FifaStandingsPage | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async (options?: { silent?: boolean }): Promise<void> => {
		const silent = options?.silent ?? false;
		if (!silent) {
			setLoading(true);
		}
		setError(null);
		try {
			const page = await fetchWc26FifaStandings();
			setData(page);
		} catch (err) {
			setData(null);
			setError(err instanceof Error ? err.message : 'wc26FifaStandingsLoadError');
		} finally {
			if (!silent) {
				setLoading(false);
			}
		}
	}, []);

	const hasLiveStandings = useMemo(
		() => data?.groups.some((group) => group.rows.some((row) => row.liveNow)) ?? false,
		[data]
	);

	useLivePagePolling(!loading && !error && hasLiveStandings, () => reload({ silent: true }));

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			await reload();
			if (cancelled) {
				return;
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [reload]);

	return { data, loading, error, reload };
}

export function useWc26FifaBracket(stageFilter: string): {
	data: Wc26FifaBracketPage | null;
	loading: boolean;
	error: string | null;
	reload: () => Promise<void>;
} {
	const [data, setData] = useState<Wc26FifaBracketPage | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const page = await fetchWc26FifaBracket(stageFilter === 'all' ? undefined : stageFilter);
			setData(page);
		} catch (err) {
			setData(null);
			setError(err instanceof Error ? err.message : 'wc26FifaBracketLoadError');
		} finally {
			setLoading(false);
		}
	}, [stageFilter]);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			await reload();
			if (cancelled) {
				return;
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [reload]);

	return { data, loading, error, reload };
}
