import { Box } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomErrorMessage from '../../../components/custom/CustomErrorMessage';
import CustomCalendarDialog from '../../../components/custom/dialog/CustomCalendarDialog';
import LeagueMatchdayNode from './types/LeagueMatchdayNode';

interface DialogProps {
	onSave: () => void;
	leagueMatchdayNodes: LeagueMatchdayNode[];
}

const MatchdayCalendarSaveDialog = ({ onSave, leagueMatchdayNodes }: DialogProps): JSX.Element => {
	const [openDialog, setOpenDialog] = useState(false);

	const handleOpenDialog = (): void => {
		setOpenDialog(true);
	};

	const handleCloseDialog = (): void => {
		setOpenDialog(false);
	};

	const handleDialogSave = (): void => {
		onSave();
		handleCloseDialog();
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center' }}>
			{leagueMatchdayNodes.length > 0 ? (
				<CustomButton
					sx={{ mt: 3, height: '3rem' }}
					buttonText={t('addToCalendar')}
					onClick={handleOpenDialog}
					buttonColor="secondary"
					autoFocus
				/>
			) : (
				<CustomErrorMessage message="noData" />
			)}
			<CustomCalendarDialog
				open={openDialog}
				onClose={handleCloseDialog}
				onSave={handleDialogSave}
				title={t('addToCalendar')}
				helperText={t('addCalenderNodeHelperText')}
			/>
		</Box>
	);
};

export default MatchdayCalendarSaveDialog;
