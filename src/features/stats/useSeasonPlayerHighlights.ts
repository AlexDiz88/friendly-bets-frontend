import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	selectPlayerHighlights,
	selectPlayerHighlightsSeasonId,
} from './selectors';
import { getPlayerHighlights } from './statsSlice';
import PlayerHighlight from './types/PlayerHighlight';

export default function useSeasonPlayerHighlights(
	seasonId: string | undefined,
	enabled: boolean
): {
	highlightsByUserId: Record<string, PlayerHighlight>;
	loading: boolean;
	error: string | undefined;
} {
	const dispatch = useAppDispatch();
	const highlights = useAppSelector(selectPlayerHighlights);
	const loadedSeasonId = useAppSelector(selectPlayerHighlightsSeasonId);
	const attemptedSeasonIdRef = useRef<string | undefined>(undefined);
	const [fetchError, setFetchError] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!enabled || !seasonId) {
			return;
		}
		if (loadedSeasonId === seasonId) {
			setFetchError(undefined);
			return;
		}
		if (attemptedSeasonIdRef.current === seasonId) {
			return;
		}
		attemptedSeasonIdRef.current = seasonId;
		setFetchError(undefined);
		void dispatch(getPlayerHighlights(seasonId)).then((result) => {
			if (getPlayerHighlights.rejected.match(result)) {
				setFetchError(result.error.message);
			}
		});
	}, [dispatch, enabled, loadedSeasonId, seasonId]);

	const ready = Boolean(seasonId) && loadedSeasonId === seasonId;
	const waiting = enabled && Boolean(seasonId) && !ready;

	const highlightsByUserId: Record<string, PlayerHighlight> = {};
	if (ready) {
		highlights.forEach((item) => {
			highlightsByUserId[item.userId] = item;
		});
	}

	return {
		highlightsByUserId,
		loading: waiting && !fetchError,
		error: waiting ? fetchError : undefined,
	};
}
