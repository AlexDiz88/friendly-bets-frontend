import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectAuthChecked, selectUser } from './selectors';

interface PrivateRouteProps {
	roles?: string[];
}

const PrivateRoute = ({ roles }: PrivateRouteProps): JSX.Element => {
	const user = useSelector(selectUser);
	const authChecked = useSelector(selectAuthChecked);
	const location = useLocation();

	// До ответа getProfile не редиректим: после reload user ещё undefined, сессия уже есть
	if (!authChecked) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
				<CircularProgress size={32} />
			</Box>
		);
	}

	if (!user) {
		return <Navigate to="/auth/login" state={{ from: location }} replace />;
	}

	if (roles && !roles.includes(user.role)) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};

export default PrivateRoute;
