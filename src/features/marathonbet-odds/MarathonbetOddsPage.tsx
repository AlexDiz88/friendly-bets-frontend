import {
	Alert,
	Box,
	CircularProgress,
	FormControlLabel,
	Link,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tabs,
	TextField,
	Typography,
	useTheme,
	type SxProps,
	type Theme,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import CustomSwitch from '../../components/custom/controls/CustomSwitch';
import { toggleFormControlLabelSx } from '../../components/custom/controls/customToggleStyles';
import MatchdayGridSelect from '../../components/matchday/MatchdayGridSelect';
import { selectUser } from '../auth/selectors';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { externalSlotsToMatchdaySlots } from '../football-data/competitionOptions';
import { getCompetitionInfo } from '../football-data/footballDataApi';
import { resolveExternalSeasonForLeague } from '../football-data/seasonExternalYear';
import { showErrorSnackbar, showSuccessSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import {
	oddsDemoHintSx,
	oddsDemoPageRootSx,
	oddsDemoPanelSx,
	oddsDemoTitleSx,
	oddsDemoToolbarRowSx,
} from '../odds-demo/oddsDemoPageStyles';
import {
	fetchLatestMarathonbetSyncRun,
	fetchMarathonbetRequestStats,
	fetchMarathonbetSlotPreview,
	fetchMarathonbetSyncRuns,
	scrapeMarathonbetEvent,
	syncMarathonbetSlot,
	type MarathonbetHttpLogEntry,
	type MarathonbetMarket,
	type MarathonbetRequestStats,
	type MarathonbetScrapeResult,
	type MarathonbetSlotMatchPreview,
	type MarathonbetSlotPreview,
	type MarathonbetSyncRun,
} from './marathonbetOddsApi';

const DEFAULT_TREE_ID = '25819358';
const WC_CODE = 'WC';

function formatUtc(iso: string | null | undefined): string {
	if (!iso) return '—';
	try {
		const d = typeof iso === 'string' && iso.includes('T') ? iso : new Date(iso).toISOString();
		return d.replace('T', ' ').slice(0, 16) + ' UTC';
	} catch {
		return String(iso);
	}
}

function formatKickoffMillis(ms: number | null | undefined): string {
	if (ms == null) return '—';
	return formatUtc(new Date(ms).toISOString());
}

function formatDurationMs(ms: number | null | undefined): string {
	if (ms == null || ms < 0) return '—';
	if (ms < 1000) return `${ms} ms`;
	const sec = Math.round(ms / 1000);
	if (sec < 60) return `${sec}s`;
	const min = Math.floor(sec / 60);
	const rem = sec % 60;
	return rem > 0 ? `${min}m ${rem}s` : `${min}m`;
}

function failedHttpLogs(logs: MarathonbetHttpLogEntry[] | undefined): MarathonbetHttpLogEntry[] {
	return (logs ?? []).filter((e) => e.outcome !== 'SUCCESS');
}

function visibleMarkets(markets: MarathonbetMarket[], showIgnoredProd: boolean): MarathonbetMarket[] {
	if (showIgnoredProd) {
		return markets;
	}
	return markets.filter((m) => !m.ignoredForProd);
}

function MarketsTable({
	markets,
	showIgnoredProd,
}: {
	markets: MarathonbetMarket[];
	showIgnoredProd: boolean;
}): JSX.Element {
	const { t } = useTranslation();
	const visible = useMemo(() => visibleMarkets(markets, showIgnoredProd), [markets, showIgnoredProd]);
	if (visible.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				—
			</Typography>
		);
	}
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			{visible.map((market, idx) => (
				<Box
					key={`${market.model}-${market.marketId ?? idx}`}
					sx={
						showIgnoredProd && market.ignoredForProd
							? {
									bgcolor: 'grey.400',
									borderRadius: 1,
									px: 1,
									py: 0.5,
								}
							: undefined
					}
				>
					<Typography variant="subtitle2" sx={{ mb: 0.75 }}>
						{market.name || market.model}
						{market.marketId != null ? (
							<Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
								id {market.marketId} · {market.model}
							</Typography>
						) : null}
					</Typography>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>{t('marathonbetOdds.selection')}</TableCell>
								<TableCell align="right">{t('marathonbetOdds.odds')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{market.selections.map((sel) => (
								<TableRow key={`${sel.selId ?? ''}-${sel.name}-${sel.odds}`}>
									<TableCell>
										{sel.name}
										{sel.selId != null ? (
											<Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
												#{sel.selId}
											</Typography>
										) : null}
									</TableCell>
									<TableCell align="right">{sel.odds ?? '—'}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			))}
		</Box>
	);
}

export default function MarathonbetOddsPage(): JSX.Element | null {
	const { t } = useTranslation();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const activeSeason = useAppSelector(selectActiveSeason);
	const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	const wcLeague = useMemo(
		() => activeSeason?.leagues?.find((l) => l.leagueCode === WC_CODE) ?? null,
		[activeSeason?.leagues]
	);
	const externalSeason = useMemo(
		() => resolveExternalSeasonForLeague(activeSeason, WC_CODE),
		[activeSeason]
	);

	const [matchday, setMatchday] = useState(1);
	const [matchdayCount, setMatchdayCount] = useState(16);
	const [slots, setSlots] = useState<ReturnType<typeof externalSlotsToMatchdaySlots>>([]);
	const [competitionLoading, setCompetitionLoading] = useState(false);

	const [preview, setPreview] = useState<MarathonbetSlotPreview | null>(null);
	const [previewLoading, setPreviewLoading] = useState(false);
	const [syncLoading, setSyncLoading] = useState(false);
	const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

	const [treeIdInput, setTreeIdInput] = useState(DEFAULT_TREE_ID);
	const [eventLoading, setEventLoading] = useState(false);
	const [eventData, setEventData] = useState<MarathonbetScrapeResult | null>(null);
	const [marketTab, setMarketTab] = useState(0);
	const [showIgnoredProd, setShowIgnoredProd] = useState(false);

	const [latestRun, setLatestRun] = useState<MarathonbetSyncRun | null>(null);
	const [syncRuns, setSyncRuns] = useState<MarathonbetSyncRun[]>([]);
	const [requestStats, setRequestStats] = useState<MarathonbetRequestStats | null>(null);
	const [monitoringLoading, setMonitoringLoading] = useState(false);

	useEffect(() => {
		if (!wcLeague?.id || !externalSeason) return;
		let cancelled = false;
		setCompetitionLoading(true);
		void getCompetitionInfo(WC_CODE, externalSeason)
			.then((info) => {
				if (cancelled) return;
				setMatchdayCount(info.matchdayCount || 16);
				setSlots(
					info.matchdaySlots?.length
						? externalSlotsToMatchdaySlots(info.matchdaySlots)
						: []
				);
				setMatchday(info.currentMatchday || 1);
			})
			.catch(() => {
				if (!cancelled) setSlots([]);
			})
			.finally(() => {
				if (!cancelled) setCompetitionLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [wcLeague?.id, externalSeason]);

	const loadPreview = useCallback(async () => {
		if (!wcLeague?.id) return;
		setPreviewLoading(true);
		try {
			const result = await fetchMarathonbetSlotPreview(
				wcLeague.id,
				matchday,
				externalSeason ?? undefined
			);
			setPreview(result);
			if (result.matches.length > 0 && !selectedMatchId) {
				setSelectedMatchId(result.matches[0].gameResultId);
			}
		} catch (e) {
			const message = e instanceof Error ? e.message : 'unknownError';
			dispatch(showErrorSnackbar({ message }));
			setPreview(null);
		} finally {
			setPreviewLoading(false);
		}
	}, [wcLeague?.id, matchday, externalSeason, dispatch, selectedMatchId]);

	useEffect(() => {
		if (wcLeague?.id) {
			void loadPreview();
		}
	}, [wcLeague?.id, matchday, loadPreview]);

	const loadSyncMonitoring = useCallback(async () => {
		setMonitoringLoading(true);
		try {
			const [runs, stats, latest] = await Promise.all([
				fetchMarathonbetSyncRuns(30),
				fetchMarathonbetRequestStats(24),
				fetchLatestMarathonbetSyncRun(),
			]);
			setSyncRuns(runs);
			setRequestStats(stats);
			setLatestRun(latest);
		} catch {
			setSyncRuns([]);
			setRequestStats(null);
		} finally {
			setMonitoringLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadSyncMonitoring();
	}, [loadSyncMonitoring]);

	const handleSyncSlot = useCallback(async () => {
		if (!wcLeague?.id) return;
		setSyncLoading(true);
		try {
			await syncMarathonbetSlot(wcLeague.id, matchday, externalSeason ?? undefined);
			dispatch(showSuccessSnackbar({ message: 'marathonbetSyncCompleted' }));
			await loadPreview();
			await loadSyncMonitoring();
		} catch (e) {
			const message = e instanceof Error ? e.message : 'unknownError';
			dispatch(showErrorSnackbar({ message }));
		} finally {
			setSyncLoading(false);
		}
	}, [wcLeague?.id, matchday, externalSeason, dispatch, loadPreview, loadSyncMonitoring]);

	const handleFetchEvent = useCallback(async () => {
		const treeId = Number.parseInt(treeIdInput.trim(), 10);
		if (!Number.isFinite(treeId) || treeId <= 0) {
			dispatch(showErrorSnackbar({ message: 'marathonbetInvalidTreeId' }));
			return;
		}
		setEventLoading(true);
		try {
			const result = await scrapeMarathonbetEvent(treeId);
			setEventData(result);
			setMarketTab(0);
		} catch (e) {
			const message = e instanceof Error ? e.message : 'unknownError';
			dispatch(showErrorSnackbar({ message }));
			setEventData(null);
		} finally {
			setEventLoading(false);
		}
	}, [dispatch, treeIdInput]);

	const selectedPreview: MarathonbetSlotMatchPreview | null = useMemo(
		() => preview?.matches.find((m) => m.gameResultId === selectedMatchId) ?? null,
		[preview, selectedMatchId]
	);

	const loadEventForSelected = useCallback(async () => {
		const treeId = selectedPreview?.marathonbetTreeId;
		if (treeId == null) return;
		setTreeIdInput(String(treeId));
		setEventLoading(true);
		try {
			const result = await scrapeMarathonbetEvent(treeId);
			setEventData(result);
		} catch (e) {
			const message = e instanceof Error ? e.message : 'unknownError';
			dispatch(showErrorSnackbar({ message }));
		} finally {
			setEventLoading(false);
		}
	}, [selectedPreview?.marathonbetTreeId]);

	if (!isStaff) {
		return null;
	}

	if (!wcLeague) {
		return (
			<Box sx={oddsDemoPageRootSx}>
				<Alert severity="info">{t('marathonbetOdds.noWcLeague')}</Alert>
			</Box>
		);
	}

	return (
		<Box sx={oddsDemoPageRootSx}>
			<Typography component="h1" sx={oddsDemoTitleSx}>
				{t('marathonbetOdds.title')}
			</Typography>
			<Box sx={oddsDemoHintSx}>{t('marathonbetOdds.hintWc')}</Box>

			<Box sx={{ ...oddsDemoPanelSx(theme), mb: 2 }}>
				<Box sx={{ ...oddsDemoToolbarRowSx, justifyContent: 'space-between', mb: 1.5 }}>
					<Typography variant="subtitle1">{t('marathonbetOdds.syncStatsTitle')}</Typography>
					<CustomButton
						buttonText={t('marathonbetOdds.refreshStats')}
						onClick={() => void loadSyncMonitoring()}
						disabled={monitoringLoading}
					/>
				</Box>
				{requestStats && (
					<>
						<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
							{t('marathonbetOdds.statsPeriod', { hours: requestStats.periodHours })}
						</Typography>
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
								gap: 1,
								mb: 2,
							}}
						>
							{[
								[t('marathonbetOdds.statRuns'), requestStats.totalRuns],
								[t('marathonbetOdds.statScheduledRuns'), requestStats.scheduledRuns],
								[t('marathonbetOdds.statManualRuns'), requestStats.manualRuns],
								[t('marathonbetOdds.statTournamentRequests'), requestStats.tournamentRequests],
								[t('marathonbetOdds.statSseRequests'), requestStats.sseRequests],
								[t('marathonbetOdds.statHttpFailures'), requestStats.httpFailures],
								[t('marathonbetOdds.statRateLimited'), requestStats.rateLimitedCount],
								[t('marathonbetOdds.statAccessDenied'), requestStats.accessDeniedCount],
								[t('marathonbetOdds.statTimeouts'), requestStats.timeoutCount],
								[t('marathonbetOdds.statAvgSseMs'), requestStats.avgSseDurationMs],
								[t('marathonbetOdds.statMatchesSaved'), requestStats.matchesSaved],
							].map(([label, value]) => (
								<Box
									key={String(label)}
									sx={{
										border: '1px solid',
										borderColor: 'divider',
										borderRadius: 1,
										px: 1,
										py: 0.75,
									}}
								>
									<Typography variant="caption" color="text.secondary" display="block">
										{label}
									</Typography>
									<Typography variant="body2" fontWeight={600}>
										{value}
									</Typography>
								</Box>
							))}
						</Box>
					</>
				)}
				{latestRun && (
					<Alert severity="info" sx={{ mb: 2 }}>
						{t('marathonbetOdds.lastRun', {
							matched: latestRun.matchesMatched ?? 0,
							eligible: latestRun.matchesEligible ?? 0,
							saved: latestRun.mergedSaved ?? 0,
							sse: latestRun.sseCalls ?? 0,
						})}
						{latestRun.errorSummary ? ` · ${latestRun.errorSummary}` : ''}
					</Alert>
				)}
				<Typography variant="subtitle2" sx={{ mb: 1 }}>
					{t('marathonbetOdds.syncRunsTitle')}
				</Typography>
				{monitoringLoading && syncRuns.length === 0 ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
						<CircularProgress size={28} />
					</Box>
				) : syncRuns.length === 0 ? (
					<Typography variant="body2" color="text.secondary">
						{t('marathonbetOdds.noSyncRuns')}
					</Typography>
				) : (
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>{t('marathonbetOdds.colStarted')}</TableCell>
								<TableCell>{t('marathonbetOdds.colDuration')}</TableCell>
								<TableCell>{t('marathonbetOdds.colScope')}</TableCell>
								<TableCell>{t('marathonbetOdds.colSlots')}</TableCell>
								<TableCell align="right">{t('marathonbetOdds.colHttp')}</TableCell>
								<TableCell align="right">{t('marathonbetOdds.colMatches')}</TableCell>
								<TableCell align="right">{t('marathonbetOdds.colSaved')}</TableCell>
								<TableCell>{t('marathonbetOdds.colErrors')}</TableCell>
								<TableCell>{t('marathonbetOdds.colDetails')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{syncRuns.map((run) => {
								const failedLogs = failedHttpLogs(run.httpLogs);
								const scopeKey = run.slotScope
									? `marathonbetOdds.scope${run.slotScope}`
									: run.manual
										? 'marathonbetOdds.scopeBOTH'
										: '—';
								return (
									<TableRow key={run.id}>
										<TableCell>
											{formatUtc(run.startedAt)}
											{run.manual ? (
												<Typography variant="caption" display="block" color="text.secondary">
													manual
												</Typography>
											) : null}
										</TableCell>
										<TableCell>{formatDurationMs(run.durationMs)}</TableCell>
										<TableCell>
											{typeof scopeKey === 'string' && scopeKey.startsWith('marathonbetOdds.')
												? t(scopeKey)
												: scopeKey}
										</TableCell>
										<TableCell>{run.slotOrders?.join(', ') ?? '—'}</TableCell>
										<TableCell align="right">
											{run.httpRequestsFailed ?? 0}/{run.httpRequestsTotal ?? 0}
										</TableCell>
										<TableCell align="right">
											{run.matchesMatched ?? 0}/{run.matchesEligible ?? 0}
										</TableCell>
										<TableCell align="right">{run.mergedSaved ?? 0}</TableCell>
										<TableCell>
											{run.errorSummary ? (
												<Typography variant="caption" color="error.main">
													{run.errorSummary}
												</Typography>
											) : failedLogs.length > 0 ? (
												<Typography variant="caption" color="warning.main">
													{failedLogs.length} HTTP
												</Typography>
											) : (
												'—'
											)}
										</TableCell>
										<TableCell>
											{failedLogs.length > 0 ? (
												<Box component="ul" sx={{ m: 0, pl: 2 }}>
													{failedLogs.map((entry, idx) => (
														<Box component="li" key={`${run.id}-${idx}`} sx={{ fontSize: '0.75rem' }}>
															{t(`marathonbetOdds.requestType${entry.requestType}`, {
																defaultValue: entry.requestType,
															})}
															{entry.targetId != null ? ` #${entry.targetId}` : ''}
															{' · '}
															{t(`marathonbetOdds.outcome${entry.outcome}`, {
																defaultValue: entry.outcome,
															})}
															{entry.httpStatus != null
																? ` · ${t('marathonbetOdds.httpStatus', { status: entry.httpStatus })}`
																: ''}
															{entry.retryAfterSeconds != null
																? ` · ${t('marathonbetOdds.retryAfter', { seconds: entry.retryAfterSeconds })}`
																: ''}
															{` · ${entry.durationMs}ms`}
														</Box>
													))}
												</Box>
											) : (
												'—'
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</Box>

			<Box sx={oddsDemoPanelSx(theme)}>
				<Typography variant="subtitle2" sx={{ mb: 1 }}>
					{t('marathonbetOdds.wcSlot')}
				</Typography>
				<Box sx={{ ...oddsDemoToolbarRowSx, flexWrap: 'wrap', gap: 1 }}>
					{competitionLoading ? (
						<CircularProgress size={28} />
					) : (
						<MatchdayGridSelect
							value={matchday}
							matchdayCount={matchdayCount}
							slots={slots}
							onChange={setMatchday}
							aria-label={t('marathonbetOdds.slot')}
						/>
					)}
					<CustomButton
						buttonText={t('marathonbetOdds.refreshPreview')}
						onClick={() => void loadPreview()}
						disabled={previewLoading}
					/>
					<span>
						<CustomSuccessButton
							buttonText={t('marathonbetOdds.syncSlot')}
							onClick={() => void handleSyncSlot()}
							disabled={syncLoading}
						/>
					</span>
				</Box>
				<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
					{t('marathonbetOdds.tournamentId')}: {preview?.tournamentTreeId ?? '2253726'}
					{' · '}
					<RouterLink to="/external-sync-issues">{t('marathonbetOdds.issuesLink')}</RouterLink>
				</Typography>
			</Box>

			{previewLoading && !preview && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
					<CircularProgress />
				</Box>
			)}

			{preview && preview.matches.length > 0 && (
				<Box sx={{ ...oddsDemoPanelSx(theme), mb: 2 }}>
					<Typography variant="subtitle1" sx={{ mb: 1 }}>
						{t('marathonbetOdds.slotMatches')}
					</Typography>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>{t('marathonbetOdds.match')}</TableCell>
								<TableCell>treeId</TableCell>
								<TableCell>{t('marathonbetOdds.mapping')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{preview.matches.map((m) => (
								<TableRow
									key={m.gameResultId}
									selected={m.gameResultId === selectedMatchId}
									hover
									sx={{ cursor: 'pointer' }}
									onClick={() => setSelectedMatchId(m.gameResultId)}
								>
									<TableCell>
										{m.homeTeamTitle} — {m.awayTeamTitle}
										<Typography variant="caption" display="block" color="text.secondary">
											{formatUtc(m.utcDate)}
										</Typography>
									</TableCell>
									<TableCell>
										{m.marathonbetTreeId ?? '—'}
										{m.marathonbetTreeId != null ? (
											<Link
												href={`https://new.marathonbet.ru/su/sport/event/${m.marathonbetTreeId}`}
												target="_blank"
												rel="noopener noreferrer"
												sx={{ ml: 0.5, fontSize: '0.75rem' }}
												onClick={(e) => e.stopPropagation()}
											>
												↗
											</Link>
										) : null}
									</TableCell>
									<TableCell>
										{m.mappingOk ? (
											<Typography color="success.main" variant="body2">
												OK
											</Typography>
										) : (
											<Typography color="warning.main" variant="body2">
												{m.mappingNote ?? '—'}
											</Typography>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					{selectedPreview && (
						<Box sx={{ mt: 2 }}>
							<Typography variant="body2" color="text.secondary">
								Marathon: {selectedPreview.marathonHomeTeam} — {selectedPreview.marathonAwayTeam}
								{' · '}
								{formatKickoffMillis(selectedPreview.marathonDisplayTimeMillis)}
							</Typography>
							<CustomButton
								buttonText={t('marathonbetOdds.loadSelectedEvent')}
								onClick={() => void loadEventForSelected()}
								disabled={!selectedPreview.marathonbetTreeId || eventLoading}
							/>
						</Box>
					)}
				</Box>
			)}

			<Box sx={{ ...oddsDemoPanelSx(theme), mb: 2 }}>
				<Typography variant="subtitle2" sx={{ mb: 1 }}>
					{t('marathonbetOdds.manualTreeId')}
				</Typography>
				<Box sx={oddsDemoToolbarRowSx}>
					<TextField
						size="small"
						label={t('marathonbetOdds.treeId')}
						value={treeIdInput}
						onChange={(e) => setTreeIdInput(e.target.value)}
						sx={{ flex: 1, minWidth: 160 }}
					/>
					<CustomButton
						buttonText={t('marathonbetOdds.fetch')}
						onClick={() => void handleFetchEvent()}
						disabled={eventLoading}
					/>
				</Box>
			</Box>

			{eventLoading && !eventData && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{eventData && (
				<>
					<Box sx={{ mb: 2 }}>
						<Box sx={oddsDemoPanelSx(theme)}>
							<Typography variant="subtitle1" sx={{ mb: 1 }}>
								{eventData.homeTeam && eventData.awayTeam
									? `${eventData.homeTeam} — ${eventData.awayTeam}`
									: eventData.eventName ?? '—'}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								treeId: {eventData.treeId}
								{eventData.eventId != null ? ` · eventId: ${eventData.eventId}` : ''}
							</Typography>
							{eventData.sourceUrl ? (
								<Link href={eventData.sourceUrl} target="_blank" rel="noopener noreferrer" variant="body2">
									{eventData.sourceUrl}
								</Link>
							) : null}
						</Box>
					</Box>

					{eventData.warnings.length > 0 && (
						<Alert severity="warning" sx={{ mb: 2 }}>
							<ul style={{ margin: 0, paddingLeft: 20 }}>
								{eventData.warnings.map((w) => (
									<li key={w}>{t(`marathonbetOdds.warning.${w}`, { defaultValue: w })}</li>
								))}
							</ul>
						</Alert>
					)}

					<Box sx={oddsDemoPanelSx(theme)}>
						<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
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
										checked={showIgnoredProd}
										onChange={(e) => setShowIgnoredProd(e.target.checked)}
										inputProps={{ 'aria-label': t('marathonbetOdds.showIgnoredProd') }}
									/>
								}
								label={t('marathonbetOdds.showIgnoredProd')}
								labelPlacement="start"
							/>
						</Box>
						<Tabs value={marketTab} onChange={(_, v: number) => setMarketTab(v)} sx={{ mb: 2 }} variant="scrollable">
							<Tab
								label={`${t('marathonbetOdds.matchResult')} (${visibleMarkets(eventData.matchResultMarkets, showIgnoredProd).length})`}
							/>
							<Tab
								label={`${t('marathonbetOdds.doubleChance')} (${visibleMarkets(eventData.doubleChanceMarkets ?? [], showIgnoredProd).length})`}
							/>
							<Tab
								label={`${t('marathonbetOdds.handicaps')} (${visibleMarkets(eventData.handicapMarkets, showIgnoredProd).length})`}
							/>
							<Tab
								label={`${t('marathonbetOdds.totals')} (${visibleMarkets(eventData.totalMarkets ?? [], showIgnoredProd).length})`}
							/>
							<Tab
								label={`${t('marathonbetOdds.resultTotal')} (${visibleMarkets(eventData.resultTotalMarkets ?? [], showIgnoredProd).length})`}
							/>
							<Tab
								label={`${t('marathonbetOdds.correctScore')} (${visibleMarkets(eventData.correctScoreMarkets ?? [], showIgnoredProd).length})`}
							/>
						</Tabs>
						{marketTab === 0 && (
							<MarketsTable markets={eventData.matchResultMarkets} showIgnoredProd={showIgnoredProd} />
						)}
						{marketTab === 1 && (
							<MarketsTable
								markets={eventData.doubleChanceMarkets ?? []}
								showIgnoredProd={showIgnoredProd}
							/>
						)}
						{marketTab === 2 && (
							<MarketsTable markets={eventData.handicapMarkets} showIgnoredProd={showIgnoredProd} />
						)}
						{marketTab === 3 && (
							<MarketsTable markets={eventData.totalMarkets ?? []} showIgnoredProd={showIgnoredProd} />
						)}
						{marketTab === 4 && (
							<MarketsTable
								markets={eventData.resultTotalMarkets ?? []}
								showIgnoredProd={showIgnoredProd}
							/>
						)}
						{marketTab === 5 && (
							<MarketsTable
								markets={eventData.correctScoreMarkets ?? []}
								showIgnoredProd={showIgnoredProd}
							/>
						)}
					</Box>
				</>
			)}
		</Box>
	);
}
