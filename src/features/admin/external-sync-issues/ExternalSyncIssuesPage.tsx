import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	Chip,
	CircularProgress,
	IconButton,
	Link as MuiLink,
	Tooltip,
	Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomCalendarDialog from '../../../components/custom/dialog/CustomCalendarDialog';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import {
	buildTeamMappingAdminLink,
	extractTeamMappingFromIssue,
} from '../teams/teamMappingLinkUtils';
import {
	clearExternalSyncIssues,
	deleteExternalSyncIssue,
	getExternalSyncIssues,
	notifyExternalSyncIssuesChanged,
} from './api';
import {
	EXTERNAL_SYNC_ISSUES_COUNT_CHIP_SX,
	EXTERNAL_SYNC_ISSUES_EMPTY_SX,
	EXTERNAL_SYNC_ISSUES_HEADER_SX,
	EXTERNAL_SYNC_ISSUES_LIST_SX,
	EXTERNAL_SYNC_ISSUES_PAGE_SX,
	EXTERNAL_SYNC_ISSUES_TITLE_SX,
	EXTERNAL_SYNC_ISSUES_TOOLBAR_SX,
	getIssueSeverity,
	getProviderColors,
	getSeverityColors,
} from './externalSyncIssuesPageStyles';
import { ExternalSyncIssue } from './types/ExternalSyncIssue';

function issueTypeLabel(issueType: string | undefined): string {
	if (issueType === 'API_SCORE_CHANGED') {
		return t('externalSyncIssuesIssueTypeApiScoreChanged');
	}
	if (issueType === 'TEAM_MAPPING_MISSING') {
		return t('externalSyncIssuesIssueTypeTeamMappingMissing');
	}
	if (issueType === 'EVENT_MAPPING_MISSING') {
		return t('externalSyncIssuesIssueTypeEventMappingMissing');
	}
	if (issueType === 'INVALID_CANONICAL_SCORE') {
		return t('externalSyncIssuesIssueTypeInvalidScore');
	}
	if (issueType === 'SCORE_NOT_STABLE') {
		return t('externalSyncIssuesIssueTypeScoreNotStable');
	}
	if (issueType === 'PROVIDER_SCORE_MISMATCH') {
		return t('externalSyncIssuesIssueTypeProviderMismatch');
	}
	if (issueType === 'PRIMARY_PROVIDER_UNAVAILABLE') {
		return t('externalSyncIssuesIssueTypePrimaryUnavailable');
	}
	if (issueType === 'SECONDARY_PROVIDER_UNAVAILABLE') {
		return t('externalSyncIssuesIssueTypeSecondaryUnavailable');
	}
	if (issueType === 'ODDS_MARKET_UNMAPPED') {
		return t('externalSyncIssuesIssueTypeOddsMarketUnmapped');
	}
	if (issueType === 'ODDS_SELECTION_UNMAPPED') {
		return t('externalSyncIssuesIssueTypeOddsSelectionUnmapped');
	}
	if (issueType === 'ODDS_QUOTE_MISMATCH') {
		return t('externalSyncIssuesIssueTypeOddsQuoteMismatch');
	}
	if (issueType === 'ODDS_QUOTE_REJECTED') {
		return t('externalSyncIssuesIssueTypeOddsQuoteRejected');
	}
	return issueType ?? '';
}

function formatIssueIndex(index: number, total: number): string {
	const pad = total >= 100 ? 3 : 2;
	return String(index + 1).padStart(pad, '0');
}

function formatRecordedAt(createdAt: string | undefined, locale: string): string | null {
	if (!createdAt) {
		return null;
	}
	const date = new Date(createdAt);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return date.toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' });
}

function buildIssueContextLines(issue: ExternalSyncIssue, locale: string): string[] {
	const lines: string[] = [];

	if (issue.leagueCode) {
		lines.push(t('externalSyncIssuesMetaLeague', { code: issue.leagueCode }));
	}
	if (issue.season) {
		lines.push(t('externalSyncIssuesMetaSeason', { season: issue.season }));
	}
	if (issue.matchday != null) {
		lines.push(t('externalSyncIssuesMetaMatchday', { number: issue.matchday }));
	}
	if (issue.externalMatchId != null) {
		lines.push(t('externalSyncIssuesMetaExternalMatchId', { id: issue.externalMatchId }));
	}

	const recordedAt = formatRecordedAt(issue.createdAt, locale);
	if (recordedAt) {
		lines.push(t('externalSyncIssuesMetaRecordedAt', { datetime: recordedAt }));
	}

	return lines;
}

