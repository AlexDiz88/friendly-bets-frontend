import { Box, CircularProgress, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import useFilterLanguageChange from '../../components/hooks/useFilterLanguageChange';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import PlayerSelect from '../../components/selectors/PlayerSelect';
import SeasonSelect from '../../components/selectors/SeasonSelect';
import { SEASON_STATUS_ACTIVE, TOTAL_STATS_BY_TEAMS_USER_ID } from '../../constants';
import { getSeasonSummaries } from '../admin/seasons/seasonsSlice';
import {
	selectActiveSeason,
	selectActiveSeasonId,
	selectSeasonSummaries,
} from '../admin/seasons/selectors';
import { sortSeasonsNewestFirst } from '../admin/seasons/sortSeasons';
import SeasonSummary from '../admin/seasons/types/SeasonSummary';
import { selectStatsByTeams } from './selectors';
import { getStatsByTeams } from './statsSlice';
import TeamsStats from './TeamsStats';

const teamsStatsPageSx = {
	maxWidth: '25rem',
	margin: '0 auto',
	mt: -2,
	pt: 2,
	boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
};

const teamsStatsFiltersSx = {
	display: 'flex',
	flexDirection: 'column',
	gap: 0.75,
	px: 0.75,
	mb: 0.5,
};

const teamsStatsLeaguePlayerRowSx = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'nowrap',
	justifyContent: 'center',
	alignItems: 'center',
};

const teamsStatsEmptySx = {
	textAlign: 'center',
	fontWeight: 600,
	fontSize: 16,
	py: 3,
	px: 2,
};

