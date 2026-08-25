import { Box, CircularProgress, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import SeasonSelect from '../../components/selectors/SeasonSelect';
import { SEASON_STATUS_ACTIVE } from '../../constants';
import {
	fetchGameweekBets,
	fetchGameweeksOverview,
	getAllSeasonCalendarNodes,
	invalidateGameweeksBetsCache,
} from '../admin/calendars/calendarsSlice';
import {
	selectBetsByCalendarNodeId,
	selectCalendarNodesHasBets,
	selectGameweeksBetsLoadingForNode,
	selectGameweeksOverviewSeasonId,
} from '../admin/calendars/selectors';
import Calendar from '../admin/calendars/types/Calendar';
import { getCurrentSeasonCalendarNode } from '../admin/calendars/api';
import { selectActiveSeasonId } from '../admin/seasons/selectors';
import useSeasonSummaries from '../admin/seasons/useSeasonSummaries';
import GameweekCalendarSelect from './GameweekCalendarSelect';
import GameweekPlayerContainer from './GameweekPlayersContainer';
import GameweekStats from './GameweekStats';
import {
	GAMEWEEK_NEIGHBOR_PREFETCH_DELAY_MS,
	pickDefaultCalendarNode,
	prefetchGameweekNeighborBets,
} from './gameweekCalendarUtils';
import {
	gameweekFiltersSx,
	gameweekPageEmptyHintSx,
	gameweekPageEmptySx,
	gameweekPageEmptyTitleSx,
} from './gameweekPageStyles';

type GameweekEmptyReason = 'no-bets' | 'no-calendar';

const Gameweek = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const { seasonChoices, seasonsNewestFirst, summariesReady, summariesError } =
		useSeasonSummaries();
	const calendarNodes = useAppSelector(selectCalendarNodesHasBets);
	const overviewSeasonId = useAppSelector(selectGameweeksOverviewSeasonId);

	const [selectedSeasonId, setSelectedSeasonId] = useState('');
	const [selectedCalendarNode, setSelectedCalendarNode] = useState<Calendar | undefined>(undefined);
	const [overviewLoading, setOverviewLoading] = useState(true);
	const [overviewError, setOverviewError] = useState(false);
	const [emptyReason, setEmptyReason] = useState<GameweekEmptyReason>('no-calendar');

	const selectedSeason = useMemo(
		() => seasonChoices.find((season) => season.id === selectedSeasonId),
		[seasonChoices, selectedSeasonId]
	);
	const hasValidSeason =
		Boolean(selectedSeasonId) && seasonChoices.some((season) => season.id === selectedSeasonId);
	const seasonId = hasValidSeason ? selectedSeasonId : undefined;
	const selectedNodeId = selectedCalendarNode?.id;
	const cachedBets = useAppSelector(selectBetsByCalendarNodeId(selectedNodeId));
	const betsLoading = useAppSelector(selectGameweeksBetsLoadingForNode(selectedNodeId));
	const requestedNodeId = useMemo(
		() => new URLSearchParams(location.search).get('node'),
		[location.search]
	);
	const requestedSeasonId = useMemo(
		() => new URLSearchParams(location.search).get('season'),
		[location.search]
	);

	useEffect(() => {
		if (seasonChoices.length === 0) {
			return;
		}

		if (requestedSeasonId) {
			if (seasonChoices.some((season) => season.id === requestedSeasonId)) {
				if (selectedSeasonId !== requestedSeasonId) {
					setSelectedSeasonId(requestedSeasonId);
				}
				return;
			}
			if (!summariesReady) {
				return;
			}
		}

		if (selectedSeasonId && seasonChoices.some((season) => season.id === selectedSeasonId)) {
			return;
		}

		const activeInList = seasonChoices.find((season) => season.status === SEASON_STATUS_ACTIVE);
		if (activeInList) {
			setSelectedSeasonId(activeInList.id);
		} else if (activeSeasonId && seasonChoices.some((season) => season.id === activeSeasonId)) {
			setSelectedSeasonId(activeSeasonId);
		} else {
			setSelectedSeasonId(seasonsNewestFirst[0].id);
		}
	}, [
		seasonChoices,
		seasonsNewestFirst,
		summariesReady,
		activeSeasonId,
		selectedSeasonId,
		requestedSeasonId,
	]);

	const loadBetsForNode = useCallback(
		(nodeId: string): void => {
			void dispatch(fetchGameweekBets(nodeId));
		},
		[dispatch]
	);

	const selectCalendarNode = useCallback(
		(node: Calendar | undefined, options?: { skipBetsFetch?: boolean }): void => {
			if (!node || !seasonId) {
				setSelectedCalendarNode(node);
				return;
			}
			setSelectedCalendarNode(node);
			if (!options?.skipBetsFetch) {
				loadBetsForNode(node.id);
			}
		},
		[seasonId, loadBetsForNode]
	);

	const handleSelectCalendar = (nodeId: string): void => {
		const node = calendarNodes.find((n) => n.id === nodeId);
		selectCalendarNode(node);
	};

	const handleSeasonChange = (nextSeasonId: string): void => {
		if (nextSeasonId === selectedSeasonId) {
			return;
		}
		setSelectedSeasonId(nextSeasonId);
		setSelectedCalendarNode(undefined);
		setOverviewLoading(true);
		setOverviewError(false);
		if (location.search) {
			navigate('/gameweeks', { replace: true });
		}
	};

	useEffect(() => {
		if (location.pathname !== '/gameweeks') {
			return;
		}
		if (!seasonId) {
			setOverviewLoading(true);
			return;
		}

		let cancelled = false;

		const applyNodes = async (nodes: Calendar[]): Promise<void> => {
			if (nodes.length === 0) {
				setSelectedCalendarNode(undefined);
				return;
			}
			setEmptyReason('no-calendar');
			const requestedNode = requestedNodeId
				? nodes.find((node) => node.id === requestedNodeId)
				: undefined;

			let defaultNode = requestedNode;
			if (!defaultNode && seasonId) {
				try {
					const current = await getCurrentSeasonCalendarNode(seasonId);
					defaultNode = nodes.find((node) => node.id === current.id);
				} catch {
					defaultNode = undefined;
				}
			}
			defaultNode = defaultNode ?? pickDefaultCalendarNode(nodes);

			if (defaultNode) {
				setSelectedCalendarNode(defaultNode);
				void dispatch(fetchGameweekBets(defaultNode.id));
			} else {
				setSelectedCalendarNode(undefined);
			}
		};

		const loadOverview = async (): Promise<void> => {
			if (overviewSeasonId && overviewSeasonId !== seasonId) {
				dispatch(invalidateGameweeksBetsCache());
			}

			if (overviewSeasonId === seasonId && calendarNodes.length > 0) {
				await applyNodes(calendarNodes);
				if (!cancelled) {
					setOverviewLoading(false);
					setOverviewError(false);
				}
				return;
			}

			setOverviewLoading(true);
			setOverviewError(false);

			try {
				const result = await dispatch(fetchGameweeksOverview({ seasonId }));

				if (cancelled) {
					return;
				}

				if (fetchGameweeksOverview.rejected.match(result)) {
					setOverviewError(true);
					dispatch(showErrorSnackbar({ message: result.error.message }));
					return;
				}

				const nodes = result.payload.calendarNodes;

				if (nodes.length === 0) {
					setSelectedCalendarNode(undefined);
					const allCalendarsResult = await dispatch(getAllSeasonCalendarNodes(seasonId));
					if (cancelled) {
						return;
					}
					if (
						getAllSeasonCalendarNodes.fulfilled.match(allCalendarsResult) &&
						allCalendarsResult.payload.calendarNodes.length > 0
					) {
						setEmptyReason('no-bets');
					} else {
						setEmptyReason('no-calendar');
					}
					return;
				}

				await applyNodes(nodes);
			} finally {
				if (!cancelled) {
					setOverviewLoading(false);
				}
			}
		};

		void loadOverview();

		return () => {
			cancelled = true;
		};
	}, [seasonId, location.pathname, requestedNodeId, dispatch]);

	useEffect(() => {
		if (calendarNodes.length === 0 || !selectedCalendarNode?.id) {
			return;
		}
		const freshNode = calendarNodes.find((node) => node.id === selectedCalendarNode.id);
		if (
			freshNode &&
			(freshNode.isFinished !== selectedCalendarNode.isFinished ||
				freshNode.gameweekStats.length !== selectedCalendarNode.gameweekStats.length)
		) {
			setSelectedCalendarNode(freshNode);
		}
	}, [
		calendarNodes,
		selectedCalendarNode?.id,
		selectedCalendarNode?.isFinished,
		selectedCalendarNode?.gameweekStats.length,
	]);

	useEffect(() => {
		if (location.pathname !== '/gameweeks') {
			return;
		}
		if (!selectedNodeId || calendarNodes.length === 0) {
			return;
		}
		if (cachedBets === undefined) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			prefetchGameweekNeighborBets(calendarNodes, selectedNodeId, (neighborId) => {
				void dispatch(fetchGameweekBets(neighborId));
			});
		}, GAMEWEEK_NEIGHBOR_PREFETCH_DELAY_MS);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [location.pathname, selectedNodeId, cachedBets, calendarNodes, dispatch]);

	const gameweekCardsCount =
		selectedCalendarNode?.leagueMatchdayNodes?.reduce((sum, node) => sum + (node.betCountLimit ?? 0), 0) ??
		0;

	const showBetsSection = useMemo(() => {
		if (!selectedCalendarNode || !selectedSeason) {
			return false;
		}
		if (cachedBets?.bets) {
			return true;
		}
		return betsLoading;
	}, [selectedCalendarNode, selectedSeason, cachedBets, betsLoading]);

	if (summariesError && seasonChoices.length === 0) {
		return <CustomLoadingError />;
	}

	if (seasonChoices.length === 0 || !hasValidSeason) {
		return <CustomLoading />;
	}

	const filters = (
		<Box sx={gameweekFiltersSx}>
			<SeasonSelect
				value={selectedSeasonId}
				onChange={(event) => handleSeasonChange(event.target.value)}
				seasons={seasonsNewestFirst}
				sx={{ width: '100%' }}
			/>
			{!overviewLoading && calendarNodes.length > 0 ? (
				<GameweekCalendarSelect
					calendars={calendarNodes}
					value={selectedCalendarNode?.id ?? ''}
					onChange={handleSelectCalendar}
				/>
			) : null}
		</Box>
	);

	if (overviewLoading) {
		return (
			<Box>
				{filters}
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
					<CircularProgress />
				</Box>
			</Box>
		);
	}

	if (overviewError) {
		return (
			<Box>
				{filters}
				<CustomLoadingError />
			</Box>
		);
	}

	return (
		<Box>
			{filters}
			{calendarNodes.length > 0 ? (
				<Box>
					{selectedCalendarNode && selectedSeason ? (
						<>
							<GameweekStats calendarNode={selectedCalendarNode} season={selectedSeason} />
							{showBetsSection ? (
								cachedBets?.bets ? (
									<GameweekPlayerContainer
										season={selectedSeason}
										bets={cachedBets.bets}
										gameweekCardsCount={gameweekCardsCount}
									/>
								) : (
									<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
										<CircularProgress size={32} />
									</Box>
								)
							) : null}
						</>
					) : null}
				</Box>
			) : (
				<Box sx={gameweekPageEmptySx}>
					<Typography sx={gameweekPageEmptyTitleSx}>
						{t(
							emptyReason === 'no-bets'
								? 'gameweeksNoBetsYetTitle'
								: 'gameweeksNoCalendarYetTitle'
						)}
					</Typography>
					<Typography sx={gameweekPageEmptyHintSx}>
						{t(
							emptyReason === 'no-bets'
								? 'gameweeksNoBetsYetHint'
								: 'gameweeksNoCalendarYetHint'
						)}
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default Gameweek;
