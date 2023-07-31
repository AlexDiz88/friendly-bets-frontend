import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from '@mui/material';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { useAppDispatch } from '../../store';
import { betResult, getActiveSeason } from '../admin/seasons/seasonsSlice';
import BetCard from './BetCard';
import NotificationSnackbar from '../../components/utils/NotificationSnackbar';

export default function BetsCheck(): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const dispatch = useAppDispatch();
  const [betLoseOpenDialog, setBetLoseOpenDialog] = useState(false);
  const [betReturnOpenDialog, setBetReturnOpenDialog] = useState(false);
  const [betWinOpenDialog, setBetWinOpenDialog] = useState(false);
  const [selectedBetId, setSelectedBetId] = useState<string | undefined>(undefined);
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
          betResult({
            seasonId: activeSeason.id,
            betId: selectedBetId,
            gameResult: '1',
            betStatus,
          })
        );

        if (betResult.fulfilled.match(dispatchResult)) {
          setOpenSnackbar(true);
          setSnackbarSeverity('success');
          setSnackbarMessage('Ставка успешно обработана');
        }
        if (betResult.rejected.match(dispatchResult)) {
          setOpenSnackbar(true);
          setSnackbarSeverity('error');
          if (dispatchResult.error.message) {
            setSnackbarMessage(dispatchResult.error.message);
          }
        }
      }
    },
    [activeSeason, dispatch, selectedBetId]
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

  const handleBetLoseOpenDialog = (betId: string): void => {
    setSelectedBetId(betId);
    setBetLoseOpenDialog(true);
  };

  const handleBetReturnOpenDialog = (betId: string): void => {
    setSelectedBetId(betId);
    setBetReturnOpenDialog(true);
  };

  const handleBetWinOpenDialog = (betId: string): void => {
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

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch, openSnackbar]);

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
            sx={{ borderBottom: 1, textAlign: 'center', mx: 3, pb: 0.5, mb: 1.5 }}
          >
            Проверка ставок
          </Box>
          {activeSeason.leagues.map((l) => (
            <Box key={l.id}>
              {l.bets
                .filter((bet) => bet.betStatus === 'OPENED')
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
                      <Button
                        sx={{ mr: 1 }}
                        variant="contained"
                        color="error"
                        onClick={() => handleBetLoseOpenDialog(bet.id)}
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
                        onClick={() => handleBetReturnOpenDialog(bet.id)}
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
                        onClick={() => handleBetWinOpenDialog(bet.id)}
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
                ))}
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={betLoseOpenDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            Подтвердить
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
            Подтвердить
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
            Подтвердить
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
