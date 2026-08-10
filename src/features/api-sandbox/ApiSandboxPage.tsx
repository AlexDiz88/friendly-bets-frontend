import { Box, CircularProgress, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import {
	fetchExternalDataLayerConfig,
	type ExternalDataLayer,
} from '../admin/external-data/externalDataAdminApi';
import {
	sandboxFullMatch,
	sandboxLive,
	sandboxOdds,
	sandboxSchedule,
	type SandboxResult,
} from './apiSandboxApi';
import { sandboxHintSx, sandboxPageRootSx, sandboxTitleSx } from './apiSandboxPageStyles';
import SandboxLayerTabs from './SandboxLayerTabs';
import FullMatchSandboxStand, {
	type FullMatchStandForm,
} from './stands/FullMatchSandboxStand';
import LiveSandboxStand, { type LiveStandForm } from './stands/LiveSandboxStand';
import OddsSandboxStand, {
	type OddsMode,
	type OddsModeForm,
	type OddsModeStandState,
} from './stands/OddsSandboxStand';
import ScheduleSandboxStand, { type ScheduleStandForm } from './stands/ScheduleSandboxStand';
import {
	SOCCER365_PROVIDER,
	SPORTS_RU_PROVIDER,
	FOOTBALL24_PROVIDER,
} from '../admin/teams/teamProviderConstants';

function todayIsoDate(): string {
	const d = new Date();
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

function emptyOddsMode(provider = 'marathonbet'): OddsModeStandState {
	return {
		form: { provider, treeId: '' },
		loading: false,
		result: null,
	};
}

type LayerStandState<F> = {
	form: F;
	loading: boolean;
	result: SandboxResult | null;
};

export default function ApiSandboxPage(): JSX.Element {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [activeLayer, setActiveLayer] = useState<ExternalDataLayer>('SCHEDULE');
	const [capabilities, setCapabilities] = useState<Record<string, string[]>>({});
	const [configLoading, setConfigLoading] = useState(true);

	const [schedule, setSchedule] = useState<LayerStandState<ScheduleStandForm>>({
		form: { provider: 'soccer365.ru', competitionId: '', round: '', limit: '1' },
		loading: false,
		result: null,
	});
	const [oddsMode, setOddsMode] = useState<OddsMode>('tournament');
	const [oddsTournament, setOddsTournament] = useState<OddsModeStandState>(() => emptyOddsMode());
	const [oddsEvent, setOddsEvent] = useState<OddsModeStandState>(() => emptyOddsMode());
	const [live, setLive] = useState<LayerStandState<LiveStandForm>>({
		form: { provider: '24score.pro', date: todayIsoDate(), titleContains: '' },
		loading: false,
		result: null,
	});
	const [fullMatch, setFullMatch] = useState<LayerStandState<FullMatchStandForm>>({
		form: { provider: 'soccer365.ru', gameId: '', date: todayIsoDate(), titleContains: '' },
		loading: false,
		result: null,
	});

	useEffect(() => {
		let cancelled = false;
		setConfigLoading(true);
		void fetchExternalDataLayerConfig()
			.then((config) => {
				if (cancelled) return;
				setCapabilities(config.capabilities || {});
				const scheduleProviders = config.capabilities?.SCHEDULE || [];
				const oddsProviders = config.capabilities?.ODDS || [];
				const liveProviders = config.capabilities?.LIVE || [];
				const fullProviders = config.capabilities?.FULL_MATCH || [];
				const oddsProvider = oddsProviders[0] || 'marathonbet';
				setSchedule((prev) => ({
					...prev,
					form: {
						...prev.form,
						provider: scheduleProviders[0] || prev.form.provider,
					},
				}));
				setOddsTournament((prev) => ({
					...prev,
					form: { ...prev.form, provider: oddsProvider },
				}));
				setOddsEvent((prev) => ({
					...prev,
					form: { ...prev.form, provider: oddsProvider },
				}));
				setLive((prev) => ({
					...prev,
					form: {
						...prev.form,
						provider: liveProviders[0] || prev.form.provider,
					},
				}));
				setFullMatch((prev) => ({
					...prev,
					form: {
						...prev.form,
						provider: fullProviders[0] || prev.form.provider,
					},
				}));
			})
			.catch((err: Error) => {
				if (!cancelled) {
					dispatch(showErrorSnackbar({ message: err.message || 'externalDataLayersLoadFailed' }));
				}
			})
			.finally(() => {
				if (!cancelled) setConfigLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [dispatch]);

	const runSchedule = useCallback(async () => {
		const provider = schedule.form.provider;
		const idRaw = schedule.form.competitionId.trim();
		let competitionId: number | undefined;
		let calendarPath: string | undefined;
		if (provider === SPORTS_RU_PROVIDER) {
			if (!idRaw) {
				dispatch(showErrorSnackbar({ message: 'sandboxCalendarPathRequired' }));
				return;
			}
			calendarPath = idRaw;
		} else if (provider === SOCCER365_PROVIDER || provider === FOOTBALL24_PROVIDER) {
			competitionId = Number(idRaw);
			if (!Number.isFinite(competitionId) || competitionId <= 0) {
				dispatch(showErrorSnackbar({ message: 'sandboxCompetitionIdRequired' }));
				return;
			}
		} else {
			dispatch(showErrorSnackbar({ message: 'sandboxUnsupportedProvider' }));
			return;
		}
		const roundRaw = schedule.form.round.trim();
		let round: number | undefined;
		if (roundRaw) {
			round = Number(roundRaw);
			if (!Number.isFinite(round) || round <= 0) {
				dispatch(showErrorSnackbar({ message: 'sandboxRoundInvalid' }));
				return;
			}
		}
		const limitRaw = schedule.form.limit.trim();
		let limit: number | undefined;
		if (limitRaw) {
			limit = Number(limitRaw);
			if (!Number.isFinite(limit) || limit <= 0) {
				dispatch(showErrorSnackbar({ message: 'sandboxLimitInvalid' }));
				return;
			}
		}
		setSchedule((prev) => ({ ...prev, loading: true }));
		try {
			const result = await sandboxSchedule({
				provider,
				competitionId,
				calendarPath,
				round,
				limit,
			});
			setSchedule((prev) => ({ ...prev, result, loading: false }));
		} catch (err) {
			setSchedule((prev) => ({ ...prev, loading: false }));
			dispatch(showErrorSnackbar({ message: (err as Error).message }));
		}
	}, [dispatch, schedule.form]);

	const runOddsMode = useCallback(
		async (mode: OddsMode, form: OddsModeForm, setState: typeof setOddsTournament) => {
			const treeId = Number(form.treeId);
			if (!Number.isFinite(treeId) || treeId <= 0) {
				dispatch(showErrorSnackbar({ message: 'sandboxTreeIdRequired' }));
				return;
			}
			setState((prev) => ({ ...prev, loading: true }));
			try {
				const result = await sandboxOdds({
					provider: form.provider,
					mode,
					treeId,
				});
				setState((prev) => ({ ...prev, result, loading: false }));
			} catch (err) {
				setState((prev) => ({ ...prev, loading: false }));
				dispatch(showErrorSnackbar({ message: (err as Error).message }));
			}
		},
		[dispatch]
	);

	const runLive = useCallback(async () => {
		if (!live.form.date) {
			dispatch(showErrorSnackbar({ message: 'sandboxDateRequired' }));
			return;
		}
		setLive((prev) => ({ ...prev, loading: true }));
		try {
			const result = await sandboxLive({
				provider: live.form.provider,
				date: live.form.date,
				titleContains: live.form.titleContains.trim() || undefined,
			});
			setLive((prev) => ({ ...prev, result, loading: false }));
		} catch (err) {
			setLive((prev) => ({ ...prev, loading: false }));
			dispatch(showErrorSnackbar({ message: (err as Error).message }));
		}
	}, [dispatch, live.form]);

	const runFullMatch = useCallback(async () => {
		const provider = fullMatch.form.provider;
		const gameId = fullMatch.form.gameId.trim();
		const date = fullMatch.form.date.trim();
		if (provider === 'ruscore.ru') {
			if (!gameId && !date) {
				dispatch(showErrorSnackbar({ message: 'sandboxDateRequired' }));
				return;
			}
		} else if (!gameId) {
			dispatch(showErrorSnackbar({ message: 'sandboxGameIdRequired' }));
			return;
		}
		setFullMatch((prev) => ({ ...prev, loading: true }));
		try {
			const result = await sandboxFullMatch({
				provider,
				gameId: gameId || undefined,
				date: !gameId && date ? date : undefined,
				titleContains: fullMatch.form.titleContains.trim() || undefined,
			});
			setFullMatch((prev) => ({ ...prev, result, loading: false }));
		} catch (err) {
			setFullMatch((prev) => ({ ...prev, loading: false }));
			dispatch(showErrorSnackbar({ message: (err as Error).message }));
		}
	}, [dispatch, fullMatch.form]);

	const openFullMatchCard = useCallback(
		async (gameId: string) => {
			if (!gameId.trim()) {
				return;
			}
			setFullMatch((prev) => ({
				...prev,
				form: { ...prev.form, gameId: gameId.trim() },
				loading: true,
			}));
			try {
				const result = await sandboxFullMatch({
					provider: fullMatch.form.provider,
					gameId: gameId.trim(),
				});
				setFullMatch((prev) => ({ ...prev, result, loading: false }));
			} catch (err) {
				setFullMatch((prev) => ({ ...prev, loading: false }));
				dispatch(showErrorSnackbar({ message: (err as Error).message }));
			}
		},
		[dispatch, fullMatch.form.provider]
	);

	return (
		<Box sx={sandboxPageRootSx}>
			<Typography sx={sandboxTitleSx}>{t('apiSandbox.title')}</Typography>
			<Typography sx={sandboxHintSx}>{t('apiSandbox.hint')}</Typography>

			<SandboxLayerTabs value={activeLayer} onChange={setActiveLayer} />

			{configLoading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
					<CircularProgress />
				</Box>
			) : (
				<>
					{activeLayer === 'SCHEDULE' ? (
						<ScheduleSandboxStand
							providers={capabilities.SCHEDULE || []}
							form={schedule.form}
							onFormChange={(form) => setSchedule((prev) => ({ ...prev, form }))}
							loading={schedule.loading}
							result={schedule.result}
							onRun={() => void runSchedule()}
						/>
					) : null}
					{activeLayer === 'ODDS' ? (
						<OddsSandboxStand
							providers={capabilities.ODDS || []}
							activeMode={oddsMode}
							onModeChange={setOddsMode}
							tournament={oddsTournament}
							event={oddsEvent}
							onTournamentFormChange={(form) =>
								setOddsTournament((prev) => ({ ...prev, form }))
							}
							onEventFormChange={(form) => setOddsEvent((prev) => ({ ...prev, form }))}
							onRunTournament={() =>
								void runOddsMode('tournament', oddsTournament.form, setOddsTournament)
							}
							onRunEvent={() => void runOddsMode('event', oddsEvent.form, setOddsEvent)}
						/>
					) : null}
					{activeLayer === 'LIVE' ? (
						<LiveSandboxStand
							providers={capabilities.LIVE || []}
							form={live.form}
							onFormChange={(form) => setLive((prev) => ({ ...prev, form }))}
							loading={live.loading}
							result={live.result}
							onRun={() => void runLive()}
						/>
					) : null}
					{activeLayer === 'FULL_MATCH' ? (
						<FullMatchSandboxStand
							providers={capabilities.FULL_MATCH || []}
							form={fullMatch.form}
							onFormChange={(form) => setFullMatch((prev) => ({ ...prev, form }))}
							loading={fullMatch.loading}
							result={fullMatch.result}
							onRun={() => void runFullMatch()}
							onOpenMatch={(gameId) => void openFullMatchCard(gameId)}
						/>
					) : null}
				</>
			)}
		</Box>
	);
}
