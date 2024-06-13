import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { selectPlayersStats } from '../features/stats/selectors';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import { getActiveSeasonId } from '../features/admin/seasons/seasonsSlice';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import StatsTable from './StatsTable';
import { getCompletedBets } from '../features/bets/betsSlice';
import { selectCompletedBets } from '../features/bets/selectors';
import SeasonResponseError from '../features/admin/seasons/types/SeasonResponseError';

export default function Homepage(): JSX.Element {
	const navigate = useNavigate();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const playersStats = useAppSelector(selectPlayersStats);
	const completedBets = useAppSelector(selectCompletedBets);
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const sortedPlayersStats = [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId())
				.unwrap()
				.then(() => {
					setLoading(false);
				})
				.catch((error: SeasonResponseError) => {
					if (error.message === 'Сезон со статусом ACTIVE не найден') {
						navigate('/no-active-season');
					} else {
						setLoadingError(true);
					}
					setLoading(false);
				});
		}
	}, [dispatch]);

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
	}, [activeSeasonId, dispatch]);

	return (
		<Box>
			{loading ? (
				<Box
					sx={{
						height: '70vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<CircularProgress sx={{ mt: 5 }} size={100} color="primary" />
				</Box>
			) : (
				<Box>
					{loadingError ? (
						<Box
							sx={{ textAlign: 'center', fontWeight: 600, color: 'brown', pt: 10, fontSize: 20 }}
						>
							Ошибка загрузки. Попробуйте обновить страницу
						</Box>
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
