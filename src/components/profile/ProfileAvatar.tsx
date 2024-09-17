import { Avatar, Box } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import CustomButton from '../custom/btn/CustomButton';
import UploadForm from '../UploadAvatarForm';
import { avatarBase64Converter } from '../utils/imgBase64Converter';

const ProfileAvatar = ({ avatar }: { avatar: string | undefined }): JSX.Element => {
	const [showUploadForm, setShowUploadForm] = useState(false);

	return (
		<Box
			sx={{
				p: 2,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Avatar
				sx={{ mr: 1, mb: 2, height: '7rem', width: '7rem', border: 1 }}
				alt="user_avatar"
				src={avatarBase64Converter(avatar)}
			/>
			{!showUploadForm ? (
				<CustomButton onClick={() => setShowUploadForm(true)} buttonText={t('changePhoto')} />
			) : (
				<UploadForm onClose={() => setShowUploadForm(false)} />
			)}
		</Box>
	);
};

export default ProfileAvatar;
