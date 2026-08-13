import { Avatar, Box, Typography, type SxProps, type Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import LeagueAvatar, { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import { selectActiveSeasonId } from '../admin/seasons/selectors';
import { formatGameweekDateRange, formatSignedBalance } from './playerGameweekChart';
import { FORM_PILL } from './PlayerFormPills';
import {
	playerFormPillSx,
	playerHighlightCardClickableSx,
	playerHighlightCardHintSx,
	playerHighlightCardLabelSx,
	playerHighlightCardSx,
	playerHighlightCardValueSx,
	playerHighlightInlineRowSx,
	playerHighlightLeaguePairSx,
	playerHighlightLeagueSlotSx,
	playerHighlightLeagueSlotsSx,
	playerHighlightMetaSx,
	playerHighlightStreakRowSx,
	playerHighlightTeamBlockSx,
	playerHighlightTeamRowSx,
	playerHighlightTeamRowsSx,
	playerHighlightsGridSx,
} from './playerStatsChartStyles';
import { statsThemePalette } from './statsPageStyles';
import PlayerHighlight, { type HighlightTeam } from './types/PlayerHighlight';

function CardShell({
	label,
	children,
	to,
}: {
	label: string;
	children: ReactNode;
	to?: string;
}): JSX.Element {
	const body = (
		<>
			<Typography component="div" sx={playerHighlightCardLabelSx}>
				{label}
			</Typography>
			{children}
		</>
	);
	if (to) {
		return (
			<Box
				component={RouterLink}
				to={to}
				onClick={(event) => event.stopPropagation()}
				sx={[playerHighlightCardSx, playerHighlightCardClickableSx] as SxProps<Theme>}
			>
				{body}
			</Box>
		);
	}
	return <Box sx={playerHighlightCardSx}>{body}</Box>;
}

function TeamLogoName({
	team,
	language,
	color,
	height = 16,
	fontSize = '0.75rem',
}: {
	team: HighlightTeam | null | undefined;
	language: string;
	color?: string;
	height?: number;
	fontSize?: number | string;
}): JSX.Element | null {
	if (!team) {
		return null;
	}
	return (
		<Box sx={{ display: 'inline-flex', alignItems: 'center', minWidth: 0, gap: 0.3 }}>
			<Avatar
				sx={[{ height, width: height, flexShrink: 0 }, leagueLogoAvatarSx] as SxProps<Theme>}
				variant="square"
				alt=""
				src={resolveTeamLogoUrl(team)}
			/>
			<Typography
				component="span"
				sx={{
					fontSize,
					fontWeight: 600,
					lineHeight: 1.2,
					color: color,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				{resolveTeamDisplayName(team, t, language) || team.title || '—'}
			</Typography>
		</Box>
	);
}

function TeamBalanceRow({
	team,
	language,
	color,
}: {
	team: HighlightTeam;
	language: string;
	color: string;
}): JSX.Element {
	return (
		<Box sx={playerHighlightTeamRowSx}>
			<Box sx={{ minWidth: 0, flex: 1 }}>
				<TeamLogoName team={team} language={language} color={color} height={14} />
			</Box>
			<Typography
				component="span"
				sx={{
					fontSize: '0.75rem',
					fontWeight: 800,
					fontVariantNumeric: 'tabular-nums',
					color,
					flexShrink: 0,
				}}
			>
				{team.actualBalance != null ? formatSignedBalance(team.actualBalance) : ''}
			</Typography>
		</Box>
	);
}

export default function PlayerHighlightCards({
	highlight,
	seasonId,
}: {
	highlight: PlayerHighlight | undefined;
	seasonId?: string;
}): JSX.Element {
	const theme = useTheme();
	const { i18n } = useTranslation();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const p = statsThemePalette(theme);
	const language = i18n.language;
	const win = highlight?.biggestWin;
	const gw = highlight?.bestGameweek;
	const leagueTeams = highlight?.leagueTeams ?? [];
	const winStreak = highlight?.bestWinStreak ?? 0;
	const loseStreak = highlight?.worstLoseStreak ?? 0;
	const formPill = theme.palette.mode === 'dark' ? FORM_PILL.dark : FORM_PILL.light;
	const gameweekLink =
		gw?.calendarNodeId && seasonId && activeSeasonId && seasonId === activeSeasonId
			? `/gameweeks?node=${encodeURIComponent(gw.calendarNodeId)}`
			: undefined;

	return (
		<Box sx={playerHighlightsGridSx}>
			<CardShell label={t('statsChart.bestBet')}>
				<Typography
					component="div"
					sx={
						[playerHighlightCardValueSx, win ? { color: p.positive } : false] as SxProps<Theme>
					}
				>
					{win ? formatSignedBalance(win.balanceChange) : '—'}
				</Typography>
				{win?.leagueCode ? (
					<LeagueAvatar
						leagueCode={win.leagueCode}
						matchDay={win.matchDay ?? undefined}
						height={14}
						sx={{
							mr: 0,
							mt: 0.25,
							display: 'inline-flex',
							justifyContent: 'flex-start',
							fontSize: '0.66rem',
							fontWeight: 700,
						}}
					/>
				) : null}
				{win?.homeTeam || win?.awayTeam ? (
					<Box sx={playerHighlightInlineRowSx}>
						<TeamLogoName team={win?.homeTeam} language={language} />
						<Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
							–
						</Typography>
						<TeamLogoName team={win?.awayTeam} language={language} />
					</Box>
				) : null}
				{win && (win.betOdds != null || win.betSize != null) ? (
					<Box sx={playerHighlightMetaSx}>
						{win.betOdds != null ? (
							<span>
								{t('statsChart.oddsLabel')} {win.betOdds.toFixed(2)}
							</span>
						) : null}
						{win.betSize != null ? (
							<span>
								{t('statsChart.stakeLabel')} {win.betSize}
							</span>
						) : null}
					</Box>
				) : null}
			</CardShell>

			<CardShell label={t('statsChart.bestGameweek')} to={gameweekLink}>
				<Typography
					component="div"
					sx={
						[
							playerHighlightCardValueSx,
							gw ? { color: gw.balanceChange >= 0 ? p.positive : p.negative } : false,
						] as SxProps<Theme>
					}
				>
					{gw ? formatSignedBalance(gw.balanceChange) : '—'}
				</Typography>
				{gw?.startDate ? (
					<Typography component="div" sx={playerHighlightCardHintSx}>
						{formatGameweekDateRange(gw.startDate, gw.endDate ?? '')}
					</Typography>
				) : null}
				{gw?.matchdays && gw.matchdays.length > 0 ? (
					<Box sx={playerHighlightLeagueSlotsSx}>
						{gw.matchdays.map((slot) => (
							<Box
								key={`${slot.leagueCode}-${slot.matchDay ?? ''}`}
								sx={playerHighlightLeagueSlotSx}
							>
								<Avatar
									sx={[{ height: 14, width: 14 }, leagueLogoAvatarSx] as SxProps<Theme>}
									variant="square"
									alt=""
									src={pathToLogoImage(slot.leagueCode)}
								/>
								{slot.matchDay || ''}
							</Box>
						))}
					</Box>
				) : null}
			</CardShell>

			<CardShell label={t('statsChart.teams')}>
				{leagueTeams.length > 0 ? (
					<Box sx={playerHighlightTeamBlockSx}>
						{leagueTeams.map((league) => {
							const best = league.best;
							const worst = league.worst;
							const sameTeam = Boolean(best && worst && best.id === worst.id);
							const bestColor =
								best?.actualBalance != null && best.actualBalance < 0 ? p.negative : p.positive;
							const worstColor =
								worst?.actualBalance != null && worst.actualBalance < 0 ? p.negative : p.bodyText;
							return (
								<Box key={league.leagueId || league.leagueCode} sx={playerHighlightLeaguePairSx}>
									<Avatar
										sx={[{ height: 16, width: 16, flexShrink: 0 }, leagueLogoAvatarSx] as SxProps<Theme>}
										variant="square"
										alt=""
										src={pathToLogoImage(league.leagueCode)}
									/>
									<Box sx={playerHighlightTeamRowsSx}>
										{best ? (
											<TeamBalanceRow team={best} language={language} color={bestColor} />
										) : null}
										{worst && !sameTeam ? (
											<TeamBalanceRow team={worst} language={language} color={worstColor} />
										) : null}
									</Box>
								</Box>
							);
						})}
					</Box>
				) : (
					<Typography component="div" sx={playerHighlightCardValueSx}>
						—
					</Typography>
				)}
			</CardShell>

			<CardShell label={t('statsChart.streaks')}>
				{winStreak > 0 ? (
					<Box sx={playerHighlightStreakRowSx}>
						<Box sx={playerFormPillSx(formPill.WON.bg, formPill.WON.fg)}>
							{t('statsChart.formWon')}
						</Box>
						<Typography component="span" sx={{ color: p.bodyText, fontWeight: 700, fontSize: '0.78rem' }}>
							–
						</Typography>
						<Typography
							component="div"
							sx={[playerHighlightCardValueSx, { color: p.positive, whiteSpace: 'nowrap' }] as SxProps<Theme>}
						>
							{t('statsChart.streakWins', { n: winStreak })}
						</Typography>
					</Box>
				) : null}
				{loseStreak > 0 ? (
					<Box sx={playerHighlightStreakRowSx}>
						<Box sx={playerFormPillSx(formPill.LOST.bg, formPill.LOST.fg)}>
							{t('statsChart.formLost')}
						</Box>
						<Typography component="span" sx={{ color: p.bodyText, fontWeight: 700, fontSize: '0.78rem' }}>
							–
						</Typography>
						<Typography
							component="div"
							sx={[playerHighlightCardValueSx, { color: p.negative, whiteSpace: 'nowrap' }] as SxProps<Theme>}
						>
							{t('statsChart.streakLosses', { n: loseStreak })}
						</Typography>
					</Box>
				) : null}
				{winStreak <= 0 && loseStreak <= 0 ? (
					<Typography component="div" sx={playerHighlightCardValueSx}>
						—
					</Typography>
				) : null}
			</CardShell>
		</Box>
	);
}
