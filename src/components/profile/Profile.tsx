import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/selectors';
import useFetchCurrentUser from '../hooks/useFetchCurrentUser';
import ProfileAvatar from './ProfileAvatar';
import ProfileEmail from './ProfileEmail';
import ProfileLanguage from './ProfileLanguage';
import ProfilePassword from './ProfilePassword';
import ProfileUsername from './ProfileUsername';

export default function Profile(): JSX.Element {
	const user = useAppSelector(selectUser);
	useFetchCurrentUser();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				mx: 2,
				mt: 2,
				mb: 4,
			}}
		>
			<Typography sx={{ borderBottom: 2, pb: 1, mx: 2, px: 7 }}>{t('personalAccount')}</Typography>
			<ProfileAvatar avatar={user?.avatar} />
			<ProfileEmail email={user?.email} />
			<ProfilePassword />
			<ProfileUsername username={user?.username} />
			<ProfileLanguage lng={user?.language} />
		</Box>
	);
}
