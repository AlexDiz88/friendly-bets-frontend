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
import { register, resetRegisterFormError, login } from './authSlice';
import { selectRegisterFormError } from './selectors';
import { useAppDispatch } from '../../store';

function Register(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectRegisterFormError);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordRepeat, setPasswordRepeat] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleTogglePasswordVisibility = (): void => {
    setShowPassword((prevShowPassword: boolean) => !prevShowPassword);
  };

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const dispatchResult = await dispatch(
        register({
          email,
          password,
          passwordRepeat,
        })
      );

      if (register.fulfilled.match(dispatchResult)) {
        await dispatch(login({ email, password }));
        navigate('/');
      }
    },
    [dispatch, email, navigate, password, passwordRepeat]
  );

  const handleNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      dispatch(resetRegisterFormError());
    },
    [dispatch]
  );

  const handlePasswordChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      dispatch(resetRegisterFormError());
    },
    [dispatch]
  );

  const handlePasswordRepeatChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordRepeat(event.target.value);
      dispatch(resetRegisterFormError());
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
          <TextField
            fullWidth
            required
            id="password-repeat"
            label="Repeat password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={passwordRepeat}
            onChange={handlePasswordRepeatChange}
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
          {error && <Box sx={{ display: 'block' }}>{error}</Box>}
        </Box>
        <Box sx={{ fontSize: 16, mt: 3 }}>
          <Link href="#/auth/login">Уже есть аккаунт? Войти</Link>
        </Box>
      </FormControl>
    </Box>
  );
}

export default Register;
