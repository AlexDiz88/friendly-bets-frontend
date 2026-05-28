import {
	Alert,
	Box,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
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
import { getOddsDemoEvent, listOddsDemoEvents, refreshOddsDemoLeague } from './oddsDemoApi';
import { OddsDemoEventDetail, OddsDemoEventSummary } from './types';

const DEFAULT_LEAGUE = 'international-world-cup';

export default function OddsDemoPage(): JSX.Element {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	const [leagueSlug, setLeagueSlug] = useState(DEFAULT_LEAGUE);
	const [events, setEvents] = useState<OddsDemoEventSummary[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [detail, setDetail] = useState<OddsDemoEventDetail | null>(null);
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
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const d = await getOddsDemoEvent(selectedId);
				if (!cancelled) {
					setDetail(d);
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
	}, [dispatch, selectedId]);

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

	const bookmakers = detail?.bookmakers ?? [];

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
							{detail.mergedLines.map((line) => (
								<TableContainer
									key={`${line.marketName}-${line.line ?? 'main'}`}
									component={Paper}
									variant="outlined"
									sx={{ mb: 2 }}
								>
									<Typography sx={{ px: 1.5, pt: 1, fontWeight: 600 }}>
										{line.marketName}
										{line.line ? ` (${line.line})` : ''}
									</Typography>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell>{t('oddsDemo.selection', 'Исход')}</TableCell>
												{bookmakers.map((bk) => (
													<TableCell key={bk} align="right">
														{bk}
													</TableCell>
												))}
											</TableRow>
										</TableHead>
										<TableBody>
											{line.selections.map((sel) => (
												<TableRow key={sel.selectionKey}>
													<TableCell>{sel.displayLabel}</TableCell>
													{bookmakers.map((bk) => (
														<TableCell key={bk} align="right">
															{sel.bookmakerOdds[bk] ?? '—'}
														</TableCell>
													))}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							))}
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
