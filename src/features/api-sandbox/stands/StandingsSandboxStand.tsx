import {
	Box,
	Chip,
	FormControl,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import LeagueStandingsView from '../../match-results/LeagueStandingsView';
import type { LeagueStandingsPage } from '../../match-results/types/LeagueStandings';
import { LIVERESULT_PROVIDER } from '../../admin/teams/teamProviderConstants';
import type { SandboxResult } from '../apiSandboxApi';
import {
	LAYER_ACCENT,
	sandboxFieldLabelSx,
	sandboxFormColSx,
	sandboxResultColSx,
	sandboxStandLayoutSx,
} from '../apiSandboxPageStyles';
import CopyableValue from '../CopyableValue';
import SandboxIdHints from '../SandboxIdHints';
import SandboxResultPanel from '../SandboxResultPanel';

const RESULTS_CARD_MAX_WIDTH = 430;

export type StandingsStandForm = {
	provider: string;
	leagueCode: string;
};

type StandingsParsedTeam = {
	id?: string;
	title?: string;
	logoKey?: string | null;
	displayNames?: {
		en?: string;
		ru?: string;
		de?: string;
	};
};

type StandingsParsedRow = {
	rank?: number;
	externalTeamName?: string;
	team?: StandingsParsedTeam | null;
	played?: number;
	wins?: number;
	draws?: number;
	losses?: number;
	goalsFor?: number;
	goalsAgainst?: number;
	goalDifference?: number;
	points?: number;
	zoneCode?: string | null;
};

type StandingsParsed = {
	leagueCode?: string;
	sourceUrl?: string;
	rowsCount?: number;
	zoneRulesCount?: number;
	zoneRules?: Array<{
		code: string;
		label: string;
		cssClass: string;
	}>;
	rows?: StandingsParsedRow[];
};

type StandingsSandboxStandProps = {
	providers: string[];
	form: StandingsStandForm;
	onFormChange: (next: StandingsStandForm) => void;
	loading: boolean;
	result: SandboxResult | null;
	onRun: () => void;
};

function toPreviewPage(parsed: StandingsParsed, provider: string): LeagueStandingsPage {
	return {
		seasonId: '',
		leagueId: '',
		leagueCode: parsed.leagueCode ?? '',
		provider,
		sourceUrl: parsed.sourceUrl ?? null,
		zoneRules: (parsed.zoneRules ?? []).map((rule) => ({
			code: rule.code,
			label: rule.label,
			cssClass: rule.cssClass,
		})),
		rows: (parsed.rows ?? []).map((row, index) => {
			const team = row.team;
			const fallbackName = row.externalTeamName?.trim() || '—';
			return {
				rank: row.rank ?? index + 1,
				teamId: team?.id ?? `sandbox-${index}`,
				teamTitle: team?.title ?? fallbackName,
				displayNames: team?.displayNames ?? undefined,
				logoKey: team?.logoKey ?? undefined,
				played: row.played ?? 0,
				wins: row.wins ?? 0,
				draws: row.draws ?? 0,
				losses: row.losses ?? 0,
				goalsFor: row.goalsFor ?? 0,
				goalsAgainst: row.goalsAgainst ?? 0,
				goalDifference: row.goalDifference ?? 0,
				points: row.points ?? 0,
				zoneCode: row.zoneCode ?? null,
			};
		}),
	};
}

export default function StandingsSandboxStand({
	providers,
	form,
	onFormChange,
	loading,
	result,
	onRun,
}: StandingsSandboxStandProps): JSX.Element {
	const { t } = useTranslation();
	const layer = 'STANDINGS' as const;
	const accent = LAYER_ACCENT[layer];
	const parsed = (result?.parsed || null) as StandingsParsed | null;
	const providerOptions = providers.length > 0 ? providers : [LIVERESULT_PROVIDER];
	const safeProvider = providerOptions.includes(form.provider) ? form.provider : providerOptions[0];

	const previewPage = useMemo(() => {
		if (!result?.success || !parsed?.rows?.length) {
			return null;
		}
		return toPreviewPage(parsed, result.provider);
	}, [parsed, result]);

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<Chip size="small" label={`${t('apiSandbox.kpi.rows')}: ${parsed.rowsCount ?? 0}`} />
					<Chip
						size="small"
						label={`${t('apiSandbox.kpi.zoneRules')}: ${parsed.zoneRulesCount ?? 0}`}
					/>
					{parsed.sourceUrl ? (
						<CopyableValue value={parsed.sourceUrl} label={t('apiSandbox.fields.sourceUrl')} />
					) : null}
				</Box>
				{previewPage ? (
					<Box sx={{ maxWidth: RESULTS_CARD_MAX_WIDTH, mx: 'auto', width: '100%' }}>
						<Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1 }}>
							{t('apiSandbox.standingsCardPreview')}
						</Typography>
						<LeagueStandingsView data={previewPage} loading={false} error={null} />
					</Box>
				) : null}
			</Box>
		) : null;

	return (
		<Box sx={sandboxStandLayoutSx(layer)}>
			<Box sx={sandboxFormColSx}>
				<Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: accent }}>
					{t('apiSandbox.layer.STANDINGS')}
				</Typography>
				<Typography color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
					{t('apiSandbox.standingsHint')}
				</Typography>

				<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.provider')}</Typography>
				<FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
					<Select
						value={safeProvider}
						onChange={(e) => onFormChange({ ...form, provider: e.target.value })}
					>
						{providerOptions.map((provider) => (
							<MenuItem key={provider} value={provider}>
								{provider}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.leagueCode')}</Typography>
				<FormControl fullWidth size="small" sx={{ mb: 1 }}>
					<Select
						value={form.leagueCode}
						onChange={(e) => onFormChange({ ...form, leagueCode: e.target.value })}
					>
						<MenuItem value="EPL">EPL</MenuItem>
						<MenuItem value="BL">BL</MenuItem>
					</Select>
				</FormControl>

				<SandboxIdHints
					layer={layer}
					provider={safeProvider}
					onApply={(value) => onFormChange({ ...form, leagueCode: value })}
				/>

				<CustomSuccessButton
					onClick={onRun}
					disabled={loading}
					buttonText={t('apiSandbox.runRequest')}
					sx={{ mt: 1.5 }}
				/>
			</Box>

			<Box sx={sandboxResultColSx}>
				<SandboxResultPanel
					loading={loading}
					result={result}
					accent={accent}
					summary={summary}
					emptyHint={t('apiSandbox.standingsEmpty')}
				/>
			</Box>
		</Box>
	);
}
