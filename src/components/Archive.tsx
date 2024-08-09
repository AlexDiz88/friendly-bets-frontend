import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getSeasons } from '../features/admin/seasons/seasonsSlice';
import { selectSeasons } from '../features/admin/seasons/selectors';
import Season from '../features/admin/seasons/types/Season';
import PlayersStats from '../features/stats/PlayersStats';
import { selectPlayersStats } from '../features/stats/selectors';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import CustomLoading from './custom/loading/CustomLoading';
import CustomLoadingError from './custom/loading/CustomLoadingError';

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
	}, [selectedSeason, seasons]);

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
								{t('chooseFinishedSeasonForDetailedStatistik')}
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
										<Box style={{ display: 'flex', alignItems: 'center' }}>
											<Typography sx={{ mx: 1, fontSize: '1rem' }}>{season.title}</Typography>
										</Box>
									</MenuItem>
								))}
							</Select>
							<PlayersStats playersStats={sortedPlayersStats} />
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
