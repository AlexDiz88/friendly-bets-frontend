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
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GameScore from '../../bets/types/GameScore';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import ExternalMatchResultCard from '../../match-results/ExternalMatchResultCard';
import { resolveExternalMatchScoreView } from '../../match-results/externalMatchScoreView';
import { resolveLiveMinuteLabel } from '../../../shared/liveMinuteResolver';
import { useFormatUserDateTime } from '../../../shared/useFormatUserDateTime';
import type { SandboxResult } from '../apiSandboxApi';
import { EURO_FOOTBALL_PROVIDER, listedProviders, resolveSelectedProvider } from '../../admin/teams/teamProviderConstants';
import { ProviderSelectItems, providerSelectSx, renderProviderSelectValue } from '../../admin/teams/ProviderOptionLabel';
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

/** Same content width as MatchdayPage («Результаты»). */
const RESULTS_CARD_MAX_WIDTH = 430;

export type LiveStandForm = {
	provider: string;
	date: string;
	titleContains: string;
};

type LiveParsedTeam = {
	id?: string;
	title?: string;
	logoKey?: string | null;
	displayNames?: {
		en?: string;
		ru?: string;
		de?: string;
	};
};

type LiveParsedMatch = {
	externalMatchId?: string;
	homeName?: string;
	awayName?: string;
	homeTeam?: LiveParsedTeam | null;
	awayTeam?: LiveParsedTeam | null;
	scoreText?: string;
	fullTimeScore?: string;
	penaltyScore?: string;
	liveMinuteLabel?: string;
	status?: string;
};

