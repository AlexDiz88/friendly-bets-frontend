import {
	Avatar,
	Box,
	Button,
	List,
	ListItem,
	ListItemText,
	TextField,
	Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import { addLeagueToSeason } from './seasonsSlice';
import { useAppDispatch } from '../../../app/hooks';
import League from '../leagues/types/League';

// TODO сделать короткое название лиги для удобного выбора и короткой записи

export default function AddLeagueInSeason({
	seasonId,
	leagues,
	handleLeagueListShow,
}: {
	seasonId: string;
	leagues: League[] | undefined;
	handleLeagueListShow: (show: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [leagueDisplayNameRu, setLeagueDisplayNameRu] = useState<string>('');
	const [leagueDisplayNameEn, setLeagueDisplayNameEn] = useState<string>('');
	const [leagueShortNameRu, setLeagueShortNameRu] = useState<string>('');
	const [leagueShortNameEn, setLeagueShortNameEn] = useState<string>('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleAddLeagueClick = useCallback(async () => {
		const dispatchResult = await dispatch(
			addLeagueToSeason({
				seasonId,
				displayNameRu: leagueDisplayNameRu,
				displayNameEn: leagueDisplayNameEn,
				shortNameRu: leagueShortNameRu,
				shortNameEn: leagueShortNameEn,
			})
		);
		if (addLeagueToSeason.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage('Лига успешно добавлена в сезон');
			setLeagueDisplayNameRu('');
			setLeagueDisplayNameEn('');
			setLeagueShortNameRu('');
			setLeagueShortNameEn('');
		}
		if (addLeagueToSeason.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [
		dispatch,
		leagueDisplayNameEn,
		leagueDisplayNameRu,
		leagueShortNameEn,
		leagueShortNameRu,
		seasonId,
	]);

	const handleLeagueNameRuChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setLeagueDisplayNameRu(event.target.value);
	};

	const handleLeagueNameEnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setLeagueDisplayNameEn(event.target.value);
	};

	const handleLeagueShortNameRuChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setLeagueShortNameRu(event.target.value);
	};

	const handleLeagueShortNameEnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setLeagueShortNameEn(event.target.value);
	};

	const handleCancelClick = (): void => {
		handleLeagueListShow(false);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<>
			<Typography sx={{ mt: 1.5 }}>Список лиг сезона:</Typography>
			{leagues && leagues.length > 0 ? (
				<List sx={{ borderBottom: 1 }}>
					{leagues?.map((item) => (
						<ListItem sx={{ my: 0, px: 2, py: 0 }} key={item.id}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Avatar
									sx={{ mr: 1, width: 30, height: 30 }}
									alt="league_logo"
									src={`${process.env.PUBLIC_URL || ''}/upload/logo/${item.displayNameEn
										.toLowerCase()
										.replace(/\s/g, '_')}.png`}
								/>
								<ListItemText primary={item.displayNameRu} />
							</div>
						</ListItem>
					))}
				</List>
			) : (
				<Box sx={{ fontWeight: 600, color: 'brown' }}>В данном сезоне нет лиг</Box>
			)}
			<Box sx={{ my: 1 }}>
				<TextField
					fullWidth
					required
					id="league-name-ru"
					label="Название лиги(RU)"
					variant="outlined"
					value={leagueDisplayNameRu}
					onChange={handleLeagueNameRuChange}
				/>
			</Box>
			<Box sx={{ mb: 1 }}>
				<TextField
					fullWidth
					required
					id="league-name-en"
					label="Название лиги(EN)"
					variant="outlined"
					value={leagueDisplayNameEn}
					onChange={handleLeagueNameEnChange}
				/>
			</Box>
			<Box sx={{ mb: 1 }}>
				<TextField
					fullWidth
					required
					id="league-short-name-ru"
					label="Сокращенное имя лиги(RU)"
					variant="outlined"
					value={leagueShortNameRu}
					onChange={handleLeagueShortNameRuChange}
				/>
			</Box>
			<Box sx={{ mb: 3 }}>
				<TextField
					fullWidth
					required
					id="league-short-name-en"
					label="Сокращенное имя лиги(EN)"
					variant="outlined"
					value={leagueShortNameEn}
					onChange={handleLeagueShortNameEnChange}
				/>
			</Box>

			<Button
				sx={{ height: '1.8rem', px: 1, mr: 1 }}
				variant="contained"
				color="error"
				onClick={handleCancelClick}
			>
				<Typography variant="button" fontWeight="600" fontSize="0.9rem" fontFamily="Shantell Sans">
					Отмена
				</Typography>
			</Button>
			<Button
				onClick={handleAddLeagueClick}
				sx={{ height: '1.8rem', px: 1 }}
				variant="contained"
				color="success"
			>
				<Typography variant="button" fontWeight="600" fontSize="0.9rem" fontFamily="Shantell Sans">
					Добавить
				</Typography>
			</Button>
			<Box textAlign="center">
				<NotificationSnackbar
					open={openSnackbar}
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					message={snackbarMessage}
					duration={3000}
				/>
			</Box>
		</>
	);
}
