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

type FullMatchParsed = {
	gameId?: string;
	statusText?: string;
	goalsCount?: number;
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

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
					<CopyableValue value={parsed.gameId} label={t('apiSandbox.fields.gameId')} />
					{parsed.statusText ? <Chip size="small" label={parsed.statusText} color="success" /> : null}
					<Chip size="small" label={`${t('apiSandbox.kpi.goals')}: ${parsed.goalsCount ?? 0}`} />
				</Box>
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
