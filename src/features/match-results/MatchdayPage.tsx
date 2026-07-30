import {
	Alert,
	Box,
	CircularProgress,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import i18n, { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { pageHasLiveMatches } from '../../shared/livePagePolling';
import { useLivePagePolling } from '../../shared/useLivePagePolling';
import { useVisibilityPageRefresh } from '../../shared/useVisibilityPageRefresh';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import { formatSlotLabel } from '../../components/matchday/formatSlotLabel';
import MatchdayNavigator from '../../components/matchday/MatchdayNavigator';
import {
	externalSlotsToMatchdaySlots,
	matchDayStringToSlotValue,
} from '../../components/matchday/slotMappers';
import type { MatchdaySlot } from '../../components/matchday/types';
import { APP_HEADER_CONTENT_GAP_PX } from '../../components/header/headerLayout';
import { getAllSeasonCalendarNodes } from '../admin/calendars/calendarsSlice';
import { selectAllCalendarNodes } from '../admin/calendars/selectors';
import { findLeagueMatchdayInCalendars } from '../bets/betSizeDefaults';
import NearestGameweekBetsPlate, {
	type NearestGameweekLeagueClick,
} from '../gameweeks/NearestGameweekBetsPlate';
import { resolveExternalMatchScoreView } from './externalMatchScoreView';
import { resolveExternalMatchKickoffUtcMs } from './externalMatchKickoff';
import { matchSideToDisplayTeam } from './externalMatchDisplay';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { selectUser } from '../auth/selectors';
import { useFormatUserDateTime } from '../../shared/useFormatUserDateTime';
import GameScore from '../bets/types/GameScore';
import { isSensitiveKnockoutSlot } from '../bets/knockoutBetPrivacy';
import League from '../admin/leagues/types/League';
import {
	getLeagueExternalCompetitionInfo,
	getMatchdayFromCache,
} from './matchResultsApi';
import {
	isMatchNotStarted,
} from './matchStatusI18n';
import { resolveExternalSeasonForLeague } from './seasonExternalYear';
import {
	ExternalCompetitionInfo,
	ExternalMatch,
	MatchdayPageData,
} from './types/ExternalMatch';
import ExternalMatchBetsDialog from './ExternalMatchBetsDialog';
import ExternalMatchResultCard from './ExternalMatchResultCard';
import ExternalMatchViewBetsButton from './ExternalMatchViewBetsButton';
import WcExternalSlotPanel from './WcExternalSlotPanel';
import { useWcSlotUserBets } from './useWcSlotUserBets';
import { matchBetCountKey, useSlotMatchBetCounts } from './useSlotMatchBetCounts';
import OddsPickDialog from '../../components/odds/OddsPickDialog';
import {
	FALLBACK_DEFAULT_BET_SIZE,
	getNodeDefaultBetSize,
} from '../bets/betSizeDefaults';

export default function MatchdayPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const { formatDateTime } = useFormatUserDateTime();
	const activeSeason = useAppSelector(selectActiveSeason);
	const calendarNodes = useAppSelector(selectAllCalendarNodes);
	const [searchParams, setSearchParams] = useSearchParams();
	const pendingMatchDayFromQuery = useRef<string | null>(null);
	const appliedMatchdayQueryKey = useRef('');
	const [plateRefreshKey, setPlateRefreshKey] = useState(0);

	useFetchActiveSeason(activeSeason?.id);

	const matchResultLeagues = useMemo(
		() => activeSeason?.leagues ?? [],
		[activeSeason?.leagues]
	);

	const [selectedLeagueCode, setSelectedLeagueCode] = useState(
		matchResultLeagues[0]?.leagueCode ?? ''
	);

	const effectiveLeagueCode = useMemo(() => {
		if (matchResultLeagues.length === 0) {
			return '';
		}
		if (matchResultLeagues.some((l) => l.leagueCode === selectedLeagueCode)) {
			return selectedLeagueCode;
		}
		return matchResultLeagues[0].leagueCode;
	}, [matchResultLeagues, selectedLeagueCode]);

	const selectedLeague: League | undefined = useMemo(
		() => matchResultLeagues.find((l) => l.leagueCode === effectiveLeagueCode),
		[matchResultLeagues, effectiveLeagueCode]
	);
	const [matchday, setMatchday] = useState(1);
	const [matchdayTouched, setMatchdayTouched] = useState(false);

	const [competitionInfo, setCompetitionInfo] = useState<ExternalCompetitionInfo | null>(null);
	const matchdaySlots = useMemo((): MatchdaySlot[] => {
		if (competitionInfo?.matchdaySlots && competitionInfo.matchdaySlots.length > 0) {
			return externalSlotsToMatchdaySlots(competitionInfo.matchdaySlots);
		}
		return [];
	}, [competitionInfo?.matchdaySlots]);

	const externalSeason = useMemo(
		() => resolveExternalSeasonForLeague(activeSeason, effectiveLeagueCode),
		[activeSeason, effectiveLeagueCode]
	);

	const [data, setData] = useState<MatchdayPageData | null>(null);
	const [loading, setLoading] = useState(true);
	const [competitionInfoLoading, setCompetitionInfoLoading] = useState(true);
	const [betsMatch, setBetsMatch] = useState<ExternalMatch | null>(null);
	const [oddsPickMatch, setOddsPickMatch] = useState<ExternalMatch | null>(null);
	const [calendarsReady, setCalendarsReady] = useState(false);

	const effectiveMatchday = useMemo(() => {
		const baseMatchday =
			!matchdayTouched && competitionInfo && !competitionInfoLoading
				? competitionInfo.currentMatchday
				: matchday;
		if (matchdaySlots.length === 0) {
			return baseMatchday;
		}
		const values = matchdaySlots.map((s) => s.value);
		if (values.includes(baseMatchday)) {
			return baseMatchday;
		}
		return values[values.length - 1];
	}, [matchday, matchdayTouched, competitionInfo, competitionInfoLoading, matchdaySlots]);

	const isSeasonParticipant = useMemo(() => {
		if (!user?.id || !activeSeason?.players) {
			return false;
		}
		return activeSeason.players.some((p) => p.id === user.id);
	}, [user?.id, activeSeason?.players]);

	const isAdminOrModerator =
		user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	const canAccessMatchBetsView = isSeasonParticipant || isAdminOrModerator;
	const canShowNearestGameweekPlate = Boolean(user?.id) && canAccessMatchBetsView;

	const betMatchDay = useMemo(() => {
		const slot = matchdaySlots.find((s) => s.value === effectiveMatchday);
		return slot?.slotId ?? String(effectiveMatchday);
	}, [matchdaySlots, effectiveMatchday]);

	const isWcLeague = effectiveLeagueCode === 'WC';

	const currentSlot = useMemo(
		() => matchdaySlots.find((s) => s.value === effectiveMatchday),
		[matchdaySlots, effectiveMatchday]
	);

	const currentSlotLabel = useMemo(
		() => (currentSlot ? formatSlotLabel(currentSlot) : undefined),
		[currentSlot, i18n.language]
	);

	const slotBetsContextReady = !competitionInfoLoading;

	const { bets: userSlotBets, loading: slotBetsLoading } = useWcSlotUserBets({
		enabled: isWcLeague && Boolean(user?.id),
		contextReady: slotBetsContextReady,
		seasonId: activeSeason?.id,
		leagueId: selectedLeague?.id,
		matchDay: betMatchDay,
	});

	const calendarMatch = useMemo(() => {
		if (!selectedLeague) {
			return null;
		}

		return findLeagueMatchdayInCalendars(
			calendarNodes,
			selectedLeague.leagueCode,
			betMatchDay,
			selectedLeague.id
		);
	}, [calendarNodes, selectedLeague, betMatchDay]);

	const slotBetLimit = useMemo(
		() => calendarMatch?.node.betCountLimit ?? 0,
		[calendarMatch]
	);

	const needsMatchBetCounts =
		Boolean(user?.id) && canAccessMatchBetsView && Boolean(selectedLeague?.id) && Boolean(activeSeason?.id);

	const { countsByMatch } = useSlotMatchBetCounts({
		enabled: needsMatchBetCounts,
		contextReady: slotBetsContextReady && Boolean(calendarMatch),
		seasonId: activeSeason?.id,
		leagueId: selectedLeague?.id,
		matchDay: betMatchDay,
	});

	const matchesLoading = competitionInfoLoading || loading;

	const isMatchdayAligned = useMemo(() => {
		if (matchdayTouched) {
			return true;
		}
		if (competitionInfoLoading || !competitionInfo) {
			return false;
		}
		return effectiveMatchday === competitionInfo.currentMatchday;
	}, [effectiveMatchday, matchdayTouched, competitionInfoLoading, competitionInfo]);

	const needsUserSlotBets = isWcLeague && Boolean(user?.id);
	const slotBetsPending =
		needsUserSlotBets && (!slotBetsContextReady || slotBetsLoading);
	const matchdayDataPending =
		Boolean(selectedLeague) &&
		isMatchdayAligned &&
		!competitionInfoLoading &&
		data === null &&
		!loading;

	const isExternalPageReady =
		calendarsReady &&
		!matchesLoading &&
		Boolean(selectedLeague) &&
		isMatchdayAligned &&
		!slotBetsPending &&
		!matchdayDataPending;

	const isBettingCalendarMissing = isExternalPageReady && !calendarMatch;

	const isMatchOpenForBetting = useCallback((match: ExternalMatch): boolean => {
		if (!match.homeTeamId || !match.awayTeamId) {
			return false;
		}
		if (!isMatchNotStarted(match.status)) {
			return false;
		}
		const kickoffMs = resolveExternalMatchKickoffUtcMs(match);
		if (kickoffMs > 0 && kickoffMs <= Date.now()) {
			return false;
		}
		return true;
	}, []);

	const canViewMatchBets = useCallback(
		(match: ExternalMatch): boolean => {
			if (!user || !canAccessMatchBetsView || !selectedLeague?.id || !activeSeason?.id) {
				return false;
			}
			if (!calendarMatch) {
				return false;
			}
			if (!match.homeTeamId || !match.awayTeamId) {
				return false;
			}
			return !isMatchOpenForBetting(match);
		},
		[
			user,
			canAccessMatchBetsView,
			selectedLeague?.id,
			activeSeason?.id,
			calendarMatch,
			isMatchOpenForBetting,
		]
	);

	const canOpenMatchBetsDialog = useCallback(
		(match: ExternalMatch): boolean => {
			if (!user || !canAccessMatchBetsView || !selectedLeague?.id || !activeSeason?.id) {
				return false;
			}
			if (!calendarMatch) {
				return false;
			}
			if (!match.homeTeamId || !match.awayTeamId) {
				return false;
			}
			return true;
		},
		[user, canAccessMatchBetsView, selectedLeague?.id, activeSeason?.id, calendarMatch]
	);

	const canOpenOddsPick = useCallback(
		(match: ExternalMatch): boolean => {
			if (!user || !match.id || !isMatchOpenForBetting(match)) {
				return false;
			}
			if (isSeasonParticipant) {
				return Boolean(calendarMatch);
			}
			// ADMIN / MODERATOR без участия — только просмотр кэфов
			return isAdminOrModerator;
		},
		[user, isMatchOpenForBetting, isAdminOrModerator, isSeasonParticipant, calendarMatch]
	);

	const showViewMatchBetsButton = useCallback(
		(match: ExternalMatch): boolean =>
			canOpenMatchBetsDialog(match) &&
			isMatchOpenForBetting(match) &&
			!isSensitiveKnockoutSlot(selectedLeague?.leagueCode, betMatchDay),
		[canOpenMatchBetsDialog, isMatchOpenForBetting, selectedLeague?.leagueCode, betMatchDay]
	);

	const isMatchCardClickable = useCallback(
		(match: ExternalMatch): boolean => canViewMatchBets(match) || canOpenOddsPick(match),
		[canViewMatchBets, canOpenOddsPick]
	);

	const handleMatchClick = useCallback(
		(match: ExternalMatch): void => {
			if (canOpenOddsPick(match)) {
				setOddsPickMatch(match);
				return;
			}
			if (canViewMatchBets(match)) {
				setBetsMatch(match);
			}
		},
		[canOpenOddsPick, canViewMatchBets]
	);

	const oddsPickBetSize = useMemo(() => {
		if (!calendarMatch?.node) {
			return FALLBACK_DEFAULT_BET_SIZE;
		}
		return getNodeDefaultBetSize(calendarMatch.node) ?? FALLBACK_DEFAULT_BET_SIZE;
	}, [calendarMatch]);

	const reloadMatchday = useCallback(async (): Promise<void> => {
		if (!selectedLeague?.id || !effectiveLeagueCode) {
			return;
		}
		try {
			const page = await getMatchdayFromCache(
				effectiveLeagueCode,
				effectiveMatchday,
				externalSeason,
				selectedLeague.id
			);
			setData(page);
		} catch {
			// тихий refresh: оставляем текущие данные на экране
		}
	}, [effectiveLeagueCode, effectiveMatchday, externalSeason, selectedLeague?.id]);

	const hasLiveMatches = useMemo(
		() =>
			pageHasLiveMatches(
				(data?.matches ?? []).map((match) => ({
					status: match.status,
					finalized: match.finalized,
					liveMinuteLabel: match.liveMinuteLabel,
					kickoffUtcMs: resolveExternalMatchKickoffUtcMs(match),
				}))
			),
		[data?.matches]
	);

	useVisibilityPageRefresh(isExternalPageReady, reloadMatchday);
	useLivePagePolling(isExternalPageReady && hasLiveMatches, reloadMatchday);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	useEffect(() => {
		if (user?.id) {
			dispatch(getActiveSeason());
		}
	}, [user?.id, dispatch]);

	useEffect(() => {
		if (!activeSeason?.id) {
			setCalendarsReady(false);
			return;
		}
		setCalendarsReady(false);
		void dispatch(getAllSeasonCalendarNodes(activeSeason.id)).finally(() => {
			setCalendarsReady(true);
		});
	}, [activeSeason?.id, dispatch]);

	useEffect(() => {
		if (matchResultLeagues.length > 0) {
			setSelectedLeagueCode((prev) =>
				matchResultLeagues.some((l) => l.leagueCode === prev)
					? prev
					: matchResultLeagues[0].leagueCode
			);
		}
	}, [matchResultLeagues]);

	useEffect(() => {
		const leagueParam = searchParams.get('league');
		const matchDayParam = searchParams.get('matchDay');
		if (!leagueParam) {
			appliedMatchdayQueryKey.current = '';
			return;
		}
		if (matchResultLeagues.length === 0) {
			return;
		}
		if (!matchResultLeagues.some((l) => l.leagueCode === leagueParam)) {
			return;
		}
		const queryKey = `${leagueParam}|${matchDayParam ?? ''}`;
		if (appliedMatchdayQueryKey.current === queryKey) {
			return;
		}
		appliedMatchdayQueryKey.current = queryKey;

		if (matchDayParam) {
			pendingMatchDayFromQuery.current = matchDayParam;
		}
		if (leagueParam !== selectedLeagueCode) {
			setSelectedLeagueCode(leagueParam);
			setMatchdayTouched(false);
			setData(null);
			setCompetitionInfo(null);
			setCompetitionInfoLoading(true);
			setLoading(true);
		}
	}, [searchParams, matchResultLeagues, selectedLeagueCode]);

	useEffect(() => {
		const pending = pendingMatchDayFromQuery.current;
		if (!pending || competitionInfoLoading || matchdaySlots.length === 0) {
			return;
		}
		const nextValue = matchDayStringToSlotValue(pending, matchdaySlots);
		pendingMatchDayFromQuery.current = null;
		setMatchdayTouched(true);
		setMatchday(nextValue);
		setData(null);
		setLoading(true);
	}, [competitionInfoLoading, matchdaySlots, effectiveLeagueCode]);

	useEffect(() => {
		if (!effectiveLeagueCode || !selectedLeague?.id) {
			setCompetitionInfoLoading(false);
			setCompetitionInfo(null);
			return;
		}

		let cancelled = false;
		setCompetitionInfoLoading(true);
		setCompetitionInfo(null);

		const loadInfo = async (): Promise<void> => {
			try {
				const info = await getLeagueExternalCompetitionInfo(selectedLeague.id, externalSeason);
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
	}, [effectiveLeagueCode, externalSeason, selectedLeague?.id]);

	useEffect(() => {
		if (competitionInfoLoading) {
			return;
		}
		if (!matchdayTouched && !competitionInfo) {
			return;
		}
		if (!selectedLeague?.id || !effectiveLeagueCode) {
			return;
		}

		const targetMatchday = effectiveMatchday;

		let cancelled = false;
		const loadMatches = async (): Promise<void> => {
			setLoading(true);
			try {
				const page = await getMatchdayFromCache(
					effectiveLeagueCode,
					targetMatchday,
					externalSeason,
					selectedLeague.id
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
		effectiveLeagueCode,
		externalSeason,
		selectedLeague?.id,
		dispatch,
	]);

	useEffect(() => {
		if (effectiveLeagueCode && effectiveLeagueCode !== selectedLeagueCode) {
			setSelectedLeagueCode(effectiveLeagueCode);
		}
	}, [effectiveLeagueCode, selectedLeagueCode]);

	const handleLeagueChange = (e: SelectChangeEvent): void => {
		setMatchdayTouched(false);
		setSelectedLeagueCode(e.target.value);
		setData(null);
		setCompetitionInfo(null);
		setCompetitionInfoLoading(true);
		setLoading(true);
		setSearchParams({}, { replace: true });
	};

	const handleMatchdayChange = (md: number): void => {
		setMatchdayTouched(true);
		setMatchday(md);
		setData(null);
		setLoading(true);
		setSearchParams({}, { replace: true });
	};

	const handleNearestGameweekLeagueClick = useCallback(
		({ leagueCode, matchDay }: NearestGameweekLeagueClick): void => {
			setSearchParams({ league: leagueCode, matchDay }, { replace: true });
			if (leagueCode === selectedLeagueCode) {
				pendingMatchDayFromQuery.current = matchDay;
				if (!competitionInfoLoading && matchdaySlots.length > 0) {
					const nextValue = matchDayStringToSlotValue(matchDay, matchdaySlots);
					pendingMatchDayFromQuery.current = null;
					setMatchdayTouched(true);
					setMatchday(nextValue);
					setData(null);
					setLoading(true);
				}
				return;
			}
			setSelectedLeagueCode(leagueCode);
			setMatchdayTouched(false);
			setData(null);
			setCompetitionInfo(null);
			setCompetitionInfoLoading(true);
			setLoading(true);
			pendingMatchDayFromQuery.current = matchDay;
		},
		[selectedLeagueCode, competitionInfoLoading, matchdaySlots, setSearchParams]
	);

	const sortedMatches = useMemo(() => {
		if (!data?.matches) return [];
		return [...data.matches].sort(
			(a, b) => resolveExternalMatchKickoffUtcMs(a) - resolveExternalMatchKickoffUtcMs(b)
		);
	}, [data?.matches]);

	const renderViewMatchBetsButton = (match: ExternalMatch): JSX.Element | null => {
		if (!showViewMatchBetsButton(match)) {
			return null;
		}
		const count = match.id ? countsByMatch.get(matchBetCountKey(match.id)) ?? 0 : 0;
		if (count <= 0) {
			return null;
		}
		return (
			<ExternalMatchViewBetsButton
				count={count}
				tooltip={t('wc26.externalResults.matchBets.viewTooltip', { count })}
				ariaLabel={t('wc26.externalResults.matchBets.viewAria', { count })}
				onClick={() => setBetsMatch(match)}
			/>
		);
	};

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 430,
				mx: 'auto',
				px: 0.5,
				mt: `calc(-${APP_HEADER_CONTENT_GAP_PX}px + 5px)`,
				pb: 1,
				overflowX: 'hidden',
			}}
		>
			{canShowNearestGameweekPlate ? (
				<NearestGameweekBetsPlate
					enabled
					seasonId={activeSeason?.id}
					refreshKey={plateRefreshKey}
					onLeagueClick={handleNearestGameweekLeagueClick}
				/>
			) : null}

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
						minHeight: 40,
						px: 0.25,
					}}
				>
					<Typography
						sx={{
							fontWeight: 700,
							textAlign: 'center',
							fontSize: '1rem',
							lineHeight: 1.2,
						}}
					>
						{t('externalMatchResults')}
					</Typography>
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
							leagues={matchResultLeagues}
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
							disabled={!isExternalPageReady}
						/>
					</Box>
				</Box>
			</Box>

			{isBettingCalendarMissing ? (
				<Alert severity="warning" role="alert" sx={{ mx: 0.5, mb: 1, flexShrink: 0 }}>
					{t('externalMatchBettingUnavailableNoCalendar')}
				</Alert>
			) : null}

			{betsMatch && user && activeSeason && selectedLeague ? (
				<ExternalMatchBetsDialog
					open
					onClose={() => setBetsMatch(null)}
					match={betsMatch}
					seasonId={activeSeason.id}
					currentUserId={user.id}
				/>
			) : null}

			{oddsPickMatch && oddsPickMatch.id ? (
				<OddsPickDialog
					open
					onClose={() => setOddsPickMatch(null)}
					matchScheduleId={oddsPickMatch.id}
					match={oddsPickMatch}
					viewOnly={!isSeasonParticipant}
					seasonId={activeSeason?.id}
					leagueId={selectedLeague?.id}
					matchDay={betMatchDay}
					calendarNodeId={calendarMatch?.calendar.id}
					betSize={oddsPickBetSize}
					userId={user?.id}
					onBetPlaced={() => {
						setOddsPickMatch(null);
						setPlateRefreshKey((key) => key + 1);
					}}
				/>
			) : null}

			{!isExternalPageReady && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
					<CircularProgress size={40} />
				</Box>
			)}

			{isExternalPageReady && data !== null && sortedMatches.length === 0 && (
				<Typography
					textAlign="center"
					color="text.secondary"
					sx={{ py: 3, px: 1 }}
				>
					{t('externalMatchNoDataHint')}
				</Typography>
			)}

			{isExternalPageReady && sortedMatches.length > 0 && (
				<>
					{isWcLeague ? (
						<WcExternalSlotPanel
							slotId={betMatchDay}
							slotLabel={currentSlotLabel}
							betsUsed={userSlotBets.length}
							betsLimit={slotBetLimit}
							matchCount={sortedMatches.length}
							betsLoading={slotBetsLoading}
						/>
					) : null}
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
							const kickoffUtcMs = resolveExternalMatchKickoffUtcMs(match);
							const scoreView = resolveExternalMatchScoreView({
								gameScore,
								matchStatus: match.status,
								finalized: Boolean(match.finalized),
								liveMinuteLabel: match.liveMinuteLabel,
								kickoffUtcMs,
							});
							const matchDate =
								kickoffUtcMs > 0 ? formatDateTime(kickoffUtcMs) : '';
							const betEnabled = isMatchCardClickable(match);

							return (
								<Box
									key={match.wc26ScheduleId ?? match.id ?? match.externalMatchId}
									sx={{
										borderBottom: index < sortedMatches.length - 1 ? 1 : 0,
										borderColor: 'divider',
									}}
								>
									<ExternalMatchResultCard
										homeTeam={homeTeam}
										awayTeam={awayTeam}
										scoreView={scoreView}
										status={match.status}
										finalized={Boolean(match.finalized)}
										liveMinuteLabel={match.liveMinuteLabel}
										fetchedAt={match.fetchedAt}
										kickoffUtcMs={kickoffUtcMs}
										leagueCode={match.leagueCode}
										slotId={match.slotId ?? betMatchDay}
										matchDateLabel={matchDate}
										headerActions={renderViewMatchBetsButton(match)}
										onClick={betEnabled ? () => handleMatchClick(match) : undefined}
										interactive={betEnabled}
									/>
								</Box>
							);
						})}
					</Box>
				</>
			)}
		</Box>
	);
}
