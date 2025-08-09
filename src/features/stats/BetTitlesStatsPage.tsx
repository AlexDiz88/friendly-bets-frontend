import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveSeasonId } from '../admin/seasons/selectors';
import { selectAllStatsByBetTitlesInSeason } from './selectors';
import { getAllStatsByBetTitlesInSeason } from './statsSlice';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import PlayerBetStatsByBetTitles from './PlayerBetStatsByBetTitles';
import { t } from 'i18next';

export default function BetTitlesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const playersStatsByBetTitles = useAppSelector(selectAllStatsByBetTitlesInSeason);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getAllStatsByBetTitlesInSeason(activeSeasonId))
				.then(() => {
					setLoading(false);
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
								bgcolor: '#283229ff',
								border: 2,
								borderRadius: 2,
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#fff',
									py: 1.25,
								}}
							>
								{t('betTitlesStatsByPlayers')}
							</Box>
							<PlayerBetStatsByBetTitles playersStatsByBetTitles={playersStatsByBetTitles} />
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
