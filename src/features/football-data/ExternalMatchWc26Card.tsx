import { Box, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPLETED_BET_STATUSES } from '../../constants';
import BetStatusIcon from '../bets/BetStatusIcon';
import Wc26MatchCenterStatus from '../world-cup-2026/Wc26MatchCenterStatus';
import Wc26TeamFlag from '../world-cup-2026/Wc26TeamFlag';
import {
	findWc26ScheduleMatchForExternal,
	utcToBerlinKickoff,
} from '../world-cup-2026/wc26BetSlots';
import {
	formatBerlinDateFromIsoDate,
	formatBerlinDateFromUtc,
	kickoffToGerman,
	venueLocalKickoffToUtcMs,
} from '../world-cup-2026/wc26Time';
import { parseUtcDate } from '../../shared/utcDate';
import { getFullBetTitle } from '../../components/utils/stringTransform';
import { formatPickOdds } from '../../components/odds/formatPickOdds';
import type Bet from '../bets/types/Bet';
import {
	EXTERNAL_MATCH_WC_BET_CHIP_HEIGHT_PX,
	externalMatchWcBetChipRowSx,
	externalMatchWcBetChipSx,
	externalMatchWcBetOutcomeIconCellSx,
	externalMatchWcCardRowSx,
	externalMatchWcKickoffDateSx,
	externalMatchWcKickoffTimeSx,
	externalMatchWcLiveMinuteSx,
} from './externalMatchWcPageStyles';
import { wc26MatchMetaSx } from '../world-cup-2026/wc26PageStyles';
import { getExternalMatchScoreView } from './externalMatchScoreView';
import { translateMatchStatus, getMatchStatusChipColor } from './matchStatusI18n';
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
}: ExternalMatchWc26CardProps): JSX.Element {
	const { t, i18n } = useTranslation();
	const scheduled = useMemo(
		() => findWc26ScheduleMatchForExternal(match, slotId),
		[match, slotId]
	);
	const { kickoff, dateLabel } = useMemo(() => {
		if (scheduled) {
			const german = kickoffToGerman(scheduled.date, scheduled.timeLocal, scheduled.venueKey);
			return {
				kickoff: german.time,
				dateLabel: formatBerlinDateFromIsoDate(german.date, i18n.language),
			};
		}
		return {
			kickoff: utcToBerlinKickoff(match.utcDate),
			dateLabel: formatBerlinDateFromUtc(match.utcDate, i18n.language),
		};
	}, [scheduled, match.utcDate, i18n.language]);
	const kickoffUtcMs = useMemo(() => {
		if (scheduled) {
			return venueLocalKickoffToUtcMs(scheduled.date, scheduled.timeLocal, scheduled.venueKey);
		}
		return parseUtcDate(match.utcDate)?.getTime() ?? 0;
	}, [scheduled, match.utcDate]);
	const gameScore: GameScore | null = match.gameScore ?? null;
	const scoreView = getExternalMatchScoreView(
		gameScore,
		match.status,
		Boolean(match.finalized)
	);
	const hasScore = Boolean(scoreView && scoreView !== '—');
	const statusLabel = match.finalized
		? t('gameResultFinalized')
		: translateMatchStatus(match.status, t);
	const statusColor = match.finalized ? 'success' : getMatchStatusChipColor(match.status);
	const hasTeams = Boolean(scheduled?.home && scheduled?.away);
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

	const betChipRowMt = hasScore ? 0.5 : '2px';

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
					{scheduled?.id ? `#${scheduled.id}` : null}
					{scheduled?.group ? ` · ${t('wc26.group', { letter: scheduled.group })}` : null}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
					<Chip
						size="small"
						label={statusLabel}
						color={statusColor}
						sx={{
							height: 15,
							fontSize: '0.52rem',
							'& .MuiChip-label': { px: 0.45, py: 0 },
						}}
					/>
					{showAdminEdit ? adminEditButton : null}
				</Box>
			</Box>

			{hasTeams ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.1,
						width: '100%',
						flex: 1,
						minHeight: 0,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: { xs: 0.35, sm: 0.6 },
							width: '100%',
						}}
					>
						<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
							<Wc26TeamFlag teamId={scheduled!.home!} side="home" compact />
						</Box>

						<Box
							sx={{
								textAlign: 'center',
								flexShrink: 0,
								px: 0.2,
								minWidth: '3.25rem',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 0.05,
							}}
						>
							{!hasScore ? (
								<Typography component="span" sx={externalMatchWcKickoffDateSx}>
									{dateLabel}
								</Typography>
							) : null}
							<Wc26MatchCenterStatus
								kickoffTime={kickoff}
								kickoffUtcMs={kickoffUtcMs}
								scoreView={scoreView}
								kickoffSx={externalMatchWcKickoffTimeSx}
								liveMinuteSx={externalMatchWcLiveMinuteSx}
							/>
						</Box>

						<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
							<Wc26TeamFlag teamId={scheduled!.away!} side="away" compact />
						</Box>
					</Box>

					{betChipRow ? <Box sx={{ mt: betChipRowMt }}>{betChipRow}</Box> : null}
				</Box>
			) : scheduled?.labelKey ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.1,
						flex: 1,
						minHeight: 0,
					}}
				>
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
							kickoffSx={externalMatchWcKickoffTimeSx}
							liveMinuteSx={externalMatchWcLiveMinuteSx}
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
					{betChipRow ? <Box sx={{ mt: betChipRowMt }}>{betChipRow}</Box> : null}
				</Box>
			) : null}
		</Box>
	);
}
