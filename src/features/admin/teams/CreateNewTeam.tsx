import { Box, FormControl, TextField } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import { createTeam } from './teamsSlice';

export default function CreateNewTeam({
	closeAddNewTeam,
}: {
	closeAddNewTeam: (close: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [title, setTitle] = useState<string>('');
	const [country, setCountry] = useState<string>('');

	const handleSaveClick = useCallback(async () => {
		const dispatchResult = await dispatch(createTeam({ title, country }));
		if (createTeam.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('teamWasSuccessfullyCreated') }));
			setTitle('');
			setCountry('');
		}
		if (createTeam.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
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
		</FormControl>
	);
}
