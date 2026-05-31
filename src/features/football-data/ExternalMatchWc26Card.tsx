import { Box, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26TeamFlag from '../world-cup-2026/Wc26TeamFlag';
import {
	findWc26ScheduleMatchForExternal,
	utcToBerlinKickoff,
} from '../world-cup-2026/wc26BetSlots';
import {
	formatBerlinDateFromIsoDate,
	formatBerlinDateFromUtc,
	kickoffToGerman,
} from '../world-cup-2026/wc26Time';
import type Bet from '../bets/types/Bet';
import {
	externalMatchWcBetChipSx,
	externalMatchWcCardRowSx,
	externalMatchWcKickoffDateSx,
} from './externalMatchWcPageStyles';
import { wc26KickoffTimeSx, wc26MatchMetaSx } from '../world-cup-2026/wc26PageStyles';
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
	const kickoff = utcToBerlinKickoff(match.utcDate);
	const dateLabel = useMemo(() => {
		if (scheduled) {
			const german = kickoffToGerman(scheduled.date, scheduled.timeLocal, scheduled.venueKey);
			return formatBerlinDateFromIsoDate(german.date, i18n.language);
		}
		return formatBerlinDateFromUtc(match.utcDate, i18n.language);
	}, [scheduled, match.utcDate, i18n.language]);
	const gameScore: GameScore | null = match.gameScore ?? null;
	const scoreView = getExternalMatchScoreView(
		gameScore,
		match.status,
		Boolean(match.finalized)
	);
	const statusLabel = match.finalized
		? t('gameResultFinalized')
		: translateMatchStatus(match.status, t);
	const statusColor = match.finalized ? 'success' : getMatchStatusChipColor(match.status);
	const hasTeams = Boolean(scheduled?.home && scheduled?.away);
	const interactive = clickable && Boolean(onClick);
	const betChipLabel =
		userBet?.betTitle?.label != null && userBet.betOdds != null
			? t('wc26.oddsPick.betChip', {
					title: userBet.betTitle.label,
					odds: userBet.betOdds,
				})
			: null;

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
					mb: 0.2,
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
							height: 17,
							fontSize: '0.55rem',
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
						alignItems: 'center',
						gap: { xs: 0.5, sm: 0.75 },
						width: '100%',
						flex: 1,
						minHeight: 0,
					}}
				>
					<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
						<Wc26TeamFlag teamId={scheduled!.home!} side="home" />
					</Box>

					<Box
						sx={{
							textAlign: 'center',
							flexShrink: 0,
							px: 0.2,
							minWidth: '3.75rem',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 0.1,
						}}
					>
						<Typography component="span" sx={externalMatchWcKickoffDateSx}>
							{dateLabel}
						</Typography>
						<Typography component="span" sx={wc26KickoffTimeSx}>
							{kickoff}
						</Typography>
						{scoreView !== '—' ? (
							<Typography
								variant="caption"
								sx={{
									fontWeight: 800,
									fontSize: '0.8rem',
									lineHeight: 1.1,
									color: (theme) =>
										theme.palette.mode === 'dark' ? '#ffe566' : '#6b5200',
								}}
							>
								{scoreView}
							</Typography>
						) : null}
						{betChipLabel ? (
							<Chip size="small" label={betChipLabel} sx={externalMatchWcBetChipSx} />
						) : null}
					</Box>

					<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
						<Wc26TeamFlag teamId={scheduled!.away!} side="away" />
					</Box>
				</Box>
			) : scheduled?.labelKey ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.15,
						flex: 1,
						minHeight: 0,
					}}
				>
					<Typography component="span" sx={externalMatchWcKickoffDateSx}>
						{dateLabel}
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center' }}>
						<Typography component="span" sx={wc26KickoffTimeSx}>
							{kickoff}
						</Typography>
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
						{scoreView !== '—' ? (
							<Typography
								variant="caption"
								sx={{
									fontWeight: 700,
									fontSize: '0.75rem',
									color: (theme) =>
										theme.palette.mode === 'dark' ? '#ffe566' : '#6b5200',
								}}
							>
								{scoreView}
							</Typography>
						) : null}
					</Box>
					{betChipLabel ? (
						<Chip size="small" label={betChipLabel} sx={externalMatchWcBetChipSx} />
					) : null}
				</Box>
			) : null}
		</Box>
	);
}
