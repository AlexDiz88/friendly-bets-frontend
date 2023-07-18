import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import { addLeagueToSeason } from './seasonsSlice';
import { useAppDispatch } from '../../../store';
import League from '../leagues/types/League';

export default function AddLeagueInSeason({
  seasonId,
  leagues,
  handleLeagueListShow,
}: {
  seasonId: string;
  leagues: League[] | undefined;
  handleLeagueListShow: any;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const [leagueDisplayNameRu, setLeagueDisplayNameRu] = useState<string>('');
  const [leagueDisplayNameEn, setLeagueDisplayNameEn] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddLeagueClick = React.useCallback(async () => {
    const dispatchResult = await dispatch(
      addLeagueToSeason({
        seasonId,
        displayNameRu: leagueDisplayNameRu,
        displayNameEn: leagueDisplayNameEn,
      })
    );
    if (addLeagueToSeason.fulfilled.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Лига успешно добавлена в сезон');
      setLeagueDisplayNameRu('');
      setLeagueDisplayNameEn('');
    }
    if (addLeagueToSeason.rejected.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('error');
      if (dispatchResult.error.message) {
        setSnackbarMessage(dispatchResult.error.message);
      }
    }
  }, [dispatch, leagueDisplayNameEn, leagueDisplayNameRu, seasonId]);

  const handleLeagueNameRuChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLeagueDisplayNameRu(event.target.value);
  };

  const handleLeagueNameEnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLeagueDisplayNameEn(event.target.value);
  };

  const handleCancelClick = (): void => {
    handleLeagueListShow(false);
  };

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography sx={{ mt: 1.5 }}>Список лиг сезона:</Typography>
      <List sx={{ borderBottom: 1 }}>
        {leagues?.map((item) => (
          <ListItem sx={{ my: 0, px: 2, py: 0 }} key={item.id}>
            <ListItemText primary={item.displayNameRu} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ my: 1 }}>
        <TextField
          fullWidth
          required
          id="league-name-ru"
          label="Название лиги(RU)"
          variant="outlined"
          value={leagueDisplayNameRu}
          onChange={handleLeagueNameRuChange}
        />
      </Box>
      <Box sx={{ mb: 1, fontSize: '3rem' }}>
        <TextField
          fullWidth
          required
          id="league-name-en"
          label="Название лиги(EN)"
          variant="outlined"
          value={leagueDisplayNameEn}
          onChange={handleLeagueNameEnChange}
        />
      </Box>

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
        onClick={handleAddLeagueClick}
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
      <Box textAlign="center">
        <NotificationSnackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          message={snackbarMessage}
          duration={3000}
        />
      </Box>
    </>
  );
}
