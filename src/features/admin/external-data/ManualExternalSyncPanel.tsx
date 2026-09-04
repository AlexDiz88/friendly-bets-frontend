import {
	Alert,
	Avatar,
	Box,
	Checkbox,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	TextField,
	type SelectChangeEvent,
	Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import i18n, { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import CustomSwitch from '../../../components/custom/controls/CustomSwitch';
import { toggleInlineRowSx } from '../../../components/custom/controls/customToggleStyles';
import LeagueSelect from '../../../components/selectors/LeagueSelect';
import MatchdayGridSelect from '../../../components/matchday/MatchdayGridSelect';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import { externalSlotsToMatchdaySlots } from '../../../components/matchday/slotMappers';
import type { MatchdaySlot } from '../../../components/matchday/types';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../../components/utils/teamDisplay';
import AdminSection from '../AdminSection';
import { getActiveSeason } from '../seasons/seasonsSlice';
import { selectActiveSeason } from '../seasons/selectors';
import {
	getLeagueExternalCompetitionInfo,
	getMatchdayFromCache,
} from '../../match-results/matchResultsApi';
import { resolveExternalSeasonForLeague } from '../../match-results/seasonExternalYear';
import type { ExternalMatch } from '../../match-results/types/ExternalMatch';
import { matchSideToDisplayTeam } from '../../match-results/externalMatchDisplay';
import {
	fetchExternalDataLayerConfig,
	syncExternalFullMatch,
	syncExternalLive,
	syncExternalSchedule,
	syncExternalStandings,
	syncOddsProviderSlot,
} from './externalDataAdminApi';
import {
	CHAMPIONAT_PROVIDER,
	EURO_FOOTBALL_PROVIDER,
	FLASHSCORE_PROVIDER,
	MARATHONBET_PROVIDER,
	MELBET_PROVIDER,
	RUSCORE_PROVIDER,
	SOCCER365_PROVIDER,
	TWENTYFOUR_SCORE_PROVIDER,
	firstLiveProvider,
	isInactiveExternalProvider,
	sortProvidersLiveFirst,
} from '../teams/teamProviderConstants';
import {
	ProviderSelectItems,
	providerSelectSx,
	renderProviderSelectValue,
} from '../teams/ProviderOptionLabel';

const SCHEDULE_LEAGUE_CODES = new Set(['EPL', 'BL', 'CL', 'LE', 'EC', 'WC']);
const STANDINGS_LEAGUE_CODES = new Set(['EPL', 'BL']);
const ODDS_PROVIDERS = [MARATHONBET_PROVIDER, MELBET_PROVIDER] as const;
const ODDS_PROVIDER_LEAGUE_CODES: Record<string, Set<string>> = {
	[MARATHONBET_PROVIDER]: new Set(['EPL', 'BL', 'CL', 'LE', 'WC']),
	[MELBET_PROVIDER]: new Set(['EPL', 'BL']),
};
const ODDS_PROVIDER_LABEL_KEY: Record<string, string> = {
	[MARATHONBET_PROVIDER]: 'externalTeamAliasProviderMarathonbet',
	[MELBET_PROVIDER]: 'externalTeamAliasProviderMelbet',
};
const LIVE_PROVIDER_LABEL_KEY: Record<string, string> = {
	[TWENTYFOUR_SCORE_PROVIDER]: 'externalTeamAliasProvider24score',
	[CHAMPIONAT_PROVIDER]: 'externalTeamAliasProviderChampionat',
	[EURO_FOOTBALL_PROVIDER]: 'externalTeamAliasProviderEuroFootball',
};
const FULL_MATCH_PROVIDER_LABEL_KEY: Record<string, string> = {
	[RUSCORE_PROVIDER]: 'externalTeamAliasProviderRuscore',
	[FLASHSCORE_PROVIDER]: 'externalTeamAliasProviderFlashscore',
	[SOCCER365_PROVIDER]: 'externalTeamAliasProviderSoccer365',
};
const MATCH_OPTION_AVATAR = 18;

function todayUtcIsoDate(): string {
	return new Date().toISOString().slice(0, 10);
}

function MatchOptionLabel({ match }: { match: ExternalMatch }): JSX.Element {
	const homeTeam = matchSideToDisplayTeam(match, 'home');
	const awayTeam = matchSideToDisplayTeam(match, 'away');
	const homeName = resolveTeamDisplayName(homeTeam, i18n.language);
	const awayName = resolveTeamDisplayName(awayTeam, i18n.language);
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, ml: 0.5 }}>
			<Avatar
				variant="square"
				src={resolveTeamLogoUrl(homeTeam)}
				alt=""
				sx={{ width: MATCH_OPTION_AVATAR, height: MATCH_OPTION_AVATAR, flexShrink: 0 }}
			/>
			<Typography
				variant="body2"
				sx={{
					fontSize: '0.8rem',
					lineHeight: 1.25,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				{homeName} — {awayName}
			</Typography>
			<Avatar
				variant="square"
				src={resolveTeamLogoUrl(awayTeam)}
				alt=""
				sx={{ width: MATCH_OPTION_AVATAR, height: MATCH_OPTION_AVATAR, flexShrink: 0 }}
			/>
		</Box>
	);
}

export default function ManualExternalSyncPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const [showPanel, setShowPanel] = useState(false);
	const [scheduleLeagueCode, setScheduleLeagueCode] = useState('EPL');
	const [scheduleMatchday, setScheduleMatchday] = useState(1);
	const [scheduleSlots, setScheduleSlots] = useState<MatchdaySlot[]>([]);
	const [scheduleMetaLoading, setScheduleMetaLoading] = useState(false);
	const [oddsProvider, setOddsProvider] = useState<string>(MARATHONBET_PROVIDER);
	const [oddsLeagueCode, setOddsLeagueCode] = useState('EPL');
	const [syncingSchedule, setSyncingSchedule] = useState(false);
	const [syncingOdds, setSyncingOdds] = useState(false);
	const [syncingLive, setSyncingLive] = useState(false);
	const [liveDate, setLiveDate] = useState(todayUtcIsoDate);
	const [liveProvider, setLiveProvider] = useState('');
	const [liveProviders, setLiveProviders] = useState<string[]>([]);
	const [syncingFullMatch, setSyncingFullMatch] = useState(false);
	const [fullMatchDate, setFullMatchDate] = useState(todayUtcIsoDate);
	const [fullMatchProvider, setFullMatchProvider] = useState('');
	const [fullMatchProviders, setFullMatchProviders] = useState<string[]>([]);
	const [syncingStandings, setSyncingStandings] = useState(false);
	const [standingsLeagueCode, setStandingsLeagueCode] = useState('EPL');
	const [forceOddsUpdate, setForceOddsUpdate] = useState(false);
	const [forceMatchday, setForceMatchday] = useState(1);
	const [forceMatchIds, setForceMatchIds] = useState<string[]>([]);
	const [forceSlots, setForceSlots] = useState<MatchdaySlot[]>([]);
	const [forceMatches, setForceMatches] = useState<ExternalMatch[]>([]);
	const [forceMetaLoading, setForceMetaLoading] = useState(false);

	useEffect(() => {
		if (!activeSeason) {
			void dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	useEffect(() => {
		if (!showPanel) {
			return;
		}
		let cancelled = false;
		void (async () => {
			try {
				const config = await fetchExternalDataLayerConfig();
				if (cancelled) {
					return;
				}
				const liveIds = sortProvidersLiveFirst(config.capabilities?.LIVE ?? []);
				setLiveProviders(liveIds);
				const livePrimary = config.layers?.LIVE?.primaryProvider ?? '';
				setLiveProvider((prev) => {
					if (prev && liveIds.includes(prev)) {
						return prev;
					}
					if (livePrimary && liveIds.includes(livePrimary) && !isInactiveExternalProvider(livePrimary)) {
						return livePrimary;
					}
					return firstLiveProvider(liveIds, livePrimary && liveIds.includes(livePrimary) ? livePrimary : '');
				});
				const fullIds = sortProvidersLiveFirst(config.capabilities?.FULL_MATCH ?? []);
				setFullMatchProviders(fullIds);
				const fullPrimary = config.layers?.FULL_MATCH?.primaryProvider ?? '';
				setFullMatchProvider((prev) => {
					if (prev && fullIds.includes(prev)) {
						return prev;
					}
					if (fullPrimary && fullIds.includes(fullPrimary) && !isInactiveExternalProvider(fullPrimary)) {
						return fullPrimary;
					}
					return firstLiveProvider(fullIds, fullPrimary && fullIds.includes(fullPrimary) ? fullPrimary : '');
				});
			} catch (error) {
				if (!cancelled) {
					dispatch(
						showErrorSnackbar({
							message: error instanceof Error ? error.message : 'externalDataLayersLoadFailed',
						})
					);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [showPanel, dispatch]);

	const allLeagues = useMemo(() => activeSeason?.leagues ?? [], [activeSeason?.leagues]);
	const scheduleLeagues = useMemo(
		() => allLeagues.filter((l) => SCHEDULE_LEAGUE_CODES.has(l.leagueCode)),
		[allLeagues]
	);
	const standingsLeagues = useMemo(
		() => allLeagues.filter((l) => STANDINGS_LEAGUE_CODES.has(l.leagueCode)),
		[allLeagues]
	);

	const effectiveStandingsLeague = useMemo(() => {
		if (standingsLeagues.some((l) => l.leagueCode === standingsLeagueCode)) {
			return standingsLeagueCode;
		}
		return standingsLeagues[0]?.leagueCode ?? '';
	}, [standingsLeagues, standingsLeagueCode]);

	const effectiveScheduleLeague = useMemo(() => {
		if (scheduleLeagues.some((l) => l.leagueCode === scheduleLeagueCode)) {
			return scheduleLeagueCode;
		}
		return scheduleLeagues[0]?.leagueCode ?? '';
	}, [scheduleLeagues, scheduleLeagueCode]);

	const scheduleLeague = useMemo(
		() => scheduleLeagues.find((l) => l.leagueCode === effectiveScheduleLeague),
		[scheduleLeagues, effectiveScheduleLeague]
	);

	const scheduleExternalSeason = useMemo(
		() => resolveExternalSeasonForLeague(activeSeason, effectiveScheduleLeague),
		[activeSeason, effectiveScheduleLeague]
	);

	const scheduleSlotValues = useMemo(() => scheduleSlots.map((s) => s.value), [scheduleSlots]);
	const effectiveScheduleMatchday = useMemo(() => {
		if (scheduleSlotValues.includes(scheduleMatchday)) {
			return scheduleMatchday;
		}
		return scheduleSlotValues[0] ?? scheduleMatchday;
	}, [scheduleMatchday, scheduleSlotValues]);

	const oddsLeagues = useMemo(() => {
		const allowed = ODDS_PROVIDER_LEAGUE_CODES[oddsProvider] ?? new Set<string>();
		return allLeagues.filter((l) => allowed.has(l.leagueCode));
	}, [allLeagues, oddsProvider]);

	const effectiveOddsLeague = useMemo(() => {
		if (oddsLeagues.some((l) => l.leagueCode === oddsLeagueCode)) {
			return oddsLeagueCode;
		}
		return oddsLeagues[0]?.leagueCode ?? '';
	}, [oddsLeagues, oddsLeagueCode]);

	const oddsLeague = useMemo(
		() => oddsLeagues.find((l) => l.leagueCode === effectiveOddsLeague),
		[oddsLeagues, effectiveOddsLeague]
	);

	const externalSeason = useMemo(
		() => resolveExternalSeasonForLeague(activeSeason, effectiveOddsLeague),
		[activeSeason, effectiveOddsLeague]
	);

	const forceSlotValues = useMemo(() => forceSlots.map((s) => s.value), [forceSlots]);
	const effectiveForceMatchday = useMemo(() => {
		if (forceSlotValues.includes(forceMatchday)) {
			return forceMatchday;
		}
		return forceSlotValues[0] ?? forceMatchday;
	}, [forceMatchday, forceSlotValues]);

	useEffect(() => {
		if (!scheduleLeague?.id) {
			setScheduleSlots([]);
			return;
		}
		let cancelled = false;
		setScheduleMetaLoading(true);
		void (async () => {
			try {
				const info = await getLeagueExternalCompetitionInfo(scheduleLeague.id, scheduleExternalSeason);
				if (cancelled) {
					return;
				}
				const slots =
					info.matchdaySlots && info.matchdaySlots.length > 0
						? externalSlotsToMatchdaySlots(info.matchdaySlots)
						: Array.from({ length: Math.max(1, info.matchdayCount) }, (_, i) => ({
								value: i + 1,
								label: String(i + 1),
								kind: 'REGULAR' as const,
							}));
				setScheduleSlots(slots);
				const current = slots.some((s) => s.value === info.currentMatchday)
					? info.currentMatchday
					: (slots[0]?.value ?? 1);
				setScheduleMatchday(current);
			} catch (error) {
				if (!cancelled) {
					dispatch(
						showErrorSnackbar({
							message: error instanceof Error ? error.message : 'currentMatchdayUnresolved',
						})
					);
					setScheduleSlots([]);
				}
			} finally {
				if (!cancelled) {
					setScheduleMetaLoading(false);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [scheduleLeague?.id, scheduleExternalSeason, dispatch]);

	useEffect(() => {
		if (!forceOddsUpdate || !oddsLeague?.id) {
			setForceSlots([]);
			setForceMatches([]);
			setForceMatchIds([]);
			return;
		}
		let cancelled = false;
		setForceMetaLoading(true);
		void (async () => {
			try {
				const info = await getLeagueExternalCompetitionInfo(oddsLeague.id, externalSeason);
				if (cancelled) {
					return;
				}
				const slots =
					info.matchdaySlots && info.matchdaySlots.length > 0
						? externalSlotsToMatchdaySlots(info.matchdaySlots)
						: Array.from({ length: Math.max(1, info.matchdayCount) }, (_, i) => ({
								value: i + 1,
								label: String(i + 1),
								kind: 'REGULAR' as const,
							}));
				setForceSlots(slots);
				const current = slots.some((s) => s.value === info.currentMatchday)
					? info.currentMatchday
					: (slots[0]?.value ?? 1);
				setForceMatchday(current);
				setForceMatchIds([]);
			} catch (error) {
				if (!cancelled) {
					dispatch(
						showErrorSnackbar({
							message: error instanceof Error ? error.message : 'currentMatchdayUnresolved',
						})
					);
					setForceSlots([]);
					setForceMatches([]);
				}
			} finally {
				if (!cancelled) {
					setForceMetaLoading(false);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [forceOddsUpdate, oddsLeague?.id, externalSeason, dispatch]);

	useEffect(() => {
		if (!forceOddsUpdate || !oddsLeague?.id || !effectiveOddsLeague || forceSlots.length === 0) {
			return;
		}
		let cancelled = false;
		setForceMetaLoading(true);
		setForceMatchIds([]);
		void (async () => {
			try {
				const page = await getMatchdayFromCache(
					effectiveOddsLeague,
					effectiveForceMatchday,
					externalSeason,
					oddsLeague.id
				);
				if (cancelled) {
					return;
				}
				setForceMatches(page.matches.filter((m) => Boolean(m.id)));
			} catch (error) {
				if (!cancelled) {
					dispatch(
						showErrorSnackbar({
							message: error instanceof Error ? error.message : 'externalMatchLoadError',
						})
					);
					setForceMatches([]);
				}
			} finally {
				if (!cancelled) {
					setForceMetaLoading(false);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		forceOddsUpdate,
		oddsLeague?.id,
		effectiveOddsLeague,
		effectiveForceMatchday,
		externalSeason,
		forceSlots.length,
		dispatch,
	]);

	const handleScheduleSync = async (): Promise<void> => {
		if (!effectiveScheduleLeague) {
			return;
		}
		setSyncingSchedule(true);
		try {
			const result = await syncExternalSchedule(
				effectiveScheduleLeague,
				effectiveScheduleMatchday
			);
			dispatch(
				showSuccessSnackbar({
					message: t('externalScheduleSyncSuccess', {

						upserted: result.upserted,
						skipped: result.skippedUnmapped,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalScheduleSyncFailed',
				})
			);
		} finally {
			setSyncingSchedule(false);
		}
	};

	const handleOddsSync = async (): Promise<void> => {
		if (!oddsLeague?.id || syncingOdds) {
			return;
		}
		if (forceOddsUpdate && forceMatchIds.length === 0) {
			dispatch(showErrorSnackbar({ message: 'matchScheduleIdsRequired' }));
			return;
		}
		setSyncingOdds(true);
		try {
			const result = await syncOddsProviderSlot({
				provider: oddsProvider,
				leagueId: oddsLeague.id,
				season: externalSeason,
				force: forceOddsUpdate,
				matchday: forceOddsUpdate ? effectiveForceMatchday : undefined,
				matchScheduleIds: forceOddsUpdate ? forceMatchIds : undefined,
			});
			dispatch(
				showSuccessSnackbar({
					message: t('externalMatchOddsProviderSyncSuccess', {
						provider: t(ODDS_PROVIDER_LABEL_KEY[oddsProvider] ?? oddsProvider),
						matched: result.matchesMatched,
						eligible: result.matchesEligible,
						saved: result.mergedSaved,
						sse: result.sseCalls,
						failures: result.mappingFailures,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalMatchOddsSyncError',
				})
			);
		} finally {
			setSyncingOdds(false);
		}
	};

	const handleLiveSync = async (): Promise<void> => {
		if (!liveProvider || !liveDate) {
			return;
		}
		setSyncingLive(true);
		try {
			const result = await syncExternalLive({ provider: liveProvider, date: liveDate });
			dispatch(
				showSuccessSnackbar({
					message: t('externalDataLiveSyncSuccess', {
						updated: result.updated,
						finished: result.finishedDetected,
						http: result.httpRequests,
						tracked: result.trackedCount,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalDataLiveSyncFailed',
				})
			);
		} finally {
			setSyncingLive(false);
		}
	};

	const handleFullMatchSync = async (): Promise<void> => {
		if (!fullMatchProvider || !fullMatchDate) {
			return;
		}
		setSyncingFullMatch(true);
		try {
			const result = await syncExternalFullMatch({
				provider: fullMatchProvider,
				date: fullMatchDate,
			});
			dispatch(
				showSuccessSnackbar({
					message: t('externalDataFullMatchSyncSuccess', {
						candidates: result.candidates,
						succeeded: result.succeeded,
						notReady: result.notReady,
						failed: result.failed,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalDataFullMatchSyncFailed',
				})
			);
		} finally {
			setSyncingFullMatch(false);
		}
	};

	const handleStandingsSync = async (): Promise<void> => {
		if (!effectiveStandingsLeague) {
			return;
		}
		setSyncingStandings(true);
		try {
			const result = await syncExternalStandings(effectiveStandingsLeague);
			dispatch(
				showSuccessSnackbar({
					message: t('externalStandingsSyncSuccess', {
						saved: result.rowsSaved,
						skipped: result.skippedUnmapped,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalStandingsSyncFailed',
				})
			);
		} finally {
			setSyncingStandings(false);
		}
	};

	const handleForceMatchIdsChange = (event: SelectChangeEvent<string[]>): void => {
		const value = event.target.value;
		setForceMatchIds(typeof value === 'string' ? value.split(',') : value);
	};

	return (
		<AdminSection
			title={t('manualExternalSyncTitle')}
			hint={showPanel ? t('manualExternalSyncHint') : undefined}
		>
			<CustomButton
				sx={{ width: '100%', mb: showPanel ? 1.5 : 0 }}
				onClick={() => setShowPanel(!showPanel)}
				buttonColor="info"
				buttonVariant="outlined"
				buttonText={showPanel ? t('hideManualExternalSync') : t('showManualExternalSync')}
			/>

			{showPanel ? (
				<>
			<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
				{t('externalDataScheduleSyncTitle')}
			</Typography>
			{scheduleLeagues.length > 0 ? (
				<Box
					sx={{
						mb: 1.5,
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						minWidth: 0,
					}}
				>
					<LeagueSelect
						leagues={scheduleLeagues}
						value={effectiveScheduleLeague}
						onChange={(e) => setScheduleLeagueCode(String(e.target.value))}
						withoutAll
						compact
					/>
					{scheduleMetaLoading && scheduleSlots.length === 0 ? (
						<CircularProgress size={22} sx={{ flexShrink: 0 }} />
					) : scheduleSlots.length > 0 ? (
						<MatchdayGridSelect
							value={effectiveScheduleMatchday}
							matchdayCount={scheduleSlots.length || 1}
							slots={scheduleSlots}
							onChange={setScheduleMatchday}
							disabled={scheduleMetaLoading || syncingSchedule}
							aria-label={t('externalDataScheduleMatchday')}
						/>
					) : null}
				</Box>
			) : null}
			<CustomSuccessButton
				onClick={() => void handleScheduleSync()}
				disabled={
					syncingSchedule ||
					!effectiveScheduleLeague ||
					scheduleMetaLoading ||
					scheduleSlots.length === 0
				}
				loading={syncingSchedule}
				buttonText={t('externalScheduleSync')}
				sx={{ width: '100%', mb: 2.5, mr: 0 }}
			/>

			<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
				{t('externalDataOddsSyncTitle')}
			</Typography>
			<FormControl fullWidth size="small" sx={{ mb: 1 }}>
				<InputLabel id="odds-sync-provider-label">{t('externalDataOddsProvider')}</InputLabel>
				<Select
					labelId="odds-sync-provider-label"
					label={t('externalDataOddsProvider')}
					value={ODDS_PROVIDERS.includes(oddsProvider as (typeof ODDS_PROVIDERS)[number])
						? oddsProvider
						: ODDS_PROVIDERS[0]}
					onChange={(e) => {
						setOddsProvider(String(e.target.value));
						setForceMatchIds([]);
					}}
					renderValue={renderProviderSelectValue((id) => t(ODDS_PROVIDER_LABEL_KEY[id] ?? id))}
					sx={providerSelectSx}
				>
					{ProviderSelectItems({
						providers: ODDS_PROVIDERS,
						labelFor: (id) => t(ODDS_PROVIDER_LABEL_KEY[id] ?? id),
					})}
				</Select>
			</FormControl>
			{oddsLeagues.length > 0 ? (
				<Box sx={{ mb: 1 }}>
					<LeagueSelect
						leagues={oddsLeagues}
						value={effectiveOddsLeague}
						onChange={(e) => {
							setOddsLeagueCode(String(e.target.value));
							setForceMatchIds([]);
						}}
						withoutAll
						fullLeagueNames
					/>
				</Box>
			) : null}
			<Box sx={[toggleInlineRowSx, { mb: 1 }] as SxProps<Theme>}>
				<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
					{t('externalDataOddsForceUpdate')}
				</Typography>
				<CustomSwitch
					checked={forceOddsUpdate}
					onChange={(e) => {
						setForceOddsUpdate(e.target.checked);
						setForceMatchIds([]);
					}}
					inputProps={{ 'aria-label': t('externalDataOddsForceUpdate') }}
				/>
			</Box>			{forceOddsUpdate ? (
				<Box sx={{ mb: 1.5 }}>
					<Alert severity="info" sx={{ mb: 1.5, py: 0.5, fontSize: '0.8rem' }}>
						{t('externalDataOddsForceUpdateNote')}
					</Alert>
					{forceMetaLoading && forceSlots.length === 0 ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
							<CircularProgress size={22} />
						</Box>
					) : (
						<>
							<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
								{t('externalDataOddsForceMatchday')}
							</Typography>
							<Box sx={{ mb: 1 }}>
								<MatchdayGridSelect
									value={effectiveForceMatchday}
									matchdayCount={forceSlots.length || 1}
									slots={forceSlots}
									onChange={(md) => {
										setForceMatchday(md);
										setForceMatchIds([]);
									}}
									disabled={forceMetaLoading || forceSlots.length === 0}
									aria-label={t('externalDataOddsForceMatchday')}
								/>
							</Box>
							<FormControl fullWidth size="small" disabled={forceMetaLoading || forceMatches.length === 0}>
								<InputLabel id="force-odds-matches-label">{t('externalDataOddsForceMatches')}</InputLabel>
								<Select
									labelId="force-odds-matches-label"
									multiple
									value={forceMatchIds}
									onChange={handleForceMatchIdsChange}
									input={<OutlinedInput label={t('externalDataOddsForceMatches')} />}
									renderValue={(selected) =>
										selected.length === 0
											? t('externalDataOddsForceMatchesEmpty')
											: t('externalDataOddsForceMatchesSelected', { count: selected.length })
									}
								>
									{forceMatches.map((match) => (
										<MenuItem key={match.id} value={match.id!}>
											<Checkbox size="small" checked={forceMatchIds.includes(match.id!)} />
											<MatchOptionLabel match={match} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
							{forceMatchIds.length > 0 ? (
								<Box
									component="ul"
									sx={{
										listStyle: 'none',
										m: 0,
										mt: 1,
										p: 0,
										display: 'flex',
										flexDirection: 'column',
										gap: 0.75,
									}}
								>
									{forceMatches
										.filter((match) => match.id != null && forceMatchIds.includes(match.id))
										.map((match) => (
											<Box
												component="li"
												key={match.id}
												sx={{
													display: 'flex',
													alignItems: 'center',
													minWidth: 0,
													px: 0.5,
												}}
											>
												<MatchOptionLabel match={match} />
											</Box>
										))}
								</Box>
							) : null}
						</>
					)}
				</Box>
			) : (
				<Alert severity="info" sx={{ mb: 1.5, py: 0.5, fontSize: '0.8rem' }}>
					{t('externalDataOddsSyncMissingOnlyNote')}
				</Alert>
			)}
			<CustomSuccessButton
				onClick={() => void handleOddsSync()}
				disabled={
					syncingOdds ||
					!oddsLeague?.id ||
					(forceOddsUpdate && (forceMatchIds.length === 0 || forceMetaLoading))
				}
				loading={syncingOdds}
				buttonText={
					forceOddsUpdate ? t('externalDataOddsForceSyncNow') : t('externalDataOddsSyncNow')
				}
				sx={{ width: '100%', mb: 2.5, mr: 0 }}
			/>

			<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
				{t('externalDataLiveSyncTitle')}
			</Typography>
			<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1 }}>
				{t('externalDataLiveSyncHint')}
			</Typography>
			<FormControl fullWidth size="small" sx={{ mb: 1 }}>
				<InputLabel id="live-sync-provider-label">{t('externalDataLiveProvider')}</InputLabel>
				<Select
					labelId="live-sync-provider-label"
					label={t('externalDataLiveProvider')}
					value={liveProviders.includes(liveProvider) ? liveProvider : ''}
					onChange={(e) => setLiveProvider(String(e.target.value))}
					disabled={liveProviders.length === 0}
					renderValue={renderProviderSelectValue((id) =>
						LIVE_PROVIDER_LABEL_KEY[id] ? t(LIVE_PROVIDER_LABEL_KEY[id]) : id
					)}
					sx={providerSelectSx}
				>
					{ProviderSelectItems({
						providers: liveProviders,
						labelFor: (id) => (LIVE_PROVIDER_LABEL_KEY[id] ? t(LIVE_PROVIDER_LABEL_KEY[id]) : id),
					})}
				</Select>
			</FormControl>
			<TextField
				fullWidth
				size="small"
				type="date"
				label={t('externalDataLiveSyncDate')}
				value={liveDate}
				onChange={(e) => setLiveDate(e.target.value)}
				InputLabelProps={{ shrink: true }}
				sx={{ mb: 1.5 }}
			/>
			<CustomSuccessButton
				onClick={() => void handleLiveSync()}
				disabled={syncingLive || !liveProvider || !liveDate}
				loading={syncingLive}
				buttonText={t('externalDataLiveSyncNow')}
				sx={{ width: '100%', mb: 2.5, mr: 0 }}
			/>

			<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
				{t('externalDataFullMatchSyncTitle')}
			</Typography>
			<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1 }}>
				{t('externalDataFullMatchSyncHint')}
			</Typography>
			<FormControl fullWidth size="small" sx={{ mb: 1 }}>
				<InputLabel id="full-match-sync-provider-label">{t('externalDataFullMatchProvider')}</InputLabel>
				<Select
					labelId="full-match-sync-provider-label"
					label={t('externalDataFullMatchProvider')}
					value={fullMatchProviders.includes(fullMatchProvider) ? fullMatchProvider : ''}
					onChange={(e) => setFullMatchProvider(String(e.target.value))}
					disabled={fullMatchProviders.length === 0}
					renderValue={renderProviderSelectValue((id) =>
						FULL_MATCH_PROVIDER_LABEL_KEY[id] ? t(FULL_MATCH_PROVIDER_LABEL_KEY[id]) : id
					)}
					sx={providerSelectSx}
				>
					{ProviderSelectItems({
						providers: fullMatchProviders,
						labelFor: (id) =>
							FULL_MATCH_PROVIDER_LABEL_KEY[id] ? t(FULL_MATCH_PROVIDER_LABEL_KEY[id]) : id,
					})}
				</Select>
			</FormControl>
			<TextField
				fullWidth
				size="small"
				type="date"
				label={t('externalDataFullMatchSyncDate')}
				value={fullMatchDate}
				onChange={(e) => setFullMatchDate(e.target.value)}
				InputLabelProps={{ shrink: true }}
				sx={{ mb: 1.5 }}
			/>
			<CustomSuccessButton
				onClick={() => void handleFullMatchSync()}
				disabled={syncingFullMatch || !fullMatchProvider || !fullMatchDate}
				loading={syncingFullMatch}
				buttonText={t('externalDataFullMatchSyncNow')}
				sx={{ width: '100%', mb: 2.5, mr: 0 }}
			/>

			<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
				{t('externalDataStandingsSyncTitle')}
			</Typography>
			{standingsLeagues.length > 0 ? (
				<Box sx={{ mb: 1.5 }}>
					<LeagueSelect
						leagues={standingsLeagues}
						value={effectiveStandingsLeague}
						onChange={(e) => setStandingsLeagueCode(String(e.target.value))}
						withoutAll
						fullLeagueNames
					/>
				</Box>
			) : null}
			<CustomSuccessButton
				onClick={() => void handleStandingsSync()}
				disabled={syncingStandings || !effectiveStandingsLeague}
				loading={syncingStandings}
				buttonText={t('externalDataStandingsSyncNow')}
				sx={{ width: '100%', mr: 0 }}
			/>
				</>
			) : null}
		</AdminSection>
	);
}
