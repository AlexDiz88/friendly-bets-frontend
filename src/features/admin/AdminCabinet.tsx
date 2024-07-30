import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import DatabaseUpdate from '../../components/DatabaseUpdate';
import { selectUser } from '../auth/selectors';
import StatsRecalculating from '../stats/StatsRecalculating';
import SeasonsManagement from './seasons/SeasonsManagement';
import TeamsManagement from './teams/TeamsManagement';

export default function AdminCabinet(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const navigate = useNavigate();
	const [showMessage, setShowMessage] = useState(false);

	// редирект неавторизованных пользователей
	useEffect(() => {
		if (user && user.role !== 'ADMIN') {
			navigate('/');
		}
		const timer = setTimeout(() => {
			if (!user) {
				navigate('/');
			} else if (user && user.role !== 'ADMIN') {
				navigate('/');
			}
		}, 3000);
		return () => clearTimeout(timer);
	}, [dispatch, navigate, user]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMessage(true);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	if (!user || (user && user.role !== 'ADMIN')) {
		return (
			<Box
				sx={{
					p: 5,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '70vh',
				}}
			>
				{showMessage && (
					<Box sx={{ textAlign: 'center', my: 3, fontWeight: 600, color: 'brown' }}>
						Проверка авторизации на доступ к админ-панели
					</Box>
				)}
				<CircularProgress size={100} color="primary" />
			</Box>
		);
	}

	return (
		<Box sx={{ textAlign: 'center', mx: 2, mb: 10 }}>
			<Typography sx={{ borderBottom: 1, pb: 1 }}>Admin Panel</Typography>
			<SeasonsManagement />
			<TeamsManagement />
			<StatsRecalculating />
			<DatabaseUpdate />
		</Box>
	);
}
