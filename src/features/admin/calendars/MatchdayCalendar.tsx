import { Box, Button } from '@mui/material';
import { Dayjs } from 'dayjs';
import { t } from 'i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import useFetchActiveSeason from '../../../components/hooks/useFetchActiveSeason';
import { getActiveSeason } from '../seasons/seasonsSlice';
import { selectActiveSeason } from '../seasons/selectors';
import CalendarsList from './CalendarsList';
import { createCalendarNode } from './calendarsSlice';
import DateRangePicker from './DateRangePicker';
import MatchdayCalendarSaveDialog from './MatchdayCalendarSaveDialog';
import MatchdayLeaguePicker from './MatchdayLeaguePicker';
import LeagueMatchdayNode from './types/LeagueMatchdayNode';
import NewCalendar from './types/NewCalendar';

const MatchdayCalendar = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const hiddenButtonRef = useRef<HTMLButtonElement>(null);
	const [startDate, setStartDate] = useState<Dayjs | null>(null);
	const [endDate, setEndDate] = useState<Dayjs | null>(null);
	const [leagueMatchdayNodes, setLeagueMatchdayNodes] = useState<LeagueMatchdayNode[]>([]);
	const [showCalendarList, setShowCalendarList] = useState(false);
	const [showCalendarListButton, setShowCalendarListButton] = useState(true);

	useFetchActiveSeason(activeSeason?.id);

	const handleSave = useCallback(async () => {
		const updatedNodes = leagueMatchdayNodes.map((node) => {
			const matchDayCode = node.matchDay === t('playoffRound.final') ? 'final' : node.matchDay;
			return { ...node, matchDay: matchDayCode };
		});

		const newCalendarNode: NewCalendar = {
			seasonId: activeSeason?.id,
			startDate,
			endDate,
			leagueMatchdayNodes: updatedNodes,
		};

		const dispatchResult = await dispatch(createCalendarNode(newCalendarNode));

		if (createCalendarNode.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('calendarNodeWasSuccessfullyAdded') }));
			setStartDate(null);
			setEndDate(null);
			setLeagueMatchdayNodes([]);
		}
		if (createCalendarNode.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [activeSeason, startDate, endDate, leagueMatchdayNodes]);

	const handleShowCalendarList = (): void => {
		setShowCalendarList(!showCalendarList);
		setShowCalendarListButton(!showCalendarListButton);
	};

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, [dispatch, activeSeason]);

	useEffect(() => {
		setTimeout(() => {
			if (hiddenButtonRef.current) {
				hiddenButtonRef.current.focus();
			}
		}, 0);
	}, [startDate, endDate, leagueMatchdayNodes]);

	return (
		<Box sx={{ maxWidth: '22rem', margin: '0 auto' }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					borderBottom: '2px solid',
					pb: 0.5,
					mx: 3,
					mb: 1,
				}}
			>
				{t('addNewEntryToCalendar')}
			</Box>
			<DateRangePicker
				onStartDateChange={setStartDate}
				onEndDateChange={setEndDate}
				startDate={startDate}
				endDate={endDate}
			/>

			{activeSeason && startDate && endDate && (
				<>
					<MatchdayLeaguePicker
						leagues={activeSeason?.leagues}
						leagueMatchdayNodes={leagueMatchdayNodes}
						setLeagueMatchdayNodes={setLeagueMatchdayNodes}
					/>
					<MatchdayCalendarSaveDialog
						leagueMatchdayNodes={leagueMatchdayNodes}
						onSave={handleSave}
					/>
				</>
			)}

			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
				{showCalendarListButton ? (
					<CustomButton
						onClick={handleShowCalendarList}
						buttonText={t('showCalendarList')}
						buttonColor="info"
					/>
				) : (
					<CustomButton
						onClick={handleShowCalendarList}
						buttonText={t('hide')}
						buttonColor="info"
					/>
				)}
			</Box>
			{activeSeason && showCalendarList && <CalendarsList activeSeasonId={activeSeason?.id} />}

			<Box aria-hidden="true">
				<Button
					ref={hiddenButtonRef}
					style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
				/>
			</Box>
		</Box>
	);
};

export default MatchdayCalendar;
