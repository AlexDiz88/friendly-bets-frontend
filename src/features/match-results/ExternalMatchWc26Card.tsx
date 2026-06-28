import { Box, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPLETED_BET_STATUSES } from '../../constants';
import BetStatusIcon from '../bets/BetStatusIcon';
import Wc26MatchCenterStatus, {
	isWc26LiveStackedDisplay,
} from '../world-cup-2026/Wc26MatchCenterStatus';
import Wc26LiveBadge from '../world-cup-2026/Wc26LiveBadge';
import Wc26TeamFlag from '../world-cup-2026/Wc26TeamFlag';
import {
	findWc26ScheduleMatchForExternal,
	resolveWc26TeamIdFromCountry,
} from '../world-cup-2026/wc26BetSlots';
import type { Wc26TeamId } from '../world-cup-2026/wc26Teams';
import { matchSideToDisplayTeam } from './externalMatchDisplay';
import { resolveTeamDisplayName } from '../../components/utils/teamDisplay';
import { resolveExternalMatchBerlinKickoff } from './externalMatchKickoff';
import { getFullBetTitle } from '../../components/utils/stringTransform';
import { formatPickOdds } from '../../components/odds/formatPickOdds';
import type Bet from '../bets/types/Bet';
import {
	EXTERNAL_MATCH_WC_BET_CHIP_HEIGHT_PX,
	externalMatchWcBetChipRowSx,
	externalMatchWcBetChipRowWrapSx,
	externalMatchWcBetChipSx,
	externalMatchWcBetOutcomeIconCellSx,
	externalMatchWcCardRowSx,
	externalMatchWcKickoffDateSx,
	externalMatchWcKickoffTimeSx,
	externalMatchWcLiveMinuteSx,
	externalMatchWcLiveScoreSx,
	externalMatchWcMatchBodySx,
	externalMatchWcMatchScoreSx,
	externalMatchWcHalftimeBadgeSx,
	externalMatchWcStatusChipSx,
	externalMatchWcTeamsCenterSx,
	externalMatchWcTeamsRowSx,
} from './externalMatchWcPageStyles';
import { wc26MatchMetaSx } from '../world-cup-2026/wc26PageStyles';
import {
	resolveExternalMatchScoreView,
	hasExternalMatchScore,
} from './externalMatchScoreView';
import { translateMatchStatus, getMatchStatusChipColor, normalizeMatchStatus } from './matchStatusI18n';
import type { ExternalMatch } from './types/ExternalMatch';
import GameScore from '../bets/types/GameScore';

interface ExternalMatchWc26CardProps {
	match: ExternalMatch;
	slotId?: string;
	userBet?: Bet | null;
	clickable?: boolean;
	isLast?: boolean;
	onClick?: () => void;
	showAdminEdit?: boolean;
	adminEditButton?: React.ReactNode;
	viewBetsButton?: React.ReactNode;
}

