import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { SEASON_STATUS_FINISHED } from '../constants';
import useSeasonSummaries from '../features/admin/seasons/useSeasonSummaries';
import PlayersStats from '../features/stats/PlayersStats';
import { selectPlayersStats } from '../features/stats/selectors';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import CustomLoading from './custom/loading/CustomLoading';
import CustomLoadingError from './custom/loading/CustomLoadingError';
import SeasonSelect from './selectors/SeasonSelect';

export default function Archive(): JSX.Element {
	const dispatch = useAppDispatch();
	const playersStats = useAppSelector(selectPlayersStats);
	const { seasonsNewestFirst, summariesReady, summariesError } = useSeasonSummaries();
	const [selectedSeasonId, setSelectedSeasonId] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingError, setLoadingError] = useState(false);

	const filteredSeasons = useMemo(
		() =>
			seasonsNewestFirst.filter((season) => season.status === SEASON_STATUS_FINISHED),
		[seasonsNewestFirst]
	);

	const sortedPlayersStats =
		selectedSeasonId === ''
			? []
			: [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	useEffect(() => {
		if (!selectedSeasonId) {
			setLoading(false);
			return;
		}
		setLoading(true);
		setLoadingError(false);
		void dispatch(getAllPlayersStatsBySeason(selectedSeasonId))
			.unwrap()
			.then(() => {
				setLoading(false);
			})
			.catch(() => {
				setLoadingError(true);
				setLoading(false);
			});
	}, [selectedSeasonId, dispatch]);

	if (summariesError && seasonsNewestFirst.length === 0) {
		return <CustomLoadingError />;
	}

	if (!summariesReady && seasonsNewestFirst.length === 0) {
		return <CustomLoading />;
	}

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
								value={selectedSeasonId}
								onChange={(event) => setSelectedSeasonId(event.target.value)}
								seasons={filteredSeasons}
								sx={{ mx: 1, mb: 1, width: 'calc(100% - 16px)' }}
							/>
							<PlayersStats
								playersStats={sortedPlayersStats}
								seasonId={selectedSeasonId || undefined}
							/>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
