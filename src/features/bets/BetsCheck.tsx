/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Typography,
} from '@mui/material';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { useAppDispatch } from '../../store';
import { addBetResult, getActiveSeason } from '../admin/seasons/seasonsSlice';
import BetCard from './BetCard';
import NotificationSnackbar from '../../components/utils/NotificationSnackbar';
import { selectUser } from '../auth/selectors';
import GameScoreValidation from '../../components/utils/GameScoreValidation';
import BetGameResultInfo from './BetGameResultInfo';

export default function BetsCheck(): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [betLoseOpenDialog, setBetLoseOpenDialog] = useState(false);
  const [betReturnOpenDialog, setBetReturnOpenDialog] = useState(false);
  const [betWinOpenDialog, setBetWinOpenDialog] = useState(false);
  const [selectedBetId, setSelectedBetId] = useState<string | undefined>(undefined);
  const [gameResult, setGameResult] = useState<string>('');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [selectedLeague, setSelectedLeague] = useState('Все');
  const [showMessage, setShowMessage] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSaveBetCheck = React.useCallback(
    async (betStatus: string) => {
      handleCloseDialog();

      if (activeSeason && selectedBetId) {
        const dispatchResult = await dispatch(
          addBetResult({
            seasonId: activeSeason.id,
            betId: selectedBetId,
            newGameResult: { gameResult, betStatus },
          })
        );

        if (addBetResult.fulfilled.match(dispatchResult)) {
          setOpenSnackbar(true);
          setSnackbarSeverity('info');
          setSnackbarMessage('Ставка успешно обработана');
          setGameResult('');
        }
        if (addBetResult.rejected.match(dispatchResult)) {
          setOpenSnackbar(true);
          setSnackbarSeverity('error');
          if (dispatchResult.error.message) {
            setSnackbarMessage(dispatchResult.error.message);
          }
        }
      }
    },
    [activeSeason, dispatch, gameResult, selectedBetId]
  );

  // хэндлеры
  const handleBetLoseSave = (): void => {
    handleSaveBetCheck('LOST');
  };

  const handleBetReturnSave = (): void => {
    handleSaveBetCheck('RETURNED');
  };

  const handleBetWinSave = (): void => {
    handleSaveBetCheck('WON');
  };

  const handleGameResultChange = (betId: string, value: string): void => {
    setInputValues((prevGameResult) => ({
      ...prevGameResult,
      [betId]: value,
    }));
  };

  const handleBetLoseOpenDialog = (betId: string, result: string): void => {
    const res = GameScoreValidation(result);
    setGameResult(res);
    setSelectedBetId(betId);
    setBetLoseOpenDialog(true);
  };

  const handleBetReturnOpenDialog = (betId: string, result: string): void => {
    const res = GameScoreValidation(result);
    setGameResult(res);
    setSelectedBetId(betId);
    setBetReturnOpenDialog(true);
  };

  const handleBetWinOpenDialog = (betId: string, result: string): void => {
    const res = GameScoreValidation(result);
    setGameResult(res);
    setSelectedBetId(betId);
    setBetWinOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setBetWinOpenDialog(false);
    setBetReturnOpenDialog(false);
    setBetLoseOpenDialog(false);
  };

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  const handleLeagueChange = (leagueName: string): void => {
    setSelectedLeague(leagueName);
  };

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch, openSnackbar]);

  // редирект неавторизованных пользователей
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/');
      } else if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        navigate('/');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!user || (user && user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
    return (
      <Box
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        {showMessage && (
          <Box sx={{ textAlign: 'center', my: 3, fontWeight: 600, color: 'brown' }}>
            Проверка авторизации на доступ к панели модератора
          </Box>
        )}
        <CircularProgress size={100} color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {activeSeason && (
        <Box>
          <Box
            sx={{ borderBottom: 2, textAlign: 'center', mx: 3, pb: 0.5, mb: 1.5 }}
          >
            Проверка ставок
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ mb: 1 }}>
              <Button
                sx={{
                  borderRadius: 0,
                  borderBottom: selectedLeague === 'Все' ? 1 : 0,
                  color: selectedLeague === 'Все' ? 'brown' : 'black',
                  fontFamily: 'Exo 2',
                  px: 0,
                  mr: 0.5,
                  fontWeight: selectedLeague === 'Все' ? 'bold' : 'normal',
                }}
                onClick={() => handleLeagueChange('Все')}
              >
                <Typography
                  variant="button"
                  fontWeight="inherit"
                  fontSize="0.9rem"
                  fontFamily="Shantell Sans"
                >
                  Все
                </Typography>
              </Button>
            </Box>
            {activeSeason.leagues &&
              activeSeason.leagues.map((l) => (
                <Box key={l.id} sx={{ mb: 1 }}>
                  <Button
                    key={l.shortNameRu}
                    sx={{
                      borderRadius: 0,
                      borderBottom: selectedLeague === l.shortNameRu ? 1 : 0,
                      color: selectedLeague === l.shortNameRu ? 'brown' : 'black',
                      fontFamily: 'Exo 2',
                      px: 0,
                      mr: 0.5,
                      fontWeight:
                        selectedLeague === l.shortNameRu ? 'bold' : 'normal',
                    }}
                    onClick={() => handleLeagueChange(l.shortNameRu)}
                  >
                    <Typography
                      variant="button"
                      fontWeight="inherit"
                      fontSize="0.9rem"
                      fontFamily="Shantell Sans"
                    >
                      {l.shortNameRu}
                    </Typography>
                  </Button>
                </Box>
              ))}
          </Box>

          {activeSeason.leagues &&
            activeSeason.leagues.map((l) => (
              <Box key={l.id}>
                {l.bets
                  .filter(
                    (bet) =>
                      bet.betStatus === 'OPENED' &&
                      (selectedLeague === 'Все' || selectedLeague === l.shortNameRu)
                  )
                  .map((bet) => (
                    <Box key={bet.id}>
                      <BetCard bet={bet} league={l} />
                      <Box
                        sx={{
                          mb: 3,
                          mt: -0.5,
                          ml: 0.5,
                          display: 'flex',
                          flexWrap: 'nowrap',
                          justifyContent: 'center',
                        }}
                      >
                        <Box>
                          <Box sx={{ mb: 0.5, px: 0.5 }}>
                            <TextField
                              fullWidth
                              required
                              id={`inputValues-${bet.id}`}
                              label="Счёт матча"
                              variant="outlined"
                              value={inputValues[bet.id] || ''}
                              onChange={(event) =>
                                handleGameResultChange(bet.id, event.target.value)
                              }
                            />
                          </Box>
                          <Box>
                            <Button
                              sx={{ mr: 1 }}
                              variant="contained"
                              color="error"
                              onClick={() =>
                                handleBetLoseOpenDialog(bet.id, inputValues[bet.id])
                              }
                            >
                              <Typography
                                variant="button"
                                fontWeight="600"
                                fontSize="0.8rem"
                                fontFamily="Shantell Sans"
                              >
                                Не зашла
                              </Typography>
                            </Button>
                            <Button
                              sx={{ mr: 1, bgcolor: 'yellow', color: 'black' }}
                              variant="contained"
                              onClick={() =>
                                handleBetReturnOpenDialog(
                                  bet.id,
                                  inputValues[bet.id]
                                )
                              }
                            >
                              <Typography
                                variant="button"
                                fontWeight="600"
                                fontSize="0.8rem"
                                fontFamily="Shantell Sans"
                              >
                                Вернулась
                              </Typography>
                            </Button>
                            <Button
                              sx={{ mr: 1 }}
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleBetWinOpenDialog(bet.id, inputValues[bet.id])
                              }
                            >
                              <Typography
                                variant="button"
                                fontWeight="600"
                                fontSize="0.8rem"
                                fontFamily="Shantell Sans"
                              >
                                Зашла
                              </Typography>
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </Box>
            ))}
        </Box>
      )}

      <Dialog open={betLoseOpenDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            <BetGameResultInfo gameResult={gameResult} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ mr: 1 }}
            variant="outlined"
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
            color="error"
            onClick={handleBetLoseSave}
            autoFocus
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Ставка не зашла
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={betReturnOpenDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            <BetGameResultInfo gameResult={gameResult} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ mr: 1 }}
            variant="outlined"
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
            sx={{ bgcolor: '#e6eb16' }}
            variant="contained"
            onClick={handleBetReturnSave}
            autoFocus
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
              color="black"
            >
              Ставка вернулась
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={betWinOpenDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            <BetGameResultInfo gameResult={gameResult} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ mr: 1 }}
            variant="outlined"
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
            onClick={handleBetWinSave}
            autoFocus
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Ставка зашла
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
