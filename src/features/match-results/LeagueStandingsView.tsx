import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
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
	const { t } = useTranslation();

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
						fontSize: '0.85rem',
						'& th': {
							fontWeight: 700,
							color: 'text.secondary',
							py: 0.75,
							px: 0.5,
							borderBottom: '1px solid',
							borderColor: 'divider',
							textAlign: 'center',
							whiteSpace: 'nowrap',
						},
						'& td': {
							py: 0.65,
							px: 0.5,
							borderBottom: '1px solid',
							borderColor: 'divider',
							verticalAlign: 'middle',
						},
						'& tr:last-of-type td': { borderBottom: 'none' },
					}}
				>
					<thead>
						<tr>
							<th>#</th>
							<th style={{ textAlign: 'left' }}>{t('leagueStandings.team')}</th>
							<th>{t('leagueStandings.playedShort')}</th>
							<th>{t('leagueStandings.winsShort')}</th>
							<th>{t('leagueStandings.drawsShort')}</th>
							<th>{t('leagueStandings.lossesShort')}</th>
							<th>{t('leagueStandings.goalsShort')}</th>
							<th>{t('leagueStandings.goalDiffShort')}</th>
							<th>{t('leagueStandings.pointsShort')}</th>
						</tr>
					</thead>
					<tbody>
						{data.rows.map((row) => {
							const accent = zoneColor(row.zoneCode, data.zoneRules);
							const team = {
								title: row.teamTitle,
								logoKey: row.logoKey ?? undefined,
							};
							return (
								<tr key={`${row.rank}-${row.teamId}`}>
									<td
										style={{
											textAlign: 'center',
											fontWeight: 700,
											background: accent,
											color: accent ? '#fff' : undefined,
										}}
									>
										{row.rank}
									</td>
									<td>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
											<Box
												component="img"
												src={resolveTeamLogoUrl(team)}
												alt=""
												sx={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }}
											/>
											<Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
												{row.teamTitle}
											</Typography>
										</Box>
									</td>
									<td style={{ textAlign: 'center' }}>{row.played}</td>
									<td style={{ textAlign: 'center' }}>{row.wins}</td>
									<td style={{ textAlign: 'center' }}>{row.draws}</td>
									<td style={{ textAlign: 'center' }}>{row.losses}</td>
									<td style={{ textAlign: 'center' }}>
										{formatGoals(row.goalsFor, row.goalsAgainst)}
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
