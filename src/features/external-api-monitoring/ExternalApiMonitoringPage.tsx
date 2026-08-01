import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
	Avatar,
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
	type SxProps,
	type Theme,
} from '@mui/material';
import { t } from 'i18next';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import LeagueAvatar, { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import CustomCalendarDialog from '../../components/custom/dialog/CustomCalendarDialog';
import { showErrorSnackbar, showSuccessSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import { teamApiLogoSrc } from '../admin/teams/teamFormUtils';
import { useFormatUserDateTime } from '../../shared/useFormatUserDateTime';
import { externalDataLayerAccent } from '../../shared/externalDataLayerColors';
import {
	deleteMonitoringRunsByLayer,
	fetchMonitoringLatest,
	fetchMonitoringRun,
	fetchMonitoringRuns,
	MONITORING_LAYERS,
	type ExternalDataLayer,
	type MonitoringCounters,
	type MonitoringRun,
	type MonitoringStatus,
	type MonitoringTrigger,
} from './externalApiMonitoringApi';
import {
	monitoringDetailPanelSx,
	monitoringDetailTableSx,
	monitoringHintSx,
	monitoringKpiCardSx,
	monitoringKpiGridSx,
	monitoringLayerTitleSx,
	monitoringPageRootSx,
	monitoringSectionHeaderSx,
	monitoringSectionSx,
	monitoringSectionTitleSx,
	monitoringTableContainerSx,
	monitoringTableSx,
	monitoringTitleSx,
	monitoringToolbarSx,
	statusChipSx,
} from './externalApiMonitoringPageStyles';

function formatDuration(ms?: number | null): string {
	if (ms == null) return '—';
	if (ms < 1000) return `${ms} ms`;
	const totalSec = Math.floor(ms / 1000);
	if (totalSec < 60) return `${(ms / 1000).toFixed(1)} s`;
	const hours = Math.floor(totalSec / 3600);
	const minutes = Math.floor((totalSec % 3600) / 60);
	const seconds = totalSec % 60;
	if (hours > 0) return `${hours}h${minutes}m${seconds}s`;
	return `${minutes}m${seconds}s`;
}

function formatHttpRatio(failed?: number | null, total?: number | null): string {
	const f = failed ?? 0;
	const tot = total ?? 0;
	if (f === 0 && tot === 0) return '—';
	return `${f}/${tot}`;
}

type CounterDetailKey =
	| 'upserted'
	| 'skipped'
	| 'skippedFar'
	| 'skippedNoBookieEvent'
	| 'skippedMissingKickoff'
	| 'roundsParsed'
	| 'eligible'
	| 'matched'
	| 'saved'
	| 'sseCalls'
	| 'updated'
	| 'finishedDetected'
	| 'requested'
	| 'mappingFailures';

function counterDetailEntries(
	layer: ExternalDataLayer,
	counters?: MonitoringCounters | null
): Array<{ key: CounterDetailKey; value: number }> {
	if (!counters) return [];
	switch (layer) {
		case 'SCHEDULE':
			return [
				{ key: 'upserted', value: counters.upserted ?? 0 },
				{ key: 'skipped', value: counters.skipped ?? 0 },
				{ key: 'roundsParsed', value: counters.roundsParsed ?? 0 },
			];
		case 'ODDS': {
			const hasSplit =
				counters.skippedFar != null ||
				counters.skippedNoBookieEvent != null ||
				counters.skippedMissingKickoff != null;
			const entries: Array<{ key: CounterDetailKey; value: number }> = [
				{ key: 'eligible', value: counters.eligible ?? 0 },
				{ key: 'matched', value: counters.matched ?? 0 },
				{ key: 'saved', value: counters.saved ?? 0 },
				{ key: 'sseCalls', value: counters.sseCalls ?? 0 },
			];
			if (hasSplit) {
				entries.push(
					{ key: 'skippedFar', value: counters.skippedFar ?? 0 },
					{ key: 'skippedNoBookieEvent', value: counters.skippedNoBookieEvent ?? 0 },
					{ key: 'skippedMissingKickoff', value: counters.skippedMissingKickoff ?? 0 }
				);
			} else {
				entries.push({ key: 'skipped', value: counters.skipped ?? 0 });
			}
			if (counters.mappingFailures) {
				entries.push({ key: 'mappingFailures', value: counters.mappingFailures });
			}
			return entries;
		}
		case 'LIVE':
			return [
				{ key: 'updated', value: counters.updated ?? 0 },
				{ key: 'finishedDetected', value: counters.finishedDetected ?? 0 },
				{ key: 'skipped', value: counters.skipped ?? 0 },
			];
		case 'FULL_MATCH':
			return [
				{ key: 'requested', value: counters.requested ?? 0 },
				{ key: 'saved', value: counters.saved ?? 0 },
				{ key: 'skipped', value: counters.skipped ?? 0 },
			];
		default:
			return [];
	}
}

function oddsSkipSummary(counters: MonitoringCounters): string {
	const hasSplit =
		counters.skippedFar != null ||
		counters.skippedNoBookieEvent != null ||
		counters.skippedMissingKickoff != null;
	if (!hasSplit) {
		return `skip ${counters.skipped ?? 0}`;
	}
	const far = counters.skippedFar ?? 0;
	const noBk = counters.skippedNoBookieEvent ?? 0;
	const missKo = counters.skippedMissingKickoff ?? 0;
	let s = `far ${far} · noBk ${noBk}`;
	if (missKo > 0) {
		s += ` · missKo ${missKo}`;
	}
	return s;
}

function countersSummary(layer: ExternalDataLayer, counters?: MonitoringCounters | null): string {
	if (!counters) return '—';
	switch (layer) {
		case 'SCHEDULE':
			return `↑${counters.upserted ?? 0} · skip ${counters.skipped ?? 0} · rounds ${counters.roundsParsed ?? 0}`;
		case 'ODDS':
			return `elig ${counters.eligible ?? 0} · match ${counters.matched ?? 0} · save ${counters.saved ?? 0} · SSE ${counters.sseCalls ?? 0} · ${oddsSkipSummary(counters)}`;
		case 'LIVE':
			return `upd ${counters.updated ?? 0} · fin ${counters.finishedDetected ?? 0} · skip ${counters.skipped ?? 0}`;
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

/** Soft monitoring reasons — amber warning, not hard failure. */
const MONITORING_WARNING_KEYS = new Set([
	'missingUtcKickoff',
	'alreadyFetched',
	'farKickoffDb',
	'noLiveCandidates',
	'noSlots',
	'leagueNotSupported',
	'noSseEligible',
]);

function parseMonitoringReasonParts(summary: string): Array<{ key: string; count?: number; raw: string }> {
	return summary
		.split(';')
		.map((part) => part.trim())
		.filter(Boolean)
		.map((raw) => {
			const match = /^([a-zA-Z][a-zA-Z0-9]*)(?:=(\d+))?$/.exec(raw);
			if (!match) {
				return { key: raw, raw };
			}
			return {
				key: match[1],
				count: match[2] != null ? Number(match[2]) : undefined,
				raw,
			};
		});
}

function formatMonitoringReason(summary?: string | null): string | null {
	if (!summary || !summary.trim()) return null;
	return parseMonitoringReasonParts(summary)
		.map(({ key, count, raw }) => {
			const i18nKey = `externalApiMonitoring.reason.${key}`;
			const translated = t(i18nKey, { count: count ?? 0 });
			return translated !== i18nKey ? translated : raw;
		})
		.join(' · ');
}

function isMonitoringWarningSummary(summary?: string | null): boolean {
	if (!summary) return false;
	const parts = parseMonitoringReasonParts(summary);
	return parts.length > 0 && parts.every((p) => MONITORING_WARNING_KEYS.has(p.key));
}

function ProviderCell({ provider }: { provider?: string | null }): JSX.Element {
	if (!provider) {
		return <Typography component="span">—</Typography>;
	}
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
			<Avatar
				variant="square"
				alt=""
				src={teamApiLogoSrc(provider)}
				sx={[{ width: 18, height: 18, flexShrink: 0 }, leagueLogoAvatarSx] as SxProps<Theme>}
			/>
			<Typography component="span" sx={{ fontSize: 'inherit' }}>
				{provider}
			</Typography>
		</Box>
	);
}

const TRIGGER_ICON_SX = { fontSize: 16, opacity: 0.75, flexShrink: 0 } as const;

function TriggerCell({
	trigger,
	layer,
}: {
	trigger?: MonitoringTrigger | null;
	layer: ExternalDataLayer;
}): JSX.Element {
	if (!trigger) {
		return <Typography component="span">—</Typography>;
	}
	const icon =
		trigger === 'ADMIN' ? (
			<PersonOutlineIcon
				sx={{ ...TRIGGER_ICON_SX, opacity: 1, color: externalDataLayerAccent(layer) }}
			/>
		) : trigger === 'CRON' ? (
			<AccessTimeIcon sx={TRIGGER_ICON_SX} />
		) : null;
	if (!icon) {
		return <Typography component="span">{trigger}</Typography>;
	}
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
			{icon}
			<Typography component="span" sx={{ fontSize: 'inherit' }}>
				{trigger}
			</Typography>
		</Box>
	);
}

function LeagueCell({ leagueCode }: { leagueCode?: string | null }): JSX.Element {
	if (!leagueCode) {
		return <Typography component="span">—</Typography>;
	}
	return <LeagueAvatar leagueCode={leagueCode} height={18} sx={{ mr: 0 }} />;
}

function CountersBreakdown({
	layer,
	counters,
}: {
	layer: ExternalDataLayer;
	counters?: MonitoringCounters | null;
}): JSX.Element | null {
	const entries = counterDetailEntries(layer, counters);
	if (entries.length === 0) return null;
	return (
		<Box sx={{ mb: 1.25 }}>
			<Typography
				sx={{
					fontSize: '0.72rem',
					fontWeight: 700,
					textTransform: 'uppercase',
					letterSpacing: '0.04em',
					color: 'text.secondary',
					mb: 0.75,
				}}
			>
				{t('externalApiMonitoring.counters.title')}
			</Typography>
			<Box component="ul" sx={{ m: 0, pl: 2.25, display: 'flex', flexDirection: 'column', gap: 0.35 }}>
				{entries.map(({ key, value }) => (
					<Typography
						component="li"
						key={key}
						sx={{ fontSize: '0.78rem', lineHeight: 1.35, color: 'text.primary' }}
					>
						<strong>{value}</strong>
						{' — '}
						{t(`externalApiMonitoring.counters.${layer}.${key}`)}
					</Typography>
				))}
			</Box>
		</Box>
	);
}

export default function ExternalApiMonitoringPage(): JSX.Element {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { formatDetailed } = useFormatUserDateTime();
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
	const [deleteLayer, setDeleteLayer] = useState<ExternalDataLayer | null>(null);
	const [deleting, setDeleting] = useState(false);

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

	const handleDeleteLayer = async (): Promise<void> => {
		if (!deleteLayer) return;
		setDeleting(true);
		try {
			const deleted = await deleteMonitoringRunsByLayer(deleteLayer);
			setExpandedId(null);
			setDetail(null);
			setDeleteLayer(null);
			dispatch(
				showSuccessSnackbar({
					message: t('externalApiMonitoring.layerCleared', {
						layer: layerTitle(deleteLayer),
						count: deleted,
					}),
				})
			);
			await load();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalApiMonitoringDeleteFailed',
				})
			);
		} finally {
			setDeleting(false);
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
						<Box key={layer} sx={monitoringKpiCardSx(theme, layer, run?.status)}>
							<Typography sx={monitoringLayerTitleSx(layer)}>{layerTitle(layer)}</Typography>
							{run ? (
								<>
									<Chip
										size="small"
										variant="outlined"
										label={statusLabel(run.status)}
										sx={statusChipSx(run.status)}
									/>
									<Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
										{run.provider ?? '—'} · {formatDetailed(run.startedAt)}
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
					<Box key={layer} sx={monitoringSectionSx(theme, layer)}>
						<Box sx={monitoringSectionHeaderSx(theme, layer)}>
							<Typography sx={monitoringSectionTitleSx(layer)}>
								{layerTitle(layer)}
								<Typography component="span" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
									({rows.length})
								</Typography>
							</Typography>
							<Tooltip title={t('externalApiMonitoring.deleteLayer')}>
								<span>
									<IconButton
										aria-label={t('externalApiMonitoring.deleteLayer')}
										onClick={() => setDeleteLayer(layer)}
										disabled={loading || deleting}
										sx={{ minWidth: 40, minHeight: 40 }}
									>
										<DeleteOutlineIcon fontSize="small" />
									</IconButton>
								</span>
							</Tooltip>
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
								<Table size="small" stickyHeader sx={monitoringTableSx(theme, layer)}>
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
														<TableCell>{formatDetailed(run.startedAt)}</TableCell>
														<TableCell>
															<TriggerCell trigger={run.trigger} layer={layer} />
														</TableCell>
														<TableCell>
															<ProviderCell provider={run.provider} />
														</TableCell>
														<TableCell>
															<LeagueCell leagueCode={run.leagueCode} />
														</TableCell>
														<TableCell>{formatDuration(run.durationMs)}</TableCell>
														<TableCell>
															<Chip
																size="small"
																variant="outlined"
																label={statusLabel(run.status)}
																sx={statusChipSx(run.status)}
															/>
															{run.errorSummary ? (
																<Typography
																	sx={{
																		mt: 0.5,
																		fontSize: '0.7rem',
																		lineHeight: 1.3,
																		color: isMonitoringWarningSummary(run.errorSummary)
																			? '#d97706'
																			: '#f43f5e',
																		maxWidth: 220,
																		whiteSpace: 'normal',
																	}}
																>
																	{formatMonitoringReason(run.errorSummary)}
																</Typography>
															) : null}
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
																{formatHttpRatio(run.httpRequestsFailed, run.httpRequestsTotal)}
															</Typography>
														</TableCell>
													</TableRow>
													<TableRow
														sx={{
															display: open ? 'table-row' : 'none',
															'&:hover': { background: 'transparent' },
														}}
													>
														<TableCell
															colSpan={9}
															sx={{
																py: 0,
																borderBottom: open ? undefined : 0,
																background: 'transparent',
															}}
														>
															<Collapse in={open} timeout="auto" unmountOnExit>
																<Box sx={monitoringDetailPanelSx(theme, layer)}>
																	{detailLoading && expandedId === run.id ? (
																		<CircularProgress size={18} />
																	) : detail && detail.id === run.id ? (
																		<Box>
																			{detail.errorSummary ? (
																				<Typography
																					sx={{
																						mb: 1,
																						fontSize: '0.8rem',
																						color: isMonitoringWarningSummary(detail.errorSummary)
																							? '#d97706'
																							: '#f43f5e',
																						fontWeight: 600,
																						whiteSpace: 'normal',
																					}}
																				>
																					{formatMonitoringReason(detail.errorSummary)}
																				</Typography>
																			) : null}
																			<CountersBreakdown
																				layer={layer}
																				counters={detail.counters ?? run.counters}
																			/>
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
																				<Table size="small" sx={monitoringDetailTableSx(theme, layer)}>
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

			<CustomCalendarDialog
				open={deleteLayer != null}
				onClose={() => {
					if (!deleting) setDeleteLayer(null);
				}}
				onSave={() => void handleDeleteLayer()}
				title={
					deleteLayer
						? t('externalApiMonitoring.deleteLayerTitle', { layer: layerTitle(deleteLayer) })
						: undefined
				}
				helperText={
					deleteLayer
						? t('externalApiMonitoring.deleteLayerHelper', { layer: layerTitle(deleteLayer) })
						: undefined
				}
				buttonAcceptText={t('externalApiMonitoring.deleteLayerConfirm')}
				submitting={deleting}
			/>
		</Box>
	);
}
