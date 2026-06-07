import { Box } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import CustomButton from '../custom/btn/CustomButton';
import UploadForm from '../UploadAvatarForm';

type ProfileAvatarProps = {
	avatar?: string;
	compact?: boolean;
};

export default function ProfileAvatar({ compact = false }: ProfileAvatarProps): JSX.Element {
	const [showUploadForm, setShowUploadForm] = useState(false);

	if (compact) {
		return (
			<Box sx={{ mt: 1.25 }}>
				{!showUploadForm ? (
					<CustomButton
						onClick={() => setShowUploadForm(true)}
						buttonText={t('changePhoto')}
						sx={{ width: { xs: '100%', sm: 'auto' } }}
					/>
				) : (
					<UploadForm onClose={() => setShowUploadForm(false)} />
				)}
			</Box>
		);
	}

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
			{!showUploadForm ? (
				<CustomButton onClick={() => setShowUploadForm(true)} buttonText={t('changePhoto')} />
			) : (
				<UploadForm onClose={() => setShowUploadForm(false)} />
			)}
		</Box>
	);
}
