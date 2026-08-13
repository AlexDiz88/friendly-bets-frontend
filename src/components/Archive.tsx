import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { SEASON_STATUS_FINISHED } from '../constants';
import { getSeasons } from '../features/admin/seasons/seasonsSlice';
import { selectSeasons } from '../features/admin/seasons/selectors';
import { sortSeasonsNewestFirst } from '../features/admin/seasons/sortSeasons';
import Season from '../features/admin/seasons/types/Season';
import PlayersStats from '../features/stats/PlayersStats';
import { selectPlayersStats } from '../features/stats/selectors';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import CustomLoading from './custom/loading/CustomLoading';
import CustomLoadingError from './custom/loading/CustomLoadingError';
import SeasonSelect from './selectors/SeasonSelect';

export default function Archive(): JSX.Element {
	const dispatch = useAppDispatch();
	const playersStats = useAppSelector(selectPlayersStats);
	const seasons: Season[] = useAppSelector(selectSeasons);
	const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(undefined);
	const [filteredSeasons, setFilteredSeasons] = useState<Season[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const sortedPlayersStats =
		selectedSeason === undefined
			? []
			: [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	const handleSeasonChange = (seasonId: string): void => {
		setSelectedSeason(seasons.find((season) => season.id === seasonId));
	};

	useEffect(() => {
		dispatch(getSeasons());
	}, []);

	useEffect(() => {
		const finishedSeasons = sortSeasonsNewestFirst(
			seasons.filter((season) => season.status === SEASON_STATUS_FINISHED)
		);
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
							<SeasonSelect
								value={selectedSeason?.id ?? ''}
								onChange={(event) => handleSeasonChange(event.target.value)}
								seasons={filteredSeasons}
								sx={{ mx: 1, mb: 1, width: 'calc(100% - 16px)' }}
							/>
							<PlayersStats
								playersStats={sortedPlayersStats}
								seasonId={selectedSeason?.id}
							/>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
