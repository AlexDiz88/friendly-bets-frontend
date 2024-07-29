import {
	Avatar,
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
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import pathToLogoImage from '../../../components/utils/pathToLogoImage';
import { addTeamToLeagueInSeason, getSeasons } from '../seasons/seasonsSlice';
import { selectSeasons } from '../seasons/selectors';
import Season from '../seasons/types/Season';
import { selectLeagueTeams, selectTeams } from './selectors';
import { getAllTeams, getLeagueTeams } from './teamsSlice';

export default function AddTeamToLeague({
	closeAddTeamToLeague,
}: {
	closeAddTeamToLeague: (close: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const seasons = useAppSelector(selectSeasons);
	const allTeams = useAppSelector(selectTeams);
	const leagueTeams = useAppSelector(selectLeagueTeams);
	const [selectedSeasonTitle, setSelectedSeasonTitle] = useState<string>('');
	const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(undefined);
	const [selectedLeague, setSelectedLeague] = useState<string>('');
	const [selectedTeam, setSelectedTeam] = useState<string>('');
	const [seasonId, setSeasonId] = useState<string>('');
	const [leagueId, setLeagueId] = useState<string>('');
	const [teamId, setTeamId] = useState<string>('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarDuration, setSnackbarDuration] = useState(3000);

	const handleAddTeamClick = useCallback(async () => {
		const dispatchResult = await dispatch(
			addTeamToLeagueInSeason({
				seasonId,
				leagueId,
				teamId,
			})
		);
		if (addTeamToLeagueInSeason.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarDuration(1000);
			setSnackbarSeverity('success');
			setSnackbarMessage(t('teamWasSuccessfullyAddedToLeague'));
			setSelectedTeam('');
		}
		if (addTeamToLeagueInSeason.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [dispatch, leagueId, seasonId, teamId]);

	const handleSeasonChange = (event: SelectChangeEvent): void => {
		setSelectedSeasonTitle(event.target.value);
		const season = seasons.find((s) => s.title === event.target.value);
		setSelectedSeason(season);
		if (season) {
			setSeasonId(season.id);
		}
		setSelectedLeague('');
	};

	const handleLeagueChange = (event: SelectChangeEvent): void => {
		setSelectedLeague(event.target.value);
		const league = selectedSeason?.leagues?.find((l) => l.name === event.target.value);
		if (league) {
			setLeagueId(league.id);
		}
	};

	const handleTeamChange = (event: SelectChangeEvent): void => {
		setSelectedTeam(event.target.value);
		const team = allTeams.find((el) => el.title === event.target.value);
		if (team) {
			setTeamId(team.id);
		}
	};

	const handleCancelClick = (): void => {
		closeAddTeamToLeague(false);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	useEffect(() => {
		dispatch(getSeasons());
		dispatch(getAllTeams());
	}, []);

	useEffect(() => {
		dispatch(getLeagueTeams({ leagueId }));
	}, [openSnackbar, selectedLeague]);

	return (
		<Box>
			<Typography sx={{ fontWeight: 600, mt: 1 }}>{t('chooseSeason')}</Typography>
			<Select
				size="small"
				sx={{ my: 1, width: '18rem' }}
				labelId="season-title-label"
				id="season-title-select"
				value={selectedSeasonTitle}
				onChange={handleSeasonChange}
			>
				{seasons.map((s) => (
					<MenuItem key={s.id} value={s.title}>
						{s.title}
					</MenuItem>
				))}
			</Select>
			{selectedSeason && (
				<>
					<Typography sx={{ fontWeight: 600 }}>{t('chooseLeague')}</Typography>
					<Select
						size="small"
						sx={{ my: 1, width: '18rem' }}
						labelId="league-title-label"
						id="league-title-select"
						value={selectedLeague}
						onChange={handleLeagueChange}
					>
						{selectedSeason.leagues?.map((league) => (
							<MenuItem key={league.id} value={league.name}>
								<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<Avatar
										sx={{ mr: 1, borderRadius: 0 }}
										alt="league_logo"
										src={pathToLogoImage(league.leagueCode)}
									/>

									<Typography sx={{ fontSize: '0.85rem' }}>{league.name}</Typography>
								</Box>
							</MenuItem>
						))}
					</Select>
				</>
			)}
			{selectedSeason && selectedLeague && (
				<>
					<Typography sx={{ fontWeight: 600 }}>
						{t('listOfLeagueTeams')}: ({leagueTeams.length})
					</Typography>
					<List sx={{ pb: 0 }}>
						{leagueTeams && leagueTeams.length > 0 ? (
							leagueTeams
								.slice()
								.sort((a, b) => a.title.localeCompare(b.title))
								.map((team) => (
									<ListItem sx={{ py: 0 }} key={team.id}>
										<Avatar
											sx={{ mr: 1, width: 25, height: 25 }}
											alt="team_logo"
											src={pathToLogoImage(team.title)}
										/>
										<Typography sx={{ fontSize: '0.9rem' }}>{t(`teams:${team.title}`)}</Typography>
									</ListItem>
								))
						) : (
							<Typography sx={{ textAlign: 'center', color: 'brown', fontWeight: 600 }}>
								{t('noTeamsInLeagueAtThisMoment')}
							</Typography>
						)}
					</List>
					<Typography sx={{ mt: 1, pt: 1, borderTop: 1, fontWeight: 600 }}>
						{t('chooseTeamForAddingToLeague')}
					</Typography>
					<Select
						size="small"
						sx={{ mt: 1, mb: 1.5, p: 0, width: '16rem' }}
						labelId="team-title-label"
						id="team-title-select"
						value={selectedTeam}
						onChange={handleTeamChange}
					>
						{allTeams
							.slice()
							.sort((a, b) => a.title.localeCompare(b.title))
							.map((team) => (
								<MenuItem dense key={team.id} value={team.title}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Avatar sx={{ mr: 1 }} alt="team_logo" src={pathToLogoImage(team.title)} />
										<Typography sx={{ fontSize: '0.9rem' }}>{t(`teams:${team.title}`)}</Typography>
									</Box>
								</MenuItem>
							))}
					</Select>
					<Box>
						<CustomCancelButton onClick={handleCancelClick} />
						<CustomSuccessButton onClick={handleAddTeamClick} buttonText={t('btnText.add')} />
					</Box>
				</>
			)}
			<Box textAlign="center">
				<NotificationSnackbar
					open={openSnackbar}
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					message={snackbarMessage}
					duration={snackbarDuration}
				/>
			</Box>
		</Box>
	);
}
