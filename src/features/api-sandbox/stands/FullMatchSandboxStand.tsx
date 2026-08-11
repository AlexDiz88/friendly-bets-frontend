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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import { useFormatUserDateTime } from '../../../shared/useFormatUserDateTime';
import { getGameScoreView } from '../../../components/utils/gameScoreValidation';
import ExternalMatchFinishedPreview from '../../match-results/ExternalMatchFinishedPreview';
import MatchStatsSection from '../../match-results/MatchStatsSection';
import type MatchTeamStats from '../../match-results/types/MatchTeamStats';
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

export type FullMatchStandForm = {
	provider: string;
	gameId: string;
	date: string;
	titleContains: string;
};

type FullMatchGoal = {
	minute?: string;
	teamSide?: string;
	playerName?: string;
	penalty?: boolean;
	penaltyShootout?: boolean;
	ownGoal?: boolean;
	missed?: boolean;
	varDisallowed?: boolean;
	redCard?: boolean;
	secondYellow?: boolean;
};

type FullMatchParsedTeam = {
	id?: string;
	title?: string;
	logoKey?: string | null;
};

type FullMatchCardParsed = {
	gameId?: string;
	statusText?: string;
	homeTeamName?: string;
	awayTeamName?: string;
	homeTeam?: FullMatchParsedTeam | null;
	awayTeam?: FullMatchParsedTeam | null;
	competitionName?: string;
	goalsCount?: number;
	goals?: FullMatchGoal[];
	stats?: MatchTeamStats | null;
	addedTimeFirstHalf?: number | null;
	addedTimeSecondHalf?: number | null;
	gameScore?: {
		fullTime?: string;
		firstTime?: string;
		overTime?: string;
		penalty?: string;
	} | null;
};

type DayMatchRow = {
	externalMatchId?: string;
	gameId?: string;
	slug?: string;
	homeName?: string;
	awayName?: string;
	utcKickoff?: string | null;
	status?: string;
	scoreText?: string;
};

type DayBrowseParsed = {
	date?: string;
	titleContains?: string | null;
	competitionsTotal?: number;
	competitionsMatched?: number;
	matchesCount?: number;
	competitions?: Array<{
		title?: string;
		seasonId?: number | null;
		stageId?: string | null;
		tournamentSlug?: string | null;
		tournamentPath?: string | null;
		matches?: DayMatchRow[];
	}>;
};

type FullMatchSandboxStandProps = {
	providers: string[];
	form: FullMatchStandForm;
	onFormChange: (next: FullMatchStandForm) => void;
	loading: boolean;
	result: SandboxResult | null;
	onRun: () => void;
	onOpenMatch: (gameId: string) => void;
};

function isDayBrowse(parsed: unknown): parsed is DayBrowseParsed {
	return !!parsed && typeof parsed === 'object' && Array.isArray((parsed as DayBrowseParsed).competitions);
}

function isCardParsed(parsed: unknown): parsed is FullMatchCardParsed {
	return !!parsed && typeof parsed === 'object' && ('gameScore' in (parsed as object) || 'goals' in (parsed as object) || 'statusText' in (parsed as object));
}

function teamFromParsed(resolved: FullMatchParsedTeam | null | undefined, fallbackName?: string) {
	const title = resolved?.title?.trim() || fallbackName?.trim() || '—';
	const logoKey = resolved
		? resolved.logoKey?.trim() || resolved.title || 'no_image'
		: 'no_image';
	return {
		id: resolved?.id || `sandbox-${title}`,
		title,
		logoKey,
	};
}

const FINISHED_CARD_MAX_WIDTH = 400;

