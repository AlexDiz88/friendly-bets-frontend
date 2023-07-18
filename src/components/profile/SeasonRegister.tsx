import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  Icon,
  Link,
  Typography,
} from '@mui/material';
import { Close, DoubleArrow, SportsSoccer } from '@mui/icons-material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  getScheduledSeason,
  registrationInSeason,
} from '../../features/admin/seasons/seasonsSlice';
import NotificationSnackbar from '../utils/NotificationSnackbar';
import { selectScheduledSeason } from '../../features/admin/seasons/selectors';
import { useAppDispatch } from '../../store';

export default function SeasonRegister(): JSX.Element {
  const scheduledSeason = useSelector(selectScheduledSeason);
  const dispatch = useAppDispatch();
  const [showRules, setShowRules] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirm = React.useCallback(async () => {
    if (scheduledSeason?.id) {
      const dispatchResult = await dispatch(
        registrationInSeason({ seasonId: scheduledSeason.id })
      );

      if (registrationInSeason.fulfilled.match(dispatchResult)) {
        setOpenSnackbar(true);
        setSnackbarSeverity('success');
        setSnackbarMessage('Вы были успешно зарегистрированы на турнир!');
        setOpenDialog(false);
      }
      if (registrationInSeason.rejected.match(dispatchResult)) {
        setOpenDialog(false);
        setOpenSnackbar(true);
        setSnackbarSeverity('error');
        if (dispatchResult.error.message) {
          setSnackbarMessage(dispatchResult.error.message);
        }
      }
    }
  }, [dispatch, scheduledSeason]);

  const handleOpenDialog = (): void => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  const handleRulesClick = (): void => {
    setShowRules(!showRules);
  };

  const handleScrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  React.useEffect(() => {
    dispatch(getScheduledSeason());
  }, [dispatch]);

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ textAlign: 'center', mx: 2, mt: 2, mb: 4 }}>
      <Typography
        sx={{ borderBottom: 2, pb: 1, mx: 2, fontWeight: '600', fontSize: '1.4rem' }}
      >
        Регистрация на сезон
      </Typography>
      {scheduledSeason && scheduledSeason.title ? (
        <>
          <Typography
            sx={{ pb: 1, mx: 2, mt: 3, fontWeight: '600', fontSize: '1.1rem' }}
          >
            <Icon sx={{ pr: 0.5, pb: 0.5, mb: -0.5 }}>
              <SportsSoccer />
            </Icon>
            Сезон: {scheduledSeason.title}
          </Typography>
          <Button
            onClick={handleOpenDialog}
            sx={{ height: '3rem', px: 3 }}
            variant="contained"
            color="success"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Принять участие
            </Typography>
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogContent>
              <DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
                Вы уверены, что хотите принять участие?
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
                onClick={handleConfirm}
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
          {!showRules && (
            <Box>
              <Fab
                variant="extended"
                sx={{ mt: 2, px: 2 }}
                onClick={handleRulesClick}
              >
                <Typography
                  variant="button"
                  fontWeight="600"
                  fontSize="0.9rem"
                  fontFamily="Shantell Sans"
                >
                  Правила на сезон
                </Typography>
                <DoubleArrow sx={{ ml: 1 }} color="info" />
              </Fab>
            </Box>
          )}
          {showRules && (
            <Box>
              <Fab
                variant="extended"
                sx={{ mt: 2, px: 2 }}
                onClick={handleRulesClick}
              >
                <Typography
                  variant="button"
                  fontWeight="600"
                  fontSize="0.9rem"
                  fontFamily="Shantell Sans"
                >
                  Закрыть
                </Typography>
                <Close sx={{ ml: 1, fontWeight: 600 }} color="error" />
              </Fab>
              <Box sx={{ mx: 0.5, my: 3, textAlign: 'left' }}>
                <Typography sx={{ my: 1 }}>
                  <b>1. Взнос за участие</b> - 50 евро (за сезон). Общий банк -
                  зависит от итогового количества участников. Приз за 1 место в
                  итоговом зачёте - около 67% от общего банка. Приз за 2 место в
                  итоговом зачёте - около 33% от общего банка. Конкретные суммы будут
                  объявлены после окончания регистрации всех участников и начала
                  нового футбольного сезона (10 августа 2023)
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <b>2. Футбольные лиги.</b> Ставки делаем на АПЛ, Бундеслигу, Лигу
                  Чемпионов и Лигу Европы по 2 матча на каждый тур в каждом турнире.
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <b>3. Размер/сумма ставки.</b> Она одинаковая для всех участников
                  на каждый матч - 10 у.е. Исключения: На матчи 1/2 финала ЛЧ и ЛЕ -
                  по 15 у.е. На Финалы - по 30 у.е.
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <b>4. Виды ставок.</b> Разрешены только те варианты ставок, которые
                  можно рассчитать глядя на итоговый счёт, либо счёт первого тайма.
                  Таким образом ЗАПРЕЩЕНЫ ставки на Угловые, Удары, Владение мячом,
                  Карточки, Голы на определённых минутах, Удаления и.т.д. Также
                  запрещены ставки на гандикапы, интервалы, на все виды ставок на
                  несколько исходов, волевую победу, серии голов.
                  <ul>
                    Разрешенные типы ставок:
                    <li>
                      На победу хозяев/гостей, или ничью (в том числе в первом тайме)
                    </li>
                    <li>На точный счет матча/первого тайма</li>
                    <li>На фору (кроме Азиатских фор)</li>
                    <li>На тотал голов (кроме Азиатских тоталов)</li>
                    <li>Голы (обе забьют/нет, индивидуальный тотал)</li>
                    <li>
                      Микс-ставка: Тотал голов + Результат матча/тайма, Обе
                      забьют+Тотал голов, Тайм+Матч и.т.д.
                    </li>
                  </ul>
                  На матчи 1/8, 1/4, 1/2 финала и Финалов ЛЧ и ЛЕ дополнительно можно
                  поставить на результат овертаймов/пенальти.
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <b>5. Подтверждение ставок.</b> Для фиксации ставок действует
                  специальный чат в WhatsApp. Просьба там НИЧЕГО не писать, а
                  скидывать ТОЛЬКО фотографии/скриншоты ваших ставок. В момент когда
                  ставку скинули в чат, она считается окончательной и действительной,
                  даже если она по каким-либо причинам не выложена на сайт до начала
                  матча.
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <b>6. Разница в кэфах.</b> Обратите внимание на то, что
                  коэффициенты у букмекеров постоянно меняются. Поэтому кэф на
                  одинаковую ставку на один и тот же матч у разных участников может
                  отличаться.
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <b>7. Кэфы.</b> Кэфы для ставок можно брать с сайтов букмекерских
                  контор, таких как, например, &quot;Марафон&quot; или
                  &quot;1ХВЕТ&quot;. Для этого на сайте{' '}
                  <Link>https://www.marathonbet.com</Link> или{' '}
                  <Link>https://1xbet.com/</Link> нужно найти и выбрать нужную вам
                  ставку и прислать в чат WhatsApp скриншот, на котором чётко видно
                  матч и ставку.
                </Typography>
                <Typography sx={{ my: 1 }}>
                  <b>!!!ВАЖНО!!!</b> В случае отсутствия двух ставок к моменту
                  окончания тура - все несделанные ставки считаются автоматически
                  проигранными (минус 10 у.е. к Вашему балансу за каждую ставку)
                  Забытая ставка - это Ваша потерянная ставка! Она не будет
                  переноситься на следующие туры. Ставки переносятся ТОЛЬКО в случае
                  официальной отмены/переноса игр из-за Covid, Кубковых матчей и.т.д.
                  В случае такого переноса/отмены Вам необходимо сделать новую ставку
                  в рамках ЭТОГО ЖЕ игрового тура. Если это невозможно (поскольку
                  больше нет матчей в туре), то Ваша ставка переносится на следующий
                  тур, но не позже. Это требование необходимо для нормального
                  подведения еженедельных/ежемесячных итогов.
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Fab color="primary" onClick={handleScrollToTop}>
                    <KeyboardArrowUpIcon />
                  </Fab>
                </Box>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Typography sx={{ pb: 1, mx: 2, mt: 2 }}>
          В данный момент нет сезонов доступных для регистрации
        </Typography>
      )}

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
