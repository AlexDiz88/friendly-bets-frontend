import {
	Box,
	Chip,
	FormControl,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import type { SandboxResult } from '../apiSandboxApi';
import {
	LAYER_ACCENT,
	sandboxFieldLabelSx,
	sandboxFormColSx,
	sandboxResultColSx,
	sandboxStandLayoutSx,
} from '../apiSandboxPageStyles';
import CopyableValue from '../CopyableValue';
import SandboxResultPanel from '../SandboxResultPanel';

export type FullMatchStandForm = {
	provider: string;
	gameId: string;
};

type FullMatchGoal = {
	minute?: string;
	teamSide?: string;
	playerName?: string;
	penalty?: boolean;
	penaltyShootout?: boolean;
	ownGoal?: boolean;
	missed?: boolean;
};

type FullMatchStats = {
	possessionHome?: number | null;
	possessionAway?: number | null;
	shotsHome?: number | null;
	shotsAway?: number | null;
	shotsOnTargetHome?: number | null;
	shotsOnTargetAway?: number | null;
	yellowCardsHome?: number | null;
	yellowCardsAway?: number | null;
	xgHome?: number | null;
	xgAway?: number | null;
};

type FullMatchParsed = {
	gameId?: string;
	statusText?: string;
	homeTeamName?: string;
	awayTeamName?: string;
	competitionName?: string;
	goalsCount?: number;
	goals?: FullMatchGoal[];
	stats?: FullMatchStats | null;
	gameScore?: {
		fullTime?: string;
		firstTime?: string;
		overTime?: string;
		penalty?: string;
	} | null;
};

type FullMatchSandboxStandProps = {
	providers: string[];
	form: FullMatchStandForm;
	onFormChange: (next: FullMatchStandForm) => void;
	loading: boolean;
	result: SandboxResult | null;
	onRun: () => void;
};

function StatCard({
	label,
	home,
	away,
	accent,
}: {
	label: string;
	home: string | number | null | undefined;
	away: string | number | null | undefined;
	accent: string;
}): JSX.Element {
	return (
		<Box
			sx={{
				p: 1.25,
				borderRadius: 1.5,
				border: `1px solid ${accent}44`,
				background: `linear-gradient(135deg, ${accent}18 0%, transparent 70%)`,
			}}
		>
			<Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
				{label}
			</Typography>
			<Typography sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem' }}>
				{home ?? '—'} : {away ?? '—'}
			</Typography>
		</Box>
	);
}

export default function FullMatchSandboxStand({
	providers,
	form,
	onFormChange,
	loading,
	result,
	onRun,
}: FullMatchSandboxStandProps): JSX.Element {
	const { t } = useTranslation();
	const accent = LAYER_ACCENT.FULL_MATCH;
	const parsed = (result?.parsed || null) as FullMatchParsed | null;
	const providerOptions = providers.length > 0 ? providers : ['soccer365.ru'];
	const safeProvider = providerOptions.includes(form.provider) ? form.provider : providerOptions[0];
	const stats = parsed?.stats;

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
					<CopyableValue value={parsed.gameId} label={t('apiSandbox.fields.gameId')} />
					{parsed.competitionName ? (
						<Chip size="small" label={parsed.competitionName} variant="outlined" color="error" />
					) : null}
					{parsed.statusText ? <Chip size="small" label={parsed.statusText} color="success" /> : null}
					<Chip size="small" label={`${t('apiSandbox.kpi.goals')}: ${parsed.goalsCount ?? 0}`} />
				</Box>

				{(parsed.homeTeamName || parsed.awayTeamName) && (
					<Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1.15rem' }}>
						{parsed.homeTeamName || '—'} — {parsed.awayTeamName || '—'}
					</Typography>
				)}

				{parsed.gameScore ? (
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
							gap: 1,
						}}
					>
						{(
							[
								['fullTime', parsed.gameScore.fullTime],
								['firstTime', parsed.gameScore.firstTime],
								['overTime', parsed.gameScore.overTime],
								['penalty', parsed.gameScore.penalty],
							] as const
						).map(([key, value]) => (
							<Box
								key={key}
								sx={{
									p: 1.25,
									borderRadius: 1.5,
									border: '1px solid',
									borderColor: 'divider',
									background: 'rgba(244,63,94,0.06)',
								}}
							>
								<Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
									{t(`apiSandbox.score.${key}`)}
								</Typography>
								<Typography sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem' }}>
									{value || '—'}
								</Typography>
							</Box>
						))}
					</Box>
				) : null}

				{parsed.goals && parsed.goals.length > 0 ? (
					<Box>
						<Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', mb: 0.75, color: 'text.secondary' }}>
							{t('apiSandbox.fullMatch.goalsTitle')}
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
							{parsed.goals.map((g, idx) => (
								<Box
									key={`${g.minute}-${g.playerName}-${idx}`}
									sx={{
										display: 'flex',
										gap: 1,
										alignItems: 'center',
										px: 1,
										py: 0.5,
										borderRadius: 1,
										background:
											g.teamSide === 'HOME' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
									}}
								>
									<Typography
										sx={{
											fontFamily: g.penaltyShootout ? undefined : 'monospace',
											fontWeight: 700,
											minWidth: g.penaltyShootout ? 110 : 40,
											fontSize: g.penaltyShootout ? '0.75rem' : undefined,
										}}
									>
										{g.penaltyShootout
											? t('apiSandbox.fullMatch.penShootoutMinute')
											: `${g.minute}'`}
									</Typography>
									<Chip
										size="small"
										label={g.teamSide === 'HOME' ? t('apiSandbox.col.home') : t('apiSandbox.col.away')}
										sx={{ height: 22 }}
									/>
									<Typography sx={{ fontSize: '0.85rem' }}>{g.playerName || '—'}</Typography>
									{g.ownGoal ? (
										<Chip size="small" label={t('apiSandbox.fullMatch.ownGoal')} color="warning" />
									) : null}
									{g.penalty && !g.penaltyShootout ? (
										<Chip size="small" label={t('apiSandbox.fullMatch.penalty')} color="info" />
									) : null}
									{g.penaltyShootout ? (
										<Chip size="small" label={t('apiSandbox.fullMatch.penShootout')} color="secondary" />
									) : null}
									{g.missed ? (
										<Chip size="small" label={t('apiSandbox.fullMatch.miss')} color="error" />
									) : null}
								</Box>
							))}
						</Box>
					</Box>
				) : null}

				{stats ? (
					<Box>
						<Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', mb: 0.75, color: 'text.secondary' }}>
							{t('apiSandbox.fullMatch.statsTitle')}
						</Typography>
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
								gap: 1,
							}}
						>
							<StatCard
								label={t('apiSandbox.fullMatch.stat.xg')}
								home={stats.xgHome}
								away={stats.xgAway}
								accent="#14b8a6"
							/>
							<StatCard
								label={t('apiSandbox.fullMatch.stat.shots')}
								home={stats.shotsHome}
								away={stats.shotsAway}
								accent="#0ea5e9"
							/>
							<StatCard
								label={t('apiSandbox.fullMatch.stat.shotsOnTarget')}
								home={stats.shotsOnTargetHome}
								away={stats.shotsOnTargetAway}
								accent="#22c55e"
							/>
							<StatCard
								label={t('apiSandbox.fullMatch.stat.possession')}
								home={stats.possessionHome}
								away={stats.possessionAway}
								accent="#f59e0b"
							/>
							<StatCard
								label={t('apiSandbox.fullMatch.stat.yellowCards')}
								home={stats.yellowCardsHome}
								away={stats.yellowCardsAway}
								accent="#eab308"
							/>
						</Box>
					</Box>
				) : null}
			</Box>
		) : null;

	return (
		<Box sx={sandboxStandLayoutSx(accent)}>
			<Box sx={sandboxFormColSx}>
				<Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
					{t('apiSandbox.layer.FULL_MATCH')}
				</Typography>
				<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: -1 }}>
					{t('apiSandbox.fullMatchHint')}
				</Typography>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.provider')}</Typography>
					<FormControl fullWidth size="small">
						<Select
							value={safeProvider}
							onChange={(e) => onFormChange({ ...form, provider: String(e.target.value) })}
						>
							{providerOptions.map((p) => (
								<MenuItem key={p} value={p}>
									{p}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.gameId')}</Typography>
					<TextField
						fullWidth
						size="small"
						value={form.gameId}
						onChange={(e) => onFormChange({ ...form, gameId: e.target.value })}
						placeholder="1234567"
					/>
				</Box>

				<CustomSuccessButton
					onClick={onRun}
					disabled={loading}
					loading={loading}
					buttonText={t('apiSandbox.runRequest')}
					sx={{ mt: 'auto', mr: 0 }}
				/>
			</Box>

			<Box sx={sandboxResultColSx}>
				<SandboxResultPanel
					loading={loading}
					result={result}
					accent={accent}
					summary={summary}
					emptyHint={t('apiSandbox.fullMatchEmpty')}
				/>
			</Box>
		</Box>
	);
}