export default function FullMatchSandboxStand({
	providers,
	form,
	onFormChange,
	loading,
	result,
	onRun,
	onOpenMatch,
}: FullMatchSandboxStandProps): JSX.Element {
	const { t } = useTranslation();
	const { formatDateTime } = useFormatUserDateTime();
	const layer = 'FULL_MATCH' as const;
	const accent = LAYER_ACCENT[layer];
	const providerOptions = providers.length > 0 ? providers : ['soccer365.ru'];
	const safeProvider = providerOptions.includes(form.provider) ? form.provider : providerOptions[0];
	const isRuscore = safeProvider === 'ruscore.ru';
	const isFlashscore = safeProvider === 'flashscorekz.com';
	const isDayBrowseProvider = isRuscore || isFlashscore;
	const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

	const parsed = result?.parsed ?? null;
	const dayParsed = isDayBrowse(parsed) ? parsed : null;
	const cardParsed = !dayParsed && isCardParsed(parsed) ? parsed : null;

	const daySummary =
		result?.success && dayParsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<Chip size="small" label={`${t('apiSandbox.kpi.competitions')}: ${dayParsed.competitionsMatched ?? 0}/${dayParsed.competitionsTotal ?? 0}`} />
					<Chip size="small" label={`${t('apiSandbox.kpi.matches')}: ${dayParsed.matchesCount ?? 0}`} />
				</Box>
				{(dayParsed.competitions || []).map((comp, cIdx) => (
					<Box key={`${comp.seasonId || comp.title}-${cIdx}`}>
						<Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>
							{comp.title || '—'}
							{comp.seasonId != null
								? ` · ${comp.seasonId}`
								: comp.stageId
									? ` · ${comp.stageId}`
									: ''}
						</Typography>
						<TableContainer>
							<Table size="small" sx={sandboxTableSx(layer)}>
								<TableHead>
									<TableRow>
										<TableCell>{t('apiSandbox.col.home')}</TableCell>
										<TableCell>{t('apiSandbox.col.away')}</TableCell>
										<TableCell>{t('apiSandbox.col.score')}</TableCell>
										<TableCell>{t('apiSandbox.col.kickoff')}</TableCell>
										<TableCell>{t('apiSandbox.col.status')}</TableCell>
										<TableCell>{t('apiSandbox.fields.gameId')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{(comp.matches || []).map((m, mIdx) => {
										const gid = m.gameId || (m.slug && m.externalMatchId ? `${m.slug}/${m.externalMatchId}` : m.externalMatchId) || '';
										return (
											<TableRow
												key={`${gid}-${mIdx}`}
												hover
												selected={selectedGameId === gid}
												onClick={() => {
													if (!gid) return;
													setSelectedGameId(gid);
													onOpenMatch(gid);
												}}
												sx={{ cursor: gid ? 'pointer' : 'default' }}
											>
												<TableCell>{m.homeName || '—'}</TableCell>
												<TableCell>{m.awayName || '—'}</TableCell>
												<TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, whiteSpace: 'nowrap' }}>
													{m.scoreText || '—'}
												</TableCell>
												<TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
													{m.utcKickoff ? formatDateTime(m.utcKickoff) : '—'}
												</TableCell>
												<TableCell>
													{m.status ? (
														<Chip size="small" label={m.status} color={statusChipColor(m.status)} />
													) : (
														'—'
													)}
												</TableCell>
												<TableCell>
													<CopyableValue value={gid} />
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				))}
			</Box>
		) : null;

	const cardSummary =
		result?.success && cardParsed ? (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
				<Box sx={{ maxWidth: FINISHED_CARD_MAX_WIDTH, width: '100%' }}>
					<Typography sx={{ px: 0.25, pb: 0.5, fontSize: '0.75rem', fontWeight: 700 }}>
						{t('apiSandbox.fullMatchCardPreview')}
					</Typography>
					<ExternalMatchFinishedPreview
						homeTeam={teamFromParsed(cardParsed.homeTeam, cardParsed.homeTeamName)}
						awayTeam={teamFromParsed(cardParsed.awayTeam, cardParsed.awayTeamName)}
						scoreView={
							cardParsed.gameScore?.fullTime && cardParsed.gameScore?.firstTime
								? getGameScoreView(
										{
											fullTime: cardParsed.gameScore.fullTime ?? null,
											firstTime: cardParsed.gameScore.firstTime ?? null,
											overTime: cardParsed.gameScore.overTime ?? null,
											penalty: cardParsed.gameScore.penalty ?? null,
										},
										false
									)
								: cardParsed.gameScore?.fullTime || '—'
						}
						events={cardParsed.goals}
						addedTimeFirstHalf={cardParsed.addedTimeFirstHalf}
						addedTimeSecondHalf={cardParsed.addedTimeSecondHalf}
					/>
					<MatchStatsSection stats={cardParsed.stats} />
				</Box>

				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
					<CopyableValue value={cardParsed.gameId} label={t('apiSandbox.fields.gameId')} />
					{cardParsed.competitionName ? (
						<Chip size="small" label={cardParsed.competitionName} variant="outlined" color="error" />
					) : null}
					{cardParsed.statusText ? <Chip size="small" label={cardParsed.statusText} color="success" /> : null}
					<Chip size="small" label={`${t('apiSandbox.kpi.goals')}: ${cardParsed.goalsCount ?? 0}`} />
				</Box>

				{(cardParsed.homeTeamName || cardParsed.awayTeamName) && (
					<Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1.15rem' }}>
						{cardParsed.homeTeamName || '—'} — {cardParsed.awayTeamName || '—'}
					</Typography>
				)}

				{cardParsed.gameScore ? (
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
							gap: 1,
						}}
					>
						{(
							[
								['fullTime', cardParsed.gameScore.fullTime],
								['firstTime', cardParsed.gameScore.firstTime],
								['overTime', cardParsed.gameScore.overTime],
								['penalty', cardParsed.gameScore.penalty],
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

				{(cardParsed.addedTimeFirstHalf != null || cardParsed.addedTimeSecondHalf != null) && (
					<Typography sx={{ fontSize: '0.85rem' }}>
						{t('apiSandbox.fullMatch.addedTime')}: HT +{cardParsed.addedTimeFirstHalf ?? '—'} / FT +
						{cardParsed.addedTimeSecondHalf ?? '—'}
					</Typography>
				)}

				{cardParsed.goals && cardParsed.goals.length > 0 ? (
					<Box>
						<Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', mb: 0.75, color: 'text.secondary' }}>
							{t('apiSandbox.fullMatch.eventsTitle')}
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
							{cardParsed.goals.map((g, idx) => (
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
											minWidth: g.penaltyShootout ? 110 : 48,
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
									{g.redCard ? (
										<Chip
											size="small"
											label={
												g.secondYellow
													? t('apiSandbox.fullMatch.secondYellowRed')
													: t('apiSandbox.fullMatch.redCard')
											}
											color="error"
										/>
									) : null}
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
									{g.varDisallowed ? (
										<Chip size="small" label={t('apiSandbox.fullMatch.varDisallowed')} color="warning" />
									) : null}
								</Box>
							))}
						</Box>
					</Box>
				) : null}
			</Box>
		) : null;

	return (
		<Box sx={sandboxStandLayoutSx(layer)}>
			<Box sx={sandboxFormColSx}>
				<Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
					{t('apiSandbox.layer.FULL_MATCH')}
				</Typography>
				<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: -1 }}>
					{isDayBrowseProvider
						? t('apiSandbox.fullMatchHintRuscore')
						: t('apiSandbox.fullMatchHint')}
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
									gameId: '',
								})
							}
						>
							{providerOptions.map((p) => (
								<MenuItem key={p} value={p}>
									{p}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>

				{isDayBrowseProvider ? (
					<>
						<Box>
							<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.date')}</Typography>
							<TextField
								fullWidth
								size="small"
								type="date"
								value={form.date}
								onChange={(e) => onFormChange({ ...form, date: e.target.value, gameId: '' })}
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
						<Box>
							<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.fields.gameId')}</Typography>
							<TextField
								fullWidth
								size="small"
								value={form.gameId}
								onChange={(e) => onFormChange({ ...form, gameId: e.target.value })}
								placeholder={isFlashscore ? 'nNUWaFf5' : 'slug/563678'}
								helperText={
									isFlashscore
										? t('apiSandbox.fullMatch.flashscoreGameIdHint')
										: t('apiSandbox.fullMatch.ruscoreGameIdHint')
								}
							/>
						</Box>
					</>
				) : (
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
				)}

				<SandboxIdHints
					layer={layer}
					provider={safeProvider}
					onApply={
						isDayBrowseProvider
							? (value) => onFormChange({ ...form, titleContains: value })
							: undefined
					}
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
					summary={daySummary || cardSummary}
					emptyHint={
						isDayBrowseProvider
							? t('apiSandbox.fullMatchEmptyRuscore')
							: t('apiSandbox.fullMatchEmpty')
					}
				/>
			</Box>
		</Box>
	);
}
