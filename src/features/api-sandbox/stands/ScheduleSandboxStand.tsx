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

export type ScheduleStandForm = {
	provider: string;
	competitionId: string;
};

type ScheduleParsed = {
	competitionId?: number;
	roundsCount?: number;
	matchesCount?: number;
	rounds?: Array<{
		number: number;
		matches: Array<{
			homeName?: string;
			awayName?: string;
			utcKickoff?: string;
			status?: string;
			soccer365GameId?: string;
		}>;
	}>;
};

type ScheduleSandboxStandProps = {
	providers: string[];
	form: ScheduleStandForm;
	onFormChange: (next: ScheduleStandForm) => void;
	loading: boolean;
	result: SandboxResult | null;
	onRun: () => void;
};

export default function ScheduleSandboxStand({
	providers,
	form,
	onFormChange,
	loading,
	result,
	onRun,
}: ScheduleSandboxStandProps): JSX.Element {
	const { t } = useTranslation();
	const accent = LAYER_ACCENT.SCHEDULE;
	const parsed = (result?.parsed || null) as ScheduleParsed | null;
	const providerOptions = providers.length > 0 ? providers : ['soccer365.ru'];
	const safeProvider = providerOptions.includes(form.provider) ? form.provider : providerOptions[0];

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<Chip size="small" label={`${t('apiSandbox.kpi.matches')}: ${parsed.matchesCount ?? 0}`} />
					<Chip size="small" label={`${t('apiSandbox.kpi.rounds')}: ${parsed.roundsCount ?? 0}`} />
					<CopyableValue value={parsed.competitionId} label={t('apiSandbox.fields.competitionId')} />
				</Box>
				<TableContainer sx={{ maxHeight: 280, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
					<Table size="small" stickyHeader sx={sandboxTableSx}>
						<TableHead>
							<TableRow>
								<TableCell>{t('apiSandbox.col.round')}</TableCell>
								<TableCell>{t('apiSandbox.col.home')}</TableCell>
								<TableCell>{t('apiSandbox.col.away')}</TableCell>
								<TableCell>{t('apiSandbox.col.kickoff')}</TableCell>
								<TableCell>{t('apiSandbox.col.status')}</TableCell>
								<TableCell>{t('apiSandbox.col.gameId')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(parsed.rounds || []).flatMap((round) =>
								(round.matches || []).map((match, idx) => (
									<TableRow key={`${round.number}-${match.soccer365GameId || idx}`}>
										<TableCell>{round.number}</TableCell>
										<TableCell>
											<CopyableValue value={match.homeName} mono={false} />
										</TableCell>
										<TableCell>
											<CopyableValue value={match.awayName} mono={false} />
										</TableCell>
										<TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
											{match.utcKickoff || '—'}
										</TableCell>
										<TableCell>
											<Chip size="small" label={match.status || '—'} color={statusChipColor(match.status)} />
										</TableCell>
										<TableCell>
											<CopyableValue value={match.soccer365GameId} />
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
		<Box sx={sandboxStandLayoutSx(accent)}>
			<Box sx={sandboxFormColSx}>
				<Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
					{t('apiSandbox.layer.SCHEDULE')}
				</Typography>
				<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: -1 }}>
					{t('apiSandbox.scheduleHint')}
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
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.competitionId')}</Typography>
					<TextField
						fullWidth
						size="small"
						value={form.competitionId}
						onChange={(e) => onFormChange({ ...form, competitionId: e.target.value })}
						placeholder="12"
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
					emptyHint={t('apiSandbox.scheduleEmpty')}
				/>
			</Box>
		</Box>
	);
}
