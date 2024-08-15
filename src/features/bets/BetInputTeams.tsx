import { Box, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import TeamSelect from '../../components/selectors/TeamSelect';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import Team from '../admin/teams/types/Team';

export default function BetInputTeams({
	defaultHomeTeamName = '',
	defaultAwayTeamName = '',
	onHomeTeamSelect,
	onAwayTeamSelect,
	leagueId,
	resetTeams,
}: {
	defaultHomeTeamName?: string;
	defaultAwayTeamName?: string;
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
	}, [leagueId, resetTeams]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, []);

	return (
		<Box sx={{ mt: 0.5 }}>
			<TeamSelect
				label="homeTeam"
				value={selectedHomeTeamName}
				onChange={handleHomeTeamChange}
				teams={league?.teams}
			/>
			<TeamSelect
				label="awayTeam"
				value={selectedAwayTeamName}
				onChange={handleAwayTeamChange}
				teams={league?.teams}
			/>
		</Box>
	);
}
