import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import SeasonSelect from '../../components/selectors/SeasonSelect';
import PlayerBetStatsByBetTitles from './PlayerBetStatsByBetTitles';
import { selectAllStatsByBetTitlesInSeason } from './selectors';
import { getAllStatsByBetTitlesInSeason } from './statsSlice';
import useSeasonSummariesForStats from './useSeasonSummariesForStats';

export default function BetTitlesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const playersStatsByBetTitles = useAppSelector(selectAllStatsByBetTitlesInSeason);
	const {
		seasonsNewestFirst,
		selectedSeasonId,
		setSelectedSeasonId,
		players,
		hasValidSeason,
		summariesError,
	} = useSeasonSummariesForStats();

	const [loadedStatsSeasonId, setLoadedStatsSeasonId] = useState<string | null>(null);
	const [loadingError, setLoadingError] = useState(false);

	const isPageLoading =
		!loadingError && (!hasValidSeason || loadedStatsSeasonId !== selectedSeasonId);

	useEffect(() => {
		if (!hasValidSeason) {
			return;
		}

		let cancelled = false;
		setLoadingError(false);

		void dispatch(getAllStatsByBetTitlesInSeason(selectedSeasonId))
			.unwrap()
			.then(() => {
				if (!cancelled) {
					setLoadedStatsSeasonId(selectedSeasonId);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setLoadingError(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [selectedSeasonId, hasValidSeason, dispatch]);

	if (summariesError && seasonsNewestFirst.length === 0) {
		return <CustomLoadingError />;
	}

	if (isPageLoading) {
		return <CustomLoading />;
	}

	const seasonSelect = (
		<Box sx={{ maxWidth: '25rem', mx: 'auto', mb: 1, px: { xs: 1, sm: 0 } }}>
			<SeasonSelect
				value={selectedSeasonId}
				onChange={(event) => setSelectedSeasonId(event.target.value)}
				seasons={seasonsNewestFirst}
				sx={{ width: '100%' }}
			/>
		</Box>
	);

	if (loadingError) {
		return (
			<Box>
				{seasonSelect}
				<CustomLoadingError />
			</Box>
		);
	}

	return (
		<Box>
			{seasonSelect}

			<Box sx={{ maxWidth: '25rem', margin: '0 auto' }}>
				{playersStatsByBetTitles.length === 0 ? (
					<Box
						sx={{
							textAlign: 'center',
							fontWeight: 600,
							fontSize: 16,
							py: 2,
						}}
					>
						{t('noBetTitlesStats')}
					</Box>
				) : (
					<PlayerBetStatsByBetTitles
						playersStatsByBetTitles={playersStatsByBetTitles}
						players={players}
					/>
				)}
			</Box>
		</Box>
	);
}
