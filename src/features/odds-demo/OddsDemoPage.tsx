import {
	Alert,
	Box,
	CircularProgress,
	FormControlLabel,
	Paper,
	Switch,
	Tab,
	Tabs,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import { selectUser } from '../auth/selectors';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import { getOddsDemoEvent, getOddsDemoEventDebug, listOddsDemoEvents, refreshOddsDemoLeague } from './oddsDemoApi';
import OddsMarketGroupAccordion from '../../components/odds/OddsMarketGroupAccordion';
import { OddsDemoDebugDetail, OddsDemoEventDetail, OddsDemoEventSummary, OddsMappingTraceEntry } from './types';

const DEFAULT_LEAGUE = 'international-world-cup';

function MappingTraceTable({ rows }: { rows: OddsMappingTraceEntry[] }): JSX.Element {
	const { t } = useTranslation();
	if (rows.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
				—
			</Typography>
		);
	}
	return (
		<Table size="small" sx={{ mb: 2 }}>
			<TableHead>
				<TableRow>
					<TableCell>{t('oddsDemo.debugMarket', 'Рынок')}</TableCell>
					<TableCell>{t('oddsDemo.debugRawRow', 'JSON строка API')}</TableCell>
					<TableCell>{t('oddsDemo.debugBetTitle', 'BetTitle')}</TableCell>
					<TableCell align="right">{t('oddsDemo.debugStatus', 'Статус')}</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row, idx) => (
					<TableRow key={`${row.marketName}-${row.rawRowJson}-${idx}`}>
						<TableCell sx={{ verticalAlign: 'top', maxWidth: 120 }}>{row.marketName}</TableCell>
						<TableCell
							sx={{
								verticalAlign: 'top',
								fontFamily: 'monospace',
								fontSize: '0.75rem',
								wordBreak: 'break-word',
							}}
						>
							{row.rawRowJson}
							{row.odds ? ` · odds=${row.odds}` : ''}
						</TableCell>
						<TableCell sx={{ verticalAlign: 'top' }}>
							{row.betTitleLabel ?? '—'}
							{row.betTitleCode != null ? ` (${row.betTitleCode})` : ''}
							{row.betTitleIsNot ? ' [NOT]' : ''}
						</TableCell>
						<TableCell align="right" sx={{ verticalAlign: 'top' }}>
							{row.mappingStatus}
							{row.rejectReason ? ` · ${row.rejectReason}` : ''}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default function OddsDemoPage(): JSX.Element {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	const [leagueSlug, setLeagueSlug] = useState(DEFAULT_LEAGUE);
	const [events, setEvents] = useState<OddsDemoEventSummary[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [detail, setDetail] = useState<OddsDemoEventDetail | null>(null);
	const [debugDetail, setDebugDetail] = useState<OddsDemoDebugDetail | null>(null);
	const [debugMode, setDebugMode] = useState(false);
	const [debugTab, setDebugTab] = useState(0);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const loadEvents = useCallback(async () => {
		setLoading(true);
		try {
			const list = await listOddsDemoEvents(leagueSlug.trim());
			setEvents(list);
			setSelectedId((prev) => {
				if (prev != null && list.some((e) => e.oddsApiEventId === prev)) {
					return prev;
				}
				return list[0]?.oddsApiEventId ?? null;
			});
		} catch (e) {
			dispatch(showErrorSnackbar({ message: e instanceof Error ? e.message : 'unknownError' }));
		} finally {
			setLoading(false);
		}
	}, [dispatch, leagueSlug]);

	useEffect(() => {
		void loadEvents();
	}, [loadEvents]);

	useEffect(() => {
		if (selectedId == null) {
			setDetail(null);
			setDebugDetail(null);
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const d = await getOddsDemoEvent(selectedId);
				if (!cancelled) {
					setDetail(d);
				}
				if (debugMode && isStaff) {
					const dbg = await getOddsDemoEventDebug(selectedId);
					if (!cancelled) {
						setDebugDetail(dbg);
					}
				} else if (!cancelled) {
					setDebugDetail(null);
				}
			} catch (e) {
				if (!cancelled) {
					dispatch(showErrorSnackbar({ message: e instanceof Error ? e.message : 'unknownError' }));
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [dispatch, selectedId, debugMode, isStaff]);

	const handleRefresh = async () => {
		if (!isStaff) {
			return;
		}
		setRefreshing(true);
		try {
			await refreshOddsDemoLeague(leagueSlug.trim(), 20);
			dispatch(showSuccessSnackbar({ message: 'oddsApiSyncCompleted' }));
			setSelectedId(null);
			await loadEvents();
		} catch (e) {
			dispatch(showErrorSnackbar({ message: e instanceof Error ? e.message : 'unknownError' }));
		} finally {
			setRefreshing(false);
		}
	};

	const bookmakers = detail?.bookmakers ?? debugDetail?.bookmakers ?? [];
	const debugBookmaker = bookmakers[debugTab] ?? bookmakers[0];
	const debugTrace = debugBookmaker
		? (debugDetail?.mappingTraceByBookmaker?.[debugBookmaker] ?? [])
		: [];

	return (
		<Box sx={{ p: 2, maxWidth: 1100, mx: 'auto' }}>
			<Typography variant="h5" sx={{ mb: 2, fontFamily: 'Shantell Sans' }}>
				{t('oddsDemo.title', 'Демо: кэфы odds-api.io')}
			</Typography>
			<Alert severity="info" sx={{ mb: 2 }}>
				{t(
					'oddsDemo.hint',
					'Данные не привязаны к матчам сайта. Угловые, фолы и четвертные линии (2.25, 1.75…) отфильтрованы. Кэфы Bet365 и 1xbet в одной таблице.'
				)}
			</Alert>

			<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
				<TextField
					size="small"
					label={t('oddsDemo.leagueSlug', 'Slug лиги')}
					value={leagueSlug}
					onChange={(e) => setLeagueSlug(e.target.value)}
					sx={{ minWidth: 280 }}
				/>
				<CustomButton
					onClick={() => void loadEvents()}
					disabled={loading}
					buttonText={t('oddsDemo.load', 'Загрузить из БД')}
				/>
				{isStaff && (
					<CustomSuccessButton
						onClick={() => void handleRefresh()}
						disabled={refreshing}
						buttonText={t('oddsDemo.refresh', 'Обновить из API')}
					/>
				)}
				{isStaff && (
					<FormControlLabel
						control={
							<Switch
								checked={debugMode}
								onChange={(e) => setDebugMode(e.target.checked)}
								size="small"
							/>
						}
						label={t('oddsDemo.debugMode', 'Режим отладки')}
					/>
				)}
				{refreshing && <CircularProgress size={22} />}
			</Box>

			{loading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{!loading && events.length === 0 && (
				<Typography color="text.secondary">
					{t('oddsDemo.empty', 'Нет данных. Админ: «Обновить из API».')}
				</Typography>
			)}

			{!loading && events.length > 0 && (
				<Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
					<Paper variant="outlined" sx={{ flex: '0 0 280px', maxHeight: 420, overflow: 'auto' }}>
						{events.map((ev) => (
							<Box
								key={ev.oddsApiEventId}
								onClick={() => setSelectedId(ev.oddsApiEventId)}
								sx={{
									px: 1.5,
									py: 1,
									cursor: 'pointer',
									bgcolor: selectedId === ev.oddsApiEventId ? 'action.selected' : undefined,
									borderBottom: '1px solid',
									borderColor: 'divider',
								}}
							>
								<Typography variant="body2" fontWeight={600}>
									{ev.home} — {ev.away}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{ev.eventDate} · {ev.mergedLineCount} {t('oddsDemo.lines', 'линий')}
								</Typography>
							</Box>
						))}
					</Paper>

					{detail && (
						<Box sx={{ flex: 1, minWidth: 0 }}>
							<Typography variant="h6" sx={{ mb: 1 }}>
								{detail.home} — {detail.away}
							</Typography>

							{debugMode && debugDetail ? (
								<Box sx={{ mb: 2 }}>
									{debugDetail.mappingIssues.length > 0 && (
										<Alert severity="warning" sx={{ mb: 1 }}>
											{debugDetail.mappingIssues.slice(0, 5).join(' · ')}
										</Alert>
									)}
									<Typography variant="subtitle2" sx={{ mb: 1 }}>
										{t('oddsDemo.debugMapping', 'Маппинг')}
									</Typography>
									<Tabs
										value={debugTab}
										onChange={(_, v: number) => setDebugTab(v)}
										variant="scrollable"
										sx={{ mb: 1 }}
									>
										{bookmakers.map((bk) => (
											<Tab key={bk} label={bk} />
										))}
										<Tab label={t('oddsDemo.debugMerged', 'Итог (merged)')} />
									</Tabs>
									{debugTab < bookmakers.length ? (
										<MappingTraceTable rows={debugTrace} />
									) : (
										(debugDetail.mergedMarketGroups ?? detail.marketGroups ?? []).map((group) => (
											<OddsMarketGroupAccordion
												key={`merged-${group.category}`}
												group={group}
												bookmakers={bookmakers}
												displayMode="best"
											/>
										))
									)}
								</Box>
							) : (
								(detail.marketGroups ?? []).map((group) => (
									<OddsMarketGroupAccordion
										key={group.category}
										group={group}
										bookmakers={bookmakers}
									/>
								))
							)}
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
