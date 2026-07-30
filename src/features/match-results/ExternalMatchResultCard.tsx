import { Avatar, Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import { useDisplayLiveMinuteLabel } from '../../shared/useDisplayLiveMinuteLabel';
import { formatLiveMinuteForDisplay } from '../../shared/liveMinuteResolver';
import Team from '../admin/teams/types/Team';
import { isLiveMatchStatus } from './externalMatchScoreView';
import LiveMatchBadge from './LiveMatchBadge';
import {
	liveMatchHalftimeBadgeSx,
	liveMatchMinuteSx,
	liveMatchScoreSx,
	matchResultStatusChipSx,
} from './liveMatchBadgeStyles';
import {
	getMatchStatusChipColor,
	isMatchBreakStatus,
	isPenaltyShootoutStatus,
	normalizeMatchStatus,
	translateMatchStatus,
} from './matchStatusI18n';

const MATCH_ROW_AVATAR = 26;

export type ExternalMatchResultCardProps = {
	homeTeam: Team;
	awayTeam: Team;
	scoreView: string;
	status: string;
	finalized?: boolean;
	liveMinuteLabel?: string | null;
	fetchedAt?: string | null;
	kickoffUtcMs?: number;
	leagueCode?: string | null;
	slotId?: string | null;
	matchDateLabel?: string;
	headerActions?: React.ReactNode;
	onClick?: () => void;
	interactive?: boolean;
};

function CompactMatchRow({
	homeTeam,
	awayTeam,
	scoreView,
	liveMinuteDisplay,
	liveStacked,
}: {
	homeTeam: Team;
	awayTeam: Team;
	scoreView: string;
	liveMinuteDisplay?: string | null;
	liveStacked?: boolean;
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

			<Box
				sx={{
					flex: '0 0 auto',
					px: 0.5,
					minWidth: liveStacked ? '4.5rem' : '3.25rem',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0.12,
				}}
			>
				{liveStacked && liveMinuteDisplay ? (
					<Typography component="span" sx={liveMatchMinuteSx}>
						{liveMinuteDisplay}
					</Typography>
				) : null}
				<Typography
					sx={
						liveStacked
							? liveMatchScoreSx
							: {
									fontWeight: 700,
									fontSize: '0.85rem',
									lineHeight: 1.2,
									textAlign: 'center',
									whiteSpace: 'pre-line',
								}
					}
				>
					{scoreView}
				</Typography>
			</Box>

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

export default function ExternalMatchResultCard({
	homeTeam,
	awayTeam,
	scoreView,
	status,
	finalized = false,
	liveMinuteLabel,
	fetchedAt,
	kickoffUtcMs = 0,
	leagueCode,
	slotId,
	matchDateLabel,
	headerActions,
	onClick,
	interactive = false,
}: ExternalMatchResultCardProps): JSX.Element {
	const { t } = useTranslation();
	const displayMinute = useDisplayLiveMinuteLabel({
		liveMinuteLabel,
		fetchedAt,
		matchStatus: status,
		kickoffUtcMs,
		finalized,
		leagueCode,
		slotId,
	});
	const minuteDisplay = formatLiveMinuteForDisplay(displayMinute);
	const statusLabel = finalized ? t('gameResultFinalized') : translateMatchStatus(status, t);
	const statusColor = finalized ? 'success' : getMatchStatusChipColor(status);
	const isPaused = isMatchBreakStatus(status);
	const isPenalty = isPenaltyShootoutStatus(status);
	const liveStacked =
		!finalized && (isLiveMatchStatus(status) || Boolean(minuteDisplay));
	const showLiveBadge =
		liveStacked && !isPaused && !isPenalty && normalizeMatchStatus(status) !== 'FINISHED';
	/** Над счётом: минута, либо «Пенальти» вместо времени. */
	const liveMinuteDisplay = isPenalty && liveStacked ? statusLabel : minuteDisplay;

	return (
		<Box
			onClick={onClick}
			sx={{
				px: 1,
				py: 0.45,
				cursor: interactive ? 'pointer' : 'default',
				'&:hover': interactive ? { bgcolor: 'action.hover' } : undefined,
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
					sx={{ fontSize: '0.68rem', lineHeight: 1.2, minHeight: '0.82rem' }}
				>
					{matchDateLabel ?? ''}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
					{showLiveBadge ? (
						<LiveMatchBadge />
					) : (isPaused || isPenalty) && liveStacked ? (
						<Box component="span" sx={liveMatchHalftimeBadgeSx}>
							{statusLabel}
						</Box>
					) : (
						<Chip
							size="small"
							label={statusLabel}
							color={statusColor}
							sx={matchResultStatusChipSx}
						/>
					)}
					{headerActions}
				</Box>
			</Box>
			<CompactMatchRow
				homeTeam={homeTeam}
				awayTeam={awayTeam}
				scoreView={scoreView}
				liveMinuteDisplay={liveMinuteDisplay}
				liveStacked={liveStacked}
			/>
		</Box>
	);
}
