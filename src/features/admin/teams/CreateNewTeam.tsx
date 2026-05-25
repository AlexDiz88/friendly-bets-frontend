import { Box } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import TeamFormFields from './TeamFormFields';
import { emptyTeamFormValues, formValuesToCreatePayload } from './teamFormUtils';
import { createTeam } from './teamsSlice';

export default function CreateNewTeam({
	closeAddNewTeam,
}: {
	closeAddNewTeam: (close: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [values, setValues] = useState(emptyTeamFormValues);

	const handleChange = (patch: Partial<ReturnType<typeof emptyTeamFormValues>>): void => {
		setValues((prev) => ({ ...prev, ...patch }));
	};

	const handleSaveClick = useCallback(async () => {
		const dispatchResult = await dispatch(createTeam(formValuesToCreatePayload(values)));
		if (createTeam.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('teamWasSuccessfullyCreated') }));
			setValues(emptyTeamFormValues());
		}
		if (createTeam.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, values]);

	const handleCancelClick = (): void => {
		closeAddNewTeam(false);
	};

	return (
		<Box sx={{ textAlign: 'left' }}>
			<TeamFormFields values={values} onChange={handleChange} />
			<Box sx={{ textAlign: 'center' }}>
				<CustomCancelButton onClick={handleCancelClick} />
				<CustomSuccessButton onClick={handleSaveClick} buttonText={t('btnText.create')} />
			</Box>
		</Box>
	);
}
