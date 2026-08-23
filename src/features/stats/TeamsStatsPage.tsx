import { Box, CircularProgress, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import useFilterLanguageChange from '../../components/hooks/useFilterLanguageChange';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import PlayerSelect from '../../components/selectors/PlayerSelect';
import SeasonSelect from '../../components/selectors/SeasonSelect';
import { TOTAL_STATS_BY_TEAMS_USER_ID } from '../../constants';
import { selectStatsByTeams } from './selectors';
import { getStatsByTeams } from './statsSlice';
import TeamsStats from './TeamsStats';
import useSeasonSummariesForStats from './useSeasonSummariesForStats';

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
	const statsByTeams = useAppSelector(selectStatsByTeams);
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
	const [selectedPlayerName, setSelectedPlayerName] = useState(t('all'));
	const [loadedStatsKey, setLoadedStatsKey] = useState<string | null>(null);
	const [loadingError, setLoadingError] = useState(false);

	useFilterLanguageChange(setSelectedPlayerName);

	const allPlayersLabel = t('all');

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

	if (summariesError && seasonsNewestFirst.length === 0) {
		return <CustomLoadingError />;
	}

	if (seasonsNewestFirst.length === 0 || !hasValidSeason) {
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
