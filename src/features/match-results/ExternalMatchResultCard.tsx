import { Avatar, Box, Chip, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { MouseEvent } from 'react';
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
	matchSettlingChipSx,
} from './liveMatchBadgeStyles';
import MatchResultOddsChips from './MatchResultOddsChips';
import {
	getMatchStatusChipColor,
	isAwaitingMatchFinalization,
	isMatchBreakStatus,
	isMatchNotStarted,
	isPenaltyShootoutStatus,
	normalizeMatchStatus,
	translateMatchStatus,
} from './matchStatusI18n';
import type { MatchResultOdds } from './types/ExternalMatch';

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
	matchResultOdds?: MatchResultOdds | null;
	headerActions?: React.ReactNode;
	onClick?: () => void;
	/** Open participants' bets (e.g. before kickoff — card click opens odds pick instead). */
	onStatusClick?: () => void;
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
					{resolveTeamDisplayName(homeTeam, i18n.language)}
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
					{resolveTeamDisplayName(awayTeam, i18n.language)}
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
	matchResultOdds,
	headerActions,
	onClick,
	onStatusClick,
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
	const awaitingFinalization = isAwaitingMatchFinalization(status, finalized);
	const statusLabel = finalized
		? t('gameResultFinalized')
		: awaitingFinalization
			? t('gameResultSettling')
			: translateMatchStatus(status, t);
	const statusColor = finalized ? 'success' : getMatchStatusChipColor(status);
	const isPaused = isMatchBreakStatus(status);
	const isPenalty = isPenaltyShootoutStatus(status);
	const liveStacked =
		!finalized &&
		!awaitingFinalization &&
		(isLiveMatchStatus(status) || Boolean(minuteDisplay));
	const showLiveBadge =
		liveStacked && !isPaused && !isPenalty && normalizeMatchStatus(status) !== 'FINISHED';
	/** Над счётом: минута, либо «Пенальти» вместо времени. */
	const liveMinuteDisplay = isPenalty && liveStacked ? statusLabel : minuteDisplay;
	const kickoffNotReached = kickoffUtcMs <= 0 || kickoffUtcMs > Date.now();
	const showMatchResultOdds =
		Boolean(matchResultOdds) &&
		isMatchNotStarted(status) &&
		kickoffNotReached &&
		!finalized;

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
					position: 'relative',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 0.25,
					gap: 0.5,
					minHeight: '1.15rem',
				}}
			>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{
						fontSize: '0.68rem',
						lineHeight: 1.2,
						minHeight: '0.82rem',
						minWidth: 0,
						flex: 1,
						pr: showMatchResultOdds ? '5.5rem' : 0,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{matchDateLabel ?? ''}
				</Typography>
				{showMatchResultOdds && matchResultOdds ? (
					<Box
						sx={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%)',
							pointerEvents: 'none',
						}}
					>
						<MatchResultOddsChips odds={matchResultOdds} />
					</Box>
				) : null}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						gap: 0.25,
						flex: 1,
						pl: showMatchResultOdds ? '5.5rem' : 0,
						minWidth: 0,
					}}
				>
					{headerActions}
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
							color={awaitingFinalization ? 'default' : statusColor}
							variant="filled"
							onClick={
								onStatusClick
									? (event: MouseEvent) => {
											event.stopPropagation();
											onStatusClick();
										}
									: undefined
							}
							sx={
								[
									awaitingFinalization ? matchSettlingChipSx : matchResultStatusChipSx,
									onStatusClick
										? {
												cursor: 'pointer',
												'&:hover': { filter: 'brightness(1.08)' },
											}
										: null,
								] as SxProps<Theme>
							}
						/>
					)}
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
