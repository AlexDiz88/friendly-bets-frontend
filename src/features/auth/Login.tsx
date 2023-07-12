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
  TextField,
  Typography,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { getProfile, login, resetLoginFormError } from './authSlice';
import { selectLoginFormError } from './selectors';
import { useAppDispatch } from '../../store';

function Login(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectLoginFormError);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleTogglePasswordVisibility = (): void => {
    setShowPassword((prevShowPassword: boolean) => !prevShowPassword);
  };

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const dispatchResult = await dispatch(
        login({
          email,
          password,
        })
      );

      // 332 проверяем, что санк login зарезолвился успешно
      if (login.fulfilled.match(dispatchResult)) {
        dispatch(getProfile());
        navigate('/');
      }

      // 332 выводим в консоль ошибку если санк login зареджектился
      if (login.rejected.match(dispatchResult)) {
        throw new Error(dispatchResult.error.message);
      }
    },
    [dispatch, email, navigate, password]
  );

  const handleNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      // 332 очищаем ошибку
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
            onChange={handleNameChange}
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
          {error && <Box sx={{ display: 'block' }}>{error}</Box>}
        </Box>
        <Box sx={{ mt: 3, fontSize: 16 }}>
          <Link href="#/auth/register">Нет аккаунта? Регистрируйся!</Link>
        </Box>
      </FormControl>
    </Box>
  );
}

export default Login;
