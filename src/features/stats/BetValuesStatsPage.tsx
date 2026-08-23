import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import SeasonSelect from '../../components/selectors/SeasonSelect';
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
import useSeasonSummariesForStats from './useSeasonSummariesForStats';

export default function BetValuesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const playersStatsByBetValues = useAppSelector(selectAllStatsByBetValuesInSeason);
	const {
		seasonsNewestFirst,
		selectedSeasonId,
		setSelectedSeasonId,
		leagues,
		players,
		hasValidSeason,
		summariesError,
	} = useSeasonSummariesForStats();

	const [selectedLeagueCode, setSelectedLeagueCode] = useState<string | null>(null);
	const [loadedStatsSeasonId, setLoadedStatsSeasonId] = useState<string | null>(null);
	const [loadingError, setLoadingError] = useState(false);

	const allValue = t('all');

	const isPageLoading =
		!loadingError && (!hasValidSeason || loadedStatsSeasonId !== selectedSeasonId);

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

	if (summariesError && seasonsNewestFirst.length === 0) {
		return <CustomLoadingError />;
	}

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
				<Box component="span">· {t('averageCoefShort')}</Box>
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
