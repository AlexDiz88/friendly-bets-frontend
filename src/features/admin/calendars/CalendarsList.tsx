import { Box } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomCalendarDialog from '../../../components/custom/dialog/CustomCalendarDialog';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import CalendarNode from './CalendarNode';
import { deleteCalendarNode, getAllSeasonCalendarNodes } from './calendarsSlice';
import { selectAllCalendarNodes } from './selectors';
import Calendar from './types/Calendar';

const CalendarsList = ({ activeSeasonId }: { activeSeasonId: string }): JSX.Element => {
	const dispatch = useAppDispatch();
	const calendarNodes: Calendar[] = useAppSelector(selectAllCalendarNodes);
	const [selectedCalendarNode, setSelectedCalendarNode] = useState<Calendar | undefined>(undefined);
	const [openDialog, setOpenDialog] = useState(false);

	const handleRemoveCalendarNode = useCallback(
		async (calendarNode: Calendar) => {
			const dispatchResult = await dispatch(deleteCalendarNode(calendarNode.id));

			if (deleteCalendarNode.fulfilled.match(dispatchResult)) {
				dispatch(showSuccessSnackbar({ message: t('calendarNodeWasSuccessfullyDeleted') }));
			}
			if (deleteCalendarNode.rejected.match(dispatchResult)) {
				dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
			}
			setOpenDialog(false);
		},
		[dispatch]
	);

	const handleOpenDialog = (calendarNode: Calendar): void => {
		setOpenDialog(true);
		setSelectedCalendarNode(calendarNode);
	};

	const handleCloseDialog = (): void => {
		setOpenDialog(false);
	};

	useEffect(() => {
		dispatch(getAllSeasonCalendarNodes(activeSeasonId));
	}, [activeSeasonId]);

	return (
		<>
			<Box
				sx={{
					margin: '0 auto',
					display: 'flex',
					justifyContent: 'center',
					flexDirection: 'column',
					width: '18rem',
					mt: 2,
				}}
			>
				{Array.isArray(calendarNodes) &&
					calendarNodes.map((c) => (
						<Box key={c.id} sx={{ my: 0.5 }}>
							<CalendarNode calendar={c} onClick={() => handleOpenDialog(c)} deleteIcon />
						</Box>
					))}
			</Box>

			{selectedCalendarNode && (
				<CustomCalendarDialog
					open={openDialog}
					onClose={handleCloseDialog}
					onSave={() => handleRemoveCalendarNode(selectedCalendarNode)}
					title={t('deleteNodeFromCalendar')}
					helperText={t('deleteNodeFromCalendarHelperText')}
				/>
			)}
		</>
	);
};

export default CalendarsList;
