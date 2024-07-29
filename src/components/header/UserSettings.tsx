import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getProfile, logout } from '../../features/auth/authSlice';
import { selectUser } from '../../features/auth/selectors';
import User from '../../features/auth/types/User';
import pathToAvatarImage from '../utils/pathToAvatarImage';

export default function UserSettings(): JSX.Element {
	const user: User | undefined = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const adminSettings = [
		t('inputBet'),
		t('summaryResults'),
		t('editBet'),
		t('adminPanel'),
		t('logout'),
	];
	const moderSettings = [
		t('inputBet'),
		t('summaryResults'),
		t('editBet'),
		t('myProfile'),
		// t('myStats'),
		t('seasonRegister'),
		t('logout'),
	];
	const authSettings = [t('myProfile'), t('myStats'), t('seasonRegister'), t('logout')];
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

	const handleBetsEditList = (): void => {
		navigate('/bets/edit');
	};

	const handleMyProfile = (): void => {
		navigate('/my/profile');
	};

	const handleMyStatistic = (): void => {
		navigate('/my/stats');
	};

	const handleBetInput = (): void => {
		navigate('/bet-input');
	};

	const handleAdminCabinet = (): void => {
		navigate('/admin/cabinet');
	};

	const handleSeasonRegister = (): void => {
		navigate('/season/register');
	};

	const handleBetsCheck = (): void => {
		navigate('/bets/check');
	};

	const handleBetDelete = (): void => {
		// логика для обработки события клика на "Удалить ставку"
	};

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

	const handleLogin = (): void => {
		navigate('/auth/login');
	};

	const handleRegister = (): void => {
		navigate('/auth/register');
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = (): void => {
		setAnchorElUser(null);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'flex-end',
				flexGrow: 1,
				pl: { xs: 0, md: 3 },
			}}
		>
			<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
				<Avatar alt="avatar" src={pathToAvatarImage(user?.avatar)} />
			</IconButton>
			<Menu
				sx={{ mt: '45px' }}
				id="menu-appbar"
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
					<MenuItem
						key={index}
						onClick={() => {
							if (setting === t('myProfile')) {
								handleMyProfile();
							} else if (setting === t('myStats')) {
								handleMyStatistic();
							} else if (setting === t('logout')) {
								handleLogout();
							} else if (setting === t('login')) {
								handleLogin();
							} else if (setting === t('signUp')) {
								handleRegister();
							} else if (setting === t('inputBet')) {
								handleBetInput();
							} else if (setting === t('deleteBet')) {
								handleBetDelete();
							} else if (setting === t('adminPanel')) {
								handleAdminCabinet();
							} else if (setting === t('seasonRegister')) {
								handleSeasonRegister();
							} else if (setting === t('summaryResults')) {
								handleBetsCheck();
							} else if (setting === t('editBet')) {
								handleBetsEditList();
							}
							handleCloseUserMenu();
						}}
					>
						<Typography>{setting}</Typography>
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
}
