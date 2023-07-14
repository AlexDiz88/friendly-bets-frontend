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

export default function SeasonInfo({
  data: { id, title, status },
}: {
  data: Season;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const statuses = useSelector(selectStatuses);
  const [seasonStatus, setSeasonStatus] = useState<string>(status);
  const [showStatusOptions, setShowStatusOptions] = useState<boolean>(false);

  const handleStatusChange = (event: SelectChangeEvent): void => {
    setSeasonStatus(event.target.value);
  };

  const handleStatusChangeClick = (): void => {
    setShowStatusOptions(!showStatusOptions);
  };

  const handleCancelClick = (): void => {
    setShowStatusOptions(false);
    setSeasonStatus(status);
  };

  const handleSaveClick = (): void => {
    // Обработка сохранения нового статуса
    dispatch(changeSeasonStatus({ title, status: seasonStatus }));
    setShowStatusOptions(false);
    setSeasonStatus(status);
  };

  return (
    <Box sx={{ border: 1, borderRadius: 3, mb: 1, p: 1 }}>
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
                <PlaylistAddCircle fontSize="large" color="info" />
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
      </Box>
    </Box>
  );
}
