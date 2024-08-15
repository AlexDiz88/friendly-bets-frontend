import { Avatar, Box } from '@mui/material';
import SimpleUser from '../../../features/auth/types/SimpleUser';
import User from '../../../features/auth/types/User';
import pathToAvatarImage from '../../utils/pathToAvatarImage';

const UserAvatar = ({
	player,
	height = 40,
	sx,
	avasx,
}: {
	player: User | SimpleUser | undefined;
	height?: number;
	sx?: {};
	avasx?: {};
}): JSX.Element => {
	return (
		<Box sx={{ mb: 0.8, ml: 0.5, display: 'flex', alignItems: 'center', fontWeight: 600, ...sx }}>
			<Avatar
				sx={{ mr: 0.5, height, width: 'auto', border: 1, borderColor: 'gray', ...avasx }}
				alt="user_avatar"
				src={pathToAvatarImage(player?.avatar)}
			/>
			{player?.username}
		</Box>
	);
};

export default UserAvatar;
