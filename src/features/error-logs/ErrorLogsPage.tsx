import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	Collapse,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	Tooltip,
	Typography,
	useTheme,
	type SelectChangeEvent,
	type SxProps,
	type Theme,
} from '@mui/material';
import i18n, { t } from 'i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import CustomCalendarDialog from '../../components/custom/dialog/CustomCalendarDialog';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import { copyText } from '../api-sandbox/CopyableValue';
import { externalDataLayerAccent } from '../../shared/externalDataLayerColors';
import { useFormatUserDateTime } from '../../shared/useFormatUserDateTime';
import ErrorLogsPagination from './ErrorLogsPagination';
import {
	clearErrorLogs,
	DEFAULT_ERROR_LOGS_PAGE_SIZE,
	deleteErrorLog,
	ERROR_LOGS_PAGE_SIZES,
	fetchErrorLogs,
	fetchErrorLogsCount,
	type ErrorLogEntry,
	type ErrorLogsPageSize,
} from './errorLogsApi';
import {
	ERROR_LOG_ACCENT,
	ERROR_LOG_LEAGUE,
	ERROR_LOG_PROVIDER,
	ERROR_LOG_TEAMS,
	ERROR_LOG_WARN,
	chipIdSx,
	chipSx,
	chipWithLogosSx,
	errorLogCardSx,
	errorLogChipLogoSx,
	errorLogMessageSx,
	errorLogMetaRowSx,
	errorLogOccurrenceRowSx,
	errorLogOccurrencesListSx,
	errorLogOccurrencesToggleSx,
	errorLogTimeSx,
	errorLogsPageRootSx,
	errorLogsPageSizeSelectSx,
	errorLogsTitleSx,
	errorLogsToolbarSx,
} from './errorLogsPageStyles';

function codeLabel(code: string): string {
	const key = `errorLogs.code.${code}`;
	return t(key) !== key ? t(key) : code;
}

function layerLabel(layer: string): string {
	const key = `errorLogs.layer.${layer}`;
	return t(key) !== key ? t(key) : layer;
}

function ErrorLogChipLogo({ src, alt }: { src: string; alt: string }): JSX.Element {
	return (
		<Avatar
			variant="square"
			src={src}
			alt={alt}
			sx={[errorLogChipLogoSx, leagueLogoAvatarSx] as SxProps<Theme>}
		/>
	);
}

function occurrenceTimes(entry: ErrorLogEntry): string[] {
	if (entry.occurredAt && entry.occurredAt.length > 0) {
		return entry.occurredAt;
	}
	const first = entry.firstOccurredAt ?? entry.createdAt;
	return first ? [first] : [];
}

function formatOccurrenceGap(ms: number): string {
	const sec = Math.max(0, Math.round(ms / 1000));
	if (sec < 60) {
		return t('errorLogsOccurrenceDeltaSec', { count: sec });
	}
	const minutesTotal = Math.round(sec / 60);
	if (minutesTotal < 60) {
		return t('errorLogsOccurrenceDeltaMin', { count: minutesTotal });
	}
	const hours = Math.floor(sec / 3600);
	const minutes = Math.round((sec % 3600) / 60);
	return t('errorLogsOccurrenceDeltaHm', { hours, minutes });
}

