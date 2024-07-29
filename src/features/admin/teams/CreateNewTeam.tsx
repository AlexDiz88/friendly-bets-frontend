import { Box, FormControl, TextField } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import { createTeam } from './teamsSlice';

export default function CreateNewTeam({
	closeAddNewTeam,
}: {
	closeAddNewTeam: (close: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [title, setTitle] = useState<string>('');
	const [country, setCountry] = useState<string>('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleSaveClick = useCallback(async () => {
		const dispatchResult = await dispatch(createTeam({ title, country }));
		if (createTeam.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage(t('teamWasSuccessfullyCreated'));
			setTitle('');
			setCountry('');
		}
		if (createTeam.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [dispatch, country, title]);

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setTitle(event.target.value);
	};

	const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setCountry(event.target.value);
	};

	const handleCancelClick = (): void => {
		closeAddNewTeam(false);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<FormControl>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					required
					id="team-name-en"
					label={t('teamTitle')}
					variant="outlined"
					value={title}
					onChange={handleTitleChange}
					helperText={t('teamNameMustBeEqualLogoName')}
				/>
			</Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					required
					id="team-country"
					label={t('teamCountry')}
					variant="outlined"
					value={country}
					onChange={handleCountryChange}
					helperText={t('abbreviatedTeamCountry')}
				/>
			</Box>
			<Box>
				<CustomCancelButton onClick={handleCancelClick} />
				<CustomSuccessButton onClick={handleSaveClick} buttonText={t('btnText.create')} />
			</Box>
			<Box textAlign="center">
				<NotificationSnackbar
					open={openSnackbar}
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					message={snackbarMessage}
					duration={3000}
				/>
			</Box>
		</FormControl>
	);
}
