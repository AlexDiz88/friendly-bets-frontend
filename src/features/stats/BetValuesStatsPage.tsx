import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import SeasonSelect from '../../components/selectors/SeasonSelect';
import { getSeasons } from '../admin/seasons/seasonsSlice';
import { selectActiveSeasonId, selectSeasons } from '../admin/seasons/selectors';
import { sortSeasonsNewestFirst } from '../admin/seasons/sortSeasons';
import BetValuesStatsList from './BetValuesStatsList';
import {
	betValuesEmptySx,
	betValuesFiltersSx,
	betValuesLegendSx,
	betValuesPageSx,
	betValuesWrlValueSx,
} from './betValuesStatsPageStyles';
import { selectAllStatsByBetValuesInSeason } from './selectors';
import { getAllStatsByBetValuesInSeason } from './statsSlice';
import { TOTAL_LEAGUE_ID } from './types/PlayerStatsByBetValues';

export default function BetValuesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const allSeasons = useAppSelector(selectSeasons);
	const playersStatsByBetValues = useAppSelector(selectAllStatsByBetValuesInSeason);

	const [selectedSeasonId, setSelectedSeasonId] = useState('');
	const [selectedLeagueCode, setSelectedLeagueCode] = useState<string | null>(null);
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
	const players = selectedSeason?.players ?? [];
	const leagues = selectedSeason?.leagues ?? [];
	const allValue = t('all');

	const hasValidSeason =
		Boolean(selectedSeasonId) && allSeasons.some((season) => season.id === selectedSeasonId);

	const isPageLoading =
		!loadingError &&
		(!seasonsReady || !hasValidSeason || loadedStatsSeasonId !== selectedSeasonId);

	const selectedLeague = leagues.find((league) => league.leagueCode === selectedLeagueCode);
	const leagueIdFilter =
		selectedLeagueCode === null ? TOTAL_LEAGUE_ID : selectedLeague?.id ?? '';

	const visibleStats = useMemo(
		() =>
			playersStatsByBetValues.filter(
				(stats) => stats.seasonId === selectedSeasonId && stats.leagueId === leagueIdFilter
			),
		[playersStatsByBetValues, selectedSeasonId, leagueIdFilter]
	);

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

		if (activeSeasonId && allSeasons.some((season) => season.id === activeSeasonId)) {
			setSelectedSeasonId(activeSeasonId);
		} else {
			setSelectedSeasonId(seasonsNewestFirst[0].id);
		}
	}, [seasonsReady, allSeasons, seasonsNewestFirst, activeSeasonId, selectedSeasonId]);

	useEffect(() => {
		if (selectedLeagueCode && !leagues.some((league) => league.leagueCode === selectedLeagueCode)) {
			setSelectedLeagueCode(null);
		}
	}, [leagues, selectedLeagueCode]);

	useEffect(() => {
		if (!hasValidSeason) {
			return;
		}

		let cancelled = false;
		setLoadingError(false);

		void dispatch(getAllStatsByBetValuesInSeason(selectedSeasonId))
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

	if (isPageLoading) {
		return <CustomLoading />;
	}

	const filters = (
		<Box sx={betValuesFiltersSx}>
			<SeasonSelect
				value={selectedSeasonId}
				onChange={(event) => setSelectedSeasonId(event.target.value)}
				seasons={seasonsNewestFirst}
				sx={{ flex: '1 1 auto', minWidth: 0 }}
			/>
			<LeagueSelect
				value={selectedLeagueCode ?? allValue}
				onChange={(event) => {
					const value = event.target.value;
					setSelectedLeagueCode(value === allValue ? null : value);
				}}
				leagues={leagues}
			/>
		</Box>
	);

	if (loadingError) {
		return (
			<Box sx={betValuesPageSx}>
				{filters}
				<CustomLoadingError />
			</Box>
		);
	}

	return (
		<Box sx={betValuesPageSx}>
			{filters}
			<Box sx={betValuesLegendSx}>
				<Box component="span" sx={betValuesWrlValueSx('won')}>
					{t('won')}
				</Box>
				<Box component="span">/</Box>
				<Box component="span" sx={betValuesWrlValueSx('returned')}>
					{t('returned')}
				</Box>
				<Box component="span">/</Box>
				<Box component="span" sx={betValuesWrlValueSx('lost')}>
					{t('lost')}
				</Box>
				<Box component="span">· {t('totalBets')}</Box>
				<Box component="span">
					·{' '}
					<Box component="span" sx={betValuesWrlValueSx('winRate')}>
						%
					</Box>
				</Box>
				<Box component="span">· {t('averageCoef')}</Box>
			</Box>
			{visibleStats.length === 0 ? (
				<Box sx={betValuesEmptySx}>{t('noBetValuesStats')}</Box>
			) : (
				<BetValuesStatsList
					key={`${selectedSeasonId}-${leagueIdFilter}`}
					playersStatsByBetValues={visibleStats}
					players={players}
				/>
			)}
		</Box>
	);
}
