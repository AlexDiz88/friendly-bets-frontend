import { Avatar, Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/selectors';
import useFetchCurrentUser from '../hooks/useFetchCurrentUser';
import ProfileAvatar from './ProfileAvatar';
import ProfileEmail from './ProfileEmail';
import ProfileEmailVerification from './ProfileEmailVerification';
import ProfileLanguage from './ProfileLanguage';
import ProfilePassword from './ProfilePassword';
import ProfileTheme from './ProfileTheme';
import ProfileUsername from './ProfileUsername';
import {
	profileAccountBlockSx,
	profileGroupHeadingSx,
	profileHeroAvatarSx,
	profileHeroEmailSx,
	profileHeroNameSx,
	profileHeroSx,
	profilePageRootSx,
	profilePageTitleSx,
	profileSectionGroupSx,
} from './profilePageStyles';
import { avatarBase64Converter } from '../utils/imgBase64Converter';

export default function Profile(): JSX.Element {
	const user = useAppSelector(selectUser);
	useFetchCurrentUser();

	const username = user?.username?.trim();
	const email = user?.email?.trim();

	return (
		<Box sx={profilePageRootSx}>
			<Typography sx={profilePageTitleSx}>{t('personalAccount')}</Typography>

			<ProfileEmailVerification email={user?.email} emailIsConfirmed={user?.emailIsConfirmed} />

			<Box sx={profileHeroSx}>
				<Avatar
					sx={profileHeroAvatarSx}
					alt="user_avatar"
					src={avatarBase64Converter(user?.avatar)}
				/>
				<Box sx={{ flex: 1, minWidth: 0 }}>
					{username ? (
						<Typography sx={profileHeroNameSx}>{username}</Typography>
					) : (
						<Typography sx={profileHeroNameSx}>{email || '—'}</Typography>
					)}
					{username && email && (
						<Typography sx={profileHeroEmailSx}>{email}</Typography>
					)}
					<ProfileAvatar compact />
				</Box>
			</Box>

			<Typography component="h2" sx={profileGroupHeadingSx}>
				{t('profileSectionAccount')}
			</Typography>
			<Box sx={profileAccountBlockSx}>
				<ProfileEmail email={user?.email} />
				<ProfileUsername username={user?.username} />
				<ProfilePassword />
			</Box>

			<Typography component="h2" sx={profileGroupHeadingSx}>
				{t('profileSectionPreferences')}
			</Typography>
			<Box sx={profileSectionGroupSx}>
				<ProfileLanguage lng={user?.language} />
				<ProfileTheme
					themePreference={user?.themePreference}
					showThemeToggle={user?.showThemeToggle}
				/>
			</Box>
		</Box>
	);
}
