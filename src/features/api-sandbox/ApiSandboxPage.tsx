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
import OddsSandboxStand, { type OddsStandForm } from './stands/OddsSandboxStand';
import ScheduleSandboxStand, { type ScheduleStandForm } from './stands/ScheduleSandboxStand';

function todayIsoDate(): string {
	const d = new Date();
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
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
		form: { provider: 'soccer365.ru', competitionId: '' },
		loading: false,
		result: null,
	});
	const [odds, setOdds] = useState<LayerStandState<OddsStandForm>>({
		form: { provider: 'marathonbet', mode: 'tournament', treeId: '' },
		loading: false,
		result: null,
	});
	const [live, setLive] = useState<LayerStandState<LiveStandForm>>({
		form: { provider: '24score.pro', date: todayIsoDate(), titleContains: '' },
		loading: false,
		result: null,
	});
	const [fullMatch, setFullMatch] = useState<LayerStandState<FullMatchStandForm>>({
		form: { provider: 'soccer365.ru', gameId: '' },
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
				setSchedule((prev) => ({
					...prev,
					form: {
						...prev.form,
						provider: scheduleProviders[0] || prev.form.provider,
					},
				}));
				setOdds((prev) => ({
					...prev,
					form: {
						...prev.form,
						provider: oddsProviders[0] || prev.form.provider,
					},
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
		const competitionId = Number(schedule.form.competitionId);
		if (!Number.isFinite(competitionId) || competitionId <= 0) {
			dispatch(showErrorSnackbar({ message: 'sandboxCompetitionIdRequired' }));
			return;
		}
		setSchedule((prev) => ({ ...prev, loading: true }));
		try {
			const result = await sandboxSchedule({
				provider: schedule.form.provider,
				competitionId,
			});
			setSchedule((prev) => ({ ...prev, result, loading: false }));
		} catch (err) {
			setSchedule((prev) => ({ ...prev, loading: false }));
			dispatch(showErrorSnackbar({ message: (err as Error).message }));
		}
	}, [dispatch, schedule.form]);

	const runOdds = useCallback(async () => {
		const treeId = Number(odds.form.treeId);
		if (!Number.isFinite(treeId) || treeId <= 0) {
			dispatch(showErrorSnackbar({ message: 'sandboxTreeIdRequired' }));
			return;
		}
		setOdds((prev) => ({ ...prev, loading: true }));
		try {
			const result = await sandboxOdds({
				provider: odds.form.provider,
				mode: odds.form.mode,
				treeId,
			});
			setOdds((prev) => ({ ...prev, result, loading: false }));
		} catch (err) {
			setOdds((prev) => ({ ...prev, loading: false }));
			dispatch(showErrorSnackbar({ message: (err as Error).message }));
		}
	}, [dispatch, odds.form]);

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
		if (!fullMatch.form.gameId.trim()) {
			dispatch(showErrorSnackbar({ message: 'sandboxGameIdRequired' }));
			return;
		}
		setFullMatch((prev) => ({ ...prev, loading: true }));
		try {
			const result = await sandboxFullMatch({
				provider: fullMatch.form.provider,
				gameId: fullMatch.form.gameId.trim(),
			});
			setFullMatch((prev) => ({ ...prev, result, loading: false }));
		} catch (err) {
			setFullMatch((prev) => ({ ...prev, loading: false }));
			dispatch(showErrorSnackbar({ message: (err as Error).message }));
		}
	}, [dispatch, fullMatch.form]);

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
							form={odds.form}
							onFormChange={(form) => setOdds((prev) => ({ ...prev, form }))}
							loading={odds.loading}
							result={odds.result}
							onRun={() => void runOdds()}
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
						/>
					) : null}
				</>
			)}
		</Box>
	);
}
