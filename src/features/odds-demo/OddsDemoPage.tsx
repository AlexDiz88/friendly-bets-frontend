import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
	Box,
	CircularProgress,
	IconButton,
	Tab,
	Tabs,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import CustomCalendarDialog from '../../components/custom/dialog/CustomCalendarDialog';
import { selectUser } from '../auth/selectors';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import {
	clearAllOddsDemo,
	clearOddsDemoLeague,
	deleteOddsDemoEvent,
	getOddsDemoEvent,
	getOddsDemoEventDebug,
	listOddsDemoApiEvents,
	listOddsDemoEvents,
	appendEventIdToInput,
	parseEventIdsInput,
	refreshOddsDemoEvents,
	refreshOddsDemoLeague,
	type OddsDemoEventId,
} from './oddsDemoApi';
import OddsMarketGroupAccordion from '../../components/odds/OddsMarketGroupAccordion';
import { OddsDemoDebugDetail, OddsDemoEventDetail, OddsDemoEventSummary, OddsMappingTraceEntry } from './types';
import {
	oddsDemoApiEventsPreviewSx,
	oddsDemoDetailPanelSx,
	oddsDemoEventIdChipSx,
	oddsDemoHintSx,
	oddsDemoMatchItemSx,
	oddsDemoMatchListSx,
	oddsDemoPageRootSx,
	oddsDemoPanelSx,
	oddsDemoTitleSx,
	oddsDemoToolbarRowSx,
	oddsDemoDebugTabsSx,
	oddsDemoDebugTabsWrapSx,
	oddsDemoViewTabsSx,
} from './oddsDemoPageStyles';

const DEFAULT_LEAGUE = 'international-world-cup';
const LEAGUE_REFRESH_LIMIT = 20;
const API_EVENTS_LIMIT = 50;

type ConfirmAction = 'deleteEvent' | 'clearLeague' | 'clearAll' | null;

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

function formatEventKickoff(iso: string): string {
	if (!iso) {
		return '—';
	}
	try {
		return new Date(iso).toLocaleString(undefined, {
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
		});
	} catch {
		return iso;
	}
}

