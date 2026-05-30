import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	FormControlLabel,
	IconButton,
	SelectChangeEvent,
	Switch,
	Tooltip,
	Typography,
} from '@mui/material';
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
import { getExternalMatchScoreView } from './externalMatchScoreView';
import GameResultScoreEditDialog from './GameResultScoreEditDialog';
import {
	adminCorrectGameResultScore,
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
import {
	getMatchStatusChipColor,
	isMatchdayNotStarted,
	translateMatchStatus,
} from './matchStatusI18n';
import { resolveExternalSeasonForLeague } from './seasonExternalYear';
import {
	ExternalCompetitionInfo,
	ExternalMatch,
	ExternalMatchdayPage as MatchdayPageData,
} from './types/ExternalMatch';

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
	const [editMatch, setEditMatch] = useState<ExternalMatch | null>(null);
	const [adminOptionsEnabled, setAdminOptionsEnabled] = useState(false);

	const showAdminTools = isAdmin && adminOptionsEnabled;

	const matchesLoading = competitionInfoLoading || loading;

	const reloadMatchday = useCallback(async (): Promise<void> => {
		const page = await getMatchdayFromCache(
			competitionCode,
			effectiveMatchday,
			externalSeason
		);
		setData(page);
	}, [competitionCode, effectiveMatchday, externalSeason]);

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
					externalSeason
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

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 430,
				mx: 'auto',
				px: 0.5,
				mt: { xs: -1.5, sm: 5, md: 5 },
				pt: { md: 1 },
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
					<Typography
						sx={{
							fontWeight: 700,
							textAlign: 'center',
							fontSize: '1rem',
							lineHeight: 1.2,
							px: canSync ? 4 : 0,
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
				{isAdmin ? (
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', px: 0.5 }}>
						<FormControlLabel
							sx={{
								mx: 0,
								mr: 0,
								'& .MuiFormControlLabel-label': { fontSize: '0.8rem' },
							}}
							control={
								<Switch
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
			/>

			{matchesLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
					<CircularProgress />
				</Box>
			)}

			{!matchesLoading && sortedMatches.length === 0 && (
				<Typography textAlign="center" color="text.secondary" sx={{ py: 3, px: 1 }}>
					{canSync ? t('externalMatchNoDataHintModerator') : t('externalMatchNoDataHint')}
				</Typography>
			)}

			{!matchesLoading && sortedMatches.length > 0 && (
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
														onClick={() => setEditMatch(match)}
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
