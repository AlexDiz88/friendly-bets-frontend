import { Box, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26TeamFlag from '../world-cup-2026/Wc26TeamFlag';
import {
	findWc26ScheduleMatchForExternal,
	utcToBerlinKickoff,
} from '../world-cup-2026/wc26BetSlots';
import {
	wc26KickoffTimeSx,
	wc26MatchMetaSx,
} from '../world-cup-2026/wc26PageStyles';
import { getExternalMatchScoreView } from './externalMatchScoreView';
import { translateMatchStatus, getMatchStatusChipColor } from './matchStatusI18n';
import type { ExternalMatch } from './types/ExternalMatch';
import GameScore from '../bets/types/GameScore';

interface ExternalMatchWc26CardProps {
	match: ExternalMatch;
	slotId: string;
	clickable?: boolean;
	onClick?: () => void;
	showAdminEdit?: boolean;
	adminEditButton?: React.ReactNode;
}

export default function ExternalMatchWc26Card({
	match,
	slotId,
	clickable = false,
	onClick,
	showAdminEdit = false,
	adminEditButton,
}: ExternalMatchWc26CardProps): JSX.Element {
	const { t } = useTranslation();
	const scheduled = useMemo(
		() => findWc26ScheduleMatchForExternal(match, slotId),
		[match, slotId]
	);
	const kickoff = utcToBerlinKickoff(match.utcDate);
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
			sx={{
				py: 0.75,
				px: 0.5,
				borderRadius: 1,
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
							height: 18,
							fontSize: '0.58rem',
							'& .MuiChip-label': { px: 0.5, py: 0 },
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
						gap: { xs: 0.75, sm: 1.25 },
						width: '100%',
					}}
				>
					<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', minWidth: 0 }}>
						<Wc26TeamFlag teamId={scheduled!.home!} side="home" />
					</Box>

					<Box sx={{ textAlign: 'center', flexShrink: 0, px: 0.25 }}>
						<Typography component="span" sx={wc26KickoffTimeSx}>
							{kickoff}
						</Typography>
						{scoreView !== '—' ? (
							<Typography
								variant="caption"
								sx={{
									display: 'block',
									fontWeight: 700,
									fontSize: '0.75rem',
									lineHeight: 1.2,
									mt: 0.15,
								}}
							>
								{scoreView}
							</Typography>
						) : null}
					</Box>

					<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
						<Wc26TeamFlag teamId={scheduled!.away!} side="away" />
					</Box>
				</Box>
			) : null}
		</Box>
	);
}
