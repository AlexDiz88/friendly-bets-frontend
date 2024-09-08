import { Box, Button, FormControl, InputLabel, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { getProfile, uploadAvatar } from '../features/auth/authSlice';
import CustomCancelButton from './custom/btn/CustomCancelButton';
import { showErrorSnackbar, showSuccessSnackbar } from './custom/snackbar/snackbarSlice';

interface UploadFormProps {
	onClose: () => void;
}

function UploadForm({ onClose }: UploadFormProps): JSX.Element {
	const dispatch = useAppDispatch();
	const [image, setImage] = useState<File | null>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event.target.files && event.target.files.length > 0) {
			setImage(event.target.files[0]);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!image) {
			dispatch(showErrorSnackbar({ message: t('fileNotChose') }));
			return;
		}

		// const formData = new FormData();
		// formData.append('image', image);
		// let url = `${(import.meta.env.VITE_PRODUCT_SERVER as string) || ''}/api/files/upload/avatars`;
		// if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		// 	url = '/api/files/upload/avatars';
		// }
		// const response = await fetch(`${url}`, {
		// 	method: 'POST',
		// 	body: formData,
		// });
		const dispatchResult = await dispatch(uploadAvatar({ image }));

		if (uploadAvatar.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('userAvatarWasUploaded') }));
			dispatch(getProfile());
		}
		if (uploadAvatar.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	};

	const handleCancel = (): void => {
		onClose();
	};

	return (
		<Box>
			<Typography sx={{ fontFamily: "'Exo 2'" }}>{t('changePhoto')}</Typography>
			<FormControl component="form" onSubmit={handleSubmit}>
				<InputLabel htmlFor="imageInput" />
				<TextField
					type="file"
					id="imageInput"
					inputProps={{ accept: 'image/jpeg' }}
					onChange={handleImageChange}
				/>
				<Box sx={{ mt: 1, mb: 1, mr: 1 }}>
					<CustomCancelButton onClick={handleCancel} />
					{/* <CustomSuccessButton onClick={handleSubmit} /> */}
					<Button type="submit" sx={{ height: '2rem', px: 1 }} variant="contained" color="success">
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							{t('btnText.change')}
						</Typography>
					</Button>
				</Box>
			</FormControl>
		</Box>
	);
}

export default UploadForm;
