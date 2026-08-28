import {
	Box,
	Chip,
	FormControl,
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
import SandboxIdHints from '../SandboxIdHints';
import SandboxResultPanel from '../SandboxResultPanel';
import { SPORTS_RU_PROVIDER, FOOTBALL24_PROVIDER, listedProviders, resolveSelectedProvider } from '../../admin/teams/teamProviderConstants';
import { ProviderSelectItems, providerSelectSx, renderProviderSelectValue } from '../../admin/teams/ProviderOptionLabel';

export type ScheduleStandForm = {
	provider: string;
	competitionId: string;
	round: string;
	limit: string;
};

type ScheduleParsed = {
	competitionId?: number;
	calendarPath?: string;
	roundFilter?: number | null;
	limit?: number | null;
	matchesTotal?: number;
	roundsTotal?: number;
	roundsCount?: number;
	matchesCount?: number;
	parsedTruncated?: boolean;
	rounds?: Array<{
		number: number;
		matches: Array<{
			homeName?: string;
			awayName?: string;
			utcKickoff?: string;
			status?: string;
			soccer365GameId?: string;
			matchPath?: string;
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
	const layer = 'SCHEDULE' as const;
	const accent = LAYER_ACCENT[layer];
	const parsed = (result?.parsed || null) as ScheduleParsed | null;
	const providerOptions = listedProviders(providers, [SPORTS_RU_PROVIDER]);
	const safeProvider = resolveSelectedProvider(providerOptions, form.provider);
	const isSportsRu = safeProvider === SPORTS_RU_PROVIDER;
	const isFootball24 = safeProvider === FOOTBALL24_PROVIDER;

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<Chip
						size="small"
						label={`${t('apiSandbox.kpi.matches')}: ${parsed.matchesCount ?? 0}${
							parsed.matchesTotal != null && parsed.matchesTotal !== parsed.matchesCount
								? ` / ${parsed.matchesTotal}`
								: ''
						}`}
					/>
					<Chip size="small" label={`${t('apiSandbox.kpi.rounds')}: ${parsed.roundsCount ?? 0}`} />
					{parsed.parsedTruncated ? (
						<Chip size="small" color="warning" variant="outlined" label={t('apiSandbox.parsedTruncated')} />
					) : null}
					{parsed.competitionId != null ? (
						<CopyableValue value={parsed.competitionId} label={t('apiSandbox.fields.competitionId')} />
					) : null}
					{parsed.calendarPath ? (
						<CopyableValue value={parsed.calendarPath} label={t('apiSandbox.fields.calendarPath')} />
					) : null}
				</Box>
				<TableContainer sx={{ maxHeight: 280, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
					<Table size="small" stickyHeader sx={sandboxTableSx(layer)}>
						<TableHead>
							<TableRow>
								<TableCell>{t('apiSandbox.col.round')}</TableCell>
								<TableCell>{t('apiSandbox.col.home')}</TableCell>
								<TableCell>{t('apiSandbox.col.away')}</TableCell>
								<TableCell>{t('apiSandbox.col.kickoff')}</TableCell>
								<TableCell>{t('apiSandbox.col.status')}</TableCell>
								<TableCell>
									{isSportsRu ? t('apiSandbox.col.matchPath') : t('apiSandbox.col.gameId')}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(parsed.rounds || []).flatMap((round) =>
								(round.matches || []).map((match, idx) => (
									<TableRow
										key={`${round.number}-${match.soccer365GameId || match.matchPath || idx}`}
									>
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
											<CopyableValue value={match.soccer365GameId || match.matchPath} />
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
					{t('apiSandbox.layer.SCHEDULE')}
				</Typography>
				<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: -1 }}>
					{isSportsRu
						? t('apiSandbox.scheduleHintSportsRu')
						: isFootball24
							? t('apiSandbox.scheduleHintFootball24')
							: t('apiSandbox.scheduleHint')}
				</Typography>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.provider')}</Typography>
					<FormControl fullWidth size="small">
						<Select
							value={safeProvider}
							onChange={(e) =>
								onFormChange({
									...form,
									provider: String(e.target.value),
									competitionId: '',
								})
							}
							renderValue={renderProviderSelectValue()}
							sx={providerSelectSx}
						>
							{ProviderSelectItems({ providers: providerOptions })}
						</Select>
					</FormControl>
				</Box>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>
						{isSportsRu ? t('apiSandbox.fields.tournamentSlug') : t('apiSandbox.fields.competitionId')}
					</Typography>
					<TextField
						fullWidth
						size="small"
						value={form.competitionId}
						onChange={(e) => onFormChange({ ...form, competitionId: e.target.value })}
						placeholder={isSportsRu ? 'premier-league' : isFootball24 ? '3' : '12'}
						inputProps={isSportsRu ? undefined : { inputMode: 'numeric' }}
					/>
				</Box>

				<SandboxIdHints
					layer={layer}
					provider={safeProvider}
					onApply={(value) => onFormChange({ ...form, provider: safeProvider, competitionId: value })}
				/>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.round')}</Typography>
					<TextField
						fullWidth
						size="small"
						value={form.round}
						onChange={(e) => onFormChange({ ...form, round: e.target.value })}
						placeholder={t('apiSandbox.roundOptional')}
						inputProps={{ inputMode: 'numeric' }}
					/>
				</Box>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.limit')}</Typography>
					<TextField
						fullWidth
						size="small"
						value={form.limit}
						onChange={(e) => onFormChange({ ...form, limit: e.target.value })}
						placeholder={t('apiSandbox.limitOptional')}
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
						isSportsRu ? t('apiSandbox.scheduleEmptySportsRu') : t('apiSandbox.scheduleEmpty')
					}
				/>
			</Box>
		</Box>
	);
}
