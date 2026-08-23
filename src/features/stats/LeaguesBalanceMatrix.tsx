import {
	Avatar,
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	type SxProps,
	type Theme,
} from '@mui/material';
import { t } from 'i18next';
import { useMemo } from 'react';
import { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import { avatarBase64Converter, pathToLogoImage } from '../../components/utils/imgBase64Converter';
import SimpleUser from '../auth/types/SimpleUser';
import {
	findLeagueStats,
	formatLeagueBalance,
	mergePlayersWithLeagueStats,
} from './leaguePlayerStats';
import {
	leagueAccent,
	leaguesBalanceColorSx,
	leaguesMatrixBodyCellSx,
	leaguesMatrixHeadCellSx,
	leaguesMatrixPlayerNameSx,
	leaguesMatrixRowSx,
	leaguesMatrixScrollSx,
	leaguesMatrixStickyCellSx,
	leaguesMatrixStickyHeadSx,
	leaguesMatrixTableSx,
	leaguesStatsSectionSx,
	leaguesStatsSectionTitleSx,
} from './leaguesStatsPageStyles';
import LeagueStats from './types/LeagueStats';

export default function LeaguesBalanceMatrix({
	leagues,
	players,
	statsByLeagues,
	selectedLeagueCode,
	onSelectLeague,
}: {
	leagues: Array<{ id: string; leagueCode: string }>;
	players: SimpleUser[];
	statsByLeagues: LeagueStats[];
	selectedLeagueCode: string;
	onSelectLeague: (leagueCode: string) => void;
}): JSX.Element {
	const rows = useMemo(() => {
		const balancesByLeague = leagues.map((league) => {
			const merged = mergePlayersWithLeagueStats(
				players,
				findLeagueStats(statsByLeagues, league.id)
			);
			return new Map(merged.map((stats) => [stats.userId, stats.actualBalance]));
		});
		return players
			.map((player) => {
				const byLeague = balancesByLeague.map((byUser) => byUser.get(player.id) ?? 0);
				const total = byLeague.reduce((sum, value) => sum + value, 0);
				return { player, byLeague, total };
			})
			.sort(
				(a, b) =>
					b.total - a.total || (a.player.username ?? '').localeCompare(b.player.username ?? '')
			);
	}, [leagues, players, statsByLeagues]);

	const columnMinWidth = leagues.length > 4 ? 52 : undefined;

	return (
		<Box sx={leaguesStatsSectionSx}>
			<Box sx={leaguesStatsSectionTitleSx}>{t('leaguesBalanceSummary')}</Box>
			<Box sx={leaguesMatrixScrollSx}>
				<Table
					size="small"
					sx={
						[
							leaguesMatrixTableSx,
							leagues.length > 4 ? { minWidth: 84 + leagues.length * 52 } : null,
						] as SxProps<Theme>
					}
					aria-label={t('leaguesBalanceSummary')}
				>
					<TableHead>
						<TableRow>
							<TableCell sx={leaguesMatrixStickyHeadSx}>{t('playerName')}</TableCell>
							{leagues.map((league) => (
								<TableCell
									key={league.id}
									sx={
										[
											leaguesMatrixHeadCellSx,
											{
												minWidth: columnMinWidth,
												cursor: 'pointer',
												boxShadow:
													selectedLeagueCode === league.leagueCode
														? `inset 0 -3px 0 ${leagueAccent(league.leagueCode)}`
														: 'none',
											},
										] as SxProps<Theme>
									}
									onClick={() => onSelectLeague(league.leagueCode)}
								>
									<Tooltip title={t(`leagueFullName.${league.leagueCode}`)} arrow>
										<Avatar
											variant="square"
											alt={t(`leagueShortName.${league.leagueCode}`)}
											src={pathToLogoImage(league.leagueCode)}
											sx={
												[
													{ width: 22, height: 22, mx: 'auto' },
													leagueLogoAvatarSx,
												] as SxProps<Theme>
											}
										/>
									</Tooltip>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => (
							<TableRow key={row.player.id} sx={leaguesMatrixRowSx(index % 2 === 1)}>
								<TableCell sx={leaguesMatrixStickyCellSx}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, minWidth: 0 }}>
										<Avatar
											alt={row.player.username}
											src={avatarBase64Converter(row.player.avatar)}
											sx={{ width: 22, height: 22, flexShrink: 0 }}
										/>
										<Box sx={leaguesMatrixPlayerNameSx} title={row.player.username}>
											{row.player.username}
										</Box>
									</Box>
								</TableCell>
								{row.byLeague.map((balance, leagueIndex) => {
									const league = leagues[leagueIndex];
									return (
										<TableCell
											key={league.id}
											sx={
												[
													leaguesMatrixBodyCellSx,
													leaguesBalanceColorSx(balance),
													{
														minWidth: columnMinWidth,
														cursor: 'pointer',
														bgcolor:
															selectedLeagueCode === league.leagueCode
																? 'rgba(15, 118, 110, 0.08)'
																: undefined,
													},
												] as SxProps<Theme>
											}
											onClick={() => onSelectLeague(league.leagueCode)}
										>
											{formatLeagueBalance(balance)}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>
		</Box>
	);
}
