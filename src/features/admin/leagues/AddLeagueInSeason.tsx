import {
	Box,
	List,
	ListItem,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import LeagueAvatar from '../../../components/custom/avatar/LeagueAvatar';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
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

	const handleAddLeagueClick = useCallback(async () => {
		const dispatchResult = await dispatch(addLeagueToSeason({ seasonId, leagueCode }));
		if (addLeagueToSeason.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('leagueWasSuccessfullyAddedToSeason') }));
			setLeagueCode('');
		}
		if (addLeagueToSeason.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, leagueCode, seasonId]);

	const handleLeagueCodeChange = (event: SelectChangeEvent): void => {
		const code = event.target.value;
		setLeagueCode(code);
	};

	const handleCancelClick = (): void => {
		handleLeagueListShow(false);
	};

	return (
		<>
			<Typography sx={{ mt: 1.5 }}>{t(`allLeaguesList`)}:</Typography>
			{leagues && leagues.length > 0 ? (
				<List sx={{ borderBottom: 1 }}>
					{leagues?.map((l) => (
						<ListItem sx={{ my: 0, px: 1, py: 0 }} key={l.id}>
							<LeagueAvatar leagueCode={l.leagueCode} height={30} fullName />
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
							<MenuItem sx={{ ml: -0.5, py: 1.5, minWidth: '15rem' }} key={l} value={l}>
								<LeagueAvatar
									leagueCode={l}
									height={32}
									fullName
									sx={{ justifyContent: 'start' }}
								/>
							</MenuItem>
						))}
				</Select>
			</Box>
			<Box sx={{ pb: 1 }}>
				<CustomCancelButton onClick={handleCancelClick} />
				<CustomSuccessButton onClick={handleAddLeagueClick} buttonText={t('btnText.add')} />
			</Box>
		</>
	);
}
