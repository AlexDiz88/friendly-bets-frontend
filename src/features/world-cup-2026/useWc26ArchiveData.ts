import { useCallback, useEffect, useState } from 'react';
import {
	fetchWc26Bracket,
	fetchWc26Standings,
	type Wc26BracketPage,
	type Wc26StandingsPage,
} from './wc26ArchiveApi';

export function useWc26Standings(): {
	data: Wc26StandingsPage | null;
	loading: boolean;
	error: string | null;
} {
	const [data, setData] = useState<Wc26StandingsPage | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			setData(await fetchWc26Standings());
		} catch (err) {
			setData(null);
			setError(err instanceof Error ? err.message : 'wc26StandingsLoadError');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void reload();
	}, [reload]);

	return { data, loading, error };
}

export function useWc26Bracket(stageFilter: string): {
	data: Wc26BracketPage | null;
	loading: boolean;
	error: string | null;
} {
	const [data, setData] = useState<Wc26BracketPage | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const reload = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			setData(await fetchWc26Bracket(stageFilter === 'all' ? undefined : stageFilter));
		} catch (err) {
			setData(null);
			setError(err instanceof Error ? err.message : 'wc26BracketLoadError');
		} finally {
			setLoading(false);
		}
	}, [stageFilter]);

	useEffect(() => {
		void reload();
	}, [reload]);

	return { data, loading, error };
}