export default function ExternalMatchWc26Card({
	match,
	slotId,
	userBet,
	clickable = false,
	isLast = false,
	onClick,
	showAdminEdit = false,
	adminEditButton,
	viewBetsButton,
}: ExternalMatchWc26CardProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const scheduled = useMemo(
		() => findWc26ScheduleMatchForExternal(match, slotId),
		[match, slotId]
	);
	const groupScheduled = scheduled?.home && scheduled?.away ? scheduled : undefined;
	const { kickoff, dateLabel, kickoffUtcMs } = useMemo(
		() => resolveExternalMatchBerlinKickoff(match, slotId, i18n.language),
		[match, slotId, i18n.language]
	);
	const gameScore: GameScore | null = match.gameScore ?? null;
	const scoreView = resolveExternalMatchScoreView({
		gameScore,
		matchStatus: match.status,
		finalized: Boolean(match.finalized),
		liveMinuteLabel: match.liveMinuteLabel,
		kickoffUtcMs,
	});
	const hasScore = hasExternalMatchScore(scoreView);
	const isLiveStacked = isWc26LiveStackedDisplay(
		match.status,
		Boolean(match.finalized),
		match.liveMinuteLabel
	);
	const isPausedLive = normalizeMatchStatus(match.status) === 'PAUSED' && isLiveStacked;
	const showLiveBadge = isLiveStacked && !isPausedLive;
	const statusLabel = match.finalized
		? t('gameResultFinalized')
		: translateMatchStatus(match.status, t);
	const statusColor = match.finalized ? 'success' : getMatchStatusChipColor(match.status);
	const homeWcTeam: Wc26TeamId | undefined =
		groupScheduled?.home ?? resolveWc26TeamIdFromCountry(match.homeTeamCountry);
	const awayWcTeam: Wc26TeamId | undefined =
		groupScheduled?.away ?? resolveWc26TeamIdFromCountry(match.awayTeamCountry);
	const hasWcTeamFlags = Boolean(homeWcTeam && awayWcTeam);
	const homeDisplayTeam = useMemo(() => matchSideToDisplayTeam(match, 'home'), [match]);
	const awayDisplayTeam = useMemo(() => matchSideToDisplayTeam(match, 'away'), [match]);
	const homeDisplayName = resolveTeamDisplayName(homeDisplayTeam, t, i18n.language);
	const awayDisplayName = resolveTeamDisplayName(awayDisplayTeam, t, i18n.language);
	const hasApiTeamNames = Boolean(homeDisplayName?.trim() && awayDisplayName?.trim());
	const interactive = clickable && Boolean(onClick);
	const betChipLabel =
		userBet?.betTitle != null && userBet.betOdds != null
			? t('wc26.oddsPick.betChip', {
					title: getFullBetTitle(userBet.betTitle),
					odds: formatPickOdds(userBet.betOdds),
				})
			: null;
	const showBetOutcomeIcon =
		hasScore &&
		userBet != null &&
		COMPLETED_BET_STATUSES.includes(userBet.betStatus);

	const betChipRow =
		betChipLabel != null ? (
			<Box sx={externalMatchWcBetChipRowSx}>
				<Box sx={externalMatchWcBetOutcomeIconCellSx}>
					{showBetOutcomeIcon ? (
						<BetStatusIcon
							betStatus={userBet!.betStatus}
							heightPx={EXTERNAL_MATCH_WC_BET_CHIP_HEIGHT_PX}
							withTooltip
						/>
					) : null}
				</Box>
				<Chip size="small" label={betChipLabel} sx={externalMatchWcBetChipSx} />
				<Box aria-hidden />
			</Box>
		) : null;

	return (
		<Box
			role={interactive ? 'button' : undefined}
			tabIndex={interactive ? 0 : undefined}
			onClick={interactive ? onClick : undefined}
			onKeyDown={
				interactive
					? (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onClick?.();
							}
						}
					: undefined
			}
			sx={externalMatchWcCardRowSx(interactive, { isLast })}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 0.1,
					gap: 0.5,
					flexShrink: 0,
				}}
			>
				<Typography variant="caption" sx={wc26MatchMetaSx}>
					{match.wc26ScheduleId
						? `#${match.wc26ScheduleId}`
						: groupScheduled?.id
							? `#${groupScheduled.id}`
							: null}
					{groupScheduled?.group
						? ` · ${t('wc26.group', { letter: groupScheduled.group })}`
						: null}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
					{showLiveBadge ? (
						<Wc26LiveBadge />
					) : isPausedLive ? (
						<Box component="span" sx={externalMatchWcHalftimeBadgeSx}>
							{statusLabel}
						</Box>
					) : (
						<Chip
							size="small"
							label={statusLabel}
							color={statusColor}
							sx={externalMatchWcStatusChipSx}
						/>
					)}
					{showAdminEdit ? adminEditButton : null}
					{viewBetsButton}
				</Box>
			</Box>

			{hasWcTeamFlags ? (
				<Box sx={externalMatchWcMatchBodySx}>
					<Box sx={externalMatchWcTeamsRowSx}>
						<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
							<Wc26TeamFlag teamId={homeWcTeam!} side="home" compact />
						</Box>

						<Box sx={externalMatchWcTeamsCenterSx}>
							{!hasScore ? (
								<Typography component="span" sx={externalMatchWcKickoffDateSx}>
									{dateLabel}
								</Typography>
							) : null}
							<Wc26MatchCenterStatus
								kickoffTime={kickoff}
								kickoffUtcMs={kickoffUtcMs}
								scoreView={scoreView}
								liveMinuteLabel={match.liveMinuteLabel}
								liveDataFetchedAt={match.fetchedAt}
								matchStatus={match.status}
								liveStacked={isLiveStacked && hasScore}
								kickoffSx={externalMatchWcKickoffTimeSx}
								liveMinuteSx={externalMatchWcLiveMinuteSx}
								liveScoreSx={externalMatchWcLiveScoreSx}
								scoreSx={externalMatchWcMatchScoreSx}
							/>
						</Box>

						<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
							<Wc26TeamFlag teamId={awayWcTeam!} side="away" compact />
						</Box>
					</Box>

					{betChipRow ? <Box sx={externalMatchWcBetChipRowWrapSx}>{betChipRow}</Box> : null}
				</Box>
			) : hasApiTeamNames ? (
				<Box sx={externalMatchWcMatchBodySx}>
					<Box sx={externalMatchWcTeamsRowSx}>
						<Box sx={{ flex: 1, textAlign: 'right', minWidth: 0, px: 0.5 }}>
							<Typography variant="body2" noWrap sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
								{homeDisplayName}
							</Typography>
						</Box>
						<Box sx={externalMatchWcTeamsCenterSx}>
							{!hasScore ? (
								<Typography component="span" sx={externalMatchWcKickoffDateSx}>
									{dateLabel}
								</Typography>
							) : null}
							<Wc26MatchCenterStatus
								kickoffTime={kickoff}
								kickoffUtcMs={kickoffUtcMs}
								scoreView={scoreView}
								liveMinuteLabel={match.liveMinuteLabel}
								liveDataFetchedAt={match.fetchedAt}
								matchStatus={match.status}
								liveStacked={isLiveStacked && hasScore}
								kickoffSx={externalMatchWcKickoffTimeSx}
								liveMinuteSx={externalMatchWcLiveMinuteSx}
								liveScoreSx={externalMatchWcLiveScoreSx}
								scoreSx={externalMatchWcMatchScoreSx}
							/>
						</Box>
						<Box sx={{ flex: 1, textAlign: 'left', minWidth: 0, px: 0.5 }}>
							<Typography variant="body2" noWrap sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
								{awayDisplayName}
							</Typography>
						</Box>
					</Box>
					{betChipRow ? <Box sx={externalMatchWcBetChipRowWrapSx}>{betChipRow}</Box> : null}
				</Box>
			) : scheduled?.labelKey ? (
				<Box sx={externalMatchWcMatchBodySx}>
					{!hasScore ? (
						<Typography component="span" sx={externalMatchWcKickoffDateSx}>
							{dateLabel}
						</Typography>
					) : null}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center' }}>
						<Wc26MatchCenterStatus
							kickoffTime={kickoff}
							kickoffUtcMs={kickoffUtcMs}
							scoreView={scoreView}
							liveMinuteLabel={match.liveMinuteLabel}
							liveDataFetchedAt={match.fetchedAt}
							matchStatus={match.status}
							liveStacked={isLiveStacked && hasScore}
							kickoffSx={externalMatchWcKickoffTimeSx}
							liveMinuteSx={externalMatchWcLiveMinuteSx}
							liveScoreSx={externalMatchWcLiveScoreSx}
							scoreSx={externalMatchWcMatchScoreSx}
						/>
						{scoreView === '—' ? (
							<Typography
								variant="body2"
								sx={{
									fontSize: '0.75rem',
									lineHeight: 1.25,
									color: (theme) =>
										theme.palette.mode === 'dark' ? '#8fd4b0' : '#0a5c38',
									fontWeight: 600,
									textAlign: 'center',
								}}
							>
								{t(scheduled.labelKey)}
							</Typography>
						) : null}
					</Box>
					{betChipRow ? <Box sx={externalMatchWcBetChipRowWrapSx}>{betChipRow}</Box> : null}
				</Box>
			) : null}
		</Box>
	);
}
