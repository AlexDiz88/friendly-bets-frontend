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
	statusChipColor,
} from '../apiSandboxPageStyles';
import CopyableValue from '../CopyableValue';
import SandboxResultPanel from '../SandboxResultPanel';

export type LiveStandForm = {
	provider: string;
	date: string;
	titleContains: string;
};

type LiveParsed = {
	date?: string;
	titleContains?: string | null;
	competitionsTotal?: number;
	competitionsMatched?: number;
	matchesCount?: number;
	competitions?: Array<{
		title?: string;
		matches?: Array<{
			externalMatchId?: string;
			homeName?: string;
			awayName?: string;
			scoreText?: string;
			liveMinuteLabel?: string;
			status?: string;
		}>;
	}>;
};

type LiveSandboxStandProps = {
	providers: string[];
	form: LiveStandForm;
	onFormChange: (next: LiveStandForm) => void;
	loading: boolean;
	result: SandboxResult | null;
	onRun: () => void;
};

export default function LiveSandboxStand({
	providers,
	form,
	onFormChange,
	loading,
	result,
	onRun,
}: LiveSandboxStandProps): JSX.Element {
	const { t } = useTranslation();
	const layer = 'LIVE' as const;
	const accent = LAYER_ACCENT[layer];
	const parsed = (result?.parsed || null) as LiveParsed | null;
	const providerOptions = providers.length > 0 ? providers : ['24score.pro'];
	const safeProvider = providerOptions.includes(form.provider) ? form.provider : providerOptions[0];

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<Chip size="small" label={`${t('apiSandbox.kpi.competitions')}: ${parsed.competitionsMatched ?? 0}/${parsed.competitionsTotal ?? 0}`} />
					<Chip size="small" label={`${t('apiSandbox.kpi.matches')}: ${parsed.matchesCount ?? 0}`} />
					{parsed.titleContains ? <Chip size="small" label={parsed.titleContains} variant="outlined" /> : null}
				</Box>
				<TableContainer sx={{ maxHeight: 300, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
					<Table size="small" stickyHeader sx={sandboxTableSx(layer)}>
						<TableHead>
							<TableRow>
								<TableCell>{t('apiSandbox.col.league')}</TableCell>
								<TableCell>{t('apiSandbox.col.home')}</TableCell>
								<TableCell>{t('apiSandbox.col.away')}</TableCell>
								<TableCell>{t('apiSandbox.col.score')}</TableCell>
								<TableCell>{t('apiSandbox.col.minute')}</TableCell>
								<TableCell>{t('apiSandbox.col.status')}</TableCell>
								<TableCell>{t('apiSandbox.col.externalId')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(parsed.competitions || []).flatMap((comp) =>
								(comp.matches || []).map((match, idx) => (
									<TableRow key={`${comp.title}-${match.externalMatchId || idx}`}>
										<TableCell sx={{ maxWidth: 160 }}>
											<CopyableValue value={comp.title} mono={false} />
										</TableCell>
										<TableCell>
											<CopyableValue value={match.homeName} mono={false} />
										</TableCell>
										<TableCell>
											<CopyableValue value={match.awayName} mono={false} />
										</TableCell>
										<TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
											{match.scoreText || '—'}
										</TableCell>
										<TableCell>{match.liveMinuteLabel || '—'}</TableCell>
										<TableCell>
											<Chip size="small" label={match.status || '—'} color={statusChipColor(match.status)} />
										</TableCell>
										<TableCell>
											<CopyableValue value={match.externalMatchId} />
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		) : null;

	return (
		<Box sx={sandboxStandLayoutSx(layer)}>
			<Box sx={sandboxFormColSx}>
				<Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
					{t('apiSandbox.layer.LIVE')}
				</Typography>
				<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: -1 }}>
					{t('apiSandbox.liveHint')}
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
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.date')}</Typography>
					<TextField
						fullWidth
						size="small"
						type="date"
						value={form.date}
						onChange={(e) => onFormChange({ ...form, date: e.target.value })}
						InputLabelProps={{ shrink: true }}
					/>
				</Box>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.titleContains')}</Typography>
					<TextField
						fullWidth
						size="small"
						value={form.titleContains}
						onChange={(e) => onFormChange({ ...form, titleContains: e.target.value })}
						placeholder={t('apiSandbox.titleContainsPlaceholder')}
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
					emptyHint={t('apiSandbox.liveEmpty')}
				/>
			</Box>
		</Box>
	);
}
