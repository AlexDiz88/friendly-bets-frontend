import RefreshIcon from '@mui/icons-material/Refresh';
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	Tooltip,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import Team from '../admin/teams/types/Team';
import { selectUser } from '../auth/selectors';
import GameScore from '../bets/types/GameScore';
import { teamNameMap } from './gameResults/teamMap';
import {
	DEFAULT_FOOTBALL_DATA_SEASON,
	FOOTBALL_DATA_COMPETITIONS,
} from './competitionOptions';
import { getMatchdayFromCache, syncMatchdayFromApi } from './footballDataApi';
import { translateMatchStatus } from './matchStatusI18n';
import { ExternalMatch, ExternalMatchdayPage as MatchdayPageData } from './types/ExternalMatch';

function toDisplayTeam(name: string): Team {
	const title = teamNameMap[name] ?? name;
	return { id: `ext-${title}`, title };
}

function statusColor(status: string): 'success' | 'warning' | 'default' {
	if (status === 'FINISHED' || status === 'AWARDED') return 'success';
	if (status === 'IN_PLAY' || status === 'PAUSE' || status === 'HALFTIME') return 'warning';
	return 'default';
}

const MATCH_ROW_AVATAR = 26;

function CompactMatchRow({
	homeTeam,
	awayTeam,
	scoreView,
}: {
	homeTeam: Team;
	awayTeam: Team;
	scoreView: string;
}): JSX.Element {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 0.5,
				minHeight: MATCH_ROW_AVATAR,
			}}
		>
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-end',
					gap: 0.4,
					minWidth: 0,
				}}
			>
				<Typography
					variant="body2"
					sx={{
						fontSize: '0.78rem',
						fontWeight: 600,
						lineHeight: 1.2,
						textAlign: 'right',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{t(`teams:${homeTeam.title}`)}
				</Typography>
				<Avatar
					variant="square"
					src={pathToLogoImage(homeTeam.title)}
					alt=""
					sx={{ width: MATCH_ROW_AVATAR, height: MATCH_ROW_AVATAR, flexShrink: 0 }}
				/>
			</Box>

			<Typography
				sx={{
					flex: '0 0 auto',
					px: 0.5,
					fontWeight: 700,
					fontSize: '0.85rem',
					lineHeight: 1.2,
					textAlign: 'center',
					whiteSpace: 'nowrap',
				}}
			>
				{scoreView}
			</Typography>

			<Box
				sx={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					gap: 0.4,
					minWidth: 0,
				}}
			>
				<Avatar
					variant="square"
					src={pathToLogoImage(awayTeam.title)}
					alt=""
					sx={{ width: MATCH_ROW_AVATAR, height: MATCH_ROW_AVATAR, flexShrink: 0 }}
				/>
				<Typography
					variant="body2"
					sx={{
						fontSize: '0.78rem',
						fontWeight: 600,
						lineHeight: 1.2,
						textAlign: 'left',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{t(`teams:${awayTeam.title}`)}
				</Typography>
			</Box>
		</Box>
	);
}

const SUPPORTED_LEAGUE_CODES = new Set(FOOTBALL_DATA_COMPETITIONS.map((c) => c.leagueCode));

function leagueCodeToCompetition(leagueCode: string): string {
	return (
		FOOTBALL_DATA_COMPETITIONS.find((c) => c.leagueCode === leagueCode)?.competitionCode ?? 'PL'
	);
}

export default function ExternalMatchdayPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const activeSeason = useAppSelector(selectActiveSeason);
	const canSync = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	useFetchActiveSeason(activeSeason?.id);

	const footballDataLeagues = useMemo(
		() => activeSeason?.leagues.filter((l) => SUPPORTED_LEAGUE_CODES.has(l.leagueCode)) ?? [],
		[activeSeason?.leagues]
	);

	const [selectedLeagueCode, setSelectedLeagueCode] = useState(
		FOOTBALL_DATA_COMPETITIONS[0].leagueCode
	);
	const [matchday, setMatchday] = useState(1);
	const [season, setSeason] = useState(DEFAULT_FOOTBALL_DATA_SEASON);

	const competitionCode = useMemo(
		() => leagueCodeToCompetition(selectedLeagueCode),
		[selectedLeagueCode]
	);
	const [data, setData] = useState<MatchdayPageData | null>(null);
	const [loading, setLoading] = useState(false);
	const [syncing, setSyncing] = useState(false);

	const loadCache = useCallback(async () => {
		setLoading(true);
		try {
			const page = await getMatchdayFromCache(competitionCode, matchday, season);
			setData(page);
		} catch (error) {
			setData(null);
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalMatchLoadError'),
				})
			);
		} finally {
			setLoading(false);
		}
	}, [competitionCode, matchday, season, dispatch]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	useEffect(() => {
		if (footballDataLeagues.length > 0) {
			setSelectedLeagueCode((prev) =>
				footballDataLeagues.some((l) => l.leagueCode === prev)
					? prev
					: footballDataLeagues[0].leagueCode
			);
		}
	}, [footballDataLeagues]);

	useEffect(() => {
		loadCache();
	}, [loadCache]);

	const handleLeagueChange = (e: SelectChangeEvent): void => {
		setSelectedLeagueCode(e.target.value);
	};

	const handleSyncFromApi = async (): Promise<void> => {
		setSyncing(true);
		try {
			const page = await syncMatchdayFromApi(competitionCode, matchday, season);
			setData(page);
			dispatch(showSuccessSnackbar({ message: t('externalMatchSyncSuccess') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalMatchSyncError'),
				})
			);
		} finally {
			setSyncing(false);
		}
	};

	const sortedMatches = useMemo(() => {
		if (!data?.matches) return [];
		return [...data.matches].sort((a, b) => {
			const da = a.utcDate ? new Date(a.utcDate).getTime() : 0;
			const db = b.utcDate ? new Date(b.utcDate).getTime() : 0;
			return da - db;
		});
	}, [data?.matches]);

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 430,
				mx: 'auto',
				px: 0.5,
				mt: -1,
				minHeight: 'calc(100vh - 80px)',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 0.5,
					mb: 0.5,
					p: 0.5,
					borderRadius: 2,
					bgcolor: 'background.paper',
					boxShadow: 1,
				}}
			>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: '2rem 1fr 2rem',
						alignItems: 'center',
						columnGap: 0.5,
					}}
				>
					<Box aria-hidden />
					<Typography
						sx={{
							fontWeight: 700,
							textAlign: 'center',
							fontSize: '1rem',
							lineHeight: 1.25,
							py: 0.15,
						}}
					>
						{t('externalMatchResults')}
					</Typography>
					{canSync ? (
						<Tooltip title={t('externalMatchSyncFromApi')}>
							<Box component="span" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
								<IconButton
									size="small"
									disabled={syncing || loading}
									onClick={handleSyncFromApi}
									aria-label={t('externalMatchSyncFromApi')}
									sx={{
										width: 26,
										height: 26,
										p: 0,
										bgcolor: 'secondary.main',
										color: 'common.white',
										'&:hover': { bgcolor: 'secondary.dark' },
										'&.Mui-disabled': {
											bgcolor: 'action.disabledBackground',
											color: 'action.disabled',
										},
									}}
								>
									{syncing ? (
										<CircularProgress size={18} sx={{ color: 'common.white' }} />
									) : (
										<RefreshIcon sx={{ fontSize: 20, color: 'common.white' }} />
									)}
								</IconButton>
							</Box>
						</Tooltip>
					) : (
						<Box aria-hidden />
					)}
				</Box>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexWrap: 'nowrap',
						gap: 0.5,
					}}
				>
					<LeagueSelect
						value={selectedLeagueCode}
						onChange={handleLeagueChange}
						leagues={footballDataLeagues}
						withoutAll
					/>
					<Select
						size="small"
						value={matchday}
						onChange={(e) => setMatchday(Number(e.target.value))}
						sx={{ minWidth: '3.25rem', fontSize: '0.9rem' }}
						aria-label={t('matchday')}
					>
						{Array.from({ length: 38 }, (_, i) => i + 1).map((md) => (
							<MenuItem key={md} value={md}>
								{md}
							</MenuItem>
						))}
					</Select>
					<Select
						size="small"
						value={season}
						onChange={(e) => setSeason(e.target.value)}
						sx={{ minWidth: '4.25rem', fontSize: '0.9rem' }}
						aria-label={t('season')}
					>
						{['2024', '2025', '2026'].map((y) => (
							<MenuItem key={y} value={y}>
								{y}
							</MenuItem>
						))}
					</Select>
				</Box>

				{data?.sync && (
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 0.5,
							alignItems: 'center',
							justifyContent: 'center',
							px: 1,
						}}
					>
						<Chip
							size="medium"
							label={
								data.sync.syncStatus === 'COMPLETED'
									? t('externalMatchSyncCompleted')
									: t('externalMatchSyncPolling')
							}
							color={data.sync.syncStatus === 'COMPLETED' ? 'success' : 'warning'}
							sx={{
								height: 25,
								fontSize: '0.8rem',
								'& .MuiChip-label': { p: 1 },
							}}
						/>
						<Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
							{t('externalMatchSyncProgress', {
								finished: data.sync.finishedMatchCount,
								total: data.sync.expectedMatchCount,
							})}
						</Typography>
					</Box>
				)}
			</Box>

			{loading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{!loading && sortedMatches.length === 0 && (
				<Typography textAlign="center" color="text.secondary" sx={{ py: 3, px: 1 }}>
					{canSync ? t('externalMatchNoDataHintModerator') : t('externalMatchNoDataHint')}
				</Typography>
			)}

			{!loading && sortedMatches.length > 0 && (
				<Box
					sx={{
						borderRadius: 2,
						overflow: 'hidden',
						boxShadow: 2,
						bgcolor: 'background.paper',
					}}
				>
					{sortedMatches.map((match: ExternalMatch, index: number) => {
						const homeTeam = toDisplayTeam(match.homeTeamName);
						const awayTeam = toDisplayTeam(match.awayTeamName);
						const gameScore: GameScore | null = match.gameScore ?? null;
						const scoreView = gameScore ? getGameScoreView(gameScore, false) : '—';
						const matchDate = match.utcDate
							? new Date(match.utcDate).toLocaleString(undefined, {
									day: '2-digit',
									month: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
								})
							: '';

						return (
							<Box
								key={match.externalMatchId}
								sx={{
									px: 1,
									py: 0.6,
									borderBottom: index < sortedMatches.length - 1 ? 1 : 0,
									borderColor: 'divider',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mb: 0.25,
										gap: 0.5,
									}}
								>
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ fontSize: '0.68rem', lineHeight: 1.2 }}
									>
										{matchDate}
									</Typography>
									<Chip
										size="small"
										label={translateMatchStatus(match.status, t)}
										color={statusColor(match.status)}
										sx={{
											height: 18,
											fontSize: '0.58rem',
											'& .MuiChip-label': { px: 0.5, py: 0 },
										}}
									/>
								</Box>
								<CompactMatchRow
									homeTeam={homeTeam}
									awayTeam={awayTeam}
									scoreView={scoreView}
								/>
							</Box>
						);
					})}
				</Box>
			)}
		</Box>
	);
}
