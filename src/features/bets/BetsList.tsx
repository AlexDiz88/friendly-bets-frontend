import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import CustomSwitchButton from '../../components/custom/btn/CustomSwitchButton';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import { selectActiveSeason } from '../admin/seasons/selectors';

export default function BetsList(): JSX.Element {
	const navigate = useNavigate();
	const location = useLocation();
	const activeSeason = useAppSelector(selectActiveSeason);

	useFetchActiveSeason(activeSeason?.id);

	const isActive = (path: string): boolean => {
		return location.pathname === path;
	};

	const handleNavigate = (link: string): void => {
		navigate(link === t('openedBets') ? '/bets/opened' : '/bets/completed');
	};

	useEffect(() => {
		navigate('/bets/opened');
	}, []);

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: -0.5 }}>
				<CustomSwitchButton
					onClick={() => handleNavigate(t('openedBets'))}
					buttonText={t('openedBets')}
					isActive={isActive('/bets/opened')}
				/>
				<CustomSwitchButton
					onClick={() => handleNavigate(t('completedBets'))}
					buttonText={t('completedBets')}
					isActive={isActive('/bets/completed')}
				/>
			</Box>
			<Outlet />
		</Box>
	);
}
