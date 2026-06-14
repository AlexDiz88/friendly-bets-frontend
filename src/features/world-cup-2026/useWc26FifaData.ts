import { useCallback, useEffect, useState } from 'react';
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

	const reload = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const page = await fetchWc26FifaStandings();
			setData(page);
		} catch (err) {
			setData(null);
			setError(err instanceof Error ? err.message : 'wc26FifaStandingsLoadError');
		} finally {
			setLoading(false);
		}
	}, []);

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
