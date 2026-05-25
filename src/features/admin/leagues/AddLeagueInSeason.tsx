import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import LeagueAvatar from '../../../components/custom/avatar/LeagueAvatar';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import { getTournamentFormats } from '../tournament-formats/api';
import TournamentFormat from '../tournament-formats/types/TournamentFormat';
import League from '../leagues/types/League';
import { addLeagueToSeason, getSeasons } from '../seasons/seasonsSlice';
import { selectLeagueCodes } from '../seasons/selectors';
import LeagueFormatAssignInline from './LeagueFormatAssignInline';

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
	const [tournamentFormatId, setTournamentFormatId] = useState<string>('');
	const [formats, setFormats] = useState<TournamentFormat[]>([]);

	useEffect(() => {
		getTournamentFormats()
			.then((page) => setFormats(page.formats))
			.catch(() => setFormats([]));
	}, []);

	const refreshSeasons = useCallback(() => {
		dispatch(getSeasons());
	}, [dispatch]);

	const handleAddLeagueClick = useCallback(async () => {
		if (!leagueCode || !tournamentFormatId) {
			return;
		}
		const dispatchResult = await dispatch(
			addLeagueToSeason({ seasonId, leagueCode, tournamentFormatId })
		);
		if (addLeagueToSeason.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('leagueWasSuccessfullyAddedToSeason') }));
			setLeagueCode('');
			setTournamentFormatId('');
			refreshSeasons();
		}
		if (addLeagueToSeason.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, leagueCode, seasonId, tournamentFormatId, refreshSeasons]);

	const handleLeagueCodeChange = (event: SelectChangeEvent): void => {
		setLeagueCode(event.target.value);
	};

	const handleFormatChange = (event: SelectChangeEvent): void => {
		setTournamentFormatId(event.target.value);
	};

	const handleCancelClick = (): void => {
		handleLeagueListShow(false);
	};

	const canAdd = Boolean(leagueCode && tournamentFormatId);

	return (
		<>
			<Typography sx={{ mt: 1.5 }}>{t(`allLeaguesList`)}:</Typography>
			{leagues && leagues.length > 0 ? (
				<List sx={{ borderBottom: 1, py: 0 }}>
					{leagues.map((l) => (
						<ListItem
							key={l.id}
							sx={{
								flexDirection: 'column',
								alignItems: 'stretch',
								px: 0.5,
								py: 0.75,
								minWidth: 0,
								overflow: 'hidden',
							}}
						>
							{l.tournamentFormatId ? (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<LeagueAvatar leagueCode={l.leagueCode} height={28} fullName />
									<CheckCircleIcon color="success" fontSize="small" sx={{ ml: 'auto' }} />
								</Box>
							) : (
								<LeagueFormatAssignInline
									leagueId={l.id}
									leagueCode={l.leagueCode}
									leagueName={l.name}
									formats={formats}
									onAssigned={refreshSeasons}
								/>
							)}
						</ListItem>
					))}
				</List>
			) : (
				<Box sx={{ fontWeight: 600, color: 'brown' }}>{t(`noLeaguesInThisSeason`)}</Box>
			)}
			<Box sx={{ my: 1 }}>
				<Select
					fullWidth
					size="small"
					sx={{ mb: 1 }}
					labelId="league-code-label"
					id="league-code-select"
					value={leagueCode}
					onChange={handleLeagueCodeChange}
					displayEmpty
				>
					<MenuItem value="" disabled>
						{t('chooseLeague')}
					</MenuItem>
					{leagueCodeList?.map((code) => (
						<MenuItem key={code} value={code} sx={{ py: 1 }}>
							<LeagueAvatar leagueCode={code} height={28} fullName sx={{ justifyContent: 'start' }} />
						</MenuItem>
					))}
				</Select>
				<Select
					fullWidth
					size="small"
					value={tournamentFormatId}
					onChange={handleFormatChange}
					displayEmpty
				>
					<MenuItem value="" disabled>
						{t('chooseTournamentFormat')}
					</MenuItem>
					{formats.map((f) => (
						<MenuItem key={f.id} value={f.id}>
							{f.name} ({f.formatCode})
						</MenuItem>
					))}
				</Select>
			</Box>
			<Box sx={{ pb: 1 }}>
				<CustomCancelButton onClick={handleCancelClick} />
				<CustomSuccessButton
					onClick={handleAddLeagueClick}
					buttonText={t('btnText.add')}
					disabled={!canAdd}
				/>
			</Box>
		</>
	);
}
