import { useEffect } from 'react';
import { Box } from '@mui/material';
import { selectPlayersStats } from '../features/stats/selectors';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import { getActiveSeason, getActiveSeasonId } from '../features/admin/seasons/seasonsSlice';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import StatsTable from './StatsTable';

export default function Homepage(): JSX.Element {
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const playersStats = useAppSelector(selectPlayersStats);
	const dispatch = useAppDispatch();

	const sortedPlayersStats = [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	useEffect(() => {
		dispatch(getActiveSeasonId());
		dispatch(getActiveSeason());
	}, [dispatch]);

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getAllPlayersStatsBySeason(activeSeasonId));
		}
	}, [activeSeasonId, dispatch]);

	return (
		<Box
			sx={{
				maxWidth: '25rem',
				margin: '0 auto',
				boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
			}}
		>
			<StatsTable playersStats={sortedPlayersStats} />
		</Box>
	);
}
