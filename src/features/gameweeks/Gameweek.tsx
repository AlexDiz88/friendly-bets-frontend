import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomErrorMessage from '../../components/custom/CustomErrorMessage';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import CalendarNode from '../admin/calendars/CalendarNode';
import {
	getBetsByCalendarNode,
	getSeasonCalendarHasBetsNodes,
} from '../admin/calendars/calendarsSlice';
import { selectCalendarNodesHasBets } from '../admin/calendars/selectors';
import Calendar from '../admin/calendars/types/Calendar';
import { selectActiveSeason } from '../admin/seasons/selectors';
import BetsPage from '../bets/types/BetsPage';
import GameweekPlayerContainer from './GameweekPlayersContainer';

const Gameweek = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const calendarNodes: Calendar[] = useAppSelector(selectCalendarNodesHasBets);
	const [selectedCalendarNode, setSelectedCalendarNode] = useState<Calendar | undefined>(undefined);
	const [gameweekBets, setGameweekBets] = useState<BetsPage | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	useFetchActiveSeason(activeSeason?.id);

	const handleSelectCalendar = (event: SelectChangeEvent<string>): void => {
		const selectedId = event.target.value;
		const selectedNode = calendarNodes.find((node) => node.id === selectedId);
		setSelectedCalendarNode(selectedNode);
	};

	useEffect(() => {
		const fetchBets = async (): Promise<void> => {
			if (selectedCalendarNode) {
				setLoading(true);
				const dispatchResult = await dispatch(getBetsByCalendarNode(selectedCalendarNode.id));

				if (getBetsByCalendarNode.fulfilled.match(dispatchResult)) {
					setGameweekBets(dispatchResult.payload);
				}
				if (getBetsByCalendarNode.rejected.match(dispatchResult)) {
					dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
				}
				setLoading(false);
			}
		};
		fetchBets();
	}, [selectedCalendarNode]);

	useEffect(() => {
		if (calendarNodes.length > 0 && !selectedCalendarNode) {
			const now = dayjs().add(-1, 'day');

			const activeNode = calendarNodes.find(
				(node) =>
					node.startDate &&
					node.endDate &&
					now.isAfter(node.startDate) &&
					now.isBefore(node.endDate)
			);

			if (activeNode) {
				setSelectedCalendarNode(activeNode);
			} else {
				const closestNode = calendarNodes.reduce((prev, curr) => {
					const prevDiff = prev.startDate ? Math.abs(now.diff(prev.startDate)) : Infinity;
					const currDiff = curr.startDate ? Math.abs(now.diff(curr.startDate)) : Infinity;

					return currDiff < prevDiff ? curr : prev;
				});
				setSelectedCalendarNode(closestNode);
			}
		}
	}, [calendarNodes]);

	useEffect(() => {
		if (activeSeason) {
			setLoading(true);
			dispatch(getSeasonCalendarHasBetsNodes(activeSeason?.id))
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, [activeSeason]);

	return (
		<>
			<Box>
				{loading ? (
					<CustomLoading />
				) : (
					<Box>
						{loadingError ? (
							<CustomLoadingError />
						) : (
							<>
								{calendarNodes.length > 0 ? (
									<>
										<Box sx={{ mb: 1, mx: 1, textAlign: 'center', fontWeight: 600 }}>
											{t('chooseGameweekForDetailedView')}
										</Box>
										<Box sx={{ margin: '0 auto', width: '18rem' }}>
											<Select
												sx={{
													borderRadius: 2,
													'.MuiSelect-select': {
														p: 0,
														m: 0,
														border: '1px solid #123456DB',
														borderRadius: 2,
													},
												}}
												value={selectedCalendarNode?.id ?? ''}
												onChange={handleSelectCalendar}
											>
												{calendarNodes.map((c) => (
													<MenuItem key={c.id} value={c.id}>
														<Box sx={{ width: '15rem' }}>
															<CalendarNode calendar={c} />
														</Box>
													</MenuItem>
												))}
											</Select>
										</Box>
									</>
								) : (
									<CustomErrorMessage message="noGameweeks" />
								)}

								<Box>
									{activeSeason && gameweekBets?.bets && selectedCalendarNode ? (
										<Box>
											<GameweekPlayerContainer
												activeSeason={activeSeason}
												bets={gameweekBets.bets}
												gameweekLeaguesCount={selectedCalendarNode.leagueMatchdayNodes.length}
											/>
										</Box>
									) : (
										<CustomLoading />
									)}
								</Box>
							</>
						)}
					</Box>
				)}
			</Box>
		</>
	);
};

export default Gameweek;
