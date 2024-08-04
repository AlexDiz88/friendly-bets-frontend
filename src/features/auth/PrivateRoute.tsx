import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectUser } from './selectors';

interface PrivateRouteProps {
	roles?: string[];
}

const PrivateRoute = ({ roles }: PrivateRouteProps): JSX.Element => {
	const user = useSelector(selectUser);
	const location = useLocation();

	if (!user) {
		// Если пользователь не авторизован, перенаправить на страницу входа
		return <Navigate to="/auth/login" state={{ from: location }} />;
	}

	if (roles && !roles.includes(user.role)) {
		// Если роль пользователя не соответствует требуемым ролям, перенаправить на главную страницу
		return <Navigate to="/" />;
	}

	return <Outlet />;
};

export default PrivateRoute;
