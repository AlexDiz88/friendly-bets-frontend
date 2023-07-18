import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { addTeamToLeagueInSeason, getSeasons } from '../seasons/seasonsSlice';
import { useAppDispatch } from '../../../store';
import { selectSeasons } from '../seasons/selectors';
import Season from '../seasons/types/Season';
import { selectTeams } from './selectors';
import { getAllTeams } from './teamsSlice';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import Team from './types/Team';

export default function AddTeamToLeague({
  closeAddTeamToLeague,
}: {
  closeAddTeamToLeague: any;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const seasons = useSelector(selectSeasons);
  const allTeams = useSelector(selectTeams);
  const [selectedSeasonTitle, setSelectedSeasonTitle] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<Season | undefined>(
    undefined
  );
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [seasonId, setSeasonId] = useState<string>('');
  const [leagueId, setLeagueId] = useState<string>('');
  const [teamId, setTeamId] = useState<string>('');
  const [leagueTeams, setLeagueTeams] = useState<Team[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddTeamClick = React.useCallback(async () => {
    const dispatchResult = await dispatch(
      addTeamToLeagueInSeason({
        seasonId,
        leagueId,
        teamId,
      })
    );
    if (addTeamToLeagueInSeason.fulfilled.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Команда успешно добавлена в лигу');
      setSelectedTeam('');
      if (selectedSeason && selectedSeason.leagues) {
        const updatedLeague = selectedSeason.leagues.find(
          (league) => league.name === selectedLeague
        );
        if (updatedLeague) {
          setLeagueTeams(updatedLeague.teams);
        }
      }
    }
    if (addTeamToLeagueInSeason.rejected.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('error');
      if (dispatchResult.error.message) {
        setSnackbarMessage(dispatchResult.error.message);
      }
    }
  }, [dispatch, leagueId, seasonId, selectedLeague, selectedSeason, teamId]);

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
    const league = selectedSeason?.leagues?.find(
      (l) => l.name === event.target.value
    );
    if (league) {
      setLeagueId(league.id);
    }
    dispatch(getAllTeams());
  };

  const handleTeamChange = (event: SelectChangeEvent): void => {
    setSelectedTeam(event.target.value);
    const team = allTeams.find((t) => t.fullTitleRu === event.target.value);
    if (team) {
      setTeamId(team.id);
    }
  };

  const handleCancelClick = (): void => {
    closeAddTeamToLeague(false);
  };

  useEffect(() => {
    dispatch(getSeasons());
    if (selectedSeason && selectedLeague && selectedSeason.leagues) {
      const league = selectedSeason.leagues.find((l) => l.name === selectedLeague);
      if (league) {
        setLeagueTeams(league.teams);
      }
    }
  }, [dispatch, selectedSeason, selectedLeague]);

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 600 }}>Выбрать сезон</Typography>
      <Select
        fullWidth
        size="small"
        sx={{ my: 1 }}
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
          <Typography sx={{ fontWeight: 600 }}>Выбрать лигу</Typography>
          <Select
            fullWidth
            size="small"
            sx={{ my: 1 }}
            labelId="league-title-label"
            id="league-title-select"
            value={selectedLeague}
            onChange={handleLeagueChange}
          >
            {selectedSeason.leagues?.map((league) => (
              <MenuItem key={league.id} value={league.name}>
                {league.name}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
      {selectedSeason && selectedLeague && (
        <>
          <Typography sx={{ fontWeight: 600 }}>Список команд лиги:</Typography>
          <List>
            {selectedSeason.leagues &&
              leagueTeams.map((team) => (
                <ListItem sx={{ py: 0 }} key={team.id}>
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    {team.fullTitleRu}
                  </Typography>
                </ListItem>
              ))}
            {selectedSeason.leagues &&
              selectedSeason.leagues.find((league) => league.name === selectedLeague)
                ?.teams.length === 0 && (
                <ListItem>
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontSize: '1rem',
                      color: 'brown',
                      fontWeight: 600,
                    }}
                  >
                    В этой лиге на данный момент нет команд
                  </Typography>
                </ListItem>
              )}
          </List>
          <Typography sx={{ mt: 1, pt: 1, borderTop: 1, fontWeight: 600 }}>
            Выбрать команду для добавления в лигу
          </Typography>
          <Select
            fullWidth
            size="small"
            sx={{ my: 1 }}
            labelId="team-title-label"
            id="team-title-select"
            value={selectedTeam}
            onChange={handleTeamChange}
          >
            {allTeams.map((team) => (
              <MenuItem key={team.id} value={team.fullTitleRu}>
                {team.fullTitleRu}
              </MenuItem>
            ))}
          </Select>
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
            onClick={handleAddTeamClick}
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
              Добавить
            </Typography>
          </Button>
        </>
      )}
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
