import { useEffect, useState } from 'react';
import {
	Box,
	CircularProgress,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { selectPlayersStats } from '../features/stats/selectors';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectSeasons } from '../features/admin/seasons/selectors';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import StatsTable from './StatsTable';
import Season from '../features/admin/seasons/types/Season';
import { getSeasons } from '../features/admin/seasons/seasonsSlice';

export default function Archive(): JSX.Element {
	const dispatch = useAppDispatch();
	const playersStats = useAppSelector(selectPlayersStats);
	const seasons: Season[] = useAppSelector(selectSeasons);
	const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(undefined);
	const [selectedSeasonName, setSelectedSeasonName] = useState<string>('');
	const [filteredSeasons, setFilteredSeasons] = useState<Season[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const sortedPlayersStats =
		selectedSeason === undefined
			? []
			: [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	const handleSeasonChange = (event: SelectChangeEvent): void => {
		const seasonTitle = event.target.value;
		const season = seasons.find((s) => s.title === seasonTitle);
		setSelectedSeasonName(seasonTitle);
		setSelectedSeason(season || undefined);
	};

	useEffect(() => {
		dispatch(getSeasons());
	}, []);

	useEffect(() => {
		const finishedSeasons = seasons.filter((season) => season.status === 'FINISHED');
		setFilteredSeasons(finishedSeasons);
	}, [seasons]);

	useEffect(() => {
		if (selectedSeason) {
			setLoading(true);
			dispatch(getAllPlayersStatsBySeason(selectedSeason.id))
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, [selectedSeason, seasons, dispatch]);

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
								mt: -1.5,
								pt: 0,
								boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
							}}
						>
							<Box
								sx={{
									p: 1,
									textAlign: 'center',
									fontWeight: 600,
									fontSize: '0.95rem',
								}}
							>
								Выберите завершившийся сезон для просмотра статистики
							</Box>
							<Select
								size="small"
								sx={{ minWidth: '12rem', mx: 1, mb: 1 }}
								labelId="season-stats-label"
								id="season-stats-select"
								value={selectedSeasonName}
								onChange={handleSeasonChange}
							>
								{filteredSeasons.map((season) => (
									<MenuItem
										key={season.title}
										value={season.title}
										sx={{ ml: -0.5, minWidth: '11rem' }}
									>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<Typography sx={{ mx: 1, fontSize: '1rem' }}>{season.title}</Typography>
										</div>
									</MenuItem>
								))}
							</Select>
							<StatsTable playersStats={sortedPlayersStats} />
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
