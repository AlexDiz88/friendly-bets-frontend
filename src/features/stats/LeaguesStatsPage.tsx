import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import { getActiveSeason, getActiveSeasonId } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason, selectActiveSeasonId } from '../admin/seasons/selectors';
import LeaguesBalanceMatrix from './LeaguesBalanceMatrix';
import LeaguesStatsLeaderboard from './LeaguesStatsLeaderboard';
import {
	findLeagueStats,
	mergePlayersWithLeagueStats,
} from './leaguePlayerStats';
import {
	leagueAccent,
	leaguesStatsPageSx,
	leaguesStatsSectionSx,
	leaguesStatsSectionTitleSx,
} from './leaguesStatsPageStyles';
import { selectPlayersStatsByLeagues } from './selectors';
import { getAllPlayersStatsByLeagues } from './statsSlice';

export default function LeaguesStatsPage(): JSX.Element {
	const activeSeason = useAppSelector(selectActiveSeason);
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const statsByLeagues = useAppSelector(selectPlayersStatsByLeagues);
	const dispatch = useAppDispatch();
	const [selectedLeagueCode, setSelectedLeagueCode] = useState('');
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const leagues = activeSeason?.leagues ?? [];
	const players = activeSeason?.players ?? [];

	const selectedLeague = leagues.find((league) => league.leagueCode === selectedLeagueCode);
	const sortedPlayersStats = useMemo(() => {
		if (!selectedLeague) {
			return [];
		}
		return mergePlayersWithLeagueStats(
			players,
			findLeagueStats(statsByLeagues, selectedLeague.id)
		).sort(
			(a, b) => b.actualBalance - a.actualBalance || a.username.localeCompare(b.username)
		);
	}, [players, selectedLeague, statsByLeagues]);

	useFetchActiveSeason(activeSeasonId);

	const handleSelectLeague = (leagueCode: string): void => {
		setSelectedLeagueCode(leagueCode);
	};

	useEffect(() => {
		if (leagues.length > 0 && !leagues.some((league) => league.leagueCode === selectedLeagueCode)) {
			setSelectedLeagueCode(leagues[0].leagueCode);
		}
	}, [leagues, selectedLeagueCode]);

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getAllPlayersStatsByLeagues(activeSeasonId))
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeasonId]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId());
		}
	}, []);

	if (loading || (Boolean(activeSeasonId) && !activeSeason)) {
		return <CustomLoading />;
	}

	if (loadingError) {
		return <CustomLoadingError />;
	}

	return (
		<Box sx={leaguesStatsPageSx}>
			{leagues.length > 1 ? (
				<LeaguesBalanceMatrix
					leagues={leagues}
					players={players}
					statsByLeagues={statsByLeagues}
					selectedLeagueCode={selectedLeagueCode}
					onSelectLeague={handleSelectLeague}
				/>
			) : null}

			<Box sx={leaguesStatsSectionSx}>
				<Box sx={leaguesStatsSectionTitleSx}>{t('chooseLeagueForDetailedStatistik')}</Box>
				<Box sx={{ mx: 1, mb: 1.25 }}>
					<LeagueSelect
						value={selectedLeagueCode}
						onChange={(event) => handleSelectLeague(event.target.value)}
						leagues={leagues}
						withoutAll
						fullLeagueNames
					/>
				</Box>
				<LeaguesStatsLeaderboard
					playersStats={sortedPlayersStats}
					accent={leagueAccent(selectedLeagueCode)}
				/>
			</Box>
		</Box>
	);
}
