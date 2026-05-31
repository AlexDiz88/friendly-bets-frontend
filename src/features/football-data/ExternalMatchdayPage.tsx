import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	FormControlLabel,
	IconButton,
	SelectChangeEvent,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import CustomSwitch from '../../components/custom/controls/CustomSwitch';
import { toggleFormControlLabelSx } from '../../components/custom/controls/customToggleStyles';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import MatchdayNavigator from '../../components/matchday/MatchdayNavigator';
import OddsPickDialog from '../../components/odds/OddsPickDialog';
import { getAllSeasonCalendarNodes } from '../admin/calendars/calendarsSlice';
import { selectAllCalendarNodes } from '../admin/calendars/selectors';
import {
	findLeagueMatchdayInCalendars,
	resolveBetSizeForBetInput,
	resolveSeasonDefaultBetSize,
} from '../bets/betSizeDefaults';
import { getExternalMatchScoreView } from './externalMatchScoreView';
import GameResultScoreEditDialog from './GameResultScoreEditDialog';
import {
	adminCorrectGameResultScore,
	applyPrimaryApiGameResultScore,
	gameScoreToAdminBody,
	settleMatchdayAndRecalculateStats,
} from './gameResultsAdminApi';
import { matchSideToDisplayTeam } from './externalMatchDisplay';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import Team from '../admin/teams/types/Team';
import { selectUser } from '../auth/selectors';
import GameScore from '../bets/types/GameScore';
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
import { syncOddsMatchdayFromApi } from './matchOddsApi';
import { notifyExternalSyncIssuesChanged } from '../admin/external-sync-issues/api';
import {
	getMatchStatusChipColor,
	isMatchNotStarted,
	isMatchdayNotStarted,
	translateMatchStatus,
} from './matchStatusI18n';
import { resolveExternalSeasonForLeague } from './seasonExternalYear';
import {
	ExternalCompetitionInfo,
	ExternalMatch,
	ExternalMatchdayPage as MatchdayPageData,
} from './types/ExternalMatch';
import ExternalMatchWc26Card from './ExternalMatchWc26Card';
import WcExternalSlotPanel from './WcExternalSlotPanel';
import { useWcSlotUserBets } from './useWcSlotUserBets';
import {
	betsRequiredForSlot,
	expectedBerlinMatchCount,
	filterExternalMatchesForBerlinSlot,
	isBerlinGroupSlot,
} from '../world-cup-2026/wc26BetSlots';
import {
	externalMatchWcEmptyHintSx,
	externalMatchWcHeaderCompactSx,
	externalMatchWcHeaderPanelSx,
	externalMatchWcLoadingAreaSx,
	externalMatchWcMatchGridSx,
	externalMatchWcMatchListSx,
	externalMatchWcMatchPanelSx,
	externalMatchWcOddsSyncButtonSx,
	externalMatchWcOverlineSx,
	externalMatchWcOverlineTextSx,
	externalMatchWcPageColumnSx,
	externalMatchWcPageRootSx,
	externalMatchWcRefreshSyncButtonSx,
	externalMatchWcSyncCaptionSx,
	externalMatchWcTitleSx,
} from './externalMatchWcPageStyles';

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
	const { t, i18n } = useTranslation();

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
					{resolveTeamDisplayName(homeTeam, t, i18n.language)}
				</Typography>
				<Avatar
					variant="square"
					src={resolveTeamLogoUrl(homeTeam)}
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
					src={resolveTeamLogoUrl(awayTeam)}
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
					{resolveTeamDisplayName(awayTeam, t, i18n.language)}
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
	const calendarNodes = useAppSelector(selectAllCalendarNodes);
	const canSync = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
	const isAdmin = user?.role === 'ADMIN';

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

	const effectiveLeagueCode = useMemo(() => {
		if (footballDataLeagues.length === 0) {
			return '';
		}
		if (footballDataLeagues.some((l) => l.leagueCode === selectedLeagueCode)) {
			return selectedLeagueCode;
		}
		return footballDataLeagues[0].leagueCode;
	}, [footballDataLeagues, selectedLeagueCode]);

	const externalSeason = useMemo(
		() => resolveExternalSeasonForLeague(activeSeason, effectiveLeagueCode),
		[activeSeason, effectiveLeagueCode]
	);

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
	const [competitionInfoLoading, setCompetitionInfoLoading] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [oddsSyncing, setOddsSyncing] = useState(false);
	const [editMatch, setEditMatch] = useState<ExternalMatch | null>(null);
	const [pickMatch, setPickMatch] = useState<ExternalMatch | null>(null);
	const [adminOptionsEnabled, setAdminOptionsEnabled] = useState(false);

	const showAdminTools = isAdmin && adminOptionsEnabled;

	const isSeasonParticipant = useMemo(() => {
		if (!user?.id || !activeSeason?.players) {
			return false;
		}
		return activeSeason.players.some((p) => p.id === user.id);
	}, [user?.id, activeSeason?.players]);

	const betMatchDay = useMemo(() => {
		const slot = matchdaySlots.find((s) => s.value === effectiveMatchday);
		return slot?.slotId ?? String(effectiveMatchday);
	}, [matchdaySlots, effectiveMatchday]);

	const isBerlinGroupSlotActive = useMemo(
		() => isBerlinGroupSlot(betMatchDay),
		[betMatchDay]
	);

	const isWcLeague = effectiveLeagueCode === 'WC';

	const slotBetLimit = useMemo(
		() => (isWcLeague ? betsRequiredForSlot(betMatchDay) : 0),
		[isWcLeague, betMatchDay]
	);

	const currentSlotLabel = useMemo(
		() => matchdaySlots.find((s) => s.value === effectiveMatchday)?.label,
		[matchdaySlots, effectiveMatchday]
	);

	const { bets: userSlotBets, betsByMatch, loading: slotBetsLoading } = useWcSlotUserBets({
		enabled: isWcLeague && Boolean(user?.id),
		seasonId: activeSeason?.id,
		leagueId: selectedLeague?.id,
		userId: user?.id,
		matchDay: betMatchDay,
		refreshKey: data,
	});

	const calendarMatch = useMemo(
		() =>
			selectedLeague
				? findLeagueMatchdayInCalendars(calendarNodes, selectedLeague.leagueCode, betMatchDay)
				: null,
		[calendarNodes, selectedLeague, betMatchDay]
	);

	const canUserBetOnMatch = useCallback(
		(match: ExternalMatch): boolean => {
			if (!user || !isSeasonParticipant || !selectedLeague?.id || !activeSeason?.id) {
				return false;
			}
			if (!calendarMatch) {
				return false;
			}
			if (!match.id || !match.homeTeamId || !match.awayTeamId) {
				return false;
			}
			if (!isMatchNotStarted(match.status)) {
				return false;
			}
			if (match.utcDate && new Date(match.utcDate).getTime() <= Date.now()) {
				return false;
			}
			return true;
		},
		[user, isSeasonParticipant, selectedLeague?.id, activeSeason?.id, calendarMatch]
	);

	const matchesLoading = competitionInfoLoading || loading;

	const reloadMatchday = useCallback(async (): Promise<void> => {
		const page = await getMatchdayFromCache(
			competitionCode,
			effectiveMatchday,
			externalSeason,
			selectedLeague?.id
		);
		setData(page);
	}, [competitionCode, effectiveMatchday, externalSeason, selectedLeague?.id]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	useEffect(() => {
		if (activeSeason?.id) {
			void dispatch(getAllSeasonCalendarNodes(activeSeason.id));
		}
	}, [activeSeason?.id, dispatch]);

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
		setCompetitionInfoLoading(true);
		setCompetitionInfo(null);

		const loadInfo = async (): Promise<void> => {
			try {
				if (selectedLeague?.id && selectedLeague.tournamentFormatId) {
					const info = await getLeagueExternalCompetitionInfo(selectedLeague.id, externalSeason);
					if (!cancelled) setCompetitionInfo(info);
					return;
				}
				const info = await getCompetitionInfo(competitionCode, externalSeason);
				if (!cancelled) setCompetitionInfo(info);
			} catch {
				if (!cancelled) setCompetitionInfo(null);
			} finally {
				if (!cancelled) setCompetitionInfoLoading(false);
			}
		};
		loadInfo();
		return () => {
			cancelled = true;
		};
	}, [competitionCode, externalSeason, selectedLeague?.id, selectedLeague?.tournamentFormatId]);

	useEffect(() => {
		if (competitionInfoLoading) {
			return;
		}
		if (!matchdayTouched && !competitionInfo) {
			return;
		}

		const targetMatchday = matchdayTouched
			? effectiveMatchday
			: competitionInfo!.currentMatchday;

		if (!matchdayTouched && matchday !== targetMatchday) {
			setMatchday(targetMatchday);
			return;
		}

		let cancelled = false;
		const loadMatches = async (): Promise<void> => {
			setLoading(true);
			try {
				const page = await getMatchdayFromCache(
					competitionCode,
					targetMatchday,
					externalSeason,
					selectedLeague?.id
				);
				if (!cancelled) setData(page);
			} catch (error) {
				if (!cancelled) {
					setData(null);
					dispatch(
						showErrorSnackbar({
							message:
								error instanceof Error ? error.message : t('externalMatchLoadError'),
						})
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		loadMatches();
		return () => {
			cancelled = true;
		};
	}, [
		competitionInfoLoading,
		competitionInfo,
		matchdayTouched,
		effectiveMatchday,
		matchday,
		competitionCode,
		externalSeason,
		selectedLeague?.id,
		dispatch,
	]);

	useEffect(() => {
		if (effectiveLeagueCode && effectiveLeagueCode !== selectedLeagueCode) {
			setSelectedLeagueCode(effectiveLeagueCode);
		}
	}, [effectiveLeagueCode, selectedLeagueCode]);

	useEffect(() => {
		if (matchdayTouched || competitionInfoLoading || !competitionInfo) {
			return;
		}
		if (effectiveMatchday !== matchday) {
			setMatchday(effectiveMatchday);
		}
	}, [effectiveMatchday, matchday, matchdayTouched, competitionInfoLoading, competitionInfo]);

	const handleLeagueChange = (e: SelectChangeEvent): void => {
		setMatchdayTouched(false);
		setSelectedLeagueCode(e.target.value);
		setData(null);
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
				externalSeason,
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

	const handleOddsSyncFromApi = async (): Promise<void> => {
		if (!selectedLeague?.id) {
			return;
		}
		setOddsSyncing(true);
		try {
			const result = await syncOddsMatchdayFromApi(
				selectedLeague.id,
				effectiveMatchday,
				externalSeason
			);
			notifyExternalSyncIssuesChanged();
			dispatch(
				showSuccessSnackbar({
					message: t('externalMatchOddsSyncSuccess', {
						saved: result.oddsDocumentsSaved,
						failures: result.mappingFailures,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalMatchOddsSyncError'),
				})
			);
		} finally {
			setOddsSyncing(false);
		}
	};

	const handleApplyApiScore = async (): Promise<void> => {
		if (!editMatch?.id || !activeSeason?.id || !effectiveLeagueCode) {
			return;
		}
		await applyPrimaryApiGameResultScore(editMatch.id);
		const result = await settleMatchdayAndRecalculateStats({
			seasonId: activeSeason.id,
			leagueCode: effectiveLeagueCode,
			matchday: effectiveMatchday,
			externalSeason,
		});
		await reloadMatchday();
		dispatch(
			showSuccessSnackbar({
				message: t('gameResultApiScoreApplied', {
					matches: result.matchesSubmitted,
					bets: result.betsProcessed,
				}),
			})
		);
	};

	const handleAdminScoreSave = async (score: GameScore): Promise<void> => {
		if (!editMatch?.id || !activeSeason?.id || !effectiveLeagueCode) {
			return;
		}
		await adminCorrectGameResultScore(editMatch.id, gameScoreToAdminBody(score));
		const result = await settleMatchdayAndRecalculateStats({
			seasonId: activeSeason.id,
			leagueCode: effectiveLeagueCode,
			matchday: effectiveMatchday,
			externalSeason,
		});
		await reloadMatchday();
		dispatch(
			showSuccessSnackbar({
				message: t('gameResultScoreCorrected', {
					matches: result.matchesSubmitted,
					bets: result.betsProcessed,
				}),
			})
		);
	};

	const sortedMatches = useMemo(() => {
		if (!data?.matches) return [];
		const sorted = [...data.matches].sort((a, b) => {
			const da = a.utcDate ? new Date(a.utcDate).getTime() : 0;
			const db = b.utcDate ? new Date(b.utcDate).getTime() : 0;
			return da - db;
		});
		if (isBerlinGroupSlotActive) {
			return filterExternalMatchesForBerlinSlot(sorted, betMatchDay);
		}
		return sorted;
	}, [data?.matches, isBerlinGroupSlotActive, betMatchDay]);

	const syncProgressTotal = useMemo(() => {
		if (isBerlinGroupSlotActive) {
			return expectedBerlinMatchCount(betMatchDay);
		}
		return data?.sync?.expectedMatchCount ?? 0;
	}, [isBerlinGroupSlotActive, betMatchDay, data?.sync?.expectedMatchCount]);

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

	const renderWcAdminEditButton = (match: ExternalMatch): JSX.Element | null =>
		showAdminTools && match.id ? (
			<Tooltip title={t('gameResultEditScore')}>
				<span>
					<IconButton
						size="small"
						onClick={(e) => {
							e.stopPropagation();
							setEditMatch(match);
						}}
						sx={{ p: 0.25 }}
						aria-label={t('gameResultEditScore')}
					>
						<EditIcon sx={{ fontSize: 16 }} />
					</IconButton>
				</span>
			</Tooltip>
		) : null;

	return (
		<Box
			sx={
				[
					{
						width: '100%',
						maxWidth: 430,
						mx: 'auto',
						px: 0.5,
						mt: { xs: -1.5, sm: 0 },
						pb: 1,
						overflowX: 'hidden',
					},
					isWcLeague ? externalMatchWcPageRootSx : false,
					isWcLeague ? externalMatchWcPageColumnSx : false,
				] as SxProps<Theme>
			}
		>
			<Box
				sx={
					[
						{
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
						},
						isWcLeague ? externalMatchWcHeaderPanelSx : false,
						isWcLeague ? externalMatchWcHeaderCompactSx : false,
					] as SxProps<Theme>
				}
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
					{isWcLeague ? (
						<Box sx={{ width: '100%', px: canSync ? 6.5 : 0, pt: 1 }}>
							<Box sx={externalMatchWcOverlineSx}>
								<Typography component="span" sx={externalMatchWcOverlineTextSx}>
									FIFA World Cup 26™
								</Typography>
							</Box>
							<Typography sx={externalMatchWcTitleSx}>{t('externalMatchResults')}</Typography>
						</Box>
					) : (
						<Typography
							sx={{
								fontWeight: 700,
								textAlign: 'center',
								fontSize: '1rem',
								lineHeight: 1.2,
								px: canSync ? 6.5 : 0,
							}}
						>
							{t('externalMatchResults')}
						</Typography>
					)}
					{canSync ? (
						<Box
							sx={{
								position: 'absolute',
								right: 0,
								top: '50%',
								transform: 'translateY(-50%)',
								display: 'flex',
								alignItems: 'center',
								gap: 0.25,
							}}
						>
							<Tooltip title={t('externalMatchOddsSyncFromApi')}>
								<span>
									<IconButton
										size="small"
										disabled={
											oddsSyncing ||
											syncing ||
											loading ||
											!selectedLeague?.id
										}
										onClick={() => void handleOddsSyncFromApi()}
										aria-label={t('externalMatchOddsSyncFromApi')}
										sx={
											isWcLeague
												? externalMatchWcOddsSyncButtonSx
												: {
														width: 26,
														height: 26,
														p: 0,
														bgcolor: 'primary.main',
														color: 'common.white',
														'&:hover': { bgcolor: 'primary.dark' },
														'&.Mui-disabled': {
															bgcolor: 'action.disabledBackground',
															color: 'action.disabled',
														},
													}
										}
									>
										{oddsSyncing ? (
											<CircularProgress size={18} sx={{ color: 'common.white' }} />
										) : (
											<PaidIcon sx={{ fontSize: 18, color: 'common.white' }} />
										)}
									</IconButton>
								</span>
							</Tooltip>
							<Tooltip title={t('externalMatchSyncFromApi')}>
								<span>
									<IconButton
										size="small"
										disabled={syncing || oddsSyncing || loading}
										onClick={() => void handleSyncFromApi()}
										aria-label={t('externalMatchSyncFromApi')}
										sx={
											isWcLeague
												? externalMatchWcRefreshSyncButtonSx
												: {
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
													}
										}
									>
										{syncing ? (
											<CircularProgress size={18} sx={{ color: 'common.white' }} />
										) : (
											<RefreshIcon sx={{ fontSize: 20, color: 'common.white' }} />
										)}
									</IconButton>
								</span>
							</Tooltip>
						</Box>
					) : null}
				</Box>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: { xs: 0.75, sm: 2 },
						flexWrap: 'nowrap',
						minWidth: 0,
						overflow: 'hidden',
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
						<MatchdayNavigator
							value={effectiveMatchday}
							slots={matchdaySlots}
							onChange={(md) => handleMatchdayChange(md)}
							disabled={competitionInfoLoading}
						/>
					</Box>
				</Box>

				{!matchesLoading && data?.sync && syncChip && (
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 0.25,
							alignItems: 'center',
							justifyContent: 'center',
							px: 0.5,
							mb: isWcLeague ? 0.25 : undefined,
							flexShrink: 0,
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
						<Typography
							variant="caption"
							color={isWcLeague ? undefined : 'text.secondary'}
							sx={
								[
									{ px: 1 },
									isWcLeague ? externalMatchWcSyncCaptionSx : false,
								] as SxProps<Theme>
							}
						>
							{t('externalMatchSyncProgress', {
								finished: data.sync.finishedMatchCount,
								total: syncProgressTotal,
							})}
						</Typography>
					</Box>
				)}
				{isAdmin ? (
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', px: 0.5 }}>
						<FormControlLabel
							sx={
								[
									toggleFormControlLabelSx,
									{ '& .MuiFormControlLabel-label': { fontSize: '0.8rem' } },
								] as SxProps<Theme>
							}
							control={
								<CustomSwitch
									size="small"
									checked={adminOptionsEnabled}
									onChange={(e) => setAdminOptionsEnabled(e.target.checked)}
									inputProps={{ 'aria-label': t('gameResultAdminOptions') }}
								/>
							}
							label={t('gameResultAdminOptions')}
							labelPlacement="start"
						/>
					</Box>
				) : null}
			</Box>

			<GameResultScoreEditDialog
				open={editMatch !== null}
				match={editMatch}
				onClose={() => setEditMatch(null)}
				onSave={handleAdminScoreSave}
				onApplyApiScore={editMatch?.finalized ? handleApplyApiScore : undefined}
			/>

			{pickMatch && user && activeSeason && selectedLeague && calendarMatch && pickMatch.id ? (
				<OddsPickDialog
					open
					onClose={() => setPickMatch(null)}
					gameResultId={pickMatch.id}
					match={pickMatch}
					seasonId={activeSeason.id}
					leagueId={selectedLeague.id}
					matchDay={betMatchDay}
					calendarNodeId={calendarMatch.calendar.id}
					betSize={resolveBetSizeForBetInput(
						resolveSeasonDefaultBetSize(activeSeason),
						betMatchDay,
						calendarMatch.node
					)}
					userId={user.id}
					onBetPlaced={() => {
						void reloadMatchday();
					}}
				/>
			) : null}

			{matchesLoading && (
				<Box sx={isWcLeague ? externalMatchWcLoadingAreaSx : { display: 'flex', justifyContent: 'center', py: 3 }}>
					<CircularProgress size={isWcLeague ? 28 : 40} />
				</Box>
			)}

			{!matchesLoading && sortedMatches.length === 0 && (
				<Typography
					textAlign="center"
					color={isWcLeague ? undefined : 'text.secondary'}
					sx={
						isWcLeague
							? ([externalMatchWcEmptyHintSx, { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }] as SxProps<Theme>)
							: { py: 3, px: 1 }
					}
				>
					{canSync ? t('externalMatchNoDataHintModerator') : t('externalMatchNoDataHint')}
				</Typography>
			)}

			{!matchesLoading && sortedMatches.length > 0 && isWcLeague && (
				<Box sx={[externalMatchWcMatchListSx, { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }] as SxProps<Theme>}>
					<Box sx={externalMatchWcMatchPanelSx}>
						<WcExternalSlotPanel
							slotId={betMatchDay}
							slotLabel={currentSlotLabel}
							betsUsed={userSlotBets.length}
							betsLimit={slotBetLimit}
							matchCount={sortedMatches.length}
							betsLoading={slotBetsLoading}
						/>
						<Box sx={externalMatchWcMatchGridSx(sortedMatches.length)}>
							{sortedMatches.map((match: ExternalMatch, index: number) => {
								const betEnabled = canUserBetOnMatch(match);
								const matchBet =
									match.homeTeamId && match.awayTeamId
										? betsByMatch.get(`${match.homeTeamId}_${match.awayTeamId}`)
										: undefined;
								return (
									<ExternalMatchWc26Card
										key={match.externalMatchId}
										match={match}
										slotId={betMatchDay}
										userBet={matchBet}
										isLast={index === sortedMatches.length - 1}
										clickable={betEnabled}
										onClick={betEnabled ? () => setPickMatch(match) : undefined}
										showAdminEdit={showAdminTools && Boolean(match.id)}
										adminEditButton={renderWcAdminEditButton(match)}
									/>
								);
							})}
						</Box>
					</Box>
				</Box>
			)}

			{!matchesLoading && sortedMatches.length > 0 && !isWcLeague && (
				<Box
					sx={{
						borderRadius: 2,
						boxShadow: 2,
						bgcolor: 'background.paper',
					}}
				>
					{sortedMatches.map((match: ExternalMatch, index: number) => {
						const homeTeam = matchSideToDisplayTeam(match, 'home');
						const awayTeam = matchSideToDisplayTeam(match, 'away');
						const gameScore: GameScore | null = match.gameScore ?? null;
						const scoreView = getExternalMatchScoreView(
							gameScore,
							match.status,
							Boolean(match.finalized)
						);
						const statusLabel = match.finalized
							? t('gameResultFinalized')
							: translateMatchStatus(match.status, t);
						const statusColor = match.finalized
							? 'success'
							: getMatchStatusChipColor(match.status);
						const matchDate = match.utcDate
							? new Date(match.utcDate).toLocaleString(undefined, {
									day: '2-digit',
									month: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
								})
							: '';
						const betEnabled = canUserBetOnMatch(match);

						return (
							<Box
								key={match.externalMatchId}
								onClick={betEnabled ? () => setPickMatch(match) : undefined}
								sx={{
									px: 1,
									py: 0.45,
									borderBottom: index < sortedMatches.length - 1 ? 1 : 0,
									borderColor: 'divider',
									cursor: betEnabled ? 'pointer' : 'default',
									'&:hover': betEnabled ? { bgcolor: 'action.hover' } : undefined,
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
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
										<Chip
											size="small"
											label={statusLabel}
											color={statusColor}
											sx={{
												height: 18,
												fontSize: '0.58rem',
												'& .MuiChip-label': { px: 0.5, py: 0 },
											}}
										/>
										{showAdminTools && match.id ? (
											<Tooltip title={t('gameResultEditScore')}>
												<span>
													<IconButton
														size="small"
														onClick={(e) => {
															e.stopPropagation();
															setEditMatch(match);
														}}
														sx={{ p: 0.25 }}
														aria-label={t('gameResultEditScore')}
													>
														<EditIcon sx={{ fontSize: 16 }} />
													</IconButton>
												</span>
											</Tooltip>
										) : null}
									</Box>
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
