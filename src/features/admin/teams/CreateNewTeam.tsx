import { useCallback, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import { createTeam } from './teamsSlice';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';

export default function CreateNewTeam({
	closeAddNewTeam,
}: {
	closeAddNewTeam: (close: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [fullTitleRu, setFullTitleRu] = useState<string>('');
	const [fullTitleEn, setFullTitleEn] = useState<string>('');
	const [country, setCountry] = useState<string>('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleSaveClick = useCallback(async () => {
		const dispatchResult = await dispatch(createTeam({ fullTitleRu, fullTitleEn, country }));
		if (createTeam.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage('Команда успешно создана');
			setFullTitleRu('');
			setFullTitleEn('');
			setCountry('');
		}
		if (createTeam.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [dispatch, country, fullTitleEn, fullTitleRu]);

	const handleFullTitleRuChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setFullTitleRu(event.target.value);
	};

	const handleFullTitleEnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setFullTitleEn(event.target.value);
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
		<Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					required
					id="team-name-ru"
					label="Название команды(RU)"
					variant="outlined"
					value={fullTitleRu}
					onChange={handleFullTitleRuChange}
				/>
			</Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					required
					id="team-name-en"
					label="Название команды(EN)"
					variant="outlined"
					value={fullTitleEn}
					onChange={handleFullTitleEnChange}
					helperText="Название команды (EN) должно совпадать с именем файла логотипа (до момента реализации загрузки файла при создании)"
				/>
			</Box>
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					required
					id="team-country"
					label="Страна команды"
					variant="outlined"
					value={country}
					onChange={handleCountryChange}
					helperText="Сокращенное название страны из 3 символов (например ENG, GER...)"
				/>
			</Box>
			<Box sx={{ my: 2 }}>
				<Button
					sx={{ height: '1.8rem', px: 1, mr: 1 }}
					variant="contained"
					color="error"
					onClick={handleCancelClick}
				>
					<Typography
						variant="button"
						fontWeight="600"
						fontSize="0.9rem"
						fontFamily="Shantell Sans"
					>
						Отмена
					</Typography>
				</Button>
				<Button
					onClick={handleSaveClick}
					sx={{ height: '1.8rem', px: 1 }}
					variant="contained"
					color="success"
				>
					<Typography
						variant="button"
						fontWeight="600"
						fontSize="0.9rem"
						fontFamily="Shantell Sans"
					>
						Создать
					</Typography>
				</Button>
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
		</Box>
	);
}
