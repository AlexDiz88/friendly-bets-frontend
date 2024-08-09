import { t } from 'i18next';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getProfile } from '../../features/auth/authSlice';
import { selectUser } from '../../features/auth/selectors';
import { showErrorSnackbar } from '../custom/snackbar/snackbarSlice';

const useFetchCurrentUser = (): void => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const currentUser = useAppSelector(selectUser);

	useEffect(() => {
		dispatch(getProfile());
	}, []);

	useEffect(() => {
		if (!currentUser) {
			dispatch(showErrorSnackbar({ message: t('yourSessionWasFinished') }));

			const timer = setTimeout(() => {
				navigate('/auth/login');
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [currentUser, navigate, t]);
};

export default useFetchCurrentUser;
