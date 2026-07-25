import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Avatar, Box, IconButton, Menu, MenuItem, Typography, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getProfile, logout } from '../../features/auth/authSlice';
import { selectUser } from '../../features/auth/selectors';
import User from '../../features/auth/types/User';
import { fetchErrorLogsCount } from '../../features/error-logs/errorLogsApi';
import { headerIconButtonSx } from './headerPageStyles';
import { avatarBase64Converter } from '../utils/imgBase64Converter';

export default function UserSettings(): JSX.Element {
	const user: User | undefined = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const [errorLogsNonEmpty, setErrorLogsNonEmpty] = useState(false);

	const errorLogsLabel = t('errorLogs.menuLink');
	const monitoringLabel = t('externalApiMonitoring.menuLink');
	const canViewErrorLogs = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	const adminSettings = [
		t('inputBet'),
		t('summaryAutoResults'),
		t('summaryResults'),
		t('matchdayCalendar'),
		t('editBet'),
		t('myProfile'),
		t('adminPanel'),
		monitoringLabel,
		errorLogsLabel,
		t('logout'),
	];
	const moderSettings = [
		t('inputBet'),
		t('summaryAutoResults'),
		t('summaryResults'),
		t('matchdayCalendar'),
		t('editBet'),
		t('myProfile'),
		// t('myStats'),
		t('seasonRegister'),
		monitoringLabel,
		errorLogsLabel,
		t('logout'),
	];
	const authSettings = [t('myProfile'), t('seasonRegister'), t('logout')];
	const notAuthSettings = [t('login'), t('signUp')];
	let settings: string[] = [];

	if (user === undefined) {
		settings = notAuthSettings;
	} else if (user.role === 'USER') {
		settings = authSettings;
	} else if (user.role === 'MODERATOR') {
		settings = moderSettings;
	} else if (user.role === 'ADMIN') {
		settings = adminSettings;
	}

	const handleLogout = useCallback(async () => {
		const dispatchResult = await dispatch(logout());

		if (logout.fulfilled.match(dispatchResult)) {
			dispatch(getProfile());
			navigate('/auth/login');
		}

		if (logout.rejected.match(dispatchResult)) {
			throw new Error(dispatchResult.error.message);
		}
	}, [dispatch, navigate]);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElUser(event.currentTarget);
		if (canViewErrorLogs) {
			void fetchErrorLogsCount()
				.then((count) => setErrorLogsNonEmpty(count > 0))
				.catch(() => setErrorLogsNonEmpty(false));
		} else {
			setErrorLogsNonEmpty(false);
		}
	};

	const handleCloseUserMenu = (): void => {
		setAnchorElUser(null);
	};

	const handleMenuSelect = (setting: string): void => {
		if (setting === t('myProfile')) {
			navigate('/my/profile');
		} else if (setting === t('myStats')) {
			navigate('/my/stats');
		} else if (setting === t('logout')) {
			void handleLogout();
		} else if (setting === t('login')) {
			navigate('/auth/login');
		} else if (setting === t('signUp')) {
			navigate('/auth/register');
		} else if (setting === t('inputBet')) {
			navigate('/bet-input');
		} else if (setting === t('adminPanel')) {
			navigate('/admin/cabinet');
		} else if (setting === monitoringLabel) {
			navigate('/external-api-monitoring');
		} else if (setting === errorLogsLabel) {
			navigate('/error-logs');
		} else if (setting === t('seasonRegister')) {
			navigate('/season/register');
		} else if (setting === t('summaryResults')) {
			navigate('/bets/check');
		} else if (setting === t('summaryAutoResults')) {
			navigate('/bets/check/auto');
		} else if (setting === t('editBet')) {
			navigate('/bets/edit');
		} else if (setting === t('matchdayCalendar')) {
			navigate('/calendar');
		}
		handleCloseUserMenu();
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'flex-end',
				alignItems: 'center',
			}}
		>
			<IconButton
				onClick={handleOpenUserMenu}
				sx={[headerIconButtonSx, { p: 0 }] as SxProps<Theme>}
			>
				<Avatar alt="avatar" src={avatarBase64Converter(user?.avatar)} />
			</IconButton>
			<Menu
				sx={{ mt: '45px' }}
				id="menu-app-bar"
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
			>
				{settings.map((setting: string, index: number) => (
					<MenuItem key={index} onClick={() => handleMenuSelect(setting)}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 1.25,
								width: '100%',
								minWidth: 180,
							}}
						>
							<Typography sx={{ fontWeight: 600 }}>{setting}</Typography>
							{setting === errorLogsLabel && errorLogsNonEmpty ? (
								<WarningAmberIcon
									sx={{ color: '#d4a017', fontSize: 20 }}
									aria-label={t('errorLogs.hasEntriesAria')}
								/>
							) : null}
						</Box>
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
}
