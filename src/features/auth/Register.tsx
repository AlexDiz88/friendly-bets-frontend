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
import { register, login } from './authSlice';
import { selectRegisterFormError } from './selectors';
import { useAppDispatch } from '../../store';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function Register(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectRegisterFormError);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
  const snackbarDuration = 1500;
  const snackbarErrorDuration = 5000;

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
        register({
          email,
          password,
          passwordRepeat,
        })
      );

      if (register.fulfilled.match(dispatchResult)) {
        setOpenSuccessSnackbar(true);
        await dispatch(login({ email, password }));
        setTimeout(() => {
          navigate('/my/profile');
        }, snackbarDuration);
      }
      if (register.rejected.match(dispatchResult)) {
        setOpenErrorSnackbar(true);
      }
    },
    [dispatch, email, navigate, password, passwordRepeat]
  );

  const handleNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    [dispatch]
  );

  const handlePasswordChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    [dispatch]
  );

  const handlePasswordRepeatChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordRepeat(event.target.value);
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
          Register page
        </Box>
        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            required
            id="email"
            label="E-mail"
            variant="outlined"
            value={email}
            onChange={handleNameChange}
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
          <TextField
            fullWidth
            required
            id="password-repeat"
            label="Repeat password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={passwordRepeat}
            onChange={handlePasswordRepeatChange}
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
              Регистрация
            </Typography>
          </Button>
        </Box>
        <Box sx={{ fontSize: 16, mt: 3 }}>
          <Link href="#/auth/login">Уже есть аккаунт? Войти</Link>
        </Box>

        <Snackbar
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
            Успешная регистрация!
          </Alert>
        </Snackbar>
        <Snackbar
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
            {error && <Box>{error}</Box>}
          </Alert>
        </Snackbar>
      </FormControl>
    </Box>
  );
}

export default Register;
