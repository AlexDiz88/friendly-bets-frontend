import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Switch,
  TextField,
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
import {
  addBetToLeagueInSeason,
  addEmptyBetToLeagueInSeason,
} from '../admin/seasons/seasonsSlice';
import { getProfile } from '../auth/authSlice';
import { selectUser } from '../auth/selectors';

export default function BetInputContainer(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const season = useSelector(selectActiveSeason);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [selectedMatchDay, setSelectedMatchDay] = useState<string>('');
  const [selectedHomeTeamId, setSelectedHomeTeamId] = useState<string>('');
  const [selectedAwayTeamId, setSelectedAwayTeamId] = useState<string>('');
  const [selectedEmptyBetSize, setSelectedEmptyBetSize] = useState<string>('10');
  const [resetTeams, setResetTeams] = useState(false);
  const [isEmptyBet, setIsEmptyBet] = useState(false);
  const [selectedBetTitle, setSelectedBetTitle] = useState<string>('');
  const [selectedBetOdds, setSelectedBetOdds] = useState<string>('');
  const [selectedBetSize, setSelectedBetSize] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEmptyBet, setOpenDialogEmptyBet] = useState(false);
  const [openDialogTwoEmptyBet, setOpenDialogTwoEmptyBet] = useState(false);
  const [isNot, setIsNot] = useState(false);

  // добавление ставки
  const handleSaveClick = React.useCallback(async () => {
    setOpenDialog(false);
    if (season) {
      const betOddsToNumber = Number(selectedBetOdds.trim().replace(',', '.'));
      // TODO добавить проверку на валидность кэфа (наличие пробелов между цифрами итд)
      const dispatchResult = await dispatch(
        addBetToLeagueInSeason({
          seasonId: season.id,
          leagueId: selectedLeagueId,
          newBet: {
            userId: selectedUserId,
            matchDay: selectedMatchDay,
            homeTeamId: selectedHomeTeamId,
            awayTeamId: selectedAwayTeamId,
            betTitle: isNot ? `${selectedBetTitle} - нет` : selectedBetTitle,
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
        setIsNot(false);
      }
      if (addBetToLeagueInSeason.rejected.match(dispatchResult)) {
        setOpenSnackbar(true);
        setSnackbarSeverity('error');
        if (dispatchResult.error.message) {
          setSnackbarMessage(dispatchResult.error.message);
        }
        setSelectedBetTitle('');
        setSelectedBetOdds('');
        setIsNot(false);
      }
    }
  }, [
    dispatch,
    isNot,
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

  // добавление пустой ставки
  const handleSaveEmptyBetClick = React.useCallback(async () => {
    if (season) {
      const dispatchResult = await dispatch(
        addEmptyBetToLeagueInSeason({
          seasonId: season.id,
          leagueId: selectedLeagueId,
          newEmptyBet: {
            userId: selectedUserId,
            matchDay: selectedMatchDay,
            betSize: Number(selectedEmptyBetSize),
          },
        })
      );

      if (addEmptyBetToLeagueInSeason.fulfilled.match(dispatchResult)) {
        setOpenSnackbar(true);
        setSnackbarSeverity('success');
        if (openDialogEmptyBet) {
          setSnackbarMessage('Пустая ставка успешно добавлена');
        } else {
          setSnackbarMessage('2 пустые ставки успешно добавлены');
        }
      }
      if (addEmptyBetToLeagueInSeason.rejected.match(dispatchResult)) {
        setOpenSnackbar(true);
        setSnackbarSeverity('error');
        if (dispatchResult.error.message) {
          setSnackbarMessage(dispatchResult.error.message);
        }
      }
      setOpenDialogEmptyBet(false);
      setOpenDialogTwoEmptyBet(false);
    }
  }, [
    dispatch,
    openDialogEmptyBet,
    season,
    selectedEmptyBetSize,
    selectedLeagueId,
    selectedMatchDay,
    selectedUserId,
  ]);

  // хэндлеры
  const handleEmptyBet = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsEmptyBet(event.target.checked);
  };

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

  const handleEmptyBetSize = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const size = event.target.value;
    setSelectedEmptyBetSize(size);
  };

  const handleOpenDialogEmptyBet = (): void => {
    setOpenDialogEmptyBet(true);
  };

  const handleSaveTwoEmptyBet = (): void => {
    handleSaveEmptyBetClick();
    handleSaveEmptyBetClick();
  };

  const handleOpenDialogTwoEmptyBet = (): void => {
    setOpenDialogTwoEmptyBet(true);
  };

  const handleIsNotChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.target;
    setIsNot(checked);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
    setOpenDialogEmptyBet(false);
    setOpenDialogTwoEmptyBet(false);
  };

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  // редирект неавторизованных пользователей

  useEffect(() => {
    if (!user) {
      // Если пользовательне авторизован, перенаправляем на главную
      navigate('/');
    } else if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      // Если пользователь не админ или модератор, также перенаправляем на главную
      navigate('/');
    } else {
      dispatch(getProfile());
    }
  }, [dispatch, navigate, user]);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
    return (
      <div>
        <Typography sx={{ m: 1, fontSize: '1rem', fontWeight: 600, color: 'brown' }}>
          У вас нет доступа к панели модератора
          <br /> Вы будете перенаправлены на главную страницу
        </Typography>
      </div>
    );
  }

  return (
    <Box sx={{ m: 1 }}>
      <Typography sx={{ textAlign: 'center', borderBottom: 2, pb: 1, mx: 2 }}>
        Добавление ставок
      </Typography>
      <Typography sx={{ textAlign: 'left', mx: 1, mt: 1, fontWeight: '600' }}>
        Пустая ставка?
        <Switch
          checked={isEmptyBet}
          onChange={handleEmptyBet}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </Typography>
      <BetInputPlayer onUserSelect={handleUserSelection} />
      {selectedUserId && <BetInputLeague onLeagueSelect={handleLeagueSelection} />}
      {!isEmptyBet && (
        <>
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
            <Box sx={{ my: 2, width: '18.2rem' }}>
              <Box sx={{ display: 'flex' }}>
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
              <Checkbox
                sx={{ pt: 0.5 }}
                checked={isNot}
                onChange={handleIsNotChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              Нет
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
        </>
      )}
      {selectedLeagueId && isEmptyBet && (
        <>
          <Box
            sx={{ mt: 2, display: 'flex', alignItems: 'center', textAlign: 'left' }}
          >
            <Typography sx={{ ml: 2, mr: 0.5, fontWeight: '600' }}>Сумма</Typography>
            <Box component="form" autoComplete="off" sx={{ width: '3rem', pt: 0 }}>
              <TextField
                size="small"
                value={selectedEmptyBetSize}
                onChange={handleEmptyBetSize}
              />
            </Box>
          </Box>
          <Button
            onClick={handleOpenDialogEmptyBet}
            sx={{ mt: 2, height: '2.5rem', px: 2.1, bgcolor: '#525252' }}
            variant="contained"
            size="large"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Отправить пустую ставку
            </Typography>
          </Button>
          <Button
            onClick={handleOpenDialogTwoEmptyBet}
            sx={{ mt: 3, height: '2.5rem', px: 1.6, bgcolor: '#525252' }}
            variant="contained"
            size="large"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.8rem"
              fontFamily="Shantell Sans"
            >
              Отправить две пустые ставки
            </Typography>
          </Button>
        </>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            Добавить ставку? <br />
            Ставка: {selectedBetTitle} <br />
            Кэф: {selectedBetOdds} <br />
            Сумма: {selectedBetSize}
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

      <Dialog open={openDialogEmptyBet} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            Добавить пустую ставку?
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
            onClick={handleSaveEmptyBetClick}
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

      <Dialog open={openDialogTwoEmptyBet} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            Добавить 2 пустые ставки?
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
            onClick={handleSaveTwoEmptyBet}
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
