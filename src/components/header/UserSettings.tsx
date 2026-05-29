import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Avatar, Box, IconButton, Menu, MenuItem, Typography, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getProfile, logout } from '../../features/auth/authSlice';
import { selectUser } from '../../features/auth/selectors';
import User from '../../features/auth/types/User';
import {
	EXTERNAL_SYNC_ISSUES_CHANGED_EVENT,
	getExternalSyncIssuesStatus,
} from '../../features/admin/external-sync-issues/api';
import { headerIconButtonSx } from './headerPageStyles';
import { avatarBase64Converter } from '../utils/imgBase64Converter';

function isStaffRole(role: string | undefined): boolean {
	return role === 'ADMIN' || role === 'MODERATOR';
}

export default function UserSettings(): JSX.Element {
	const user: User | undefined = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const [syncIssuesHasEntries, setSyncIssuesHasEntries] = useState(false);

	const adminSettings = [
		t('inputBet'),
		t('summaryAutoResults'),
		t('summaryResults'),
		t('matchdayCalendar'),
		t('editBet'),
		t('myProfile'),
		t('adminPanel'),
		t('oddsDemo.menuLink'),
		t('externalSyncIssuesTitle'),
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
		t('externalSyncIssuesTitle'),
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

	const loadSyncIssuesStatus = useCallback(async (): Promise<void> => {
		try {
			const status = await getExternalSyncIssuesStatus();
			setSyncIssuesHasEntries(status.hasIssues);
		} catch {
			setSyncIssuesHasEntries(false);
		}
	}, []);

	useEffect(() => {
		if (!isStaffRole(user?.role)) {
			return;
		}
		void loadSyncIssuesStatus();
	}, [user?.role, location.pathname, loadSyncIssuesStatus]);

	useEffect(() => {
		if (!isStaffRole(user?.role)) {
			return;
		}
		const onChanged = (): void => {
			void loadSyncIssuesStatus();
		};
		window.addEventListener(EXTERNAL_SYNC_ISSUES_CHANGED_EVENT, onChanged);
		return () => window.removeEventListener(EXTERNAL_SYNC_ISSUES_CHANGED_EVENT, onChanged);
	}, [user?.role, loadSyncIssuesStatus]);

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
		} else if (setting === t('oddsDemo.menuLink')) {
			navigate('/odds-demo');
		} else if (setting === t('externalSyncIssuesTitle')) {
			navigate('/external-sync-issues');
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
						{setting === t('externalSyncIssuesTitle') ? (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
								<Typography sx={{ fontWeight: 600 }}>{setting}</Typography>
								{syncIssuesHasEntries ? (
									<WarningAmberIcon color="warning" fontSize="small" aria-label={t('externalSyncIssuesHasIssues')} />
								) : null}
							</Box>
						) : (
							<Typography sx={{ fontWeight: 600 }}>{setting}</Typography>
						)}
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
}
