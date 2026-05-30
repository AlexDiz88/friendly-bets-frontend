import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TeamAvatar from '../../components/custom/avatar/TeamAvatar';
import { resolveTeamDisplayName } from '../../components/utils/teamDisplay';
import Bet from '../bets/types/Bet';
import Team from '../admin/teams/types/Team';
import { ExternalMatch } from '../football-data/types/ExternalMatch';
import { wc26KickoffTimeSx, wc26MatchMetaSx } from './wc26PageStyles';

type Props = {
	match: ExternalMatch;
	onClick?: () => void;
	clickable?: boolean;
	userBet?: Bet;
};

function toTeam(m: ExternalMatch, home: boolean): Team | null {
	const id = home ? m.homeTeamId : m.awayTeamId;
	if (!id) {
		return null;
	}
	return {
		id,
		title: (home ? m.homeTeamTitle : m.awayTeamTitle) ?? '',
		country: '',
		displayNames: home ? m.homeTeamDisplayNames ?? undefined : m.awayTeamDisplayNames ?? undefined,
		logoKey: (home ? m.homeTeamLogoKey : m.awayTeamLogoKey) ?? undefined,
	};
}

function formatKickoffBerlin(utcDate?: string): string {
	if (!utcDate) {
		return '—';
	}
	const d = new Date(utcDate);
	return d.toLocaleString('de-DE', {
		timeZone: 'Europe/Berlin',
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export default function Wc26BetMatchCard({
	match,
	onClick,
	clickable = false,
	userBet,
}: Props): JSX.Element {
	const { t, i18n } = useTranslation();
	const homeTeam = toTeam(match, true);
	const awayTeam = toTeam(match, false);
	const interactive = clickable && Boolean(onClick);
	const kickoff = formatKickoffBerlin(match.utcDate);

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
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
				<Typography variant="caption" sx={wc26MatchMetaSx}>
					{kickoff}
				</Typography>
				{userBet && userBet.betTitle && userBet.betOdds != null && (
					<Chip
						size="small"
						label={t('wc26.oddsPick.betChip', {
							title: userBet.betTitle.label,
							odds: userBet.betOdds,
						})}
						sx={{ height: 20, fontSize: '0.65rem' }}
					/>
				)}
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 1,
				}}
			>
				<Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}>
					{homeTeam ? (
						<TeamAvatar team={homeTeam} height={22} />
					) : (
						<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
							{match.homeTeamName}
						</Typography>
					)}
				</Box>
				<Typography component="span" sx={wc26KickoffTimeSx}>
					—
				</Typography>
				<Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-start' }}>
					{awayTeam ? (
						<TeamAvatar team={awayTeam} height={22} />
					) : (
						<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
							{match.awayTeamName}
						</Typography>
					)}
				</Box>
			</Box>
			{(!homeTeam || !awayTeam) && (
				<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
					{resolveTeamDisplayName(homeTeam ?? { id: '', title: match.homeTeamName, country: '' }, t, i18n.language)}
					{' — '}
					{resolveTeamDisplayName(awayTeam ?? { id: '', title: match.awayTeamName, country: '' }, t, i18n.language)}
				</Typography>
			)}
		</Box>
	);
}
