import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Wc26MatchCenterStatus from './Wc26MatchCenterStatus';
import Wc26TeamFlag from './Wc26TeamFlag';
import type { Wc26BracketMatch } from './wc26ArchiveApi';
import { bracketPlaceholderLabel, bracketScoreLabel, resolveWc26TeamId } from './wc26Display';
import { parseUtcDate } from '../../shared/utcDate';
import { wc26MatchMetaSx, wc26KickoffTimeSx } from './wc26PageStyles';

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
	match: Wc26BracketMatch;
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
						theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.18)' : 'rgba(4, 90, 55, 0.18)',
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
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'stretch', gap: 0.75 }}>
					<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.45, minWidth: 0 }}>
						{sideLabel(homeTeam, match.placeholderHome, dimHome)}
						{sideLabel(awayTeam, match.placeholderAway, dimAway)}
					</Box>
					<Box sx={{ flexShrink: 0, minWidth: '3rem', textAlign: 'center' }}>
						<Wc26MatchCenterStatus
							kickoffTime={kickoffTime}
							scoreView={scoreView}
							kickoffSx={wc26KickoffTimeSx}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
