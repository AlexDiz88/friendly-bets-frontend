import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
	Box,
	Chip,
	CircularProgress,
	Collapse,
	IconButton,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material';
import { t } from 'i18next';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import {
	fetchMonitoringLatest,
	fetchMonitoringRun,
	fetchMonitoringRuns,
	MONITORING_LAYERS,
	type ExternalDataLayer,
	type MonitoringCounters,
	type MonitoringRun,
	type MonitoringStatus,
} from './externalApiMonitoringApi';
import {
	monitoringHintSx,
	monitoringKpiCardSx,
	monitoringKpiGridSx,
	monitoringPageRootSx,
	monitoringSectionHeaderSx,
	monitoringSectionSx,
	monitoringTableContainerSx,
	monitoringTableSx,
	monitoringTitleSx,
	monitoringToolbarSx,
	statusChipSx,
} from './externalApiMonitoringPageStyles';

function formatTime(iso?: string | null): string {
	if (!iso) return '—';
	try {
		return new Date(iso).toLocaleString(undefined, {
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	} catch {
		return iso;
	}
}

function formatDuration(ms?: number | null): string {
	if (ms == null) return '—';
	if (ms < 1000) return `${ms} ms`;
	return `${(ms / 1000).toFixed(1)} s`;
}

function countersSummary(layer: ExternalDataLayer, counters?: MonitoringCounters | null): string {
	if (!counters) return '—';
	switch (layer) {
		case 'SCHEDULE':
			return `↑${counters.upserted ?? 0} · skip ${counters.skipped ?? 0} · rounds ${counters.roundsParsed ?? 0}`;
		case 'ODDS':
			return `elig ${counters.eligible ?? 0} · match ${counters.matched ?? 0} · save ${counters.saved ?? 0} · SSE ${counters.sseCalls ?? 0} · skip ${counters.skipped ?? 0}`;
		case 'LIVE':
			return `upd ${counters.updated ?? 0} · fin ${counters.finishedDetected ?? 0}`;
		case 'FULL_MATCH':
			return `req ${counters.requested ?? 0} · save ${counters.saved ?? 0} · skip ${counters.skipped ?? 0}`;
		default:
			return '—';
	}
}

function statusLabel(status?: MonitoringStatus | null): string {
	if (!status) return '—';
	const key = `externalApiMonitoring.status.${status}`;
	const translated = t(key);
	return translated !== key ? translated : status;
}

function layerTitle(layer: ExternalDataLayer): string {
	return t(`externalApiMonitoring.layer.${layer}`);
}

export default function ExternalApiMonitoringPage(): JSX.Element {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const [hours, setHours] = useState(24);
	const [loading, setLoading] = useState(true);
	const [runsByLayer, setRunsByLayer] = useState<Record<ExternalDataLayer, MonitoringRun[]>>({
		SCHEDULE: [],
		ODDS: [],
		LIVE: [],
		FULL_MATCH: [],
	});
	const [latest, setLatest] = useState<Partial<Record<ExternalDataLayer, MonitoringRun>>>({});
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [detail, setDetail] = useState<MonitoringRun | null>(null);
	const [detailLoading, setDetailLoading] = useState(false);

	const load = useCallback(async (): Promise<void> => {
		setLoading(true);
		try {
			const [latestMap, ...lists] = await Promise.all([
				fetchMonitoringLatest(),
				...MONITORING_LAYERS.map((layer) => fetchMonitoringRuns(layer, hours, 50)),
			]);
			setLatest(latestMap);
			const next: Record<ExternalDataLayer, MonitoringRun[]> = {
				SCHEDULE: [],
				ODDS: [],
				LIVE: [],
				FULL_MATCH: [],
			};
			MONITORING_LAYERS.forEach((layer, idx) => {
				next[layer] = lists[idx] ?? [];
			});
			setRunsByLayer(next);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalApiMonitoringLoadFailed',
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch, hours]);

	useEffect(() => {
		void load();
	}, [load]);

	const openDetail = async (id: string): Promise<void> => {
		setExpandedId(id);
		setDetailLoading(true);
		setDetail(null);
		try {
			const run = await fetchMonitoringRun(id);
			setDetail(run);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalApiMonitoringLoadFailed',
				})
			);
			setExpandedId(null);
		} finally {
			setDetailLoading(false);
		}
	};

	return (
		<Box sx={monitoringPageRootSx}>
			<Typography sx={monitoringTitleSx}>{t('externalApiMonitoring.title')}</Typography>
			<Typography sx={monitoringHintSx}>{t('externalApiMonitoring.hint')}</Typography>

			<Box sx={monitoringToolbarSx}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography variant="body2" color="text.secondary">
						{t('externalApiMonitoring.period')}
					</Typography>
					<Select
						size="small"
						value={hours}
						onChange={(e) => setHours(Number(e.target.value))}
						sx={{ minWidth: 120 }}
					>
						<MenuItem value={24}>24h</MenuItem>
						<MenuItem value={72}>72h</MenuItem>
						<MenuItem value={168}>7d</MenuItem>
					</Select>
				</Box>
				<Tooltip title={t('externalApiMonitoring.refresh')}>
					<span>
						<IconButton onClick={() => void load()} disabled={loading} sx={{ minWidth: 40, minHeight: 40 }}>
							{loading ? <CircularProgress size={18} /> : <RefreshIcon />}
						</IconButton>
					</span>
				</Tooltip>
			</Box>

			<Box sx={monitoringKpiGridSx}>
				{MONITORING_LAYERS.map((layer) => {
					const run = latest[layer];
					return (
						<Box key={layer} sx={monitoringKpiCardSx(theme, run?.status)}>
							<Typography sx={{ fontWeight: 800, fontSize: '0.85rem', mb: 0.75 }}>
								{layerTitle(layer)}
							</Typography>
							{run ? (
								<>
									<Chip
										size="small"
										variant="outlined"
										label={statusLabel(run.status)}
										sx={statusChipSx(run.status)}
									/>
									<Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
										{run.provider ?? '—'} · {formatTime(run.startedAt)}
									</Typography>
								</>
							) : (
								<Typography variant="caption" color="text.secondary">
									{t('externalApiMonitoring.noRuns')}
								</Typography>
							)}
						</Box>
					);
				})}
			</Box>

			{MONITORING_LAYERS.map((layer) => {
				const rows = runsByLayer[layer];
				return (
					<Box key={layer} sx={monitoringSectionSx}>
						<Box sx={monitoringSectionHeaderSx}>
							<Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>
								{layerTitle(layer)}
								<Typography component="span" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
									({rows.length})
								</Typography>
							</Typography>
						</Box>
						{loading && rows.length === 0 ? (
							<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
								<CircularProgress size={24} />
							</Box>
						) : rows.length === 0 ? (
							<Typography color="text.secondary" sx={{ px: 2, py: 2, fontSize: '0.85rem' }}>
								{t('externalApiMonitoring.noRuns')}
							</Typography>
						) : (
							<TableContainer sx={monitoringTableContainerSx}>
								<Table size="small" stickyHeader sx={monitoringTableSx}>
									<TableHead>
										<TableRow>
											<TableCell />
											<TableCell>{t('externalApiMonitoring.col.started')}</TableCell>
											<TableCell>{t('externalApiMonitoring.col.trigger')}</TableCell>
											<TableCell>{t('externalApiMonitoring.col.provider')}</TableCell>
											<TableCell>{t('externalApiMonitoring.col.league')}</TableCell>
											<TableCell>{t('externalApiMonitoring.col.duration')}</TableCell>
											<TableCell>{t('externalApiMonitoring.col.status')}</TableCell>
											<TableCell>{t('externalApiMonitoring.col.counters')}</TableCell>
											<TableCell>{t('externalApiMonitoring.col.http')}</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((run) => {
											const open = expandedId === run.id;
											return (
												<Fragment key={run.id}>
													<TableRow
														hover
														sx={{ cursor: 'pointer' }}
														onClick={() => {
															if (open) {
																setExpandedId(null);
																setDetail(null);
															} else {
																void openDetail(run.id);
															}
														}}
													>
														<TableCell sx={{ width: 36 }}>
															<ExpandMoreIcon
																sx={{
																	fontSize: 18,
																	transform: open ? 'rotate(180deg)' : 'none',
																	transition: 'transform 0.2s',
																	opacity: 0.7,
																}}
															/>
														</TableCell>
														<TableCell>{formatTime(run.startedAt)}</TableCell>
														<TableCell>{run.trigger ?? '—'}</TableCell>
														<TableCell>{run.provider ?? '—'}</TableCell>
														<TableCell>{run.leagueCode ?? '—'}</TableCell>
														<TableCell>{formatDuration(run.durationMs)}</TableCell>
														<TableCell>
															<Chip
																size="small"
																variant="outlined"
																label={statusLabel(run.status)}
																sx={statusChipSx(run.status)}
															/>
														</TableCell>
														<TableCell>{countersSummary(layer, run.counters)}</TableCell>
														<TableCell>
															<Typography
																component="span"
																sx={{
																	color:
																		(run.httpRequestsFailed ?? 0) > 0
																			? '#f43f5e'
																			: 'text.secondary',
																	fontWeight: (run.httpRequestsFailed ?? 0) > 0 ? 700 : 500,
																}}
															>
																{run.httpRequestsFailed ?? 0}/{run.httpRequestsTotal ?? 0}
															</Typography>
														</TableCell>
													</TableRow>
													<TableRow>
														<TableCell colSpan={9} sx={{ py: 0, borderBottom: open ? undefined : 0 }}>
															<Collapse in={open} timeout="auto" unmountOnExit>
																<Box sx={{ py: 1.5, px: 1 }}>
																	{detailLoading && expandedId === run.id ? (
																		<CircularProgress size={18} />
																	) : detail && detail.id === run.id ? (
																		<Box>
																			{detail.errorSummary ? (
																				<Typography
																					sx={{
																						mb: 1,
																						fontSize: '0.8rem',
																						color: '#f43f5e',
																						fontWeight: 600,
																					}}
																				>
																					{detail.errorSummary}
																				</Typography>
																			) : null}
																			{(detail.failedMatchScheduleIds?.length ?? 0) > 0 ? (
																				<Typography
																					variant="caption"
																					color="text.secondary"
																					display="block"
																					sx={{ mb: 1 }}
																				>
																					{t('externalApiMonitoring.failedIds')}:{' '}
																					{detail.failedMatchScheduleIds!.join(', ')}
																				</Typography>
																			) : null}
																			{(detail.httpLogs?.length ?? 0) === 0 ? (
																				<Typography variant="caption" color="text.secondary">
																					{t('externalApiMonitoring.noHttpLogs')}
																				</Typography>
																			) : (
																				<Table size="small" sx={monitoringTableSx}>
																					<TableHead>
																						<TableRow>
																							<TableCell>{t('externalApiMonitoring.http.type')}</TableCell>
																							<TableCell>{t('externalApiMonitoring.http.target')}</TableCell>
																							<TableCell>{t('externalApiMonitoring.http.status')}</TableCell>
																							<TableCell>{t('externalApiMonitoring.http.outcome')}</TableCell>
																							<TableCell>{t('externalApiMonitoring.http.duration')}</TableCell>
																							<TableCell>{t('externalApiMonitoring.http.detail')}</TableCell>
																						</TableRow>
																					</TableHead>
																					<TableBody>
																						{detail.httpLogs!.map((log, idx) => (
																							<TableRow key={`${run.id}-http-${idx}`}>
																								<TableCell>{log.requestType ?? '—'}</TableCell>
																								<TableCell>{log.target ?? '—'}</TableCell>
																								<TableCell>{log.httpStatus ?? '—'}</TableCell>
																								<TableCell
																									sx={{
																										color:
																											log.outcome && log.outcome !== 'SUCCESS'
																												? '#f43f5e'
																												: '#22c55e',
																										fontWeight: 600,
																									}}
																								>
																									{log.outcome ?? '—'}
																								</TableCell>
																								<TableCell>{formatDuration(log.durationMs)}</TableCell>
																								<TableCell
																									sx={{
																										maxWidth: 280,
																										overflow: 'hidden',
																										textOverflow: 'ellipsis',
																									}}
																								>
																									{log.detail ?? '—'}
																								</TableCell>
																							</TableRow>
																						))}
																					</TableBody>
																				</Table>
																			)}
																		</Box>
																	) : null}
																</Box>
															</Collapse>
														</TableCell>
													</TableRow>
												</Fragment>
											);
										})}
									</TableBody>
								</Table>
							</TableContainer>
						)}
					</Box>
				);
			})}
		</Box>
	);
}
