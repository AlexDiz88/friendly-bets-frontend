import { Box, FormControl, List, TextField } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { ADMIN_FORM_PANEL_SX } from '../adminPanelStyles';
import SeasonInfo from './SeasonInfo';
import { addSeason, getLeagueCodeList, getSeasonStatusList, getSeasons } from './seasonsSlice';
import { selectSeasons } from './selectors';
import { FALLBACK_DEFAULT_BET_SIZE } from '../../bets/betSizeDefaults';
import Season from './types/Season';

export default function SeasonsManagement(): JSX.Element {
	const dispatch = useAppDispatch();
	const seasons: Season[] = useAppSelector(selectSeasons);
	const [seasonTitle, setSeasonTitle] = useState<string>('');
	const [seasonBetCount, setSeasonBetCount] = useState<string>('');
	const [seasonBetSize, setSeasonBetSize] = useState<string>(String(FALLBACK_DEFAULT_BET_SIZE));
	const [seasonStartDate, setSeasonStartDate] = useState('');
	const [seasonEndDate, setSeasonEndDate] = useState('');
	const [showCreateSeason, setShowCreateSeason] = useState(false);
	const [showAllSeasons, setShowAllSeasons] = useState(false);

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();
			const dispatchResult = await dispatch(
				addSeason({
					title: seasonTitle,
					betCountPerMatchDay: Number(seasonBetCount),
					defaultBetSize: Number(seasonBetSize),
					startDate: seasonStartDate,
					endDate: seasonEndDate,
				})
			);

			if (addSeason.fulfilled.match(dispatchResult)) {
				dispatch(showSuccessSnackbar({ message: t('seasonWasSuccessfullyCreated') }));
				setSeasonTitle('');
				setSeasonBetCount('');
				setSeasonBetSize(String(FALLBACK_DEFAULT_BET_SIZE));
				setSeasonStartDate('');
				setSeasonEndDate('');
				setShowCreateSeason(false);
				setShowAllSeasons(true);
				dispatch(getSeasons());
			}
			if (addSeason.rejected.match(dispatchResult)) {
				dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
			}
		},
		[seasonBetCount, seasonBetSize, seasonTitle, seasonStartDate, seasonEndDate, dispatch]
	);

	const handleShowAllSeasons = (): void => {
		dispatch(getSeasonStatusList());
		dispatch(getLeagueCodeList());
		dispatch(getSeasons());
		setShowAllSeasons(true);
	};

	const handleHideAllSeasons = (): void => {
		setShowAllSeasons(false);
	};

	const handleShowCreateNewSeason = (): void => {
		setShowCreateSeason(!showCreateSeason);
	};

	const handleSeasonTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setSeasonTitle(event.target.value);
	};

	const handleSeasonBetCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setSeasonBetCount(event.target.value);
	};

	const handleSeasonBetSizeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setSeasonBetSize(event.target.value);
	};

	return (
		<AdminSection title={t('SeasonsManagement')}>
			<CustomButton
				sx={{ width: '100%', mb: showCreateSeason ? 1.5 : 0 }}
				onClick={() => handleShowCreateNewSeason()}
				buttonColor="secondary"
				buttonText={t('newSeason')}
			/>

			{showCreateSeason && (
				<Box sx={ADMIN_FORM_PANEL_SX}>
					<FormControl fullWidth>
						<Box sx={{ fontSize: '0.9375rem', fontWeight: 600, mb: 1.5 }}>{t('addNewSeason')}</Box>
						<TextField
							fullWidth
							required
							id="season-title"
							label={t('SeasonName')}
							size="small"
							value={seasonTitle}
							onChange={handleSeasonTitleChange}
							sx={{ mb: 1.5 }}
						/>
						<Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
							<TextField
								required
								type="number"
								id="season-bets-count"
								label={t('BetsCountPerMatchday')}
								size="small"
								fullWidth
								value={seasonBetCount}
								onChange={handleSeasonBetCountChange}
							/>
							<TextField
								required
								type="number"
								id="season-bet-size"
								label={t('DefaultBetSizePerMatchday')}
								size="small"
								fullWidth
								value={seasonBetSize}
								onChange={handleSeasonBetSizeChange}
								inputProps={{ min: 1 }}
							/>
						</Box>
						<Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
							<TextField
								required
								type="date"
								id="season-start-date"
								label={t('seasonStartDate')}
								size="small"
								fullWidth
								value={seasonStartDate}
								onChange={(e) => setSeasonStartDate(e.target.value)}
								InputLabelProps={{ shrink: true }}
								inputProps={{ max: seasonEndDate || undefined }}
							/>
							<TextField
								required
								type="date"
								id="season-end-date"
								label={t('seasonEndDate')}
								size="small"
								fullWidth
								value={seasonEndDate}
								onChange={(e) => setSeasonEndDate(e.target.value)}
								InputLabelProps={{ shrink: true }}
								inputProps={{ min: seasonStartDate || undefined }}
							/>
						</Box>
						<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
							<CustomCancelButton onClick={handleShowCreateNewSeason} />
							<CustomSuccessButton
								onClick={handleSubmit}
								buttonText={t('btnText.create')}
								disabled={!seasonStartDate || !seasonEndDate}
							/>
						</Box>
					</FormControl>
				</Box>
			)}

			{!showCreateSeason && (
				<Box sx={{ mt: 1.5 }}>
					{!showAllSeasons ? (
						<CustomButton
							sx={{ width: '100%' }}
							onClick={() => handleShowAllSeasons()}
							buttonColor="info"
							buttonVariant="outlined"
							buttonText={t('showAllSeasons')}
						/>
					) : (
						<CustomButton
							sx={{ width: '100%', mb: 1.5 }}
							onClick={() => handleHideAllSeasons()}
							buttonColor="info"
							buttonVariant="outlined"
							buttonText={t('hide')}
						/>
					)}
					{showAllSeasons && !!seasons.length && (
						<List disablePadding sx={{ mt: 0.5 }}>
							{seasons
								.slice()
								.reverse()
								.map((season) => (
									<SeasonInfo key={season.id} data={season} />
								))}
						</List>
					)}
				</Box>
			)}
		</AdminSection>
	);
}
