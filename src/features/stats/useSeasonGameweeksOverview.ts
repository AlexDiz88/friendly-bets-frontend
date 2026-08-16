import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchGameweeksOverview } from '../admin/calendars/calendarsSlice';
import {
	selectCalendarNodesHasBets,
	selectGameweeksOverviewSeasonId,
} from '../admin/calendars/selectors';
import Calendar from '../admin/calendars/types/Calendar';

export default function useSeasonGameweeksOverview(
	seasonId: string | undefined,
	enabled: boolean
): {
	nodes: Calendar[];
	loading: boolean;
	error: string | undefined;
} {
	const dispatch = useAppDispatch();
	const nodes = useAppSelector(selectCalendarNodesHasBets);
	const loadedSeasonId = useAppSelector(selectGameweeksOverviewSeasonId);
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
		void dispatch(fetchGameweeksOverview({ seasonId })).then((result) => {
			if (fetchGameweeksOverview.rejected.match(result)) {
				setFetchError(result.error.message);
			}
		});
	}, [dispatch, enabled, loadedSeasonId, seasonId]);

	const ready = Boolean(seasonId) && loadedSeasonId === seasonId;
	const waiting = enabled && Boolean(seasonId) && !ready;

	return {
		nodes: ready ? nodes : [],
		loading: waiting && !fetchError,
		error: waiting ? fetchError : undefined,
	};
}
