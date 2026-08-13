import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Avatar, Box, Collapse, Typography, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import { formatLeagueBalance } from './leaguePlayerStats';
import {
	leaderboardBalanceSx,
	leaderboardCardSx,
	leaderboardChipLabelSx,
	leaderboardChipSx,
	leaderboardChipValueSx,
	leaderboardChipsGridSx,
	leaderboardListSx,
	leaderboardMetaSx,
	leaderboardNameSx,
	leaderboardRankSx,
	leaderboardRowSx,
	leaguesBalanceColorSx,
	leaderboardExpandIconSx,
} from './leaguesStatsPageStyles';
import { STATS_COLLAPSE_MS } from './StatsTableIdentityCell';
import PlayerStats from './types/PlayerStats';

function LeaderboardCard({
	pStats,
	place,
	accent,
}: {
	pStats: PlayerStats;
	place: number;
	accent: string;
}): JSX.Element {
	const [open, setOpen] = useState(false);
	const toggleOpen = (): void => setOpen((prev) => !prev);

	const chips = [
		{ label: t('totalBetsCount'), value: String(pStats.totalBets) },
		{ label: t('betsWonCount'), value: String(pStats.wonBetCount) },
		{ label: t('betsReturnedCount'), value: String(pStats.returnedBetCount) },
		{ label: t('betsLostCount'), value: String(pStats.lostBetCount) },
		{ label: t('emptyBetsCount'), value: String(pStats.emptyBetCount) },
		{ label: t('winPercentage'), value: `${pStats.winRate.toFixed(1)}%` },
		{ label: t('averageCoef'), value: pStats.averageOdds.toFixed(2) },
		{ label: t('averageWinCoef'), value: pStats.averageWonBetOdds.toFixed(2) },
	];

	return (
		<Box
			role="button"
			tabIndex={0}
			aria-expanded={open}
			aria-label={t('expandRow')}
			onClick={toggleOpen}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					toggleOpen();
				}
			}}
			sx={leaderboardCardSx(open, accent)}
		>
			<Box sx={leaderboardRowSx}>
				<Box sx={leaderboardRankSx(place)}>{place}</Box>
				<Avatar
					alt={pStats.username}
					src={avatarBase64Converter(pStats.avatar)}
					sx={{ width: 36, height: 36, flexShrink: 0 }}
				/>
				<Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
					<Typography sx={leaderboardNameSx}>{pStats.username}</Typography>
					<Typography sx={leaderboardMetaSx}>
						{pStats.betCount} ({pStats.totalBets}) · {pStats.winRate.toFixed(0)}%
					</Typography>
				</Box>
				<Box
					sx={
						[leaderboardBalanceSx, leaguesBalanceColorSx(pStats.actualBalance)] as SxProps<Theme>
					}
				>
					{formatLeagueBalance(pStats.actualBalance)}€
				</Box>
				<KeyboardArrowDownIcon sx={leaderboardExpandIconSx(open)} />
			</Box>
			<Collapse in={open} timeout={STATS_COLLAPSE_MS} unmountOnExit>
				<Box sx={leaderboardChipsGridSx}>
					{chips.map((chip) => (
						<Box key={chip.label} sx={leaderboardChipSx}>
							<Typography sx={leaderboardChipLabelSx}>{chip.label}</Typography>
							<Typography sx={leaderboardChipValueSx}>{chip.value}</Typography>
						</Box>
					))}
				</Box>
			</Collapse>
		</Box>
	);
}

export default function LeaguesStatsLeaderboard({
	playersStats,
	accent,
}: {
	playersStats: PlayerStats[];
	accent: string;
}): JSX.Element {
	return (
		<Box sx={leaderboardListSx}>
			{playersStats.map((pStats, index) => (
				<LeaderboardCard
					key={pStats.userId || pStats.username}
					pStats={pStats}
					place={index + 1}
					accent={accent}
				/>
			))}
		</Box>
	);
}
