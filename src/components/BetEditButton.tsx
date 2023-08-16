import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from '@mui/material';
import Bet from '../features/bets/types/Bet';
import BetEditForm from '../features/bets/BetEditForm';

export default function BetEditButton({ bet }: { bet: Bet }): JSX.Element {
  const [showEditForm, setShowEditForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleBetDeleteSave = (): void => {
    console.log('dispatch на аннулирование');
  };

  const handleEditBet = (): void => {
    setShowEditForm(!showEditForm);
  };

  const handleDeleteBetOpenDialog = (): void => {
    setOpenDeleteDialog(!openDeleteDialog);
  };

  const handleCloseDialog = (): void => {
    setOpenDeleteDialog(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{ mr: 1 }}
          variant="contained"
          color="info"
          onClick={() => handleEditBet()}
        >
          <Typography
            variant="button"
            fontWeight="600"
            fontSize="0.8rem"
            fontFamily="Shantell Sans"
          >
            Редактировать
          </Typography>
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleDeleteBetOpenDialog()}
        >
          <Typography
            variant="button"
            fontWeight="600"
            fontSize="0.8rem"
            fontFamily="Shantell Sans"
          >
            Аннулировать
          </Typography>
        </Button>
      </Box>
      {showEditForm && <BetEditForm bet={bet} />}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
            <Box component="span">
              Ставка будет аннулирована и больше не будет доступна для просмотра и
              редактирования.
            </Box>
            <br />
            <Box component="span" sx={{ color: 'brown', fontWeight: 600 }}>
              Внимание!! Это действие нельзя откатить после подтверждения!
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ mr: 1 }}
            variant="outlined"
            color="info"
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
            color="warning"
            onClick={handleBetDeleteSave}
            autoFocus
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Аннулировать
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
