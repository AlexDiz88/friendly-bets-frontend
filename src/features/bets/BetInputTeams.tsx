import { Avatar, Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import Team from '../admin/teams/types/Team';

export default function BetInputTeams({
	defaultHomeTeamName,
	defaultAwayTeamName,
	onHomeTeamSelect,
	onAwayTeamSelect,
	leagueId,
	resetTeams,
}: {
	defaultHomeTeamName: string;
	defaultAwayTeamName: string;
	onHomeTeamSelect: (homeTeam: Team) => void;
	onAwayTeamSelect: (awayTeam: Team) => void;
	leagueId: string;
	resetTeams: boolean;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const leagues = activeSeason?.leagues;
	const league = leagues?.find((l) => l.id === leagueId);
	const [selectedHomeTeamName, setSelectedHomeTeamName] = useState<string>(defaultHomeTeamName);
	const [selectedAwayTeamName, setSelectedAwayTeamName] = useState<string>(defaultAwayTeamName);

	const handleHomeTeamChange = (event: SelectChangeEvent): void => {
		const teamName = event.target.value;
		setSelectedHomeTeamName(teamName);
		const selectedLeague = leagues?.find((l) => l.id === leagueId);
		if (selectedLeague) {
			const selectedTeam = selectedLeague.teams.find((team) => team.title === teamName);
			if (selectedTeam) {
				onHomeTeamSelect(selectedTeam);
			}
		}
	};

	const handleAwayTeamChange = (event: SelectChangeEvent): void => {
		const teamName = event.target.value;
		setSelectedAwayTeamName(teamName);
		const selectedLeague = leagues?.find((l) => l.id === leagueId);
		if (selectedLeague) {
			const selectedTeam = selectedLeague.teams.find((team) => team.title === teamName);
			if (selectedTeam) {
				onAwayTeamSelect(selectedTeam);
			}
		}
	};

	useEffect(() => {
		setSelectedHomeTeamName(defaultHomeTeamName);
		setSelectedAwayTeamName(defaultAwayTeamName);
		//  onHomeTeamSelect(undefined);
		//  onAwayTeamSelect(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [leagueId, resetTeams]);

	useEffect(() => {
		dispatch(getActiveSeason());
	}, [dispatch]);

	return (
		<>
			<Box sx={{ textAlign: 'left' }}>
				<Typography sx={{ mx: 1, fontWeight: '600' }}>{t('homeTeam')}</Typography>
				<Select
					autoWidth
					size="small"
					sx={{ minWidth: '15rem', mb: 1 }}
					labelId="home-team-name-label"
					id="home-team-name-select"
					value={selectedHomeTeamName}
					onChange={handleHomeTeamChange}
				>
					{league &&
						league.teams
							.slice()
							.sort((a, b) => (a.title && b.title ? a.title.localeCompare(b.title) : 0))
							.map((team) => (
								<MenuItem sx={{ mx: 0, minWidth: '14.5rem' }} key={team.id} value={team.title}>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<Avatar
											sx={{ width: 27, height: 27 }}
											alt="team_logo"
											src={pathToLogoImage(team.title)}
										/>

										<Typography sx={{ mx: 1, fontSize: '1rem' }}>{team.title}</Typography>
									</div>
								</MenuItem>
							))}
				</Select>
			</Box>
			<Box sx={{ textAlign: 'left' }}>
				<Typography sx={{ mx: 1, fontWeight: '600' }}>{t('awayTeam')}</Typography>
				<Select
					autoWidth
					size="small"
					sx={{ minWidth: '15rem', mb: 1 }}
					labelId="away-team-name-label"
					id="away-team-name-select"
					value={selectedAwayTeamName}
					onChange={handleAwayTeamChange}
				>
					{league &&
						league.teams
							.slice()
							.sort((a, b) => (a.title && b.title ? a.title.localeCompare(b.title) : 0))
							.map((team) => (
								<MenuItem sx={{ mx: 0, minWidth: '14.5rem' }} key={team.id} value={team.title}>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<Avatar
											sx={{ width: 27, height: 27 }}
											alt="team_logo"
											src={pathToLogoImage(team.title)}
										/>

										<Typography sx={{ mx: 1, fontSize: '1rem' }}>{team.title}</Typography>
									</div>
								</MenuItem>
							))}
				</Select>
			</Box>
		</>
	);
}
