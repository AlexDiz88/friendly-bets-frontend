import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
import MatchdayGridSelect from '../../components/selectors/MatchdayGridSelect';
import { getExternalMatchScoreView } from './externalMatchScoreView';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import Team from '../admin/teams/types/Team';
import { selectUser } from '../auth/selectors';
import GameScore from '../bets/types/GameScore';
import { teamNameMap } from './gameResults/teamMap';
import {
	buildMatchdaySlotsForLeague,
	FOOTBALL_DATA_COMPETITIONS,
	externalSlotsToMatchdaySlots,
	MatchdaySlot,
} from './competitionOptions';
import League from '../admin/leagues/types/League';
import {
	getCompetitionInfo,
	getLeagueExternalCompetitionInfo,
	getMatchdayFromCache,
	syncMatchdayFromApi,
} from './footballDataApi';
import {
	getMatchStatusChipColor,
	isMatchdayNotStarted,
	translateMatchStatus,
} from './matchStatusI18n';
import {
	resolveDefaultExternalSeason,
	resolveExternalSeasonYearOptions,
} from './seasonExternalYear';
import {
	ExternalCompetitionInfo,
	ExternalMatch,
	ExternalMatchdayPage as MatchdayPageData,
} from './types/ExternalMatch';

function toDisplayTeam(name: string): Team {
	const title = teamNameMap[name] ?? name;
	return { id: `ext-${title}`, title };
}

const MATCH_ROW_AVATAR = 26;

