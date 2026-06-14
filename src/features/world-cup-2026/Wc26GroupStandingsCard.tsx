import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Wc26TeamFlag from './Wc26TeamFlag';
import { formatGoalDifference, formatGoalsLine, resolveWc26TeamId } from './wc26FifaDisplay';
import type { Wc26FifaGroupTable, Wc26QualificationStatus } from './wc26FifaApi';
import { wc26GroupTableHeaderSx } from './wc26PageStyles';

const WC26_STANDINGS_STAT_COL_WIDTH = 22;
const WC26_STANDINGS_STAT_COL_WIDTH_COMPACT = 14;
const WC26_STANDINGS_GOALS_COL_WIDTH = 34;
const WC26_STANDINGS_GOALS_COL_WIDTH_COMPACT = 24;
const WC26_STANDINGS_GOAL_DIFF_COL_WIDTH = 26;
const WC26_STANDINGS_GOAL_DIFF_COL_WIDTH_COMPACT = 18;
const WC26_STANDINGS_POINTS_COL_WIDTH = 24;
const WC26_STANDINGS_POINTS_COL_WIDTH_COMPACT = 16;
const WC26_STANDINGS_RANK_COL_WIDTH = 26;
const WC26_STANDINGS_RANK_COL_WIDTH_COMPACT = 22;

function resolveRankQualificationStatus(
	status: Wc26QualificationStatus,
	rank: number
): Wc26QualificationStatus {
	if (status !== 'pending') {
		return status;
	}
	if (rank <= 2) {
		return 'direct';
	}
	if (rank === 3) {
		return 'best_third';
	}
	return 'eliminated';
}

function rankCellStyle(status: Wc26QualificationStatus, rank: number): { background?: string; color?: string } {
	switch (resolveRankQualificationStatus(status, rank)) {
		case 'direct':
			return {
				background: 'linear-gradient(180deg, #00a86b 0%, #046a3d 100%)',
				color: '#fff',
			};
		case 'best_third':
			return {
				background: 'linear-gradient(180deg, #ffd700 0%, #a67c00 100%)',
				color: '#1a1608',
			};
		case 'eliminated':
			return {
				background: 'linear-gradient(180deg, #e53935 0%, #b71c1c 100%)',
				color: '#fff',
			};
		default:
			return {};
	}
}

interface Wc26GroupStandingsCardProps {
	table: Wc26FifaGroupTable;
	title?: string;
	showSourceGroup?: boolean;
	/** Карточка в сетке «все группы» на экране ≥800px — уже колонка, шире место под название. */
	twoColumnGrid?: boolean;
}

