import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AssistantPhoto,
  EventNote,
  PlaylistAddCircle,
  PlayCircle,
  PauseCircle,
  NoteAdd,
} from '@mui/icons-material';
import {
  Box,
  ListItem,
  IconButton,
  ListItemAvatar,
  ListItemText,
  InputLabel,
  Button,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import Season from './types/Season';
import { selectStatuses } from './selectors';
import { useAppDispatch } from '../../../store';
import { changeSeasonStatus } from './seasonsSlice';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import AddLeagueInSeason from './AddLeagueInSeason';

export default function SeasonInfo({
  data: { id, title, status, leagues },
}: {
  data: Season;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const statuses = useSelector(selectStatuses);
  const [seasonStatus, setSeasonStatus] = useState<string>(status);
  const [showStatusOptions, setShowStatusOptions] = useState<boolean>(false);
  const [showLeaguesList, setShowLeaguesList] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLeaguesClick = (): void => {
    setShowStatusOptions(false);
    setShowLeaguesList(!showLeaguesList);
  };

  const handleStatusChange = (event: SelectChangeEvent): void => {
    setSeasonStatus(event.target.value);
  };

  const handleStatusChangeClick = (): void => {
    setShowStatusOptions(!showStatusOptions);
    setShowLeaguesList(false);
  };

  const handleCancelClick = (): void => {
    setShowStatusOptions(false);
    setShowLeaguesList(false);
    setSeasonStatus(status);
  };

  const handleLeagueListShow = (isShow: boolean): void => {
    setShowLeaguesList(isShow);
  };

  const handleSaveClick = React.useCallback(async () => {
    const dispatchResult = await dispatch(
      changeSeasonStatus({ id, status: seasonStatus })
    );
    if (changeSeasonStatus.fulfilled.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Статус сезона успешно изменен');
      setShowStatusOptions(false);
      setSeasonStatus(seasonStatus);
    }
    if (changeSeasonStatus.rejected.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('error');
      if (dispatchResult.error.message) {
        setSnackbarMessage(dispatchResult.error.message);
      }
    }
  }, [dispatch, id, seasonStatus]);

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        border: 1,
        borderRadius: 2,
        mb: 2,
        p: 1,
        boxShadow:
          '0px 2px 4px rgba(0, 0, 0, 0.25), 0px 4px 8px rgba(0, 0, 0, 0.25)',
      }}
    >
      <ListItem
        key={id}
        secondaryAction={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <>
            {status === 'CREATED' && (
              <IconButton>
                <NoteAdd fontSize="large" color="disabled" />
              </IconButton>
            )}
            {status === 'SCHEDULED' && (
              <IconButton>
                <PlaylistAddCircle fontSize="large" color="secondary" />
              </IconButton>
            )}
            {status === 'ACTIVE' && (
              <IconButton>
                <PlayCircle fontSize="large" color="success" />
              </IconButton>
            )}
            {status === 'PAUSED' && (
              <IconButton>
                <PauseCircle fontSize="large" color="warning" />
              </IconButton>
            )}
            {status === 'FINISHED' && (
              <IconButton>
                <AssistantPhoto fontSize="large" color="error" />
              </IconButton>
            )}
          </>
        }
      >
        <ListItemAvatar>
          <EventNote fontSize="large" color="info" />
        </ListItemAvatar>
        <ListItemText sx={{ ml: -2 }} primary={`Сезон: ${title}`} />
      </ListItem>
      <Box>
        <InputLabel id="season-status-label">Текущий статус: {status}</InputLabel>
        {!showStatusOptions && (
          <>
            <Button
              sx={{ height: '1.8rem', px: 3, border: 3 }}
              variant="outlined"
              onClick={handleStatusChangeClick}
            >
              <Typography
                variant="button"
                fontWeight="600"
                fontSize="0.9rem"
                fontFamily="Shantell Sans"
              >
                Изменить статус
              </Typography>
            </Button>
            <Button
              sx={{ height: '1.8rem', px: 6.7, mt: 1 }}
              variant="contained"
              onClick={handleLeaguesClick}
            >
              <Typography
                variant="button"
                fontWeight="600"
                fontSize="0.9rem"
                fontFamily="Shantell Sans"
              >
                Список лиг
              </Typography>
            </Button>
          </>
        )}
        {showStatusOptions && (
          <>
            <Select
              fullWidth
              sx={{ my: 1 }}
              labelId="season-status-label"
              id="season-status-select"
              value={seasonStatus}
              onChange={handleStatusChange}
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
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
              onClick={handleSaveClick}
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
                Изменить
              </Typography>
            </Button>
          </>
        )}
        {showLeaguesList && (
          <AddLeagueInSeason
            seasonId={id}
            leagues={leagues}
            handleLeagueListShow={handleLeagueListShow}
          />
        )}
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
    </Box>
  );
}
