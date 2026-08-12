import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import type { LeagueStandingsPage, StandingZoneRule } from './types/LeagueStandings';

const ZONE_COLOR: Record<string, string> = {
	'bg-success': '#059669',
	'bg-primary': '#2563eb',
	'bg-warning': '#d97706',
	'bg-danger': '#dc2626',
};

function zoneColor(zoneCode: string | null | undefined, zoneRules: StandingZoneRule[]): string | undefined {
	if (!zoneCode) return undefined;
	const fromRule = zoneRules.find((rule) => rule.code === zoneCode);
	if (fromRule?.cssClass && ZONE_COLOR[fromRule.cssClass]) {
		return ZONE_COLOR[fromRule.cssClass];
	}
	return ZONE_COLOR[zoneCode];
}

function formatGoals(goalsFor: number, goalsAgainst: number): string {
	return `${goalsFor} - ${goalsAgainst}`;
}

function formatGoalDifference(value: number): string {
	if (value > 0) return `+${value}`;
	return String(value);
}

interface LeagueStandingsViewProps {
	data: LeagueStandingsPage | null;
	loading: boolean;
	error: string | null;
}

export default function LeagueStandingsView({
	data,
	loading,
	error,
}: LeagueStandingsViewProps): JSX.Element {
	const { t, i18n } = useTranslation();

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
				<CircularProgress size={32} />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity="error" sx={{ mx: 0.5 }}>
				{t(error, { defaultValue: error })}
			</Alert>
		);
	}

	if (!data || data.rows.length === 0) {
		return (
			<Box
				sx={{
					borderRadius: 2,
					boxShadow: 2,
					bgcolor: 'background.paper',
					py: 4,
					px: 2,
					mx: 0.5,
				}}
			>
				<Typography textAlign="center" color="text.secondary">
					{t('matchResultsStandingsEmpty')}
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ mx: 0.5 }}>
			<Box
				sx={(theme) => ({
					border: '1px solid',
					borderColor: theme.palette.divider,
					borderRadius: 2,
					overflow: 'hidden',
					bgcolor: 'background.paper',
					boxShadow: 2,
				})}
			>
				<Box
					component="table"
					sx={{
						width: '100%',
						tableLayout: 'fixed',
						borderCollapse: 'collapse',
						fontSize: { xs: '0.75rem', sm: '0.85rem' },
						'& th': {
							fontWeight: 700,
							color: 'text.secondary',
							py: 0.5,
							px: 0.25,
							borderBottom: '1px solid',
							borderColor: 'divider',
							textAlign: 'center',
							whiteSpace: 'nowrap',
						},
						'& td': {
							py: 0.45,
							px: 0.25,
							borderBottom: '1px solid',
							borderColor: 'divider',
							verticalAlign: 'middle',
						},
						'& tr:last-of-type td': { borderBottom: 'none' },
						'& .col-rank': {
							width: { xs: '1.35rem', sm: '1.75rem' },
							px: { xs: 0.1, sm: 0.25 },
						},
						'& .col-stat': {
							width: { xs: '1.15rem', sm: '1.5rem' },
							px: { xs: 0.05, sm: 0.2 },
						},
						'& .col-goals': {
							display: { xs: 'none', sm: 'table-cell' },
							width: '3.25rem',
						},
						'& .col-diff': {
							width: { xs: '1.5rem', sm: '1.75rem' },
						},
						'& .col-points': {
							width: { xs: '1.35rem', sm: '1.75rem' },
							fontWeight: 800,
						},
					}}
				>
					<thead>
						<tr>
							<th className="col-rank">#</th>
							<th style={{ textAlign: 'left', width: 'auto' }}>{t('leagueStandings.team')}</th>
							<th className="col-stat">{t('leagueStandings.playedShort')}</th>
							<th className="col-stat">{t('leagueStandings.winsShort')}</th>
							<th className="col-stat">{t('leagueStandings.drawsShort')}</th>
							<th className="col-stat">{t('leagueStandings.lossesShort')}</th>
							<th className="col-goals">{t('leagueStandings.goalsShort')}</th>
							<th className="col-diff">{t('leagueStandings.goalDiffShort')}</th>
							<th className="col-points">{t('leagueStandings.pointsShort')}</th>
						</tr>
					</thead>
					<tbody>
						{data.rows.map((row) => {
							const accent = zoneColor(row.zoneCode, data.zoneRules);
							const team = {
								title: row.teamTitle,
								logoKey: row.logoKey ?? undefined,
								displayNames: row.displayNames ?? undefined,
							};
							const teamLabel = resolveTeamDisplayName(team, t, i18n.language);
							return (
								<tr key={`${row.rank}-${row.teamId}`}>
									<td
										className="col-rank"
										style={{
											textAlign: 'center',
											fontWeight: 700,
											background: accent,
											color: accent ? '#fff' : undefined,
										}}
									>
										{row.rank}
									</td>
									<td style={{ minWidth: 0 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
											<Box
												component="img"
												src={resolveTeamLogoUrl(team)}
												alt=""
												sx={{
													width: { xs: 18, sm: 22 },
													height: { xs: 18, sm: 22 },
													objectFit: 'contain',
													flexShrink: 0,
												}}
											/>
											<Typography
												variant="body2"
												noWrap
												sx={{
													fontWeight: 600,
													fontSize: 'inherit',
													minWidth: 0,
												}}
											>
												{teamLabel}
											</Typography>
										</Box>
									</td>
									<td className="col-stat" style={{ textAlign: 'center' }}>
										{row.played}
									</td>
									<td className="col-stat" style={{ textAlign: 'center' }}>
										{row.wins}
									</td>
									<td className="col-stat" style={{ textAlign: 'center' }}>
										{row.draws}
									</td>
									<td className="col-stat" style={{ textAlign: 'center' }}>
										{row.losses}
									</td>
									<td className="col-goals" style={{ textAlign: 'center' }}>
										{formatGoals(row.goalsFor, row.goalsAgainst)}
									</td>
									<td className="col-diff" style={{ textAlign: 'center' }}>
										{formatGoalDifference(row.goalDifference)}
									</td>
									<td className="col-points" style={{ textAlign: 'center' }}>
										{row.points}
									</td>
								</tr>
							);
						})}
					</tbody>
				</Box>
			</Box>

			{data.zoneRules.length > 0 ? (
				<Box sx={{ mt: 2, px: 0.5 }}>
					{data.zoneRules.map((rule) => (
						<Box
							key={rule.code}
							sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
						>
							<Box
								sx={{
									width: 14,
									height: 14,
									borderRadius: 0.5,
									bgcolor: zoneColor(rule.code, data.zoneRules) ?? 'divider',
									flexShrink: 0,
								}}
							/>
							<Typography variant="caption" color="text.secondary">
								{rule.label}
							</Typography>
						</Box>
					))}
				</Box>
			) : null}
		</Box>
	);
}