export default function OddsDemoPage(): JSX.Element {
	const { t } = useTranslation();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	const [leagueSlug, setLeagueSlug] = useState(DEFAULT_LEAGUE);
	const [eventIdsInput, setEventIdsInput] = useState('');
	const [apiEventsPreview, setApiEventsPreview] = useState<OddsDemoEventId[]>([]);
	const [events, setEvents] = useState<OddsDemoEventSummary[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [detail, setDetail] = useState<OddsDemoEventDetail | null>(null);
	const [debugDetail, setDebugDetail] = useState<OddsDemoDebugDetail | null>(null);
	const [viewTab, setViewTab] = useState(0);
	const [debugTab, setDebugTab] = useState(0);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [fetchingApiIds, setFetchingApiIds] = useState(false);
	const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
	const [pendingDeleteEventId, setPendingDeleteEventId] = useState<number | null>(null);

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
		setApiEventsPreview([]);
	}, [leagueSlug]);

	useEffect(() => {
		if (selectedId == null) {
			setDetail(null);
			setDebugDetail(null);
			setViewTab(0);
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

	useEffect(() => {
		if (!isStaff || selectedId == null || viewTab !== 1) {
			setDebugDetail(null);
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const dbg = await getOddsDemoEventDebug(selectedId);
				if (!cancelled) {
					setDebugDetail(dbg);
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
	}, [dispatch, isStaff, selectedId, viewTab]);

	const handleRefreshLeague = async () => {
		if (!isStaff) {
			return;
		}
		setRefreshing(true);
		try {
			const result = await refreshOddsDemoLeague(leagueSlug.trim(), LEAGUE_REFRESH_LIMIT);
			dispatch(
				showSuccessSnackbar({
					message: t('oddsDemo.refreshSuccess', {
						count: result.eventsStored,
						defaultValue: 'Обновлено матчей: {{count}}',
					}),
				})
			);
			setSelectedId(null);
			await loadEvents();
		} catch (e) {
			dispatch(showErrorSnackbar({ message: e instanceof Error ? e.message : 'unknownError' }));
		} finally {
			setRefreshing(false);
		}
	};

	const handleRefreshByIds = async () => {
		if (!isStaff) {
			return;
		}
		const ids = parseEventIdsInput(eventIdsInput);
		if (ids.length === 0) {
			dispatch(showErrorSnackbar({ message: 'oddsDemoEventIdsRequired' }));
			return;
		}
		setRefreshing(true);
		try {
			const result = await refreshOddsDemoEvents(leagueSlug.trim(), ids);
			dispatch(
				showSuccessSnackbar({
					message: t('oddsDemo.refreshSuccess', {
						count: result.eventsStored,
						defaultValue: 'Обновлено матчей: {{count}}',
					}),
				})
			);
			await loadEvents();
			if (ids.length === 1) {
				setSelectedId(ids[0]);
			}
		} catch (e) {
			dispatch(showErrorSnackbar({ message: e instanceof Error ? e.message : 'unknownError' }));
		} finally {
			setRefreshing(false);
		}
	};

	const handleFetchApiIds = async () => {
		if (!isStaff) {
			return;
		}
		setFetchingApiIds(true);
		try {
			const list = await listOddsDemoApiEvents(leagueSlug.trim(), API_EVENTS_LIMIT);
			setApiEventsPreview(list);
			dispatch(
				showSuccessSnackbar({
					message: t('oddsDemo.apiIdsFetched', {
						count: list.length,
						defaultValue: 'Получено ID из API: {{count}}',
					}),
				})
			);
		} catch (e) {
			dispatch(showErrorSnackbar({ message: e instanceof Error ? e.message : 'unknownError' }));
		} finally {
			setFetchingApiIds(false);
		}
	};

	const handleApplyAllApiIds = () => {
		if (apiEventsPreview.length === 0) {
			return;
		}
		setEventIdsInput(apiEventsPreview.map((ev) => ev.id).join(', '));
	};

	const handleCopyEventIdToInput = (eventId: number, event: React.MouseEvent) => {
		event.stopPropagation();
		if (!isStaff) {
			return;
		}
		setEventIdsInput((prev) => appendEventIdToInput(prev, eventId));
	};

	const handleConfirm = async () => {
		try {
			if (confirmAction === 'deleteEvent' && pendingDeleteEventId != null) {
				await deleteOddsDemoEvent(pendingDeleteEventId);
				dispatch(showSuccessSnackbar({ message: t('oddsDemo.eventDeleted') }));
				if (selectedId === pendingDeleteEventId) {
					setSelectedId(null);
				}
				await loadEvents();
			} else if (confirmAction === 'clearLeague') {
				const result = await clearOddsDemoLeague(leagueSlug.trim());
				dispatch(
					showSuccessSnackbar({
						message: t('oddsDemo.leagueCleared', {
							count: result.deletedCount,
							defaultValue: 'Удалено снимков: {{count}}',
						}),
					})
				);
				setSelectedId(null);
				await loadEvents();
			} else if (confirmAction === 'clearAll') {
				const result = await clearAllOddsDemo();
				dispatch(
					showSuccessSnackbar({
						message: t('oddsDemo.allCleared', {
							count: result.deletedCount,
							defaultValue: 'Полная очистка: {{count}} снимков',
						}),
					})
				);
				setSelectedId(null);
				await loadEvents();
			}
		} catch (e) {
			dispatch(showErrorSnackbar({ message: e instanceof Error ? e.message : 'unknownError' }));
		} finally {
			setConfirmAction(null);
			setPendingDeleteEventId(null);
		}
	};

	const openDeleteEvent = (eventId: number, event: React.MouseEvent) => {
		event.stopPropagation();
		setPendingDeleteEventId(eventId);
		setConfirmAction('deleteEvent');
	};

	const bookmakers = detail?.bookmakers ?? debugDetail?.bookmakers ?? [];
	const debugBookmaker = bookmakers[debugTab] ?? bookmakers[0];
	const debugTrace = debugBookmaker
		? (debugDetail?.mappingTraceByBookmaker?.[debugBookmaker] ?? [])
		: [];

	const confirmDialogContent = (): { title: string; helper: string; accept: string } => {
		if (confirmAction === 'deleteEvent' && pendingDeleteEventId != null) {
			const ev = events.find((e) => e.oddsApiEventId === pendingDeleteEventId);
			const label = ev ? `${ev.home} — ${ev.away}` : String(pendingDeleteEventId);
			return {
				title: t('oddsDemo.deleteEventTitle', 'Удалить снимок матча?'),
				helper: t('oddsDemo.deleteEventHelper', {
					label,
					id: pendingDeleteEventId,
					defaultValue: '{{label}} (ID {{id}}) будет удалён из демо-кэша.',
				}),
				accept: t('btnText.delete', 'Удалить'),
			};
		}
		if (confirmAction === 'clearLeague') {
			return {
				title: t('oddsDemo.clearLeagueTitle', 'Очистить лигу?'),
				helper: t('oddsDemo.clearLeagueHelper', {
					league: leagueSlug.trim(),
					defaultValue: 'Все снимки для «{{league}}» будут удалены.',
				}),
				accept: t('oddsDemo.clearLeague', 'Очистить лигу'),
			};
		}
		return {
			title: t('oddsDemo.clearAllTitle', 'Полная очистка?'),
			helper: t(
				'oddsDemo.clearAllHelper',
				'Все демо-снимки кэфов будут удалены из базы данных.'
			),
			accept: t('oddsDemo.clearAll', 'Очистить всё'),
		};
	};

	const dialog = confirmDialogContent();
	const busy = loading || refreshing || fetchingApiIds;

	return (
		<Box sx={oddsDemoPageRootSx}>
			<Typography sx={oddsDemoTitleSx}>{t('oddsDemo.title', 'Демо: кэфы odds-api.io')}</Typography>
			<Box sx={oddsDemoHintSx}>
				<InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.75, verticalAlign: 'text-bottom', opacity: 0.85 }} />
				{t(
					'oddsDemo.hint',
					'Данные не привязаны к матчам сайта. Угловые, фолы и четвертные линии (2.25, 1.75…) отфильтрованы. Кэфы Bet365 и 1xbet в одной таблице.'
				)}
			</Box>

			<Box sx={oddsDemoPanelSx(theme)}>
				<Box sx={oddsDemoToolbarRowSx}>
					<Tooltip title={t('oddsDemo.leagueSlugTooltip', 'Slug лиги в odds-api.io, напр. international-world-cup')}>
						<TextField
							size="small"
							label={t('oddsDemo.leagueSlug', 'Slug лиги')}
							value={leagueSlug}
							onChange={(e) => setLeagueSlug(e.target.value)}
							sx={{ minWidth: { xs: '100%', sm: 260 }, flex: { sm: '1 1 260px' } }}
						/>
					</Tooltip>
					{isStaff && (
						<Tooltip
							title={t('oddsDemo.refreshTooltip', {
								limit: LEAGUE_REFRESH_LIMIT,
								defaultValue:
									'Запросить odds-api.io: до {{limit}} ближайших матчей лиги (перезаписывает кэш лиги)',
							})}
						>
							<span>
								<CustomSuccessButton
									onClick={() => void handleRefreshLeague()}
									disabled={busy}
									buttonText={t('oddsDemo.refresh', 'Обновить лигу')}
								/>
							</span>
						</Tooltip>
					)}
				</Box>

				{isStaff && (
					<>
						<Box sx={oddsDemoToolbarRowSx}>
							<Tooltip
								title={t(
									'oddsDemo.eventIdsTooltip',
									'ID событий odds-api.io через запятую или пробел — точечное обновление без очистки всей лиги'
								)}
							>
								<TextField
									size="small"
									label={t('oddsDemo.eventIds', 'ID матчей')}
									value={eventIdsInput}
									onChange={(e) => setEventIdsInput(e.target.value)}
									placeholder="61300623, 61300624"
									sx={{ minWidth: { xs: '100%', sm: 280 }, flex: { sm: '1 1 280px' } }}
								/>
							</Tooltip>
							<Tooltip
								title={t(
									'oddsDemo.fetchApiIdsTooltip',
									'Получить список pending-событий лиги из odds-api.io и подставить ID в поле'
								)}
							>
								<span>
									<CustomButton
										onClick={() => void handleFetchApiIds()}
										disabled={busy}
										buttonText={t('oddsDemo.fetchApiIds', 'ID из API')}
										sx={{ minWidth: 0 }}
									/>
								</span>
							</Tooltip>
							<Tooltip
								title={t(
									'oddsDemo.refreshByIdsTooltip',
									'Обновить кэфы только для указанных ID (upsert, без удаления остальных матчей)'
								)}
							>
								<span>
									<CustomSuccessButton
										onClick={() => void handleRefreshByIds()}
										disabled={busy}
										buttonText={t('oddsDemo.refreshByIds', 'Обновить по ID')}
									/>
								</span>
							</Tooltip>
							<Tooltip title={t('oddsDemo.clearEventIdsTooltip', 'Очистить поле ID матчей')}>
								<span>
									<CustomCancelButton
										onClick={() => setEventIdsInput('')}
										disabled={busy || !eventIdsInput.trim()}
										buttonText={t('btnText.clear', 'Очистить')}
									/>
								</span>
							</Tooltip>
						</Box>

						<Box sx={oddsDemoToolbarRowSx}>
							<Tooltip title={t('oddsDemo.clearLeagueTooltip', 'Удалить все снимки текущей лиги из БД')}>
								<span>
									<CustomCancelButton
										onClick={() => setConfirmAction('clearLeague')}
										disabled={busy || events.length === 0}
										buttonText={t('oddsDemo.clearLeague', 'Удалить данные по лиге')}
									/>
								</span>
							</Tooltip>
							<Tooltip title={t('oddsDemo.clearAllTooltip', 'Удалить все демо-снимки всех лиг')}>
								<span>
									<CustomCancelButton
										onClick={() => setConfirmAction('clearAll')}
										disabled={busy}
										buttonText={t('oddsDemo.clearAll', 'Удалить все данные')}
									/>
								</span>
							</Tooltip>
						</Box>

						{apiEventsPreview.length > 0 && (
							<Box>
								<Box sx={oddsDemoApiEventsPreviewSx}>
									{apiEventsPreview.map((ev) => (
										<Box key={ev.id} sx={{ mb: 0.5, lineHeight: 1.5 }}>
											<Tooltip title={t('oddsDemo.copyIdToFieldTooltip', 'Добавить ID в поле «ID матчей»')}>
												<Box
													component="span"
													onClick={(e) => handleCopyEventIdToInput(ev.id, e)}
													sx={{
														color: 'primary.light',
														fontFamily: 'monospace',
														display: 'inline-block',
														minWidth: '5.5rem',
														mr: 1,
														userSelect: 'none',
														cursor: 'pointer',
														'&:hover': { textDecoration: 'underline' },
													}}
												>
													{ev.id}
												</Box>
											</Tooltip>
											<Box component="span">
												{ev.home} — {ev.away}
											</Box>
											<Box component="span" sx={{ opacity: 0.65, ml: 0.75 }}>
												{formatEventKickoff(ev.date)}
											</Box>
										</Box>
									))}
								</Box>
								<Tooltip
									title={t(
										'oddsDemo.applyAllApiIdsTooltip',
										'Подставить все ID из списка выше в поле «ID матчей»'
									)}
								>
									<span>
										<CustomButton
											onClick={handleApplyAllApiIds}
											disabled={busy}
											buttonText={t('oddsDemo.applyAllApiIds', 'Добавить все ID в поле')}
											sx={{ mt: 1 }}
										/>
									</span>
								</Tooltip>
							</Box>
						)}
					</>
				)}

				{busy && (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
						<CircularProgress size={18} />
						<Typography variant="caption" color="text.secondary">
							{t('oddsDemo.loading', 'Загрузка…')}
						</Typography>
					</Box>
				)}
			</Box>

			{!loading && events.length === 0 && (
				<Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
					{t('oddsDemo.empty', 'Нет данных. Админ: «Обновить из API».')}
				</Typography>
			)}

			{loading && events.length === 0 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
					<CircularProgress />
				</Box>
			)}

			{!loading && events.length > 0 && (
				<Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
					<Box sx={oddsDemoMatchListSx}>
						{events.map((ev) => {
							const selected = selectedId === ev.oddsApiEventId;
							return (
								<Box
									key={ev.oddsApiEventId}
									onClick={() => setSelectedId(ev.oddsApiEventId)}
									sx={oddsDemoMatchItemSx(theme, selected)}
								>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.35 }}>
											{isStaff ? (
												<Tooltip
													title={t('oddsDemo.copyIdToFieldTooltip', 'Добавить ID в поле «ID матчей»')}
												>
													<Box
														component="span"
														onClick={(e) => handleCopyEventIdToInput(ev.oddsApiEventId, e)}
														sx={[
															oddsDemoEventIdChipSx,
															{
																userSelect: 'none',
																flexShrink: 0,
																cursor: 'pointer',
																'&:hover': { filter: 'brightness(1.15)' },
															},
														]}
													>
														{ev.oddsApiEventId}
													</Box>
												</Tooltip>
											) : (
												<Box component="span" sx={[oddsDemoEventIdChipSx, { flexShrink: 0 }]}>
													{ev.oddsApiEventId}
												</Box>
											)}
											<Typography variant="body2" fontWeight={600} noWrap sx={{ minWidth: 0 }}>
												{ev.home} — {ev.away}
											</Typography>
										</Box>
										<Typography variant="caption" color="text.secondary">
											{formatEventKickoff(ev.eventDate)} · {ev.mergedLineCount}{' '}
											{t('oddsDemo.lines', 'линий')}
										</Typography>
									</Box>
									{isStaff && (
										<Tooltip title={t('oddsDemo.deleteEvent', 'Удалить снимок матча')}>
											<span>
												<IconButton
													size="small"
													onClick={(e) => openDeleteEvent(ev.oddsApiEventId, e)}
													sx={{ mt: -0.25 }}
												>
													<DeleteOutlineIcon fontSize="small" />
												</IconButton>
											</span>
										</Tooltip>
									)}
								</Box>
							);
						})}
					</Box>

					{detail ? (
						<Box sx={oddsDemoDetailPanelSx}>
							<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
								<Box>
									<Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
										{detail.home} — {detail.away}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{isStaff ? (
											<Tooltip
												title={t('oddsDemo.copyIdToFieldTooltip', 'Добавить ID в поле «ID матчей»')}
											>
												<Box
													component="span"
													onClick={(e) => handleCopyEventIdToInput(detail.oddsApiEventId, e)}
													sx={{
														fontFamily: 'monospace',
														cursor: 'pointer',
														'&:hover': { textDecoration: 'underline' },
													}}
												>
													ID {detail.oddsApiEventId}
												</Box>
											</Tooltip>
										) : (
											<>ID {detail.oddsApiEventId}</>
										)}
										{' · '}
										{formatEventKickoff(detail.eventDate)}
									</Typography>
								</Box>
								<SearchIcon sx={{ opacity: 0.35, fontSize: 22, mt: 0.25 }} />
							</Box>

							{isStaff && (
								<Tabs
									value={viewTab}
									onChange={(_, v: number) => setViewTab(v)}
									sx={oddsDemoViewTabsSx}
									TabIndicatorProps={{ sx: { display: 'none' } }}
								>
									<Tab disableRipple label={t('oddsDemo.tabOdds', 'Кэфы')} />
									<Tab disableRipple label={t('oddsDemo.tabMapping', 'Маппинг')} />
								</Tabs>
							)}

							{viewTab === 0 || !isStaff ? (
								(detail.marketGroups ?? []).map((group) => (
									<OddsMarketGroupAccordion
										key={group.category}
										group={group}
										bookmakers={bookmakers}
										showSourcePaths
									/>
								))
							) : debugDetail ? (
								<Box>
									{debugDetail.mappingIssues.length > 0 && (
										<Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
											{debugDetail.mappingIssues.slice(0, 5).join(' · ')}
										</Typography>
									)}
									<Box sx={oddsDemoDebugTabsWrapSx}>
										<Tabs
											value={debugTab}
											onChange={(_, v: number) => setDebugTab(v)}
											variant="scrollable"
											scrollButtons="auto"
											allowScrollButtonsMobile
											sx={oddsDemoDebugTabsSx}
											TabIndicatorProps={{ sx: { display: 'none' } }}
										>
											{bookmakers.map((bk) => (
												<Tab key={bk} disableRipple label={bk} />
											))}
											<Tab disableRipple label={t('oddsDemo.debugMerged', 'Итог (merged)')} />
										</Tabs>
									</Box>
									{debugTab < bookmakers.length ? (
										<MappingTraceTable rows={debugTrace} />
									) : (
										(debugDetail.mergedMarketGroups ?? detail.marketGroups ?? []).map((group) => (
											<OddsMarketGroupAccordion
												key={`merged-${group.category}`}
												group={group}
												bookmakers={bookmakers}
												displayMode="best"
												showSourcePaths
											/>
										))
									)}
								</Box>
							) : (
								<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
									<CircularProgress size={24} />
								</Box>
							)}
						</Box>
					) : (
						<Box sx={{ ...oddsDemoDetailPanelSx, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
							<Typography color="text.secondary">
								{t('oddsDemo.selectMatch', 'Выберите матч в списке слева')}
							</Typography>
						</Box>
					)}
				</Box>
			)}

			<CustomCalendarDialog
				open={confirmAction != null}
				onClose={() => {
					setConfirmAction(null);
					setPendingDeleteEventId(null);
				}}
				onSave={() => void handleConfirm()}
				title={dialog.title}
				helperText={dialog.helper}
				buttonAcceptText={dialog.accept}
				contentWidth="18rem"
			/>
		</Box>
	);
}