function buildIssueTeamIdLines(issue: ExternalSyncIssue): string[] {
	const lines: string[] = [];

	if (issue.homeTeamExternalId != null && issue.homeTeamExternalId !== '') {
		lines.push(t('externalSyncIssuesMetaHomeTeamExternalId', { id: issue.homeTeamExternalId }));
	}
	if (issue.awayTeamExternalId != null && issue.awayTeamExternalId !== '') {
		lines.push(t('externalSyncIssuesMetaAwayTeamExternalId', { id: issue.awayTeamExternalId }));
	}

	return lines;
}

function IssueMetaLine({ text }: { text: string }): JSX.Element {
	return (
		<Typography
			component="div"
			sx={{
				fontSize: '0.8125rem',
				lineHeight: 1.45,
				color: 'text.secondary',
			}}
		>
			{text}
		</Typography>
	);
}

function ExternalSyncIssueCard({
	issue,
	index,
	total,
	deleting,
	onDelete,
}: {
	issue: ExternalSyncIssue;
	index: number;
	total: number;
	deleting: boolean;
	onDelete: (id: string) => void;
}): JSX.Element {
	const theme = useTheme();
	const { i18n } = useTranslation();
	const severity = getIssueSeverity(issue.issueType);
	const severityColors = getSeverityColors(theme, severity);
	const providerColors = getProviderColors(theme, issue.provider);
	const issueLabel = issueTypeLabel(issue.issueType);
	const contextLines = buildIssueContextLines(issue, i18n.language);
	const teamIdLines = buildIssueTeamIdLines(issue);
	const teamMapping = extractTeamMappingFromIssue(issue);
	const teamMappingLink = teamMapping ? buildTeamMappingAdminLink(teamMapping) : null;

	return (
		<Box
			sx={{
				borderRadius: 2,
				border: 1,
				borderColor: 'divider',
				bgcolor: 'background.paper',
				overflow: 'hidden',
				boxShadow: theme.palette.mode === 'dark' ? '0 2px 12px rgba(0,0,0,0.25)' : '0 1px 6px rgba(0,0,0,0.06)',
				py: 1.25,
				px: 1.25,
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
					<Box
						sx={{
							minWidth: 34,
							height: 34,
							borderRadius: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: '"Shantell Sans", cursive',
							fontWeight: 700,
							fontSize: '0.8rem',
							color: severityColors.chipColor,
							bgcolor: severityColors.accentBg,
							flexShrink: 0,
						}}
					>
						{formatIssueIndex(index, total)}
					</Box>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.75, mb: 0.35 }}>
							{issue.provider ? (
								<Chip
									label={issue.provider}
									size="small"
									sx={{
										height: 22,
										fontSize: '0.6875rem',
										fontWeight: 700,
										letterSpacing: '0.02em',
										color: providerColors.color,
										bgcolor: providerColors.bg,
										border: 'none',
										'& .MuiChip-label': { px: 1 },
									}}
								/>
							) : null}
							<Typography
								component="span"
								sx={{
									fontWeight: 700,
									fontSize: '0.875rem',
									lineHeight: 1.35,
									color: severityColors.accent,
								}}
							>
								{issueLabel}
							</Typography>
						</Box>
						{contextLines.length > 0 ? (
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, mt: 0.15 }}>
								{contextLines.map((line, lineIndex) => (
									<IssueMetaLine key={`ctx-${lineIndex}`} text={line} />
								))}
							</Box>
						) : null}
						{teamIdLines.length > 0 ? (
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, mt: 0.35 }}>
								{teamIdLines.map((line, lineIndex) => (
									<IssueMetaLine key={`team-${lineIndex}`} text={line} />
								))}
							</Box>
						) : null}
					</Box>
					<Tooltip title={t('externalSyncIssuesDeleteEntry')} arrow>
						<span>
							<IconButton
								aria-label={t('externalSyncIssuesDeleteEntry')}
								size="small"
								disabled={deleting}
								onClick={() => onDelete(issue.id)}
								sx={{
									flexShrink: 0,
									border: 1,
									borderColor: 'divider',
									'&:not(:disabled):hover': {
										borderColor: theme.palette.error.light,
										color: theme.palette.error.main,
									},
								}}
							>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</span>
					</Tooltip>
				</Box>
			{teamMappingLink ? (
				<Box sx={{ mb: 0.75, pl: 0.25 }}>
					<MuiLink
						component={Link}
						to={teamMappingLink}
						underline="hover"
						sx={{ fontSize: '0.8125rem', fontWeight: 600 }}
					>
						{t('externalSyncIssuesOpenTeamMapping')}
					</MuiLink>
				</Box>
			) : null}
			{(issue.homeTeamName || issue.awayTeamName) ? (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							flexWrap: 'wrap',
							gap: 0.5,
							mt: 0.5,
							pl: 0.25,
						}}
					>
						<Typography
							component="span"
							sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}
						>
							{issue.homeTeamName ?? '—'}
						</Typography>
						<Typography
							component="span"
							sx={{
								fontSize: '0.6875rem',
								fontWeight: 700,
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								color: 'text.disabled',
								px: 0.5,
							}}
						>
							vs
						</Typography>
						<Typography
							component="span"
							sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'text.primary' }}
						>
							{issue.awayTeamName ?? '—'}
						</Typography>
					</Box>
				) : null}
				{issue.message ? (
					<Box
						sx={{
							mt: 1,
							px: 1,
							py: 0.75,
							borderRadius: 1,
							bgcolor: severityColors.accentBg,
							borderLeft: 3,
							borderColor: severityColors.accent,
						}}
					>
						<Typography sx={{ fontSize: '0.8125rem', lineHeight: 1.45, color: 'text.secondary' }}>
							{issue.message}
						</Typography>
					</Box>
				) : null}
		</Box>
	);
}

