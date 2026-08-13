import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { resolveTeamDisplayName } from '../../components/utils/teamDisplay';
import { formatGameweekDateRange, formatSignedBalance } from './playerGameweekChart';
import {
	playerHighlightCardHintSx,
	playerHighlightCardLabelSx,
	playerHighlightCardSx,
	playerHighlightCardValueSx,
	playerHighlightsGridSx,
} from './playerStatsChartStyles';
import { statsThemePalette } from './statsPageStyles';
import PlayerHighlight, { type HighlightTeam } from './types/PlayerHighlight';

function Card({
	label,
	value,
	hint,
	valueColor,
}: {
	label: string;
	value: string;
	hint?: string;
	valueColor?: string;
}): JSX.Element {
	return (
		<Box sx={playerHighlightCardSx}>
			<Typography component="div" sx={playerHighlightCardLabelSx}>
				{label}
			</Typography>
			<Typography
				component="div"
				sx={
					[playerHighlightCardValueSx, valueColor ? { color: valueColor } : false] as SxProps<Theme>
				}
			>
				{value}
			</Typography>
			{hint ? (
				<Typography component="div" sx={playerHighlightCardHintSx}>
					{hint}
				</Typography>
			) : null}
		</Box>
	);
}

function teamLabel(team: HighlightTeam | null | undefined, language: string): string {
	if (!team) {
		return '—';
	}
	return resolveTeamDisplayName(team, t, language) || team.title || '—';
}

export default function PlayerHighlightCards({
	highlight,
}: {
	highlight: PlayerHighlight | undefined;
}): JSX.Element {
	const theme = useTheme();
	const { i18n } = useTranslation();
	const p = statsThemePalette(theme);
	const win = highlight?.biggestWin;
	const gw = highlight?.bestGameweek;
	const bestTeam = highlight?.mostProfitableTeam;
	const worstTeam = highlight?.mostUnprofitableTeam;
	const language = i18n.language;
	const sameTeam = Boolean(bestTeam && worstTeam && bestTeam.id === worstTeam.id);
	const bestTeamValue = bestTeam
		? `${teamLabel(bestTeam, language)} ${formatSignedBalance(bestTeam.actualBalance ?? 0)}`
		: '—';
	const worstHint =
		worstTeam && !sameTeam
			? `${t('statsChart.worstTeam')}: ${teamLabel(worstTeam, language)} ${formatSignedBalance(worstTeam.actualBalance ?? 0)}`
			: undefined;
	const matchHint =
		win?.homeTeam || win?.awayTeam
			? `${teamLabel(win?.homeTeam, language)} – ${teamLabel(win?.awayTeam, language)}`
			: undefined;
	const oddsHint = win?.betOdds != null ? `${win.betOdds.toFixed(2)}` : undefined;

	return (
		<Box sx={playerHighlightsGridSx}>
			<Card
				label={t('statsChart.biggestWin')}
				value={win ? formatSignedBalance(win.balanceChange) : '—'}
				hint={[matchHint, oddsHint].filter(Boolean).join(' · ') || undefined}
				valueColor={win ? p.positive : undefined}
			/>
			<Card
				label={t('statsChart.bestStreak')}
				value={
					highlight && highlight.bestWinStreak > 0
						? t('statsChart.streakWins', { n: highlight.bestWinStreak })
						: '—'
				}
			/>
			<Card
				label={t('statsChart.bestGameweek')}
				value={gw ? formatSignedBalance(gw.balanceChange) : '—'}
				hint={
					gw?.startDate
						? formatGameweekDateRange(gw.startDate, gw.endDate ?? '')
						: undefined
				}
				valueColor={gw ? (gw.balanceChange >= 0 ? p.positive : p.negative) : undefined}
			/>
			<Card
				label={t('statsChart.teamsPnl')}
				value={bestTeamValue}
				hint={worstHint}
				valueColor={
					bestTeam?.actualBalance != null
						? bestTeam.actualBalance >= 0
							? p.positive
							: p.negative
						: undefined
				}
			/>
		</Box>
	);
}
