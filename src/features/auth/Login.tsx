import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { getProfile, login, resetLoginFormError } from './authSlice';
import { selectLoginFormError } from './selectors';
import { useAppDispatch } from '../../store';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function Login(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectLoginFormError);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
  const snackbarDuration = 1000;
  const snackbarErrorDuration = 3000;

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ): void => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };

  const handleTogglePasswordVisibility = (): void => {
    setShowPassword((prevShowPassword: boolean) => !prevShowPassword);
  };

  const handleSubmit = React.useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      const dispatchResult = await dispatch(
        login({
          email: email.toLowerCase(),
          password,
        })
      );

      if (login.fulfilled.match(dispatchResult)) {
        await dispatch(getProfile());
        setOpenSuccessSnackbar(true);
        setTimeout(() => {
          navigate('/');
        }, snackbarDuration);
      }
      if (login.rejected.match(dispatchResult)) {
        setOpenErrorSnackbar(true);
      }
    },
    [dispatch, email, navigate, password]
  );

  const handleEmailChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      dispatch(resetLoginFormError());
    },
    [dispatch]
  );

  const handlePasswordChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      dispatch(resetLoginFormError());
    },
    [dispatch]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box sx={{ margin: '0 auto', textAlign: 'center', width: '14rem' }}>
      <FormControl>
        <Box
          sx={{
            fontSize: 32,
            fontWeight: 600,
            textAlign: 'center',
            mt: 3,
            mb: 2,
          }}
        >
          Login page
        </Box>
        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            required
            id="email"
            label="E-mail"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleKeyDown}
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            required
            id="password"
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <Button
            onClick={handleSubmit}
            fullWidth
            sx={{ height: '3rem' }}
            variant="contained"
            type="submit"
            color="info"
            size="large"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="1.2rem"
              fontFamily="Exo"
            >
              Войти
            </Typography>
          </Button>
        </Box>
        <Box sx={{ mt: 3, fontSize: 16 }}>
          <Link href="#/auth/register">Нет аккаунта? Регистрируйся!</Link>
        </Box>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            justifyContent: 'center',
            mb: 3,
          }}
          open={openSuccessSnackbar}
          autoHideDuration={snackbarDuration}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '15rem' }}
          >
            Успешный вход!
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            justifyContent: 'center',
            mb: 3,
          }}
          open={openErrorSnackbar}
          autoHideDuration={snackbarErrorDuration}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: '15rem' }}
          >
            Login error!
            {error && <Box>{error}</Box>}
          </Alert>
        </Snackbar>
      </FormControl>
    </Box>
  );
}

export default Login;