const seasonSelectSx = {
	height: 24,
	fontSize: '0.72rem',
	'& .MuiSelect-select': {
		py: 0,
		px: 0.5,
		minHeight: 'unset !important',
		lineHeight: 1.2,
	},
	'& .MuiOutlinedInput-notchedOutline': {
		borderWidth: 1,
	},
};

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
		footballDataLeagues[0]?.leagueCode ?? FOOTBALL_DATA_COMPETITIONS[0].leagueCode
	);

	const selectedLeague: League | undefined = useMemo(
		() => footballDataLeagues.find((l) => l.leagueCode === selectedLeagueCode),
		[footballDataLeagues, selectedLeagueCode]
	);
	const [matchday, setMatchday] = useState(1);
	const [matchdayTouched, setMatchdayTouched] = useState(false);
	const [season, setSeason] = useState('');
	const [seasonTouched, setSeasonTouched] = useState(false);

	const externalSeasonYearOptions = useMemo(
		() => resolveExternalSeasonYearOptions(activeSeason),
		[activeSeason]
	);

	const effectiveSeason = useMemo(() => {
		if (season && externalSeasonYearOptions.includes(season)) {
			return season;
		}
		return resolveDefaultExternalSeason(activeSeason);
	}, [season, externalSeasonYearOptions, activeSeason]);

	const competitionCode = useMemo(
		() => leagueCodeToCompetition(selectedLeagueCode),
		[selectedLeagueCode]
	);
	const [competitionInfo, setCompetitionInfo] = useState<ExternalCompetitionInfo | null>(null);
	const matchdaySlots = useMemo((): MatchdaySlot[] => {
		if (competitionInfo?.matchdaySlots && competitionInfo.matchdaySlots.length > 0) {
			return externalSlotsToMatchdaySlots(competitionInfo.matchdaySlots);
		}
		return buildMatchdaySlotsForLeague(selectedLeagueCode);
	}, [competitionInfo?.matchdaySlots, selectedLeagueCode]);

	const matchdayCount = matchdaySlots.length;

	const effectiveLeagueCode = useMemo(() => {
		if (footballDataLeagues.length === 0) {
			return '';
		}
		if (footballDataLeagues.some((l) => l.leagueCode === selectedLeagueCode)) {
			return selectedLeagueCode;
		}
		return footballDataLeagues[0].leagueCode;
	}, [footballDataLeagues, selectedLeagueCode]);

	const effectiveMatchday = useMemo(() => {
		if (matchdaySlots.length === 0) {
			return 1;
		}
		const values = matchdaySlots.map((s) => s.value);
		if (values.includes(matchday)) {
			return matchday;
		}
		return values[values.length - 1];
	}, [matchday, matchdaySlots]);

	const [data, setData] = useState<MatchdayPageData | null>(null);
	const [loading, setLoading] = useState(false);
	const [syncing, setSyncing] = useState(false);

	const loadCache = useCallback(async () => {
		setLoading(true);
		try {
			const page = await getMatchdayFromCache(competitionCode, effectiveMatchday, effectiveSeason);
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
	}, [competitionCode, effectiveMatchday, season, dispatch]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	useEffect(() => {
		if (seasonTouched) {
			return;
		}
		setSeason(resolveDefaultExternalSeason(activeSeason));
	}, [activeSeason, seasonTouched]);

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
		let cancelled = false;
		const loadInfo = async (): Promise<void> => {
			try {
				if (selectedLeague?.id && selectedLeague.tournamentFormatId) {
					const info = await getLeagueExternalCompetitionInfo(selectedLeague.id, effectiveSeason);
					if (!cancelled) setCompetitionInfo(info);
					return;
				}
				const info = await getCompetitionInfo(competitionCode, effectiveSeason);
				if (!cancelled) setCompetitionInfo(info);
			} catch {
				if (!cancelled) setCompetitionInfo(null);
			}
		};
		loadInfo();
		return () => {
			cancelled = true;
		};
	}, [competitionCode, effectiveSeason, selectedLeague?.id, selectedLeague?.tournamentFormatId]);

	useEffect(() => {
		if (matchdayTouched || !competitionInfo) {
			return;
		}
		setMatchday(competitionInfo.currentMatchday);
	}, [competitionInfo, matchdayTouched]);

	useEffect(() => {
		if (effectiveLeagueCode && effectiveLeagueCode !== selectedLeagueCode) {
			setSelectedLeagueCode(effectiveLeagueCode);
		}
	}, [effectiveLeagueCode, selectedLeagueCode]);

	useEffect(() => {
		if (effectiveMatchday !== matchday) {
			setMatchday(effectiveMatchday);
		}
	}, [effectiveMatchday, matchday]);

	useEffect(() => {
		loadCache();
	}, [loadCache]);

	const handleLeagueChange = (e: SelectChangeEvent): void => {
		setMatchdayTouched(false);
		setCompetitionInfo(null);
		setSelectedLeagueCode(e.target.value);
		setMatchday(1);
	};

	const handleSeasonChange = (e: SelectChangeEvent): void => {
		setSeasonTouched(true);
		setMatchdayTouched(false);
		setCompetitionInfo(null);
		setSeason(e.target.value);
		setMatchday(1);
	};

	const handleMatchdayChange = (md: number): void => {
		setMatchdayTouched(true);
		setMatchday(md);
	};

	const handleSyncFromApi = async (): Promise<void> => {
		setSyncing(true);
		try {
			const page = await syncMatchdayFromApi(
				competitionCode,
				effectiveMatchday,
				season,
				selectedLeague?.id
			);
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

	const matchdayNotStarted = useMemo(() => isMatchdayNotStarted(sortedMatches), [sortedMatches]);

	const syncChip = useMemo(() => {
		if (!data?.sync) return null;
		if (data.sync.syncStatus === 'COMPLETED') {
			return { label: t('externalMatchSyncCompleted'), color: 'success' as const };
		}
		if (matchdayNotStarted) {
			return { label: t('externalMatchSyncNotStarted'), color: 'default' as const };
		}
		return { label: t('externalMatchSyncPolling'), color: 'warning' as const };
	}, [data?.sync, matchdayNotStarted]);

	const currentSlotIndex = useMemo(
		() => matchdaySlots.findIndex((s) => s.value === effectiveMatchday),
		[matchdaySlots, effectiveMatchday]
	);
	const canGoPrevMatchday = currentSlotIndex > 0;
	const canGoNextMatchday =
		currentSlotIndex >= 0 && currentSlotIndex < matchdaySlots.length - 1;

	const goPrevMatchday = (): void => {
		if (!canGoPrevMatchday) return;
		setMatchdayTouched(true);
		setMatchday(matchdaySlots[currentSlotIndex - 1].value);
	};

	const goNextMatchday = (): void => {
		if (!canGoNextMatchday) return;
		setMatchdayTouched(true);
		setMatchday(matchdaySlots[currentSlotIndex + 1].value);
	};

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 430,
				mx: 'auto',
				px: 0.5,
				mt: { xs: -1.5, md: 0 },
				pb: 1,
			}}
		>
			<Box
				sx={{
					flexShrink: 0,
					display: 'flex',
					flexDirection: 'column',
					gap: 0.5,
					mb: 1,
					px: 0.5,
					pt: 0.25,
					pb: 0.5,
					borderRadius: 2,
					bgcolor: 'background.paper',
					boxShadow: 1,
				}}
			>
				<Box
					sx={{
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: 28,
						px: 0.25,
					}}
				>
					<Select
						size="small"
						value={effectiveSeason}
						onChange={handleSeasonChange}
						sx={{
							...seasonSelectSx,
							position: 'absolute',
							left: 0,
							top: '50%',
							transform: 'translateY(-50%)',
							minWidth: '2.85rem',
						}}
						aria-label={t('externalApiSeasonYear')}
					>
						{externalSeasonYearOptions.map((y) => (
							<MenuItem key={y} value={y} sx={{ py: 0.35, fontSize: '0.75rem' }}>
								{y}
							</MenuItem>
						))}
					</Select>
					<Typography
						sx={{
							fontWeight: 700,
							textAlign: 'center',
							fontSize: '1rem',
							lineHeight: 1.2,
							px: 4.5,
						}}
					>
						{t('externalMatchResults')}
					</Typography>
					{canSync ? (
						<Tooltip title={t('externalMatchSyncFromApi')}>
							<Box
								component="span"
								sx={{
									position: 'absolute',
									right: 0,
									top: '50%',
									transform: 'translateY(-50%)',
									display: 'flex',
								}}
							>
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
					) : null}
				</Box>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 2,
						flexWrap: 'nowrap',
					}}
				>
					<Box sx={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
						<LeagueSelect
							value={effectiveLeagueCode}
							onChange={handleLeagueChange}
							leagues={footballDataLeagues}
							withoutAll
							compact
						/>
					</Box>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 0.25,
							flex: '1 1 auto',
							justifyContent: 'flex-start',
							minWidth: 0,
						}}
					>
						<Tooltip title={t('previousMatchday')}>
							<span>
								<IconButton
									disabled={!canGoPrevMatchday}
									onClick={goPrevMatchday}
									aria-label={t('previousMatchday')}
									sx={{
										width: 40,
										height: 40,
										flexShrink: 0,
										borderColor: 'divider',
										borderRadius: 1,
									}}
								>
									<ChevronLeftIcon sx={{ fontSize: 28 }} />
								</IconButton>
							</span>
						</Tooltip>
						<MatchdayGridSelect
							value={effectiveMatchday}
							matchdayCount={matchdayCount}
							slots={matchdaySlots}
							onChange={handleMatchdayChange}
							aria-label={t('matchday')}
						/>
						<Tooltip title={t('nextMatchday')}>
							<span>
								<IconButton
									disabled={!canGoNextMatchday}
									onClick={goNextMatchday}
									aria-label={t('nextMatchday')}
									sx={{
										width: 40,
										height: 40,
										flexShrink: 0,
										borderColor: 'divider',
										borderRadius: 1,
									}}
								>
									<ChevronRightIcon sx={{ fontSize: 28 }} />
								</IconButton>
							</span>
						</Tooltip>
					</Box>
				</Box>

				{data?.sync && syncChip && (
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 0.25,
							alignItems: 'center',
							justifyContent: 'center',
							px: 0.5,
						}}
					>
						<Chip
							size="medium"
							label={syncChip.label}
							color={syncChip.color}
							sx={{
								height: 22,
								my: 0.5,
								fontSize: '0.75rem',
								'& .MuiChip-label': { p: 0.75 },
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
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
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
						boxShadow: 2,
						bgcolor: 'background.paper',
					}}
				>
					{sortedMatches.map((match: ExternalMatch, index: number) => {
						const homeTeam = toDisplayTeam(match.homeTeamName);
						const awayTeam = toDisplayTeam(match.awayTeamName);
						const gameScore: GameScore | null = match.gameScore ?? null;
						const scoreView = getExternalMatchScoreView(gameScore, match.status);
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
									py: 0.45,
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
										color={getMatchStatusChipColor(match.status)}
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
