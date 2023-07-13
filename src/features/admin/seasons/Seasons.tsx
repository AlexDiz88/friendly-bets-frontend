import React, { useState } from 'react';
import {
  FormControl,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { PlayCircle, PlaylistAddCheckCircle, StopCircle } from '@mui/icons-material';
import { addSeason, getSeasons } from './seasonsSlice';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import { selectSeasons } from './selectors';
import { useAppDispatch } from '../../../store';

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
    dispatch(getSeasons());
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
        <Box sx={{ my: 2 }}>
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
        <Box sx={{ my: 2, fontSize: '3rem' }}>
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
        <Box sx={{ my: 1, pb: 1.5 }}>
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

      <Box
        sx={{
          fontSize: 22,
          fontWeight: 600,
          mb: 2,
        }}
      >
        Управление сезонами
      </Box>
      <Box sx={{ my: 1 }}>
        <Button
          onClick={handleShowAllSeasons}
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
            Показать все сезоны
          </Typography>
        </Button>
      </Box>
      <Grid item xs={12} md={6}>
        {!!seasons.length && (
          <>
            <Typography sx={{ mt: 1, mb: 1 }} variant="body1" component="div">
              Seasons List:
            </Typography>
            <List>
              {seasons.map((season) => (
                <ListItem
                  key={season.id}
                  secondaryAction={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <IconButton edge="end" aria-label="delete">
                      <PlayCircle />
                      <StopCircle />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <PlaylistAddCheckCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={season.title} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Grid>
    </Box>
  );
}
