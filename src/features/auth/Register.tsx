import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, resetRegisterFormError, login } from './authSlice';
import { selectRegisterFormError } from './selectors';
import { useAppDispatch } from '../../store';

function Register(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectRegisterFormError);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordRepeat, setPasswordRepeat] = React.useState('');

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
        dispatch(login({ email, password }));
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
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
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
      <div className="mb-3">
        <label htmlFor="password-repeat-input" className="form-label">
          Повторите пароль
        </label>
        <input
          type="password"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id="password-repeat-input"
          name="passwordRepeat"
          value={passwordRepeat}
          onChange={handlePasswordRepeatChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Зарегистрироваться
      </button>
    </form>
  );
}

export default Register;
