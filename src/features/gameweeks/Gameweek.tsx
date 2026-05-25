import { Box, CircularProgress } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { store } from '../../app/store';
import CustomErrorMessage from '../../components/custom/CustomErrorMessage';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import {
	fetchGameweekBets,
	fetchGameweeksOverview,
} from '../admin/calendars/calendarsSlice';
import {
	selectBetsByCalendarNodeId,
	selectCalendarNodesHasBets,
	selectGameweeksBetsLoading,
} from '../admin/calendars/selectors';
import Calendar from '../admin/calendars/types/Calendar';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import GameweekCalendarSelect from './GameweekCalendarSelect';
import GameweekPlayerContainer from './GameweekPlayersContainer';
import GameweekStats from './GameweekStats';
import {
	GAMEWEEK_NEIGHBOR_PREFETCH_DELAY_MS,
	pickDefaultCalendarNode,
	prefetchGameweekNeighborBets,
} from './gameweekCalendarUtils';

const Gameweek = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const activeSeason = useAppSelector(selectActiveSeason);
	const calendarNodes = useAppSelector(selectCalendarNodesHasBets);
	const [selectedCalendarNode, setSelectedCalendarNode] = useState<Calendar | undefined>(undefined);
	const [overviewLoading, setOverviewLoading] = useState(true);
	const [overviewError, setOverviewError] = useState(false);

	const seasonId = activeSeason?.id;
	const selectedNodeId = selectedCalendarNode?.id;
	const cachedBets = useAppSelector(selectBetsByCalendarNodeId(selectedNodeId));
	const betsLoading = useAppSelector(selectGameweeksBetsLoading);

	useFetchActiveSeason(seasonId);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	const loadBetsForNode = useCallback(
		(nodeId: string): void => {
			if (!store.getState().calendars.betsByCalendarNodeId[nodeId]) {
				void dispatch(fetchGameweekBets(nodeId));
			}
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

	useEffect(() => {
		if (location.pathname !== '/gameweeks') {
			return;
		}
		if (!seasonId) {
			setOverviewLoading(true);
			return;
		}

		let cancelled = false;

		const loadOverview = async (): Promise<void> => {
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
					return;
				}

				const defaultNode = pickDefaultCalendarNode(nodes);

				if (defaultNode) {
					setSelectedCalendarNode(defaultNode);
					if (!store.getState().calendars.betsByCalendarNodeId[defaultNode.id]) {
						void dispatch(fetchGameweekBets(defaultNode.id));
					}
				} else {
					setSelectedCalendarNode(undefined);
				}
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
	}, [seasonId, location.pathname, dispatch]);

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
				if (!store.getState().calendars.betsByCalendarNodeId[neighborId]) {
					void dispatch(fetchGameweekBets(neighborId));
				}
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
		if (!selectedCalendarNode || !activeSeason) {
			return false;
		}
		if (cachedBets?.bets) {
			return true;
		}
		return betsLoading;
	}, [selectedCalendarNode, activeSeason, cachedBets, betsLoading]);

	if (!seasonId || overviewLoading) {
		return <CustomLoading />;
	}

	if (overviewError) {
		return <CustomLoadingError />;
	}

	return (
		<Box>
			{calendarNodes.length > 0 ? (
				<>
					<Box sx={{ mb: 1, mx: 1, textAlign: 'center', fontWeight: 600 }}>
						{t('chooseGameweekForDetailedView')}
					</Box>
					<Box sx={{ margin: '0 auto', width: '18rem' }}>
						<GameweekCalendarSelect
							calendars={calendarNodes}
							value={selectedCalendarNode?.id ?? ''}
							onChange={handleSelectCalendar}
						/>
					</Box>
					<Box>
						{selectedCalendarNode && activeSeason && (
							<>
								<GameweekStats calendarNode={selectedCalendarNode} />
								{showBetsSection ? (
									cachedBets?.bets ? (
										<GameweekPlayerContainer
											activeSeason={activeSeason}
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
						)}
					</Box>
				</>
			) : (
				<CustomErrorMessage message="noGameweeks" />
			)}
		</Box>
	);
};

export default Gameweek;
