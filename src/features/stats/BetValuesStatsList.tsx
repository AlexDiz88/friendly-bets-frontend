import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Avatar, Box, Collapse, Typography, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { memo, useMemo, useState } from 'react';
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import SimpleUser from '../auth/types/SimpleUser';
import {
	betValueRangeAccent,
	orderedRangeStats,
	summarizeRangeStats,
} from './betValueRanges';
import {
	betValuesBalanceSx,
	betValuesDetailsSx,
	betValuesDistributionSegmentSx,
	betValuesDistributionSx,
	betValuesExpandIconSx,
	betValuesPlayerCardSx,
	betValuesPlayerMetaSx,
	betValuesPlayerNameSx,
	betValuesPlayerRowSx,
	betValuesPlayerToggleSx,
	betValuesRangeHeadSx,
	betValuesRangeIntervalSx,
	betValuesRangeMetaSx,
	betValuesRangeRowSx,
	betValuesRangeTitleSx,
	betValuesWinRateFillSx,
	betValuesWinRateTrackSx,
	betValuesWrlSx,
	betValuesWrlValueSx,
} from './betValuesStatsPageStyles';
import { STATS_COLLAPSE_MS } from './StatsTableIdentityCell';
import {
	type BetValueRangeStats,
	type PlayerStatsByBetValues,
} from './types/PlayerStatsByBetValues';

function formatBalance(value: number): string {
	const sign = value > 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}€`;
}

const RangeRow = memo(function RangeRow({ stats }: { stats: BetValueRangeStats }): JSX.Element {
	const empty = stats.betCount === 0;
	const accent = betValueRangeAccent(stats.range);

	return (
		<Box sx={betValuesRangeRowSx(empty)}>
			<Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1 }}>
				<Box
					sx={{
						width: 4,
						borderRadius: 99,
						bgcolor: accent,
						flexShrink: 0,
					}}
				/>
				<Box sx={{ minWidth: 0, flex: 1 }}>
					<Box sx={betValuesRangeHeadSx}>
						<Typography sx={betValuesRangeTitleSx}>
							{t(`betValueRange.${stats.range}`)}
						</Typography>
						<Typography sx={betValuesRangeIntervalSx}>
							{t(`betValueRangeInterval.${stats.range}`)}
						</Typography>
					</Box>
					<Box sx={betValuesRangeMetaSx}>
						<Box sx={betValuesWrlSx}>
							<Box component="span" sx={betValuesWrlValueSx('won')}>
								{stats.wonBetCount}
							</Box>
							<Box component="span">/</Box>
							<Box component="span" sx={betValuesWrlValueSx('returned')}>
								{stats.returnedBetCount}
							</Box>
							<Box component="span">/</Box>
							<Box component="span" sx={betValuesWrlValueSx('lost')}>
								{stats.lostBetCount}
							</Box>
							<Box component="span">· {stats.betCount}</Box>
							<Box component="span">
								·{' '}
								<Box component="span" sx={betValuesWrlValueSx('winRate')}>
									{empty ? '—' : `${stats.winRate.toFixed(0)}%`}
								</Box>
							</Box>
							<Box component="span">
								· {empty ? '—' : stats.averageOdds.toFixed(2)}
							</Box>
						</Box>
						<Typography sx={betValuesBalanceSx(stats.actualBalance)}>
							{empty ? '—' : formatBalance(stats.actualBalance)}
						</Typography>
					</Box>
					<Box sx={betValuesWinRateTrackSx}>
						<Box sx={betValuesWinRateFillSx(empty ? 0 : stats.winRate)} />
					</Box>
				</Box>
			</Box>
		</Box>
	);
});

const PlayerCard = memo(function PlayerCard({
	playerStats,
	player,
}: {
	playerStats: PlayerStatsByBetValues;
	player: SimpleUser;
}): JSX.Element {
	const [open, setOpen] = useState(false);
	const ranges = useMemo(
		() => orderedRangeStats(playerStats.rangeStats),
		[playerStats.rangeStats]
	);
	const summary = useMemo(() => summarizeRangeStats(ranges), [ranges]);
	const totalBets = Math.max(summary.betCount, 1);

	const toggleOpen = (): void => setOpen((prev) => !prev);

	return (
		<Box sx={betValuesPlayerCardSx(open)}>
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
				sx={betValuesPlayerToggleSx}
			>
				<Box sx={betValuesPlayerRowSx}>
					<Avatar
						alt={player.username}
						src={avatarBase64Converter(player.avatar)}
						sx={{ width: 36, height: 36, flexShrink: 0 }}
					/>
					<Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
						<Typography sx={betValuesPlayerNameSx}>{player.username}</Typography>
						<Typography sx={betValuesPlayerMetaSx}>
							{summary.betCount} · {summary.winRate.toFixed(0)}%
						</Typography>
					</Box>
					<Typography sx={betValuesBalanceSx(summary.actualBalance)}>
						{formatBalance(summary.actualBalance)}
					</Typography>
					<KeyboardArrowDownIcon
						sx={
							[
								betValuesExpandIconSx,
								{
									transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
									transition: 'transform 0.2s ease',
								},
							] as SxProps<Theme>
						}
					/>
				</Box>
				<Box sx={betValuesDistributionSx} aria-hidden>
					{ranges.map((stats) => (
						<Box
							key={stats.range}
							sx={betValuesDistributionSegmentSx(
								betValueRangeAccent(stats.range),
								stats.betCount / totalBets,
								stats.betCount === 0
							)}
						/>
					))}
				</Box>
			</Box>
			<Collapse in={open} timeout={STATS_COLLAPSE_MS} unmountOnExit>
				<Box sx={betValuesDetailsSx}>
					{ranges.map((stats) => (
						<RangeRow key={stats.range} stats={stats} />
					))}
				</Box>
			</Collapse>
		</Box>
	);
});

interface Props {
	playersStatsByBetValues: PlayerStatsByBetValues[];
	players: SimpleUser[];
}

export default function BetValuesStatsList({
	playersStatsByBetValues,
	players,
}: Props): JSX.Element {
	const playersById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);

	const sortedRows = useMemo(
		() =>
			playersStatsByBetValues
				.filter((playerStats) => playerStats.betCount > 0)
				.slice()
				.sort(
					(a, b) =>
						b.actualBalance - a.actualBalance ||
						(playersById.get(a.userId)?.username ?? '').localeCompare(
							playersById.get(b.userId)?.username ?? ''
						)
				)
				.flatMap((playerStats) => {
					const player = playersById.get(playerStats.userId);
					if (!player) {
						return [];
					}
					return [{ playerStats, player }];
				}),
		[playersStatsByBetValues, playersById]
	);

	return (
		<Box>
			{sortedRows.map(({ playerStats, player }) => (
				<PlayerCard
					key={playerStats.userId}
					playerStats={playerStats}
					player={player}
				/>
			))}
		</Box>
	);
}