function OccurrenceHistory({
	times,
	formatDetailed,
}: {
	times: string[];
	formatDetailed: (iso?: string | null) => string;
}): JSX.Element | null {
	const [open, setOpen] = useState(false);
	const listRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (open && listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [open]);

	if (times.length <= 1) {
		return null;
	}

	return (
		<>
			<Box
				role="button"
				tabIndex={0}
				aria-expanded={open}
				aria-label={t('errorLogsOccurrencesToggle', { count: times.length })}
				onClick={() => setOpen((prev) => !prev)}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						setOpen((prev) => !prev);
					}
				}}
				sx={errorLogOccurrencesToggleSx}
			>
				<Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
					{t('errorLogsOccurrencesToggle', { count: times.length })}
				</Typography>
				<ExpandMoreIcon
					fontSize="small"
					sx={{
						transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'transform 0.2s ease',
					}}
				/>
			</Box>
			<Collapse in={open} timeout={180} unmountOnExit>
				<Box ref={listRef} sx={errorLogOccurrencesListSx}>
					{times.map((iso, index) => {
						const prev = index > 0 ? Date.parse(times[index - 1]) : Number.NaN;
						const curr = Date.parse(iso);
						const gap =
							index > 0 && Number.isFinite(prev) && Number.isFinite(curr)
								? formatOccurrenceGap(curr - prev)
								: null;
						return (
							<Box key={`${iso}-${index}`} sx={errorLogOccurrenceRowSx}>
								<Typography component="span" sx={{ fontSize: 'inherit' }}>
									{formatDetailed(iso)}
								</Typography>
								{gap ? (
									<Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 600, flexShrink: 0 }}>
										{gap}
									</Typography>
								) : null}
							</Box>
						);
					})}
				</Box>
			</Collapse>
		</>
	);
}

