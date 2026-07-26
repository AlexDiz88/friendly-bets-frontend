import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
	selectActiveSeason,
	selectActiveSeasonId,
} from '../features/admin/seasons/selectors';
import { getActiveSeason } from '../features/admin/seasons/seasonsSlice';
import { selectUser } from '../features/auth/selectors';
import NearestGameweekBetsPlate, {
	matchResultsPathForLeagueMatchday,
} from '../features/gameweeks/NearestGameweekBetsPlate';
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
	const activeSeason = useAppSelector(selectActiveSeason);
	const user = useAppSelector(selectUser);
	const playersStats = useAppSelector(selectPlayersStats);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const sortedPlayersStats = [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	useFetchActiveSeason(activeSeasonId || '');

	const hasWcLeague = useMemo(
		() => Boolean(activeSeason?.leagues?.some((l) => l.leagueCode === 'WC')),
		[activeSeason?.leagues]
	);

	const isSeasonParticipant = useMemo(() => {
		if (!user?.id || !activeSeason?.players) {
			return false;
		}
		return activeSeason.players.some((p) => p.id === user.id);
	}, [user?.id, activeSeason?.players]);

	const isAdminOrModerator = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
	const canShowNearestGameweekPlate =
		Boolean(user?.id) && (isSeasonParticipant || isAdminOrModerator);

	useEffect(() => {
		if (!activeSeason && activeSeasonId) {
			void dispatch(getActiveSeason());
		}
	}, [activeSeason, activeSeasonId, dispatch]);

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
	}, [activeSeasonId, dispatch]);

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
							{hasWcLeague ? <Wc26QuickLink /> : null}
							{canShowNearestGameweekPlate ? (
								<NearestGameweekBetsPlate
									enabled
									seasonId={activeSeasonId}
									compact
									onLeagueClick={({ leagueCode, matchDay }) => {
										navigate(matchResultsPathForLeagueMatchday(leagueCode, matchDay));
									}}
								/>
							) : null}
							<PlayersStats playersStats={sortedPlayersStats} />
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