type LiveParsed = {
	date?: string;
	titleContains?: string | null;
	competitionsTotal?: number;
	competitionsMatched?: number;
	matchesCount?: number;
	competitions?: Array<{
		title?: string;
		matches?: LiveParsedMatch[];
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

function parseScoreFromText(scoreText?: string): string {
	if (!scoreText?.trim()) {
		return '—';
	}
	const match = /(\d{1,2}\s*:\s*\d{1,2})/.exec(scoreText);
	return match ? match[1].replace(/\s+/g, '') : '—';
}

function teamFromParsed(resolved: LiveParsedTeam | null | undefined, fallbackName?: string) {
	const title = resolved?.title?.trim() || fallbackName?.trim() || '—';
	// Unresolved alias → explicit default logo (avoid Cyrillic title as logo file key).
	const logoKey = resolved
		? resolved.logoKey?.trim() || resolved.title || 'no_image'
		: 'no_image';
	return {
		id: resolved?.id || `sandbox-${title}`,
		title,
		logoKey,
		displayNames: resolved?.displayNames,
	};
}

export default function LiveSandboxStand({
	providers,
	form,
	onFormChange,
	loading,
	result,
	onRun,
}: LiveSandboxStandProps): JSX.Element {
	const { t } = useTranslation();
	const { formatDateTime } = useFormatUserDateTime();
	const layer = 'LIVE' as const;
	const accent = LAYER_ACCENT[layer];
	const parsed = (result?.parsed || null) as LiveParsed | null;
	const providerOptions = listedProviders(providers, ['24score.pro']);
	const safeProvider = resolveSelectedProvider(providerOptions, form.provider);
	const [selectedMatch, setSelectedMatch] = useState<LiveParsedMatch | null>(null);
	const [previewFetchedAt, setPreviewFetchedAt] = useState<string | null>(null);

	const previewKickoffUtcMs = useMemo(() => {
		if (!form.date) {
			return 0;
		}
		const base = Date.parse(`${form.date}T12:00:00.000Z`);
		return Number.isFinite(base) ? base - 70 * 60_000 : 0;
	}, [form.date]);

	const previewResolvedMinute = useMemo(() => {
		if (!selectedMatch?.liveMinuteLabel) {
			return null;
		}
		return resolveLiveMinuteLabel(selectedMatch.liveMinuteLabel, {
			kickoffUtcMs: previewKickoffUtcMs,
			nowMs: previewFetchedAt ? Date.parse(previewFetchedAt) : Date.now(),
			leagueCode: form.titleContains ? 'CL' : undefined,
			slotId: form.titleContains ? '1/4' : undefined,
			matchStatus: selectedMatch.status,
		});
	}, [selectedMatch, previewKickoffUtcMs, previewFetchedAt, form.titleContains]);

	const previewScoreView = useMemo(() => {
		if (!selectedMatch) {
			return '—';
		}
		const fullTime =
			selectedMatch.fullTimeScore?.replace(/\s+/g, '')
			|| parseScoreFromText(selectedMatch.scoreText);
		const penalty = selectedMatch.penaltyScore?.replace(/\s+/g, '') || '';
		const gameScore: GameScore | null =
			fullTime && fullTime !== '—'
				? { fullTime, firstTime: '', overTime: '', penalty }
				: null;
		return resolveExternalMatchScoreView({
			gameScore,
			matchStatus: selectedMatch.status ?? 'SCHEDULED',
			// LIVE sandbox: FINISHED ≠ FULL finalized (нет «Итог зафиксирован»).
			finalized: false,
			liveMinuteLabel: previewResolvedMinute,
			kickoffUtcMs: previewKickoffUtcMs,
		});
	}, [selectedMatch, previewKickoffUtcMs, previewResolvedMinute]);

	const previewDateLabel =
		previewKickoffUtcMs > 0 ? formatDateTime(previewKickoffUtcMs) : form.date || '';

	const handleSelectMatch = (match: LiveParsedMatch): void => {
		setSelectedMatch(match);
		setPreviewFetchedAt(new Date().toISOString());
	};

	const summary =
		result?.success && parsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				{selectedMatch ? (
					<Box sx={{ maxWidth: RESULTS_CARD_MAX_WIDTH, width: '100%' }}>
						<Typography sx={{ px: 0.25, pb: 0.5, fontSize: '0.75rem', fontWeight: 700 }}>
							{t('apiSandbox.liveCardPreview')}
						</Typography>
						<Box
							sx={{
								border: '1px solid',
								borderColor: 'divider',
								borderRadius: 2,
								bgcolor: 'background.paper',
								overflow: 'hidden',
								boxShadow: 2,
							}}
						>
							<ExternalMatchResultCard
								homeTeam={teamFromParsed(selectedMatch.homeTeam, selectedMatch.homeName)}
								awayTeam={teamFromParsed(selectedMatch.awayTeam, selectedMatch.awayName)}
								scoreView={previewScoreView}
								status={selectedMatch.status ?? 'SCHEDULED'}
								finalized={selectedMatch.status === 'FINISHED'}
								liveMinuteLabel={previewResolvedMinute}
								fetchedAt={previewFetchedAt}
								kickoffUtcMs={previewKickoffUtcMs}
								matchDateLabel={previewDateLabel}
							/>
						</Box>
					</Box>
				) : null}
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
								(comp.matches || []).map((match, idx) => {
									const selected =
										selectedMatch?.externalMatchId === match.externalMatchId
										&& selectedMatch?.homeName === match.homeName;
									return (
										<TableRow
											key={`${comp.title}-${match.externalMatchId || idx}`}
											hover
											selected={selected}
											onClick={() => handleSelectMatch(match)}
											sx={{ cursor: 'pointer' }}
										>
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
									);
								})
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
					{t(
						safeProvider === EURO_FOOTBALL_PROVIDER
							? 'apiSandbox.liveHintEuroFootball'
							: 'apiSandbox.liveHint'
					)}
				</Typography>

				<Box>
					<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.provider')}</Typography>
					<FormControl fullWidth size="small">
						<Select
							value={safeProvider}
							onChange={(e) => onFormChange({ ...form, provider: String(e.target.value) })}
							renderValue={renderProviderSelectValue()}
							sx={providerSelectSx}
						>
							{ProviderSelectItems({ providers: providerOptions })}
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

				<SandboxIdHints
					layer={layer}
					provider={safeProvider}
					onApply={(value) => onFormChange({ ...form, provider: safeProvider, titleContains: value })}
				/>

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