export default function ErrorLogsPage(): JSX.Element {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { formatDetailed } = useFormatUserDateTime();
	const [loading, setLoading] = useState(true);
	const [entries, setEntries] = useState<ErrorLogEntry[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState<ErrorLogsPageSize>(DEFAULT_ERROR_LOGS_PAGE_SIZE);
	const [clearOpen, setClearOpen] = useState(false);
	const [clearing, setClearing] = useState(false);

	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const [list, count] = await Promise.all([
				fetchErrorLogs({ page: page - 1, size: pageSize }),
				fetchErrorLogsCount(),
			]);
			setEntries(list);
			setTotalCount(count);
			const maxPage = Math.max(1, Math.ceil(count / pageSize));
			if (page > maxPage) {
				setPage(maxPage);
			}
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'errorLogsLoadFailed',
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch, page, pageSize]);

	useEffect(() => {
		void load();
	}, [load]);

	const handlePageSizeChange = (event: SelectChangeEvent<number>): void => {
		const next = Number(event.target.value) as ErrorLogsPageSize;
		setPageSize(next);
		setPage(1);
	};

	const handleDelete = async (id: string): Promise<void> => {
		try {
			await deleteErrorLog(id);
			const newTotal = Math.max(0, totalCount - 1);
			const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
			dispatch(showSuccessSnackbar({ message: t('errorLogsEntryDeleted') }));
			if (page > maxPage) {
				setPage(maxPage);
			} else {
				await load();
			}
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'errorLogsDeleteFailed',
				})
			);
		}
	};

	const handleClearAll = async (): Promise<void> => {
		setClearing(true);
		try {
			await clearErrorLogs();
			setEntries([]);
			setTotalCount(0);
			setPage(1);
			setClearOpen(false);
			dispatch(showSuccessSnackbar({ message: t('errorLogsCleared') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'errorLogsClearFailed',
				})
			);
		} finally {
			setClearing(false);
		}
	};

	return (
		<Box sx={errorLogsPageRootSx}>
			<Typography component="h1" sx={errorLogsTitleSx}>
				{t('errorLogsTitle')}
			</Typography>

			<Box sx={errorLogsToolbarSx}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minWidth: 0 }}>
					<Typography variant="body2" color="text.secondary">
						{t('errorLogsCount', { count: totalCount })}
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
						<Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
							{t('errorLogsPageSize')}
						</Typography>
						<FormControl size="small" sx={{ minWidth: '4.5rem' }}>
							<Select
								value={pageSize}
								onChange={handlePageSizeChange}
								displayEmpty
								aria-label={t('errorLogsPageSize')}
								sx={errorLogsPageSizeSelectSx}
							>
								{ERROR_LOGS_PAGE_SIZES.map((size) => (
									<MenuItem key={size} value={size}>
										{size}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</Box>
				<Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
					<span>
						<Tooltip title={t('errorLogsRefresh')}>
							<span>
								<IconButton
									aria-label={t('errorLogsRefresh')}
									onClick={() => void load()}
									disabled={loading}
									size="small"
									sx={{ minWidth: 40, minHeight: 40 }}
								>
									{loading ? <CircularProgress size={18} /> : <RefreshIcon fontSize="small" />}
								</IconButton>
							</span>
						</Tooltip>
					</span>
					<span>
						<CustomSuccessButton
							buttonText={t('errorLogsClearAll')}
							onClick={() => setClearOpen(true)}
							disabled={totalCount === 0 || loading}
							sx={{ height: '2.25rem' }}
						/>
					</span>
				</Box>
			</Box>

			{loading && entries.length === 0 ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<CircularProgress size={32} />
				</Box>
			) : null}

			{!loading && entries.length === 0 ? (
				<Box
					sx={{
						textAlign: 'center',
						py: 5,
						px: 2,
						borderRadius: 2.5,
						border: '1px dashed',
						borderColor: 'divider',
						color: 'text.secondary',
					}}
				>
					<Typography sx={{ fontWeight: 600, mb: 0.5 }}>{t('errorLogsEmptyTitle')}</Typography>
					<Typography variant="body2">{t('errorLogsEmpty')}</Typography>
				</Box>
			) : null}

			{entries.map((entry) => {
				const severity = (entry.severity || 'ERROR').toUpperCase();
				const hasTeamLogos = Boolean(
					entry.homeTeamTitle ||
						entry.awayTeamTitle ||
						entry.homeTeamLogoKey ||
						entry.awayTeamLogoKey
				);
				const homeTeamName = resolveTeamDisplayName(
					{ title: entry.homeTeamTitle || entry.homeTeam || '' },
					t,
					i18n.language
				);
				const awayTeamName = resolveTeamDisplayName(
					{ title: entry.awayTeamTitle || entry.awayTeam || '' },
					t,
					i18n.language
				);
				const teamsLabel =
					homeTeamName && awayTeamName
						? `${homeTeamName} - ${awayTeamName}`
						: homeTeamName || awayTeamName;
				const teamsText =
					!hasTeamLogos && (entry.homeTeam || entry.awayTeam)
						? `${entry.homeTeam ?? '—'} - ${entry.awayTeam ?? '—'}`
						: null;
				const times = occurrenceTimes(entry);
				const firstAt = times[0] ?? entry.createdAt;
				const repeatCount = Math.max(entry.occurrenceCount ?? 0, times.length);
				return (
					<Box key={entry.id} sx={errorLogCardSx(theme, severity)}>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
								gap: 1,
								pl: 0.75,
							}}
						>
							<Box sx={{ minWidth: 0, flex: 1 }}>
								<Typography sx={errorLogTimeSx}>{formatDetailed(firstAt)}</Typography>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 0.75,
										mt: 0.35,
										flexWrap: 'wrap',
									}}
								>
									<Typography
										sx={{
											fontWeight: 700,
											fontSize: '0.95rem',
											color: severity === 'WARN' ? ERROR_LOG_WARN : ERROR_LOG_ACCENT,
										}}
									>
										{codeLabel(entry.code)}
									</Typography>
									{repeatCount > 1 ? (
										<Chip
											size="small"
											label={t('errorLogsRepeatChip', { count: repeatCount })}
											sx={chipSx(
												severity === 'WARN' ? ERROR_LOG_WARN : ERROR_LOG_ACCENT,
												theme
											)}
										/>
									) : null}
								</Box>
							</Box>
							<span>
								<Tooltip title={t('errorLogsDeleteEntry')}>
									<span>
										<IconButton
											aria-label={t('errorLogsDeleteEntry')}
											size="small"
											onClick={() => void handleDelete(entry.id)}
											sx={{ minWidth: 40, minHeight: 40 }}
										>
											<DeleteOutlineIcon fontSize="small" />
										</IconButton>
									</span>
								</Tooltip>
							</span>
						</Box>

						<OccurrenceHistory times={times} formatDetailed={formatDetailed} />

						<Box sx={{ ...errorLogMetaRowSx, pl: 0.75 }}>
							{entry.provider ? (
								<Chip
									size="small"
									label={
										entry.providerRole
											? `${entry.provider} · ${entry.providerRole}`
											: entry.provider
									}
									sx={chipSx(ERROR_LOG_PROVIDER, theme)}
								/>
							) : null}
							{entry.layer ? (
								<Chip
									size="small"
									label={layerLabel(entry.layer)}
									sx={chipSx(
										externalDataLayerAccent(entry.layer) ?? ERROR_LOG_ACCENT,
										theme
									)}
								/>
							) : null}
							{entry.leagueCode ? (
								<Chip
									size="small"
									sx={chipWithLogosSx(ERROR_LOG_LEAGUE, theme)}
									label={
										<Box
											component="span"
											sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.45 }}
										>
											<ErrorLogChipLogo
												src={pathToLogoImage(entry.leagueCode)}
												alt={entry.leagueCode}
											/>
											{entry.leagueCode}
										</Box>
									}
								/>
							) : null}
							{entry.matchday != null ? (
								<Chip
									size="small"
									label={t('errorLogsMatchdayChip', { number: entry.matchday })}
									sx={chipSx(ERROR_LOG_LEAGUE, theme)}
								/>
							) : null}
							{hasTeamLogos ? (
								<Tooltip title={teamsLabel}>
									<Chip
										size="small"
										sx={chipWithLogosSx(ERROR_LOG_TEAMS, theme)}
										label={
											<Box
												component="span"
												sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.45 }}
											>
												<ErrorLogChipLogo
													src={resolveTeamLogoUrl({
														title: entry.homeTeamTitle || entry.homeTeam || '',
														logoKey: entry.homeTeamLogoKey || undefined,
													})}
													alt={entry.homeTeamTitle || entry.homeTeam || ''}
												/>
												{homeTeamName}
												{' - '}
												<ErrorLogChipLogo
													src={resolveTeamLogoUrl({
														title: entry.awayTeamTitle || entry.awayTeam || '',
														logoKey: entry.awayTeamLogoKey || undefined,
													})}
													alt={entry.awayTeamTitle || entry.awayTeam || ''}
												/>
												{awayTeamName}
											</Box>
										}
									/>
								</Tooltip>
							) : null}
							{entry.externalMatchId ? (
								<Chip
									size="small"
									label={`ext ${entry.externalMatchId}`}
									sx={chipIdSx(theme)}
								/>
							) : null}
							{entry.matchScheduleId ? (
								<Tooltip title={t('apiSandbox.copy')}>
									<Chip
										size="small"
										onClick={() => {
											void copyText(entry.matchScheduleId!).then(() => {
												dispatch(
													showSuccessSnackbar({
														message: t('apiSandbox.copied'),
														duration: 1600,
													})
												);
											});
										}}
										label={
											<Box component="span" sx={{ display: 'inline' }}>
												<Box component="span" sx={{ userSelect: 'none', mr: 0.5 }}>
													id
												</Box>
												<Box component="span" sx={{ userSelect: 'all' }}>
													{entry.matchScheduleId}
												</Box>
											</Box>
										}
										sx={[chipIdSx(theme), { cursor: 'pointer' }] as SxProps<Theme>}
									/>
								</Tooltip>
							) : null}
							{teamsText ? (
								<Chip size="small" label={teamsText} sx={chipSx(ERROR_LOG_TEAMS, theme)} />
							) : null}
							{entry.season ? (
								<Chip
									size="small"
									label={entry.season}
									sx={chipSx(ERROR_LOG_LEAGUE, theme)}
								/>
							) : null}
						</Box>

						{entry.message ? (
							<Typography sx={{ ...errorLogMessageSx, pl: 0.75 }}>{entry.message}</Typography>
						) : null}
					</Box>
				);
			})}

			<ErrorLogsPagination page={page} totalPages={totalPages} onPageChange={setPage} />

			<CustomCalendarDialog
				open={clearOpen}
				onClose={() => setClearOpen(false)}
				onSave={() => void handleClearAll()}
				title={t('errorLogsClearAllTitle')}
				helperText={t('errorLogsClearAllHelper', { count: totalCount })}
				buttonAcceptText={t('errorLogsClearAll')}
				submitting={clearing}
			/>
		</Box>
	);
}