export default function TeamsStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const summaries = useAppSelector(selectSeasonSummaries);
	const statsByTeams = useAppSelector(selectStatsByTeams);

	const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeason?.id ?? '');
	const [selectedLeagueCode, setSelectedLeagueCode] = useState('');
	const [selectedPlayerName, setSelectedPlayerName] = useState(t('all'));
	const [loadedStatsKey, setLoadedStatsKey] = useState<string | null>(null);
	const [loadingError, setLoadingError] = useState(false);
	const [summariesError, setSummariesError] = useState(false);

	useFilterLanguageChange(setSelectedPlayerName);

	const seasonChoices = useMemo((): SeasonSummary[] => {
		if (summaries.length > 0) {
			return summaries;
		}
		if (!activeSeason) {
			return [];
		}
		return [
			{
				id: activeSeason.id,
				title: activeSeason.title,
				startDate: activeSeason.startDate,
				endDate: activeSeason.endDate,
				status: activeSeason.status,
				players: activeSeason.players,
				leagues: activeSeason.leagues,
			},
		];
	}, [summaries, activeSeason]);

	const seasonsNewestFirst = useMemo(
		() => sortSeasonsNewestFirst(seasonChoices),
		[seasonChoices]
	);

	const selectedSeason = useMemo(
		() => seasonChoices.find((season) => season.id === selectedSeasonId),
		[seasonChoices, selectedSeasonId]
	);
	const leagues = selectedSeason?.leagues ?? [];
	const allPlayersLabel = t('all');

	const players = useMemo(() => {
		const raw = selectedSeason?.players ?? [];
		if (!activeSeason?.players?.length) {
			return raw;
		}
		const avatarsById = new Map(
			activeSeason.players.map((player) => [player.id, player.avatar])
		);
		return raw.map((player) =>
			player.avatar ? player : { ...player, avatar: avatarsById.get(player.id) }
		);
	}, [selectedSeason, activeSeason]);

	const hasValidSeason =
		Boolean(selectedSeasonId) && seasonChoices.some((season) => season.id === selectedSeasonId);

	const selectedUserId =
		selectedPlayerName === allPlayersLabel
			? TOTAL_STATS_BY_TEAMS_USER_ID
			: players.find((player) => player.username === selectedPlayerName)?.id;

	const selectedLeagueId = leagues.find(
		(league) => league.leagueCode === selectedLeagueCode
	)?.id;

	const statsKey =
		hasValidSeason && selectedLeagueId && selectedUserId
			? `${selectedSeasonId}-${selectedLeagueId}-${selectedUserId}`
			: null;

	const isStatsLoading =
		!loadingError && leagues.length > 0 && (statsKey == null || loadedStatsKey !== statsKey);

	const handleSeasonChange = (e: SelectChangeEvent): void => {
		setSelectedSeasonId(e.target.value);
	};

	const handleLeagueChange = (e: SelectChangeEvent): void => {
		setSelectedLeagueCode(e.target.value);
	};

	const handlePlayerChange = (e: SelectChangeEvent): void => {
		setSelectedPlayerName(e.target.value);
	};

	useEffect(() => {
		if (summaries.length > 0) {
			return;
		}

		let cancelled = false;
		setSummariesError(false);

		void dispatch(getSeasonSummaries())
			.unwrap()
			.catch(() => {
				if (!cancelled) {
					setSummariesError(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [dispatch, summaries.length]);

	useEffect(() => {
		if (seasonChoices.length === 0) {
			return;
		}

		if (selectedSeasonId && seasonChoices.some((season) => season.id === selectedSeasonId)) {
			return;
		}

		const activeInList = seasonChoices.find((season) => season.status === SEASON_STATUS_ACTIVE);
		if (activeInList) {
			setSelectedSeasonId(activeInList.id);
		} else if (activeSeasonId && seasonChoices.some((season) => season.id === activeSeasonId)) {
			setSelectedSeasonId(activeSeasonId);
		} else {
			setSelectedSeasonId(seasonsNewestFirst[0].id);
		}
	}, [seasonChoices, seasonsNewestFirst, activeSeasonId, selectedSeasonId]);

	useEffect(() => {
		if (leagues.length === 0) {
			return;
		}
		if (!leagues.some((league) => league.leagueCode === selectedLeagueCode)) {
			setSelectedLeagueCode(leagues[0].leagueCode);
		}
	}, [leagues, selectedLeagueCode]);

	useEffect(() => {
		if (selectedPlayerName === allPlayersLabel) {
			return;
		}
		if (!players.some((player) => player.username === selectedPlayerName)) {
			setSelectedPlayerName(allPlayersLabel);
		}
	}, [players, selectedPlayerName, allPlayersLabel]);

	useEffect(() => {
		if (!statsKey || !selectedLeagueId || !selectedUserId) {
			return;
		}

		let cancelled = false;
		setLoadingError(false);

		void dispatch(
			getStatsByTeams({
				seasonId: selectedSeasonId,
				leagueId: selectedLeagueId,
				userId: selectedUserId,
			})
		)
			.unwrap()
			.then(() => {
				if (!cancelled) {
					setLoadedStatsKey(statsKey);
				}
			})
			.catch((err: unknown) => {
				if (cancelled) {
					return;
				}
				const message =
					typeof err === 'string'
						? err
						: err && typeof err === 'object' && 'message' in err
							? String((err as { message: unknown }).message)
							: '';
				if (
					message === 'noPlayerStatsByTeamsInLeague' ||
					message === 'noTotalStatsByTeamsInLeague'
				) {
					setLoadedStatsKey(statsKey);
					return;
				}
				setLoadingError(true);
			});

		return () => {
			cancelled = true;
		};
	}, [statsKey, selectedSeasonId, selectedLeagueId, selectedUserId, dispatch]);

	if (summariesError && seasonChoices.length === 0) {
		return <CustomLoadingError />;
	}

	if (seasonChoices.length === 0 || !hasValidSeason) {
		return <CustomLoading />;
	}

	const filters = (
		<Box sx={teamsStatsFiltersSx}>
			<SeasonSelect
				value={selectedSeasonId}
				onChange={handleSeasonChange}
				seasons={seasonsNewestFirst}
				sx={{ width: '100%' }}
			/>
			<Box sx={teamsStatsLeaguePlayerRowSx}>
				<LeagueSelect
					value={selectedLeagueCode}
					onChange={handleLeagueChange}
					leagues={leagues}
					withoutAll
				/>
				<PlayerSelect
					value={selectedPlayerName}
					onChange={handlePlayerChange}
					players={players}
				/>
			</Box>
		</Box>
	);

	return (
		<Box sx={teamsStatsPageSx}>
			{filters}
			{loadingError ? (
				<CustomLoadingError />
			) : isStatsLoading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
					<CircularProgress />
				</Box>
			) : statsByTeams && statsByTeams.teamStats.length > 0 ? (
				<TeamsStats playersStatsByTeams={statsByTeams} />
			) : (
				<Box sx={teamsStatsEmptySx}>{t('noTeamStats')}</Box>
			)}
		</Box>
	);
}
