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
	sandboxResultColSx,
	sandboxStandLayoutSx,
	sandboxTableSx,
} from '../apiSandboxPageStyles';
import CopyableValue from '../CopyableValue';
import SandboxResultPanel from '../SandboxResultPanel';

export type OddsStandForm = {
	provider: string;
	mode: 'tournament' | 'event';
	treeId: string;
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
		name?: string;
		homeTeam?: string;
		awayTeam?: string;
		displayTimeMillis?: number | null;
	}>;
};

type OddsSandboxStandProps = {
	providers: string[];
	form: OddsStandForm;
	onFormChange: (next: OddsStandForm) => void;
	loading: boolean;
	result: SandboxResult | null;
	onRun: () => void;
};

export default function OddsSandboxStand({
	providers,
	form,
	onFormChange,
	loading,
	result,
	onRun,
}: OddsSandboxStandProps): JSX.Element {
	const { t } = useTranslation();
	const accent = LAYER_ACCENT.ODDS;
	const parsed = (result?.parsed || null) as OddsParsed | null;
	const providerOptions = providers.length > 0 ? providers : ['marathonbet'];
	const safeProvider = providerOptions.includes(form.provider) ? form.provider : providerOptions[0];

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
					<Chip size="small" label={parsed.mode || form.mode} color="warning" variant="outlined" />
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
									<TableCell>{t('apiSandbox.col.name')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(parsed.events || []).map((event, idx) => (
									<TableRow key={`${event.treeId}-${idx}`}>
										<TableCell>
											<CopyableValue value={event.treeId} />
										</TableCell>
										<TableCell>
											<CopyableValue value={event.homeTeam} mono={false} />
										</TableCell>
										<TableCell>
											<CopyableValue value={event.awayTeam} mono={false} />
										</TableCell>
										<TableCell sx={{ maxWidth: 220 }}>
											<CopyableValue value={event.name} mono={false} />
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
					{t('apiSandbox.oddsHint')}
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
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.oddsMode')}</Typography>
					<FormControl fullWidth size="small">
						<Select
							value={form.mode}
							onChange={(e) =>
								onFormChange({ ...form, mode: e.target.value as 'tournament' | 'event' })
							}
						>
							<MenuItem value="tournament">{t('apiSandbox.oddsMode.tournament')}</MenuItem>
							<MenuItem value="event">{t('apiSandbox.oddsMode.event')}</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.treeId')}</Typography>
					<TextField
						fullWidth
						size="small"
						value={form.treeId}
						onChange={(e) => onFormChange({ ...form, treeId: e.target.value })}
						placeholder="21520"
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
					emptyHint={t('apiSandbox.oddsEmpty')}
				/>
			</Box>
		</Box>
	);
}
