import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser, login, resetLoginFormError } from './authSlice';
import { selectLoginFormError } from './selectors';
import { useAppDispatch } from '../../store';

function Login(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectLoginFormError);
  const [email, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      // 332 делаем диспатч санка
      const dispatchResult = await dispatch(
        login({
          email,
          password,
        })
      );

      // 332 проверяем, что санк login зарезолвился успешно
      if (login.fulfilled.match(dispatchResult)) {
        dispatch(getUser());
        navigate('/');
      }

      // 332 выводим в консоль ошибку если санк login зареджектился
      if (login.rejected.match(dispatchResult)) {
        console.error(dispatchResult.error.message);
      }
    },
    [dispatch, email, navigate, password]
  );

  const handleNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
      // 332 очищаем ошибку
      dispatch(resetLoginFormError());
    },
    [dispatch]
  );

  const handlePasswordChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      // 332 очищаем ошибку
      dispatch(resetLoginFormError());
    },
    [dispatch]
  );

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Вход</h2>
      {error && (
        <div className="invalid-feedback mb-3" style={{ display: 'block' }}>
          {error}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="name-input" className="form-label">
          Имя
        </label>
        <input
          type="text"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id="name-input"
          name="username"
          value={email}
          onChange={handleNameChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password-input" className="form-label">
          Пароль
        </label>
        <input
          type="password"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id="password-input"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Войти
      </button>
    </form>
  );
}

export default Login;
