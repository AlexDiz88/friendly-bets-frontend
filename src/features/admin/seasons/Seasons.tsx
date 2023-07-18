import React, { useState } from 'react';
import {
  FormControl,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  List,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { addSeason, getSeasonStatusList, getSeasons } from './seasonsSlice';
import SeasonInfo from './SeasonInfo';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import { selectSeasons } from './selectors';
import { useAppDispatch } from '../../../store';
import CreateNewTeam from '../teams/CreateNewTeam';
import AddTeamToLeague from '../teams/AddTeamToLeague';

export default function Seasons(): JSX.Element {
  const dispatch = useAppDispatch();
  const seasons = useSelector(selectSeasons);

  const [seasonTitle, setSeasonTitle] = useState<string>('');
  const [seasonBetCount, setSeasonBetCount] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAllSeasons, setShowAllSeasons] = useState(false);
  const [showAddTeamToLeague, setShowAddTeamToLeague] = useState(false);
  const [addNewTeam, setAddNewTeam] = useState(false);

  const handleSubmit = React.useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      const dispatchResult = await dispatch(
        addSeason({
          title: seasonTitle,
          betCountPerMatchDay: Number(seasonBetCount),
        })
      );

      if (addSeason.fulfilled.match(dispatchResult)) {
        setOpenSnackbar(true);
        setSnackbarSeverity('success');
        setSnackbarMessage('Сезон успешно создан!');
        setSeasonTitle('');
        setSeasonBetCount('');
        dispatch(getSeasonStatusList());
        dispatch(getSeasons());
      }
      if (addSeason.rejected.match(dispatchResult)) {
        setOpenSnackbar(true);
        setSnackbarSeverity('error');
        if (dispatchResult.error.message) {
          setSnackbarMessage(dispatchResult.error.message);
        }
      }
    },
    [dispatch, seasonBetCount, seasonTitle]
  );

  const handleShowAllSeasons = (): void => {
    dispatch(getSeasonStatusList());
    dispatch(getSeasons());
    setShowAllSeasons(true);
  };

  const handleHideAllSeasons = (): void => {
    setShowAllSeasons(false);
  };

  const handleSeasonTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSeasonTitle(event.target.value);
  };

  const handleSeasonBetCountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSeasonBetCount(event.target.value);
  };

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  const handleAddNewTeam = (): void => {
    setAddNewTeam(!addNewTeam);
  };

  const closeAddTeamToLeague = (isClose: boolean): void => {
    setShowAddTeamToLeague(isClose);
  };

  const closeAddNewTeam = (isClose: boolean): void => {
    setAddNewTeam(isClose);
  };

  const handleShowAddTeamToLeague = (): void => {
    setShowAddTeamToLeague(!showAddTeamToLeague);
  };

  return (
    <Box sx={{ margin: '0 auto', textAlign: 'center', width: '14rem' }}>
      <FormControl sx={{ mb: 1.5, borderBottom: 2 }}>
        <Box
          sx={{
            fontSize: 22,
            fontWeight: 600,
            mt: 1,
            mb: 0,
          }}
        >
          Добавить новый сезон
        </Box>
        <Box sx={{ mb: 1, mt: 2 }}>
          <TextField
            fullWidth
            required
            id="season-title"
            label="Название сезона"
            variant="outlined"
            value={seasonTitle}
            onChange={handleSeasonTitleChange}
          />
        </Box>
        <Box sx={{ my: 1, fontSize: '3rem' }}>
          <TextField
            required
            type="number"
            id="season-betcount"
            label="Ставок на тур"
            variant="outlined"
            value={seasonBetCount}
            onChange={handleSeasonBetCountChange}
          />
        </Box>
        <Box sx={{ mb: 1, mt: 0.5, pb: 1.5 }}>
          <Button
            onClick={handleSubmit}
            sx={{ height: '2.5rem', px: 5 }}
            variant="contained"
            type="submit"
            color="secondary"
            size="large"
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
      </FormControl>

      <Box sx={{ mb: 2, borderBottom: 2 }}>
        <Box
          sx={{
            fontSize: 22,
            fontWeight: 600,
            mb: 2,
          }}
        >
          Управление сезонами
        </Box>
        {!showAllSeasons && (
          <Box sx={{ my: 1 }}>
            <Button
              onClick={handleShowAllSeasons}
              sx={{ height: '2.5rem', px: 3, mb: 2 }}
              variant="contained"
              color="info"
              size="large"
            >
              <Typography
                variant="button"
                fontWeight="600"
                fontSize="0.9rem"
                fontFamily="Shantell Sans"
              >
                Показать все сезоны
              </Typography>
            </Button>
          </Box>
        )}
        {showAllSeasons && (
          <Box sx={{ my: 1 }}>
            <Button
              onClick={handleHideAllSeasons}
              sx={{ height: '2.5rem', px: 3 }}
              variant="contained"
              color="info"
              size="large"
            >
              <Typography
                variant="button"
                fontWeight="600"
                fontSize="0.9rem"
                fontFamily="Shantell Sans"
              >
                Скрыть
              </Typography>
            </Button>
          </Box>
        )}
        {showAllSeasons && (
          <Grid item xs={2} md={2} sx={{ mb: 1 }}>
            {!!seasons.length && (
              <>
                <Typography
                  sx={{ mt: 1.5, mb: 0.5 }}
                  variant="body1"
                  component="div"
                >
                  Список всех сезонов:
                </Typography>
                <List>
                  {seasons
                    .slice()
                    .reverse()
                    .map((season) => (
                      <SeasonInfo key={season.id} data={season} />
                    ))}
                </List>
              </>
            )}
          </Grid>
        )}
      </Box>
      <Box
        sx={{
          fontSize: 21,
          fontWeight: 600,
          mb: 2,
        }}
      >
        Управление командами
      </Box>
      <Box sx={{ my: 1 }}>
        <Button
          onClick={handleAddNewTeam}
          sx={{ height: '2.5rem', px: 3, mb: 2 }}
          variant="contained"
          color="warning"
          size="large"
        >
          <Typography
            variant="button"
            fontWeight="600"
            fontSize="0.9rem"
            fontFamily="Shantell Sans"
          >
            Новая команда
          </Typography>
        </Button>
      </Box>
      {addNewTeam && (
        <Box>
          <CreateNewTeam closeAddNewTeam={closeAddNewTeam} />
        </Box>
      )}
      {!addNewTeam && (
        <Box sx={{ my: 1 }}>
          <Button
            onClick={handleShowAddTeamToLeague}
            sx={{ height: '2.5rem', px: 1, mb: 2 }}
            variant="contained"
            color="info"
            size="large"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.85rem"
              fontFamily="Shantell Sans"
            >
              Добавить команду в лигу
            </Typography>
          </Button>
          {showAddTeamToLeague && (
            <Box>
              <AddTeamToLeague closeAddTeamToLeague={closeAddTeamToLeague} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
