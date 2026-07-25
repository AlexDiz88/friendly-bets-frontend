import {
	Box,
	Chip,
	FormControl,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
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
	sandboxLayerChipSx,
	sandboxResultColSx,
	sandboxStandLayoutSx,
	sandboxTableSx,
} from '../apiSandboxPageStyles';
import CopyableValue from '../CopyableValue';
import SandboxResultPanel from '../SandboxResultPanel';

export type OddsMode = 'tournament' | 'event';

export type OddsModeForm = {
	provider: string;
	treeId: string;
};

export type OddsModeStandState = {
	form: OddsModeForm;
	loading: boolean;
	result: SandboxResult | null;
};

type OddsParsed = {
	mode?: string;
	tournamentTreeId?: number;
	eventTreeId?: number;
	eventsCount?: number;
	marketsTotal?: number;
	marketBucketCounts?: Record<string, number>;
	events?: Array<{
		treeId?: number;
		eventId?: number | null;
		homeTeam?: string;
		awayTeam?: string;
		displayTimeMillis?: number | null;
	}>;
};

type OddsSandboxStandProps = {
	providers: string[];
	activeMode: OddsMode;
	onModeChange: (mode: OddsMode) => void;
	tournament: OddsModeStandState;
	event: OddsModeStandState;
	onTournamentFormChange: (next: OddsModeForm) => void;
	onEventFormChange: (next: OddsModeForm) => void;
	onRunTournament: () => void;
	onRunEvent: () => void;
};

export default function OddsSandboxStand({
	providers,
	activeMode,
	onModeChange,
	tournament,
	event,
	onTournamentFormChange,
	onEventFormChange,
	onRunTournament,
	onRunEvent,
}: OddsSandboxStandProps): JSX.Element {
	const { t } = useTranslation();
	const accent = LAYER_ACCENT.ODDS;
	const providerOptions = providers.length > 0 ? providers : ['marathonbet'];

	const active = activeMode === 'tournament' ? tournament : event;
	const onFormChange = activeMode === 'tournament' ? onTournamentFormChange : onEventFormChange;
	const onRun = activeMode === 'tournament' ? onRunTournament : onRunEvent;
	const form = active.form;
	const loading = active.loading;
	const result = active.result;
	const safeProvider = providerOptions.includes(form.provider) ? form.provider : providerOptions[0];
	const parsed = (result?.parsed || null) as OddsParsed | null;

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
					<Chip size="small" label={parsed.mode || activeMode} color="warning" variant="outlined" />
					{parsed.mode === 'tournament' ? (
						<>
							<Chip size="small" label={`${t('apiSandbox.kpi.events')}: ${parsed.eventsCount ?? 0}`} />
							<CopyableValue value={parsed.tournamentTreeId} label={t('apiSandbox.fields.treeId')} />
						</>
					) : (
						<>
							<Chip size="small" label={`${t('apiSandbox.kpi.markets')}: ${parsed.marketsTotal ?? 0}`} />
							<CopyableValue value={parsed.eventTreeId} label={t('apiSandbox.fields.treeId')} />
						</>
					)}
				</Box>

				{parsed.mode === 'tournament' ? (
					<TableContainer sx={{ maxHeight: 280, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
						<Table size="small" stickyHeader sx={sandboxTableSx}>
							<TableHead>
								<TableRow>
									<TableCell>{t('apiSandbox.col.treeId')}</TableCell>
									<TableCell>{t('apiSandbox.col.home')}</TableCell>
									<TableCell>{t('apiSandbox.col.away')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(parsed.events || []).map((ev, idx) => (
									<TableRow key={`${ev.treeId}-${idx}`}>
										<TableCell>
											<CopyableValue value={ev.treeId} />
										</TableCell>
										<TableCell>
											<CopyableValue value={ev.homeTeam} mono={false} />
										</TableCell>
										<TableCell>
											<CopyableValue value={ev.awayTeam} mono={false} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
						{Object.entries(parsed.marketBucketCounts || {}).map(([bucket, count]) =>
							count > 0 ? (
								<Chip key={bucket} size="small" label={`${bucket}: ${count}`} variant="outlined" />
							) : null
						)}
					</Box>
				)}
			</Box>
		) : null;

	return (
		<Box sx={sandboxStandLayoutSx(accent)}>
			<Box sx={sandboxFormColSx}>
				<Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
					{t('apiSandbox.layer.ODDS')}
				</Typography>
				<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: -1 }}>
					{activeMode === 'tournament' ? t('apiSandbox.oddsTournamentHint') : t('apiSandbox.oddsEventHint')}
				</Typography>

				<Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
					<Chip
						label={t('apiSandbox.oddsMode.tournamentShort')}
						onClick={() => onModeChange('tournament')}
						sx={sandboxLayerChipSx(activeMode === 'tournament', accent)}
					/>
					<Chip
						label={t('apiSandbox.oddsMode.eventShort')}
						onClick={() => onModeChange('event')}
						sx={sandboxLayerChipSx(activeMode === 'event', accent)}
					/>
				</Box>

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
					<Typography sx={sandboxFieldLabelSx}>
						{activeMode === 'tournament'
							? t('apiSandbox.fields.tournamentTreeId')
							: t('apiSandbox.fields.eventTreeId')}
					</Typography>
					<TextField
						fullWidth
						size="small"
						value={form.treeId}
						onChange={(e) => onFormChange({ ...form, treeId: e.target.value })}
						placeholder={activeMode === 'tournament' ? '22433' : '29432420'}
						inputProps={{ inputMode: 'numeric' }}
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
					emptyHint={
						activeMode === 'tournament' ? t('apiSandbox.oddsTournamentEmpty') : t('apiSandbox.oddsEventEmpty')
					}
				/>
			</Box>
		</Box>
	);
}
