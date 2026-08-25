import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
	Avatar,
	Box,
	Chip,
	CircularProgress,
	IconButton,
	Tooltip,
	Typography,
	useTheme,
	type SxProps,
	type Theme,
} from '@mui/material';
import i18n, { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import CustomCalendarDialog from '../../components/custom/dialog/CustomCalendarDialog';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import {
	clearErrorLogs,
	deleteErrorLog,
	fetchErrorLogs,
	type ErrorLogEntry,
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
	errorLogTimeSx,
	errorLogsPageRootSx,
	errorLogsTitleSx,
	errorLogsToolbarSx,
} from './errorLogsPageStyles';
import { externalDataLayerAccent } from '../../shared/externalDataLayerColors';
import { useFormatUserDateTime } from '../../shared/useFormatUserDateTime';

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

function teamChipTooltip(entry: ErrorLogEntry): string {
	const home = resolveTeamDisplayName(
		{ title: entry.homeTeamTitle || entry.homeTeam || '' },
		t,
		i18n.language
	);
	const away = resolveTeamDisplayName(
		{ title: entry.awayTeamTitle || entry.awayTeam || '' },
		t,
		i18n.language
	);
	if (home && away) {
		return `${home} — ${away}`;
	}
	return home || away;
}

export default function ErrorLogsPage(): JSX.Element {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { formatDetailed } = useFormatUserDateTime();
	const [loading, setLoading] = useState(true);
	const [entries, setEntries] = useState<ErrorLogEntry[]>([]);
	const [clearOpen, setClearOpen] = useState(false);
	const [clearing, setClearing] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const list = await fetchErrorLogs();
			setEntries(list);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'errorLogsLoadFailed',
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		void load();
	}, [load]);

	const handleDelete = async (id: string): Promise<void> => {
		try {
			await deleteErrorLog(id);
			setEntries((prev) => prev.filter((e) => e.id !== id));
			dispatch(showSuccessSnackbar({ message: t('errorLogsEntryDeleted') }));
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
				<Typography variant="body2" color="text.secondary">
					{t('errorLogsCount', { count: entries.length })}
				</Typography>
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
							disabled={entries.length === 0 || loading}
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
				const teamsText =
					!hasTeamLogos && (entry.homeTeam || entry.awayTeam)
						? `${entry.homeTeam ?? '—'} — ${entry.awayTeam ?? '—'}`
						: null;
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
								<Typography sx={errorLogTimeSx}>{formatDetailed(entry.createdAt)}</Typography>
								<Typography
									sx={{
										fontWeight: 700,
										fontSize: '0.95rem',
										mt: 0.35,
										color: severity === 'WARN' ? ERROR_LOG_WARN : ERROR_LOG_ACCENT,
									}}
								>
									{codeLabel(entry.code)}
								</Typography>
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
								<Tooltip title={teamChipTooltip(entry)}>
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
												<ErrorLogChipLogo
													src={resolveTeamLogoUrl({
														title: entry.awayTeamTitle || entry.awayTeam || '',
														logoKey: entry.awayTeamLogoKey || undefined,
													})}
													alt={entry.awayTeamTitle || entry.awayTeam || ''}
												/>
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
								<Chip
									size="small"
									label={`id ${entry.matchScheduleId}`}
									sx={chipIdSx(theme)}
								/>
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

			<CustomCalendarDialog
				open={clearOpen}
				onClose={() => setClearOpen(false)}
				onSave={() => void handleClearAll()}
				title={t('errorLogsClearAllTitle')}
				helperText={t('errorLogsClearAllHelper', { count: entries.length })}
				buttonAcceptText={t('errorLogsClearAll')}
				submitting={clearing}
			/>
		</Box>
	);
}
