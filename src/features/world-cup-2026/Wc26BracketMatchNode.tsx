import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Wc26LiveBadge from './Wc26LiveBadge';
import Wc26MatchCenterStatus, { isWc26LiveStackedDisplay } from './Wc26MatchCenterStatus';
import Wc26TeamFlag from './Wc26TeamFlag';
import type { Wc26FifaBracketMatch } from './wc26FifaApi';
import {
	bracketPlaceholderLabel,
	bracketScoreLabel,
	resolveWc26TeamId,
} from './wc26FifaDisplay';
import { parseUtcDate } from '../../shared/utcDate';
import { wc26MatchMetaSx, wc26MatchLiveMinuteSx, wc26LiveScoreSx, wc26KickoffTimeSx } from './wc26PageStyles';
import { normalizeMatchStatus } from '../football-data/matchStatusI18n';

function translatePlaceholder(code: string, t: TFunction): string {
	const trimmed = code.trim();
	const groupPlace = /^([123])([A-L])$/i.exec(trimmed);
	if (groupPlace) {
		return t('wc26.bracket.groupPlace', {
			place: Number(groupPlace[1]),
			group: groupPlace[2].toUpperCase(),
		});
	}
	const winner = /^W(\d+)$/i.exec(trimmed);
	if (winner) {
		return t('wc26.bracket.winnerOf', { match: Number(winner[1]) });
	}
	const runnerUp = /^RU(\d+)$/i.exec(trimmed);
	if (runnerUp) {
		return t('wc26.bracket.runnerUpOf', { match: Number(runnerUp[1]) });
	}
	return bracketPlaceholderLabel(trimmed) ?? trimmed;
}

interface Wc26BracketMatchNodeProps {
	match: Wc26FifaBracketMatch;
	showConnector?: boolean;
}

export default function Wc26BracketMatchNode({
	match,
	showConnector = false,
}: Wc26BracketMatchNodeProps): JSX.Element {
	const { t } = useTranslation();
	const homeTeam = resolveWc26TeamId(match.homeFifaCode);
	const awayTeam = resolveWc26TeamId(match.awayFifaCode);
	const scoreView = bracketScoreLabel(
		match.homeScore,
		match.awayScore,
		match.homePenaltyScore,
		match.awayPenaltyScore
	);
	const status = match.status ?? 'SCHEDULED';
	const finalized = status === 'FINISHED';
	const isLiveStacked = isWc26LiveStackedDisplay(status, finalized);
	const isPausedLive = normalizeMatchStatus(status) === 'PAUSED' && isLiveStacked;
	const showLiveBadge = isLiveStacked && !isPausedLive;
	const kickoffUtcMs = parseUtcDate(match.utcDate)?.getTime() ?? 0;
	const kickoffTime = useMemo(() => {
		const date = parseUtcDate(match.utcDate);
		if (!date) {
			return '—';
		}
		return new Intl.DateTimeFormat('de-DE', {
			timeZone: 'Europe/Berlin',
			hour: '2-digit',
			minute: '2-digit',
			hourCycle: 'h23',
		}).format(date);
	}, [match.utcDate]);
	const winnerHome =
		Boolean(match.winnerFifaCode && match.homeFifaCode && match.winnerFifaCode === match.homeFifaCode);
	const winnerAway =
		Boolean(match.winnerFifaCode && match.awayFifaCode && match.winnerFifaCode === match.awayFifaCode);
	const dimHome = Boolean(match.winnerFifaCode && match.homeFifaCode && !winnerHome);
	const dimAway = Boolean(match.winnerFifaCode && match.awayFifaCode && !winnerAway);

	const sideLabel = (teamId: typeof homeTeam, placeholder?: string | null, dimmed?: boolean): JSX.Element => {
		if (teamId) {
			return (
				<Box sx={{ opacity: dimmed ? 0.45 : 1 }}>
					<Wc26TeamFlag teamId={teamId} side="home" compact />
				</Box>
			);
		}
		return (
			<Typography
				variant="caption"
				sx={{
					fontWeight: 600,
					fontSize: '0.72rem',
					opacity: dimmed ? 0.45 : 0.85,
					lineHeight: 1.25,
				}}
			>
				{placeholder ? translatePlaceholder(placeholder, t) : '—'}
			</Typography>
		);
	};

	return (
		<Box sx={{ position: 'relative' }}>
			{showConnector ? (
				<Box
					sx={{
						position: 'absolute',
						top: -10,
						left: '50%',
						width: 2,
						height: 10,
						transform: 'translateX(-50%)',
						background: 'linear-gradient(180deg, rgba(255,214,0,0.5), rgba(0,168,107,0.65))',
					}}
				/>
			) : null}
			<Box
				sx={(theme) => ({
					border: '1px solid',
					borderColor:
						showLiveBadge
							? theme.palette.mode === 'dark'
								? 'rgba(255, 80, 80, 0.45)'
								: 'rgba(229, 57, 53, 0.35)'
							: theme.palette.mode === 'dark'
								? 'rgba(255, 214, 0, 0.18)'
								: 'rgba(4, 90, 55, 0.18)',
					borderRadius: 2,
					px: 1,
					py: 0.75,
					bgcolor:
						theme.palette.mode === 'dark' ? 'rgba(13, 20, 30, 0.72)' : 'rgba(255, 255, 255, 0.82)',
				})}
			>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
					<Typography variant="caption" sx={{ ...wc26MatchMetaSx, mb: 0 }}>
						#{match.matchNumber}
					</Typography>
					{showLiveBadge ? <Wc26LiveBadge /> : null}
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0.75 }}>
					<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.45, minWidth: 0 }}>
						{sideLabel(homeTeam, match.placeholderHome, dimHome)}
						{sideLabel(awayTeam, match.placeholderAway, dimAway)}
					</Box>
					<Box sx={{ flexShrink: 0, minWidth: '3rem', textAlign: 'center' }}>
						<Wc26MatchCenterStatus
							kickoffTime={kickoffTime}
							kickoffUtcMs={kickoffUtcMs}
							scoreView={scoreView}
							liveMinuteLabel={match.liveMinuteLabel}
							liveDataFetchedAt={match.utcDate}
							matchStatus={status}
							liveStacked={isLiveStacked && Boolean(scoreView)}
							scoresReady
							kickoffSx={wc26KickoffTimeSx}
							liveMinuteSx={wc26MatchLiveMinuteSx}
							liveScoreSx={wc26LiveScoreSx}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
