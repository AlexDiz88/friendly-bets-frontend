import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import PlayersStats from '../features/stats/PlayersStats';
import { selectPlayersStats } from '../features/stats/selectors';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import Wc26QuickLink from '../features/world-cup-2026/Wc26QuickLink';
import CustomLoading from './custom/loading/CustomLoading';
import CustomLoadingError from './custom/loading/CustomLoadingError';
import useFetchActiveSeason from './hooks/useFetchActiveSeason';
import { homepageContentLayoutSx } from './layoutMainStyles';

export default function Homepage(): JSX.Element {
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const playersStats = useAppSelector(selectPlayersStats);
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const sortedPlayersStats = [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	useFetchActiveSeason(activeSeasonId || '');

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getAllPlayersStatsBySeason(activeSeasonId))
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
						<Box sx={homepageContentLayoutSx}>
							<Wc26QuickLink />
							<PlayersStats playersStats={sortedPlayersStats} />
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
