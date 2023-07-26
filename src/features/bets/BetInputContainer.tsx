import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { Dangerous } from '@mui/icons-material';
import BetInputPlayer from './BetInputPlayer';
import BetInputLeague from './BetInputLeague';
import BetInputTeams from './BetInputTeams';
import BetInputOdds from './BetInputOdds';
import BetInputTitle from './BetInputTitle';
import NotificationSnackbar from '../../components/utils/NotificationSnackbar';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { useAppDispatch } from '../../store';
import { addBetToLeagueInSeason } from '../admin/seasons/seasonsSlice';

export default function BetInputContainer(): JSX.Element {
  const dispatch = useAppDispatch();
  const season = useSelector(selectActiveSeason);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [selectedMatchDay, setSelectedMatchDay] = useState<string>('');
  const [selectedHomeTeamId, setSelectedHomeTeamId] = useState<string>('');
  const [selectedAwayTeamId, setSelectedAwayTeamId] = useState<string>('');
  const [resetTeams, setResetTeams] = useState(false);
  const [selectedBetTitle, setSelectedBetTitle] = useState<string>('');
  const [selectedBetOdds, setSelectedBetOdds] = useState<string>('');
  const [selectedBetSize, setSelectedBetSize] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleSaveClick = React.useCallback(async () => {
    setOpenDialog(false);
    if (season) {
      const betOddsToNumber = Number(selectedBetOdds.trim().replace(',', '.'));
      // TODO добавить проверку на валидность кэфа (наличие пробелов между цифрами итд)
      const dispatchResult = await dispatch(
        addBetToLeagueInSeason({
          seasonId: season?.id,
          leagueId: selectedLeagueId,
          newBet: {
            userId: selectedUserId,
            matchDay: selectedMatchDay,
            homeTeamId: selectedHomeTeamId,
            awayTeamId: selectedAwayTeamId,
            betTitle: selectedBetTitle,
            betOdds: betOddsToNumber,
            betSize: Number(selectedBetSize),
          },
        })
      );

      if (addBetToLeagueInSeason.fulfilled.match(dispatchResult)) {
        setOpenSnackbar(true);
        setSnackbarSeverity('success');
        setSnackbarMessage('Ставка успешно добавлена');
        setResetTeams(!resetTeams);
        setSelectedHomeTeamId('');
        setSelectedAwayTeamId('');
        setSelectedBetTitle('');
        setSelectedBetOdds('');
      }
      if (addBetToLeagueInSeason.rejected.match(dispatchResult)) {
        setOpenSnackbar(true);
        setSnackbarSeverity('error');
        if (dispatchResult.error.message) {
          setSnackbarMessage(dispatchResult.error.message);
        }
        setSelectedBetTitle('');
        setSelectedBetOdds('');
      }
    }
  }, [
    dispatch,
    resetTeams,
    season,
    selectedAwayTeamId,
    selectedBetOdds,
    selectedBetSize,
    selectedBetTitle,
    selectedHomeTeamId,
    selectedLeagueId,
    selectedMatchDay,
    selectedUserId,
  ]);

  const handleUserSelection = (userId: string): void => {
    setSelectedUserId(userId);
  };

  const handleLeagueSelection = (leagueId: string, matchDay: number): void => {
    setSelectedLeagueId(leagueId);
    setSelectedMatchDay(matchDay.toString());
  };

  const handleHomeTeamSelection = (homeTeamId: string): void => {
    setSelectedHomeTeamId(homeTeamId);
  };

  const handleAwayTeamSelection = (awayTeamId: string): void => {
    setSelectedAwayTeamId(awayTeamId);
  };

  const handleBetCancel = (): void => {
    setSelectedBetTitle('');
  };

  const handleBetTitleSelection = (betTitle: string): void => {
    setSelectedBetTitle(betTitle);
  };

  const handleOddsSelection = (betOdds: string, betSize: string): void => {
    setSelectedBetOdds(betOdds);
    setSelectedBetSize(betSize);
  };

  const handleOpenDialog = (): void => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ m: 1 }}>
      <Typography sx={{ textAlign: 'center', borderBottom: 2, pb: 1, mx: 2 }}>
        Добавление ставок
      </Typography>
      <BetInputPlayer onUserSelect={handleUserSelection} />
      {selectedUserId && <BetInputLeague onLeagueSelect={handleLeagueSelection} />}
      {selectedLeagueId && selectedMatchDay && (
        <BetInputTeams
          onHomeTeamSelect={handleHomeTeamSelection}
          onAwayTeamSelect={handleAwayTeamSelection}
          leagueId={selectedLeagueId}
          resetTeams={resetTeams}
        />
      )}
      {selectedHomeTeamId && selectedAwayTeamId && !selectedBetTitle && (
        <BetInputTitle onBetTitleSelect={handleBetTitleSelection} />
      )}
      {selectedBetTitle && (
        <Box sx={{ my: 2, width: '18.2rem', display: 'flex' }}>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.85rem',
              width: '17rem',
              height: '2.3rem',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
            }}
          >
            {selectedBetTitle}
          </Typography>
          <IconButton onClick={handleBetCancel}>
            <Dangerous
              color="error"
              sx={{ mt: -1.75, ml: -1.5, fontSize: '3rem' }}
            />
          </IconButton>
        </Box>
      )}
      {selectedBetTitle && <BetInputOdds onOddsSelect={handleOddsSelection} />}
      {selectedBetOdds && selectedBetSize && (
        <Button
          onClick={handleOpenDialog}
          sx={{ mt: 2, height: '2.5rem', px: 6.6 }}
          variant="contained"
          color="secondary"
          size="large"
        >
          <Typography
            variant="button"
            fontWeight="600"
            fontSize="0.9rem"
            fontFamily="Shantell Sans"
          >
            Отправить ставку
          </Typography>
        </Button>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogTitle>Добавить ставку?</DialogTitle>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            <Typography>Ставка: {selectedBetTitle}</Typography>
            <Typography>Кэф: {selectedBetOdds}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ mr: 1 }}
            variant="contained"
            color="error"
            onClick={handleCloseDialog}
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
            variant="contained"
            color="success"
            onClick={handleSaveClick}
            autoFocus
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Подтвердить
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
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
