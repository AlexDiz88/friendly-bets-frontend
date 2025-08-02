import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import { selectCompletedBets } from '../features/bets/selectors';
import PlayerBetStatsByBetTitles from '../features/stats/PlayerBetStatsByBetTitles';
import PlayersStats from '../features/stats/PlayersStats';
import { selectAllStatsByBetTitlesInSeason, selectPlayersStats } from '../features/stats/selectors';
import {
	getAllPlayersStatsBySeason,
	getAllStatsByBetTitlesInSeason,
} from '../features/stats/statsSlice';
import CustomLoading from './custom/loading/CustomLoading';
import CustomLoadingError from './custom/loading/CustomLoadingError';
import useFetchActiveSeason from './hooks/useFetchActiveSeason';

export default function Homepage(): JSX.Element {
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const playersStats = useAppSelector(selectPlayersStats);
	const playersStatsByBetTitles = useAppSelector(selectAllStatsByBetTitlesInSeason);
	const completedBets = useAppSelector(selectCompletedBets);
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const [externalData, setExternalData] = useState<any>(null);
	const [externalDataError, setExternalDataError] = useState(false);

	const sortedPlayersStats = [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	useFetchActiveSeason(activeSeasonId || '');

	// Fetch данных с API
	// useEffect(() => {
	// 	const fetchExternalData = async (): Promise<any> => {
	// 		try {
	// 			const response = await fetch(
	// 				'https://apiv2.allsportsapi.com/football/?met=Fixtures&leagueId=152&APIkey=e3cd4b7c6cee52133ed9a2ecbcd04cb3b114b53aa74b6eb8f5b2bf45be8af491&from=2024-09-28&to=2024-10-04'
	// 			);
	// 			if (!response.ok) {
	// 				throw new Error('Ошибка при загрузке данных с API');
	// 			}
	// 			const data = await response.json();
	// 			console.log(data.result[0].event_home_team);

	// 			setExternalData(data);
	// 		} catch (error) {
	// 			setExternalDataError(true);
	// 		}
	// 	};

	// 	fetchExternalData();
	// }, []);

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

	useEffect(() => {
		console.log('homepage');

		if (activeSeasonId) {
			dispatch(getAllStatsByBetTitlesInSeason(activeSeasonId))
				.then((response) => {
					console.log(response.payload);
				})
				.catch(() => {
					setLoadingError(true);
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
							<PlayersStats playersStats={sortedPlayersStats} />
							<PlayerBetStatsByBetTitles playersStatsByBetTitles={playersStatsByBetTitles} />
							{/* <Box sx={{ py: 3, px: 1 }}>
								Fetch Results:
								{externalDataError ? (
									<Box>Error loading external data</Box>
								) : (
									<>
										<Box>
											{externalData
												? JSON.stringify(externalData.result[0].event_home_team)
												: 'Loading...'}
										</Box>
										<Box>
											{externalData
												? JSON.stringify(externalData.result[0].event_away_team)
												: 'Loading...'}
										</Box>
									</>
								)}
							</Box> */}
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
