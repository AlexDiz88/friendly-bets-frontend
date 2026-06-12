import { Box, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translateMatchStatus, normalizeMatchStatus } from '../football-data/matchStatusI18n';
import Wc26TeamFlag from './Wc26TeamFlag';
import Wc26MatchCenterStatus, { isWc26LiveStackedDisplay } from './Wc26MatchCenterStatus';
import Wc26LiveBadge from './Wc26LiveBadge';
import { kickoffToGerman, venueLocalKickoffToUtcMs } from './wc26Time';
import type { Wc26Match } from './wc26Schedule';
import {
	wc26MatchMetaSx,
	wc26MatchCardRowSx,
	wc26MatchLiveMinuteSx,
	wc26LiveScoreSx,
	wc26HalftimeBadgeSx,
	wc26KickoffTimeSx,
	wc26MatchScoreSx,
} from './wc26PageStyles';
import { formatPickOdds } from '../../components/odds/formatPickOdds';
import Bet from '../bets/types/Bet';

interface Wc26MatchCardProps {
	match: Wc26Match;
	scoreView?: string;
	status?: string;
	finalized?: boolean;
	liveMinuteLabel?: string | null;
	fetchedAt?: string;
	scoresReady?: boolean;
	onClick?: () => void;
	clickable?: boolean;
	userBet?: Bet;
}

export default function Wc26MatchCard({
	match,
	scoreView,
	status = 'SCHEDULED',
	finalized = false,
	liveMinuteLabel,
	fetchedAt,
	scoresReady = true,
	onClick,
	clickable = false,
	userBet,
}: Wc26MatchCardProps): JSX.Element {
	const { t } = useTranslation();
	const german = useMemo(
		() => kickoffToGerman(match.date, match.timeLocal, match.venueKey),
		[match.date, match.timeLocal, match.venueKey]
	);
	const kickoffUtcMs = useMemo(
		() => venueLocalKickoffToUtcMs(match.date, match.timeLocal, match.venueKey),
		[match.date, match.timeLocal, match.venueKey]
	);
	const hasTeams = Boolean(match.home && match.away);
	const interactive = clickable && Boolean(onClick);
	const hasScore = Boolean(scoreView && scoreView !== '—');
	const isLiveStacked = isWc26LiveStackedDisplay(status, finalized);
	const isPausedLive = normalizeMatchStatus(status) === 'PAUSED' && isLiveStacked;
	const showLiveBadge = isLiveStacked && !isPausedLive;
	const statusLabel = finalized ? t('gameResultFinalized') : translateMatchStatus(status, t);

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
			sx={wc26MatchCardRowSx(isLiveStacked, interactive)}
		>
			{(match.group || match.id) && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 0.25,
						gap: 0.5,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
						<Typography variant="caption" sx={{ ...wc26MatchMetaSx, mb: 0 }}>
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
					{showLiveBadge ? (
						<Wc26LiveBadge />
					) : isPausedLive ? (
						<Box component="span" sx={wc26HalftimeBadgeSx}>
							{statusLabel}
						</Box>
					) : null}
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
						<Wc26MatchCenterStatus
							kickoffTime={german.time}
							kickoffUtcMs={kickoffUtcMs}
							scoreView={scoreView}
							liveMinuteLabel={liveMinuteLabel}
							liveDataFetchedAt={fetchedAt}
							matchStatus={status}
							liveStacked={isLiveStacked && hasScore}
							scoresReady={scoresReady}
							kickoffSx={wc26KickoffTimeSx}
							liveMinuteSx={wc26MatchLiveMinuteSx}
							liveScoreSx={wc26LiveScoreSx}
							scoreSx={wc26MatchScoreSx}
						/>
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
					<Wc26MatchCenterStatus
						kickoffTime={german.time}
						kickoffUtcMs={kickoffUtcMs}
						scoreView={scoreView}
						liveMinuteLabel={liveMinuteLabel}
						liveDataFetchedAt={fetchedAt}
						matchStatus={status}
						liveStacked={isLiveStacked && hasScore}
						scoresReady={scoresReady}
						kickoffSx={wc26KickoffTimeSx}
						liveMinuteSx={wc26MatchLiveMinuteSx}
						liveScoreSx={wc26LiveScoreSx}
						scoreSx={wc26MatchScoreSx}
					/>
					{!scoreView ? (
						<Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
							{t(match.labelKey ?? '')}
						</Typography>
					) : null}
				</Box>
			)}
		</Box>
	);
}
