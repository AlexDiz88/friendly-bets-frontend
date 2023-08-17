import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
  getActiveSeason,
} from '../admin/seasons/seasonsSlice';
import { selectUser } from '../auth/selectors';
import MatchDayForm from '../../components/MatchDayForm';
import League from '../admin/leagues/types/League';
import User from '../auth/types/User';
import Team from '../admin/teams/types/Team';
import BetSummaryInfo from './BetSummaryInfo';

export default function BetInputContainer(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const season = useSelector(selectActiveSeason);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [selectedLeague, setSelectedLeague] = useState<League>();
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [selectedMatchDay, setSelectedMatchDay] = useState<string>('');
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<Team | undefined>(
    undefined
  );
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<Team | undefined>(
    undefined
  );
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
    if (season && selectedUser && selectedHomeTeam && selectedAwayTeam) {
      const betOddsToNumber = Number(selectedBetOdds.trim().replace(',', '.'));
      // TODO добавить проверку на валидность кэфа (наличие пробелов между цифрами итд)
      const dispatchResult = await dispatch(
        addBetToLeagueInSeason({
          seasonId: season.id,
          leagueId: selectedLeagueId,
          newBet: {
            userId: selectedUser?.id,
            matchDay: selectedMatchDay,
            homeTeamId: selectedHomeTeam?.id,
            awayTeamId: selectedAwayTeam?.id,
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
        setSelectedHomeTeam(undefined);
        setSelectedAwayTeam(undefined);
        setSelectedBetTitle('');
        setSelectedBetOdds('');
        setIsNot(false);
        await dispatch(getActiveSeason());
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
    selectedAwayTeam,
    selectedBetOdds,
    selectedBetSize,
    selectedBetTitle,
    selectedHomeTeam,
    selectedLeagueId,
    selectedMatchDay,
    selectedUser,
  ]);

  // добавление пустой ставки
  const handleSaveEmptyBetClick = React.useCallback(async () => {
    if (season && selectedUser) {
      const dispatchResult = await dispatch(
        addEmptyBetToLeagueInSeason({
          seasonId: season.id,
          leagueId: selectedLeagueId,
          newEmptyBet: {
            userId: selectedUser.id,
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
    selectedUser,
  ]);

  // хэндлеры
  const handleEmptyBet = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsEmptyBet(event.target.checked);
  };

  const handleUserSelection = (player: User): void => {
    setSelectedUser(player);
  };

  const handleLeagueSelection = (league: League): void => {
    setSelectedLeague(league);
    setSelectedLeagueId(league.id);
  };

  const handleMatchDaySelection = (matchDay: string): void => {
    setSelectedMatchDay(matchDay);
  };

  const handleHomeTeamSelection = (homeTeam: Team): void => {
    setSelectedHomeTeam(homeTeam);
  };

  const handleAwayTeamSelection = (awayTeam: Team): void => {
    setSelectedAwayTeam(awayTeam);
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

  const handleSaveTwoEmptyBet = async (): Promise<void> => {
    await handleSaveEmptyBetClick();
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

  useEffect(() => {
    if (season && selectedLeague) {
      setSelectedMatchDay(selectedLeague.currentMatchDay || '1');
    }
  }, [season, selectedLeague, openSnackbar]);

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
      <BetInputPlayer defaultValue={undefined} onUserSelect={handleUserSelection} />
      {selectedUser && (
        <Box>
          <BetInputLeague onLeagueSelect={handleLeagueSelection} />
          {selectedLeague && (
            <MatchDayForm
              key={selectedLeague.id}
              defaultValue={selectedLeague ? selectedLeague.currentMatchDay : '1'}
              onMatchDaySelect={handleMatchDaySelection}
            />
          )}
        </Box>
      )}
      {!isEmptyBet && (
        <>
          {selectedLeagueId && selectedMatchDay && (
            <BetInputTeams
              defaultHomeTeamName=""
              defaultAwayTeamName=""
              onHomeTeamSelect={handleHomeTeamSelection}
              onAwayTeamSelect={handleAwayTeamSelection}
              leagueId={selectedLeagueId}
              resetTeams={resetTeams}
            />
          )}
          {selectedHomeTeam && selectedAwayTeam && !selectedBetTitle && (
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
          {selectedBetTitle && (
            <BetInputOdds defaultBetOdds="" defaultBetSize="10" onOddsSelect={handleOddsSelection} />
          )}
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
          <DialogContentText sx={{ fontSize: '1rem' }}>
            <BetSummaryInfo
              message="Добавить ставку"
              player={selectedUser}
              league={selectedLeague}
              matchDay={selectedMatchDay}
              homeTeam={selectedHomeTeam}
              awayTeam={selectedAwayTeam}
              isNot={isNot}
              betTitle={selectedBetTitle}
              betOdds={selectedBetOdds}
              betSize={selectedBetSize}
              gameResult=""
              betStatus=""
            />
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
