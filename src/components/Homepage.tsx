import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import { selectCompletedBets } from '../features/bets/selectors';
import { selectPlayersStats } from '../features/stats/selectors';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import CustomLoading from './custom/loading/CustomLoading';
import CustomLoadingError from './custom/loading/CustomLoadingError';
import useFetchActiveSeason from './hooks/useFetchActiveSeason';
import StatsTable from './StatsTable';

export default function Homepage(): JSX.Element {
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const playersStats = useAppSelector(selectPlayersStats);
	const completedBets = useAppSelector(selectCompletedBets);
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const sortedPlayersStats = [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	useFetchActiveSeason(activeSeasonId);

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getAllPlayersStatsBySeason(activeSeasonId))
				.then(() => {
					setLoading(false);
					// делаем предзагрузку на главной странице
					// if (activeSeasonId && completedBets.length < 28) {
					// 	dispatch(
					// 		getCompletedBets({
					// 			seasonId: activeSeasonId,
					// 			playerId: undefined,
					// 			leagueId: undefined,
					// 			pageSize: '28',
					// 			pageNumber: 0,
					// 		})
					// 	);
					// }
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeasonId]);

	return (
		<Box>
			{loading ? (
				<CustomLoading />
			) : (
				<Box>
					{loadingError ? (
						<CustomLoadingError />
					) : (
						<Box
							sx={{
								maxWidth: '25rem',
								margin: '0 auto',
								boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
							}}
						>
							<StatsTable playersStats={sortedPlayersStats} />
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
