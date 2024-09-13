import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getProfile, logout } from '../../features/auth/authSlice';
import { selectUser } from '../../features/auth/selectors';
import User from '../../features/auth/types/User';
import { avatarBase64Converter } from '../utils/imgBase64Converter';

export default function UserSettings(): JSX.Element {
	const user: User | undefined = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const adminSettings = [
		t('inputBet'),
		t('summaryResults'),
		t('matchdayCalendar'),
		t('editBet'),
		t('myProfile'),
		t('adminPanel'),
		t('logout'),
	];
	const moderSettings = [
		t('inputBet'),
		t('summaryResults'),
		t('matchdayCalendar'),
		t('editBet'),
		t('myProfile'),
		// t('myStats'),
		t('seasonRegister'),
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
					<MenuItem
						key={index}
						onClick={() => {
							if (setting === t('myProfile')) {
								navigate('/my/profile');
							} else if (setting === t('myStats')) {
								navigate('/my/stats');
							} else if (setting === t('logout')) {
								handleLogout();
							} else if (setting === t('login')) {
								navigate('/auth/login');
							} else if (setting === t('signUp')) {
								navigate('/auth/register');
							} else if (setting === t('inputBet')) {
								navigate('/bet-input');
							} else if (setting === t('adminPanel')) {
								navigate('/admin/cabinet');
							} else if (setting === t('seasonRegister')) {
								navigate('/season/register');
							} else if (setting === t('summaryResults')) {
								navigate('/bets/check');
							} else if (setting === t('editBet')) {
								navigate('/bets/edit');
							} else if (setting === t('matchdayCalendar')) {
								navigate('/calendar');
							}
							handleCloseUserMenu();
						}}
					>
						<Typography sx={{ fontWeight: 600 }}>{setting}</Typography>
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
}
