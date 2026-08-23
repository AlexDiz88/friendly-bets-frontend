import { Box, CircularProgress } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import SeasonSelect from '../../components/selectors/SeasonSelect';
import LeaguesBalanceMatrix from './LeaguesBalanceMatrix';
import LeaguesStatsLeaderboard from './LeaguesStatsLeaderboard';
import { findLeagueStats, mergePlayersWithLeagueStats } from './leaguePlayerStats';
import {
	leagueAccent,
	leaguesStatsPageSx,
	leaguesStatsSeasonSelectSx,
	leaguesStatsSectionSx,
	leaguesStatsSectionTitleSx,
} from './leaguesStatsPageStyles';
import { selectPlayersStatsByLeagues } from './selectors';
import { getAllPlayersStatsByLeagues } from './statsSlice';
import useSeasonSummariesForStats from './useSeasonSummariesForStats';

export default function LeaguesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const statsByLeagues = useAppSelector(selectPlayersStatsByLeagues);
	const {
		seasonsNewestFirst,
		selectedSeasonId,
		setSelectedSeasonId,
		leagues,
		players,
		hasValidSeason,
		summariesError,
	} = useSeasonSummariesForStats();

	const [selectedLeagueCode, setSelectedLeagueCode] = useState('');
	const [loadedStatsSeasonId, setLoadedStatsSeasonId] = useState<string | null>(null);
	const [loadingError, setLoadingError] = useState(false);

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

	const isPageLoading =
		!loadingError && (!hasValidSeason || loadedStatsSeasonId !== selectedSeasonId);

	const handleSelectLeague = (leagueCode: string): void => {
		setSelectedLeagueCode(leagueCode);
	};

	useEffect(() => {
		if (leagues.length > 0 && !leagues.some((league) => league.leagueCode === selectedLeagueCode)) {
			setSelectedLeagueCode(leagues[0].leagueCode);
		}
	}, [leagues, selectedLeagueCode]);

	useEffect(() => {
		if (!hasValidSeason) {
			return;
		}

		let cancelled = false;
		setLoadingError(false);

		void dispatch(getAllPlayersStatsByLeagues(selectedSeasonId))
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

	if (seasonsNewestFirst.length === 0 || !hasValidSeason) {
		return <CustomLoading />;
	}

	const seasonSelect = (
		<Box sx={leaguesStatsSeasonSelectSx}>
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
			<Box sx={leaguesStatsPageSx}>
				{seasonSelect}
				<CustomLoadingError />
			</Box>
		);
	}

	if (isPageLoading) {
		return (
			<Box sx={leaguesStatsPageSx}>
				{seasonSelect}
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
					<CircularProgress />
				</Box>
			</Box>
		);
	}

	return (
		<Box sx={leaguesStatsPageSx}>
			{seasonSelect}

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
