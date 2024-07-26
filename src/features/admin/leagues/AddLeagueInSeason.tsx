import {
	Avatar,
	Box,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import pathToLogoImage from '../../../components/utils/pathToLogoImage';
import League from '../leagues/types/League';
import { addLeagueToSeason } from '../seasons/seasonsSlice';
import { selectLeagueCodes } from '../seasons/selectors';

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
	const leagueCodeList = useAppSelector(selectLeagueCodes);
	const [leagueCode, setLeagueCode] = useState<string>('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleAddLeagueClick = useCallback(async () => {
		const dispatchResult = await dispatch(
			addLeagueToSeason({
				seasonId,
				leagueCode,
			})
		);
		if (addLeagueToSeason.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage('Лига успешно добавлена в сезон');
			setLeagueCode('');
		}
		if (addLeagueToSeason.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [dispatch, leagueCode, seasonId]);

	const handleLeagueCodeChange = (event: SelectChangeEvent): void => {
		const code = event.target.value;
		setLeagueCode(code);
	};

	const handleCancelClick = (): void => {
		handleLeagueListShow(false);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<>
			<Typography sx={{ mt: 1.5 }}>{t(`allLeaguesList`)}:</Typography>
			{leagues && leagues.length > 0 ? (
				<List sx={{ borderBottom: 1 }}>
					{leagues?.map((l) => (
						<ListItem sx={{ my: 0, px: 1, py: 0 }} key={l.id}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Avatar
									sx={{ mr: 1, width: 30, height: 30 }}
									alt="league_logo"
									src={pathToLogoImage(l.leagueCode)}
								/>
								<ListItemText primary={t(`leagueFullName.${l.leagueCode}`)} />
							</div>
						</ListItem>
					))}
				</List>
			) : (
				<Box sx={{ fontWeight: 600, color: 'brown' }}>{t(`noLeaguesInThisSeason`)}</Box>
			)}
			<Box sx={{ my: 1 }}>
				<Select
					autoWidth
					size="small"
					sx={{ minWidth: '15rem', ml: -0.2 }}
					labelId="league-code-label"
					id="league-code-select"
					value={leagueCode}
					onChange={handleLeagueCodeChange}
				>
					{leagueCodeList &&
						leagueCodeList.map((l) => (
							<MenuItem sx={{ ml: -0.5, minWidth: '15rem' }} key={l} value={l}>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Avatar
										variant="square"
										sx={{ width: 27, height: 27 }}
										alt="league_logo"
										src={pathToLogoImage(l)}
									/>
									<Typography sx={{ mx: 1, fontSize: '1rem' }}>
										{t(`leagueFullName.${l}`)}
									</Typography>
								</div>
							</MenuItem>
						))}
				</Select>
			</Box>
			<Box sx={{ pb: 1 }}>
				<CustomCancelButton onClick={handleCancelClick} />
				<CustomSuccessButton onClick={handleAddLeagueClick} buttonText={t('btnText.add')} />
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
		</>
	);
}
