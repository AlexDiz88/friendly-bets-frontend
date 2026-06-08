import { Box, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26TeamFlag from './Wc26TeamFlag';
import { kickoffToGerman } from './wc26Time';
import type { Wc26Match } from './wc26Schedule';
import { wc26KickoffTimeSx, wc26MatchMetaSx, wc26MatchScoreSx } from './wc26PageStyles';
import { formatPickOdds } from '../../components/odds/formatPickOdds';
import Bet from '../bets/types/Bet';

interface Wc26MatchCardProps {
	match: Wc26Match;
	scoreView?: string;
	onClick?: () => void;
	clickable?: boolean;
	userBet?: Bet;
}

export default function Wc26MatchCard({
	match,
	scoreView,
	onClick,
	clickable = false,
	userBet,
}: Wc26MatchCardProps): JSX.Element {
	const { t } = useTranslation();
	const german = useMemo(
		() => kickoffToGerman(match.date, match.timeLocal, match.venueKey),
		[match.date, match.timeLocal, match.venueKey]
	);
	const hasTeams = Boolean(match.home && match.away);
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
				'&:hover': interactive
					? {
							bgcolor: 'action.hover',
						}
					: undefined,
			}}
		>
			{(match.group || match.id) && (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
					<Typography variant="caption" sx={wc26MatchMetaSx}>
						#{match.id}
						{match.group ? ` · ${t('wc26.group', { letter: match.group })}` : ''}
					</Typography>
					{userBet && userBet.betTitle && userBet.betOdds != null && (
						<Chip
							size="small"
							label={t('wc26.oddsPick.betChip', {
								title: userBet.betTitle.label,
								odds: formatPickOdds(userBet.betOdds),
							})}
							sx={{ height: 20, fontSize: '0.65rem' }}
						/>
					)}
				</Box>
			)}

			{hasTeams ? (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: { xs: 0.75, sm: 1.25 },
						width: '100%',
					}}
				>
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							justifyContent: 'flex-end',
							minWidth: 0,
						}}
					>
						<Wc26TeamFlag teamId={match.home!} side="home" />
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
							gap: 0.1,
						}}
					>
						<Typography component="span" sx={wc26KickoffTimeSx}>
							{german.time}
						</Typography>
						{scoreView ? (
							<Typography component="span" sx={wc26MatchScoreSx}>
								{scoreView}
							</Typography>
						) : null}
					</Box>

					<Box
						sx={{
							flex: 1,
							display: 'flex',
							justifyContent: 'flex-start',
							minWidth: 0,
						}}
					>
						<Wc26TeamFlag teamId={match.away!} side="away" />
					</Box>
				</Box>
			) : (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography component="span" sx={wc26KickoffTimeSx}>
						{german.time}
					</Typography>
					<Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
						{t(match.labelKey ?? '')}
					</Typography>
				</Box>
			)}
		</Box>
	);
}
