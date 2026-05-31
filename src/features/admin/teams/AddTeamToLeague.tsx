import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	FormControl,
	IconButton,
	InputLabel,
	List,
	ListItem,
	MenuItem,
	Select,
	SelectChangeEvent,
	Tooltip,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import LeagueAvatar from '../../../components/custom/avatar/LeagueAvatar';
import TeamAvatar from '../../../components/custom/avatar/TeamAvatar';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import CustomCalendarDialog from '../../../components/custom/dialog/CustomCalendarDialog';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import { resolveTeamDisplayName } from '../../../components/utils/teamDisplay';
import { addTeamToLeagueInSeason, getSeasons, removeTeamFromLeagueInSeason } from '../seasons/seasonsSlice';
import { selectSeasons } from '../seasons/selectors';
import Season from '../seasons/types/Season';
import {
	ADMIN_ACTIONS_ROW_SX,
	ADMIN_FIELD_LABEL_SX,
	ADMIN_FORM_FIELD_SX,
	ADMIN_SELECT_COMPACT_LABEL_SX,
} from '../adminPanelStyles';
import { selectLeagueTeams, selectTeams } from './selectors';
import Team from './types/Team';
import { getAllTeams, getLeagueTeams } from './teamsSlice';

export default function AddTeamToLeague({
	closeAddTeamToLeague,
}: {
	closeAddTeamToLeague: (close: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const { i18n } = useTranslation();
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
	const [teamToRemove, setTeamToRemove] = useState<Team | null>(null);

	const seasonTitles = useMemo(() => seasons.map((s) => s.title), [seasons]);
	const safeSeasonTitle = seasonTitles.includes(selectedSeasonTitle) ? selectedSeasonTitle : '';
	const leagueNames = useMemo(
		() => selectedSeason?.leagues?.map((l) => l.name) ?? [],
		[selectedSeason?.leagues]
	);
	const safeLeagueName = leagueNames.includes(selectedLeague) ? selectedLeague : '';
	const selectedLeagueEntity = selectedSeason?.leagues?.find((l) => l.name === safeLeagueName);
	const teamTitles = useMemo(() => allTeams.map((team) => team.title), [allTeams]);
	const safeTeamTitle = teamTitles.includes(selectedTeam) ? selectedTeam : '';
	const selectedTeamEntity = allTeams.find((team) => team.title === safeTeamTitle);

	const sortedLeagueTeams = useMemo(
		() =>
			[...leagueTeams].sort((a, b) =>
				resolveTeamDisplayName(a, t, i18n.language).localeCompare(
					resolveTeamDisplayName(b, t, i18n.language),
					i18n.language.startsWith('ru') ? 'ru' : undefined
				)
			),
		[i18n.language, leagueTeams]
	);

	const sortedAllTeams = useMemo(
		() =>
			[...allTeams].sort((a, b) =>
				resolveTeamDisplayName(a, t, i18n.language).localeCompare(
					resolveTeamDisplayName(b, t, i18n.language),
					i18n.language.startsWith('ru') ? 'ru' : undefined
				)
			),
		[allTeams, i18n.language]
	);

	const handleAddTeamClick = useCallback(async () => {
		const dispatchResult = await dispatch(
			addTeamToLeagueInSeason({
				seasonId,
				leagueId,
				teamId,
			})
		);
		if (addTeamToLeagueInSeason.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('teamWasSuccessfullyAddedToLeague') }));
			setSelectedTeam('');
			setTeamId('');
			dispatch(getLeagueTeams({ leagueId }));
		}
		if (addTeamToLeagueInSeason.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, leagueId, seasonId, teamId]);

	const handleSeasonChange = (event: SelectChangeEvent): void => {
		const title = event.target.value;
		setSelectedSeasonTitle(title);
		const season = seasons.find((s) => s.title === title);
		setSelectedSeason(season);
		setSeasonId(season?.id ?? '');
		setSelectedLeague('');
		setLeagueId('');
		setSelectedTeam('');
		setTeamId('');
	};

	const handleLeagueChange = (event: SelectChangeEvent): void => {
		const leagueName = event.target.value;
		setSelectedLeague(leagueName);
		const league = selectedSeason?.leagues?.find((l) => l.name === leagueName);
		setLeagueId(league?.id ?? '');
		setSelectedTeam('');
		setTeamId('');
	};

	const handleTeamChange = (event: SelectChangeEvent): void => {
		const teamTitle = event.target.value;
		setSelectedTeam(teamTitle);
		const team = allTeams.find((el) => el.title === teamTitle);
		setTeamId(team?.id ?? '');
	};

	const handleCancelClick = (): void => {
		closeAddTeamToLeague(false);
	};

	const handleConfirmRemoveTeam = useCallback(async () => {
		if (!teamToRemove || !seasonId || !leagueId) {
			return;
		}
		const dispatchResult = await dispatch(
			removeTeamFromLeagueInSeason({
				seasonId,
				leagueId,
				teamId: teamToRemove.id,
			})
		);
		setTeamToRemove(null);
		if (removeTeamFromLeagueInSeason.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('teamWasSuccessfullyRemovedFromLeague') }));
			if (selectedTeam === teamToRemove.title) {
				setSelectedTeam('');
				setTeamId('');
			}
			dispatch(getLeagueTeams({ leagueId }));
		}
		if (removeTeamFromLeagueInSeason.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, leagueId, seasonId, selectedTeam, teamToRemove]);

	useEffect(() => {
		dispatch(getSeasons());
		dispatch(getAllTeams());
	}, [dispatch]);

	useEffect(() => {
		if (leagueId) {
			dispatch(getLeagueTeams({ leagueId }));
		}
	}, [dispatch, leagueId]);

	return (
		<Box>
			<FormControl fullWidth size="small" sx={ADMIN_FORM_FIELD_SX}>
				<InputLabel id="season-title-label">{t('chooseSeason')}</InputLabel>
				<Select
					labelId="season-title-label"
					id="season-title-select"
					label={t('chooseSeason')}
					value={safeSeasonTitle}
					onChange={handleSeasonChange}
				>
					{seasons.map((s) => (
						<MenuItem key={s.id} value={s.title}>
							{s.title}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{selectedSeason ? (
				<FormControl fullWidth size="small" sx={ADMIN_FORM_FIELD_SX}>
					<InputLabel id="league-title-label">{t('chooseLeague')}</InputLabel>
					<Select
						labelId="league-title-label"
						id="league-title-select"
						label={t('chooseLeague')}
						value={safeLeagueName}
						onChange={handleLeagueChange}
						renderValue={(value) =>
							value && selectedLeagueEntity ? (
								<LeagueAvatar
									leagueCode={selectedLeagueEntity.leagueCode}
									height={22}
									fullName
									sx={{ justifyContent: 'start', mr: 0, minWidth: 0 }}
								/>
							) : (
								value
							)
						}
					>
						{selectedSeason.leagues?.map((league) => (
							<MenuItem key={league.id} value={league.name} sx={{ py: 0.75 }}>
								<LeagueAvatar
									leagueCode={league.leagueCode}
									height={22}
									fullName
									sx={{ justifyContent: 'start', mr: 0, minWidth: 0 }}
								/>
							</MenuItem>
						))}
					</Select>
				</FormControl>
			) : null}

			{selectedSeason && safeLeagueName ? (
				<>
					<Typography sx={ADMIN_FIELD_LABEL_SX}>
						{t('listOfLeagueTeams')}: ({leagueTeams.length})
					</Typography>
					<List dense sx={{ py: 0, mb: 1.5 }}>
						{leagueTeams.length > 0 ? (
							sortedLeagueTeams.map((team) => (
								<ListItem
									sx={{
										px: 0.25,
										py: 0.25,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
									key={team.id}
								>
									<TeamAvatar team={team} height={22} sx={{ minWidth: 0, overflow: 'hidden' }} />
									<Tooltip title={t('btnText.delete')} arrow>
										<span>
											<IconButton
												size="small"
												aria-label={t('btnText.delete')}
												onClick={() => setTeamToRemove(team)}
												sx={{ color: 'error.main', flexShrink: 0 }}
											>
												<CloseIcon fontSize="small" />
											</IconButton>
										</span>
									</Tooltip>
								</ListItem>
							))
						) : (
							<Typography sx={{ textAlign: 'center', color: 'brown', fontWeight: 600, py: 0.5 }}>
								{t('noTeamsInLeagueAtThisMoment')}
							</Typography>
						)}
					</List>

					<FormControl
						fullWidth
						size="small"
						sx={{ ...ADMIN_FORM_FIELD_SX, ...ADMIN_SELECT_COMPACT_LABEL_SX, mb: 1 }}
					>
						<InputLabel id="team-title-label">{t('chooseTeamForAddingToLeague')}</InputLabel>
						<Select
							labelId="team-title-label"
							id="team-title-select"
							label={t('chooseTeamForAddingToLeague')}
							value={safeTeamTitle}
							onChange={handleTeamChange}
							renderValue={(value) =>
								value && selectedTeamEntity ? (
									<TeamAvatar team={selectedTeamEntity} height={22} sx={{ minWidth: 0, overflow: 'hidden' }} />
								) : (
									value
								)
							}
						>
							{sortedAllTeams.map((team) => (
								<MenuItem key={team.id} value={team.title} sx={{ py: 0.75 }}>
									<TeamAvatar team={team} height={22} sx={{ minWidth: 0, overflow: 'hidden' }} />
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Box sx={{ ...ADMIN_ACTIONS_ROW_SX, '& .MuiButton-root': { width: '100%', mr: 0 } }}>
						<CustomCancelButton onClick={handleCancelClick} sx={{ mr: 0 }} />
						<CustomSuccessButton
							onClick={handleAddTeamClick}
							buttonText={t('btnText.add')}
							disabled={!teamId}
							sx={{ mr: 0 }}
						/>
					</Box>
				</>
			) : null}

			<CustomCalendarDialog
				open={teamToRemove != null}
				onClose={() => setTeamToRemove(null)}
				onSave={() => {
					void handleConfirmRemoveTeam();
				}}
				title={t('removeTeamFromLeagueTitle')}
				summaryComponent={
					teamToRemove ? (
						<Box
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								alignItems: 'center',
								gap: 0.5,
								lineHeight: 1.45,
							}}
						>
							<Typography component="span" sx={{ fontSize: '1rem' }}>
								{t('removeTeamFromLeagueConfirmBefore')}
							</Typography>
							<TeamAvatar team={teamToRemove} height={24} />
							<Typography component="span" sx={{ fontSize: '1rem' }}>
								{t('removeTeamFromLeagueConfirmAfter')}
							</Typography>
						</Box>
					) : undefined
				}
				buttonAcceptText={t('btnText.delete')}
			/>
		</Box>
	);
}
