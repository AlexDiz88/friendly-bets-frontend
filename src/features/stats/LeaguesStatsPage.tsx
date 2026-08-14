import { Box, CircularProgress } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import SeasonSelect from '../../components/selectors/SeasonSelect';
import { SEASON_STATUS_ACTIVE } from '../../constants';
import { getSeasons } from '../admin/seasons/seasonsSlice';
import { selectActiveSeasonId, selectSeasons } from '../admin/seasons/selectors';
import { sortSeasonsNewestFirst } from '../admin/seasons/sortSeasons';
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

export default function LeaguesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const allSeasons = useAppSelector(selectSeasons);
	const statsByLeagues = useAppSelector(selectPlayersStatsByLeagues);

	const [selectedSeasonId, setSelectedSeasonId] = useState('');
	const [selectedLeagueCode, setSelectedLeagueCode] = useState('');
	const [seasonsReady, setSeasonsReady] = useState(false);
	const [loadedStatsSeasonId, setLoadedStatsSeasonId] = useState<string | null>(null);
	const [loadingError, setLoadingError] = useState(false);

	const seasonsNewestFirst = useMemo(
		() => sortSeasonsNewestFirst(allSeasons),
		[allSeasons]
	);

	const selectedSeason = useMemo(
		() => allSeasons.find((season) => season.id === selectedSeasonId),
		[allSeasons, selectedSeasonId]
	);
	const leagues = selectedSeason?.leagues ?? [];
	const players = selectedSeason?.players ?? [];

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

	const hasValidSeason =
		Boolean(selectedSeasonId) && allSeasons.some((season) => season.id === selectedSeasonId);

	const isPageLoading =
		!loadingError &&
		(!seasonsReady || !hasValidSeason || loadedStatsSeasonId !== selectedSeasonId);

	const handleSelectLeague = (leagueCode: string): void => {
		setSelectedLeagueCode(leagueCode);
	};

	useEffect(() => {
		let cancelled = false;
		setSeasonsReady(false);

		void dispatch(getSeasons())
			.unwrap()
			.finally(() => {
				if (!cancelled) {
					setSeasonsReady(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [dispatch]);

	useEffect(() => {
		if (!seasonsReady || allSeasons.length === 0) {
			return;
		}

		if (selectedSeasonId && allSeasons.some((season) => season.id === selectedSeasonId)) {
			return;
		}

		const activeInList = allSeasons.find((season) => season.status === SEASON_STATUS_ACTIVE);
		if (activeInList) {
			setSelectedSeasonId(activeInList.id);
		} else if (activeSeasonId && allSeasons.some((season) => season.id === activeSeasonId)) {
			setSelectedSeasonId(activeSeasonId);
		} else {
			setSelectedSeasonId(seasonsNewestFirst[0].id);
		}
	}, [seasonsReady, allSeasons, seasonsNewestFirst, activeSeasonId, selectedSeasonId]);

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

	if (!seasonsReady || !hasValidSeason) {
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