export default function ExternalSyncIssuesPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const [issues, setIssues] = useState<ExternalSyncIssue[]>([]);
	const [loading, setLoading] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
	const [clearing, setClearing] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getExternalSyncIssues();
			setIssues(data);
			notifyExternalSyncIssuesChanged();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalSyncIssuesLoadError'),
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		load();
	}, [load]);

	const handleClear = async (): Promise<void> => {
		setClearing(true);
		try {
			await clearExternalSyncIssues();
			setIssues([]);
			notifyExternalSyncIssuesChanged();
			dispatch(showSuccessSnackbar({ message: t('externalSyncIssuesCleared') }));
			setClearConfirmOpen(false);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalSyncIssuesClearError'),
				})
			);
		} finally {
			setClearing(false);
		}
	};

	const handleDeleteIssue = useCallback(
		async (id: string): Promise<void> => {
			setDeletingId(id);
			try {
				await deleteExternalSyncIssue(id);
				setIssues((prev) => prev.filter((issue) => issue.id !== id));
				notifyExternalSyncIssuesChanged();
				dispatch(showSuccessSnackbar({ message: t('externalSyncIssuesEntryDeleted') }));
			} catch (error) {
				dispatch(
					showErrorSnackbar({
						message:
							error instanceof Error ? error.message : t('externalSyncIssuesDeleteError'),
					})
				);
			} finally {
				setDeletingId(null);
			}
		},
		[dispatch]
	);

	return (
		<Box sx={EXTERNAL_SYNC_ISSUES_PAGE_SX}>
			<Box sx={EXTERNAL_SYNC_ISSUES_HEADER_SX}>
				<Typography sx={EXTERNAL_SYNC_ISSUES_TITLE_SX}>{t('externalSyncIssuesTitle')}</Typography>
				{issues.length > 0 ? (
					<Chip
						label={issues.length}
						size="small"
						color="warning"
						sx={EXTERNAL_SYNC_ISSUES_COUNT_CHIP_SX}
					/>
				) : null}
			</Box>

			<Box sx={EXTERNAL_SYNC_ISSUES_TOOLBAR_SX}>
				<CustomButton
					buttonText={t('btnText.refresh')}
					onClick={load}
					disabled={loading}
					sx={{ px: 2 }}
				/>
				<Tooltip title={t('btnText.clear')} arrow>
					<span>
						<IconButton
							aria-label={t('btnText.clear')}
							onClick={() => setClearConfirmOpen(true)}
							disabled={loading || clearing || issues.length === 0}
							sx={{
								border: 1,
								borderColor: 'divider',
								'&:not(:disabled):hover': {
									borderColor: theme.palette.error.light,
									color: theme.palette.error.main,
								},
							}}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</span>
				</Tooltip>
			</Box>

			{loading && issues.length === 0 ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
					<CircularProgress size={32} />
				</Box>
			) : issues.length === 0 ? (
				<Typography sx={EXTERNAL_SYNC_ISSUES_EMPTY_SX}>{t('externalSyncIssuesEmpty')}</Typography>
			) : (
				<Box sx={EXTERNAL_SYNC_ISSUES_LIST_SX}>
					{issues.map((issue, index) => (
						<ExternalSyncIssueCard
							key={issue.id}
							issue={issue}
							index={index}
							total={issues.length}
							deleting={deletingId === issue.id}
							onDelete={handleDeleteIssue}
						/>
					))}
				</Box>
			)}

			<CustomCalendarDialog
				open={clearConfirmOpen}
				onClose={() => {
					if (!clearing) {
						setClearConfirmOpen(false);
					}
				}}
				onSave={() => void handleClear()}
				title={t('externalSyncIssuesClearAllTitle')}
				helperText={t('externalSyncIssuesClearAllHelper', { count: issues.length })}
				buttonAcceptText={t('btnText.clear')}
				contentWidth="18rem"
			/>
		</Box>
	);
}