export default function Wc26GroupStandingsCard({
	table,
	title,
	showSourceGroup = false,
	twoColumnGrid = false,
}: Wc26GroupStandingsCardProps): JSX.Element {
	const { t } = useTranslation();
	const headerTitle = title ?? t('wc26.group', { letter: table.group });
	const statColWidth = twoColumnGrid ? WC26_STANDINGS_STAT_COL_WIDTH_COMPACT : WC26_STANDINGS_STAT_COL_WIDTH;
	const goalsColWidth = twoColumnGrid ? WC26_STANDINGS_GOALS_COL_WIDTH_COMPACT : WC26_STANDINGS_GOALS_COL_WIDTH;
	const goalDiffColWidth = twoColumnGrid
		? WC26_STANDINGS_GOAL_DIFF_COL_WIDTH_COMPACT
		: WC26_STANDINGS_GOAL_DIFF_COL_WIDTH;
	const pointsColWidth = twoColumnGrid ? WC26_STANDINGS_POINTS_COL_WIDTH_COMPACT : WC26_STANDINGS_POINTS_COL_WIDTH;
	const rankColWidth = twoColumnGrid ? WC26_STANDINGS_RANK_COL_WIDTH_COMPACT : WC26_STANDINGS_RANK_COL_WIDTH;

	return (
		<Box
			sx={(theme) => ({
				border: '1px solid',
				borderColor:
					theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.18)' : 'rgba(4, 90, 55, 0.18)',
				borderRadius: 2,
				overflow: 'hidden',
				bgcolor:
					theme.palette.mode === 'dark' ? 'rgba(13, 20, 30, 0.72)' : 'rgba(255, 255, 255, 0.82)',
			})}
		>
			<Typography variant="caption" sx={wc26GroupTableHeaderSx}>
				{headerTitle}
			</Typography>

			<Box
				component="table"
				sx={{
					width: '100%',
					tableLayout: 'fixed',
					borderCollapse: 'collapse',
					fontSize: twoColumnGrid ? '0.78rem' : '0.85rem',
					'& th': {
						fontWeight: 700,
						color: 'text.secondary',
						py: 0.55,
						px: twoColumnGrid ? 0.35 : 0.5,
						borderBottom: '1px solid',
						borderColor: 'divider',
						textAlign: 'center',
						whiteSpace: 'nowrap',
					},
					'& td': {
						py: 0.55,
						px: twoColumnGrid ? 0.35 : 0.5,
						borderBottom: '1px solid',
						borderColor: 'divider',
						verticalAlign: 'middle',
					},
					'& tr:last-of-type td': { borderBottom: 'none' },
				}}
			>
				<colgroup>
					<col style={{ width: rankColWidth }} />
					<col />
					<col style={{ width: statColWidth }} />
					<col style={{ width: statColWidth }} />
					<col style={{ width: statColWidth }} />
					<col style={{ width: goalsColWidth }} />
					<col style={{ width: goalDiffColWidth }} />
					<col style={{ width: pointsColWidth }} />
				</colgroup>
				<thead>
					<tr>
						<th>#</th>
						<th style={{ textAlign: 'left' }}>{t('wc26.standings.team')}</th>
						<th>{t('wc26.standings.winsShort')}</th>
						<th>{t('wc26.standings.drawsShort')}</th>
						<th>{t('wc26.standings.lossesShort')}</th>
						<th>{t('wc26.standings.goalsShort')}</th>
						<th>{t('wc26.standings.goalDiffShort')}</th>
						<th>{t('wc26.standings.pointsShort')}</th>
					</tr>
				</thead>
				<tbody>
					{table.rows.map((row) => {
						const teamId = resolveWc26TeamId(row.fifaCode);
						const rankStyle = rankCellStyle(row.qualificationStatus, row.rank);
						return (
							<tr key={`${row.sourceGroup ?? table.group}-${row.fifaCode}`}>
								<td
									style={{
										textAlign: 'center',
										fontWeight: 700,
										...rankStyle,
									}}
								>
									{row.rank}
								</td>
								<td style={{ overflow: twoColumnGrid ? 'visible' : undefined }}>
									<Box sx={{ overflow: twoColumnGrid ? 'visible' : 'hidden' }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 0.35,
												flexWrap: 'nowrap',
											}}
										>
											{teamId ? (
												<Wc26TeamFlag
													teamId={teamId}
													side="away"
													compact
													truncate={!twoColumnGrid}
												/>
											) : (
												<Typography variant="caption" sx={{ fontWeight: 700 }} noWrap>
													{row.fifaCode}
												</Typography>
											)}
											{row.liveNow ? (
												<Chip
													size="small"
													label="LIVE"
													sx={{
														height: 16,
														fontSize: '0.55rem',
														fontWeight: 800,
														bgcolor: '#e53935',
														color: '#fff',
														flexShrink: 0,
														'& .MuiChip-label': { px: 0.5 },
													}}
												/>
											) : null}
										</Box>
										{showSourceGroup && row.sourceGroup ? (
											<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
												{t('wc26.group', { letter: row.sourceGroup })}
											</Typography>
										) : null}
									</Box>
								</td>
								<td style={{ textAlign: 'center' }}>{row.wins}</td>
								<td style={{ textAlign: 'center' }}>{row.draws}</td>
								<td style={{ textAlign: 'center' }}>{row.losses}</td>
								<td style={{ textAlign: 'center' }}>
									{formatGoalsLine(row.goalsFor, row.goalsAgainst)}
								</td>
								<td style={{ textAlign: 'center' }}>
									{formatGoalDifference(row.goalDifference)}
								</td>
								<td style={{ textAlign: 'center', fontWeight: 800 }}>{row.points}</td>
							</tr>
						);
					})}
				</tbody>
			</Box>
		</Box>
	);
}
