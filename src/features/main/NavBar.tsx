import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { logout } from '../auth/authSlice';
import { selectUser } from '../auth/selectors';

function NavBar(): JSX.Element {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleLogout = React.useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();
      const dispatchResult = await dispatch(logout());
      if (logout.fulfilled.match(dispatchResult)) {
        navigate('/auth/login');
      }
    },
    [dispatch, navigate]
  );
  return (
    <div className="mb-3">
      <p>{user?.email}</p>
      {user && (
        <div className="mb-3">
          Добрый день, {user.email}.{' '}
          <a href="#" role="button" tabIndex={0} onClick={handleLogout}>
            Выйти
          </a>
        </div>
      )}
      <div>
        {!user ? (
          <>
            <Link className="btn btn-light btn-lg ms-3" to="/auth/login">
              Войти
            </Link>
            <Link className="btn btn-light btn-lg ms-3" to="/auth/register">
              Регистрация
            </Link>
          </>
        ) : location.pathname === '/' ? (
          (
            user.role === 'ADMIN' ?
              (
                <Link className="btn btn-light btn-lg" to="/admin/tasks">
                  Задачи всех пользователей
                </Link>
              )
              :
              (
                <Link className="btn btn-light btn-lg" to="/tasks">
                  Задачи текущего пользователя
                </Link>
              )
          )
        ) :
          (
            <Link className="btn btn-light btn-lg" to="/">
              На главную
            </Link>
          )}
      </div>
    </div>
  );
}

export default NavBar;
