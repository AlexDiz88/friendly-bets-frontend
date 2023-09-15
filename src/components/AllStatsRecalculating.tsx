import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { useAppDispatch } from '../store';
import NotificationSnackbar from './utils/NotificationSnackbar';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import { playersStatsFullRecalculation } from '../features/stats/statsSlice';
import { getActiveSeasonId } from '../features/admin/seasons/seasonsSlice';

export default function AllStatsRecalculating(): JSX.Element {
  const dispatch = useAppDispatch();
  const activeSeasonId = useSelector(selectActiveSeasonId);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = React.useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      if (activeSeasonId) {
        const dispatchResult = await dispatch(
          playersStatsFullRecalculation(activeSeasonId)
        );

        if (playersStatsFullRecalculation.fulfilled.match(dispatchResult)) {
          setOpenSnackbar(true);
          setSnackbarSeverity('success');
          setSnackbarMessage('Статистика успешно пересчитана');
        }
        if (playersStatsFullRecalculation.rejected.match(dispatchResult)) {
          setOpenSnackbar(true);
          setSnackbarSeverity('error');
          if (dispatchResult.error.message) {
            setSnackbarMessage(dispatchResult.error.message);
          }
        }
      }
    },
    [dispatch, activeSeasonId]
  );

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    dispatch(getActiveSeasonId());
  }, [dispatch]);

  return (
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
          Пересчёт статистики
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
    </Box>
  );
}
