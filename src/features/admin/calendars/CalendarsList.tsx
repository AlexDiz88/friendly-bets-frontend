import { DoDisturbOn } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomCalendarDialog from '../../../components/custom/dialog/CustomCalendarDialog';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import pathToLogoImage from '../../../components/utils/pathToLogoImage';
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
			<Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', mt: 2 }}>
				{Array.isArray(calendarNodes) &&
					calendarNodes.map((c) => (
						<Box
							key={c.id}
							sx={{
								border: '1px solid #123456DB',
								borderRadius: 2,
								mb: 1,
								px: 1,
								py: 0.5,
								boxShadow: '0 4px 8px #12131BB6',
								bgcolor: '#0008420E',
							}}
						>
							<Box sx={{ fontWeight: 600, mb: 0.5 }}>
								{c.startDate ? dayjs(c.startDate).format('DD.MM.YYYY') : ''} -{' '}
								{c.endDate ? dayjs(c.endDate).format('DD.MM.YYYY') : ''}
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									{c.leagueMatchdayNodes &&
										c.leagueMatchdayNodes.map((node, index) => (
											<Box key={index}>
												<Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
													<Avatar
														variant="square"
														sx={{ width: 27, height: 27 }}
														alt="league_logo"
														src={pathToLogoImage(node.leagueCode)}
													/>
													<Typography
														sx={{
															mx: 0.5,
															fontWeight: 600,
															fontFamily: "'Exo 2'",
															color: '#123456',
														}}
													>
														{node.matchDay === 'final' ? t('playoffRound.final') : node.matchDay}
														{node.isPlayoff && node.matchDay !== 'final'
															? ` [${node.playoffRound}]`
															: ''}
													</Typography>
												</Box>
											</Box>
										))}
								</Box>

								{c.bets.length === 0 && (
									<IconButton
										sx={{ mt: -3, mr: 1, p: 0, color: 'red', scale: '150%' }}
										onClick={() => handleOpenDialog(c)}
									>
										<DoDisturbOn />
									</IconButton>
								)}
							</Box>
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
