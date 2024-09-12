import { Box, Button, FormControl, InputLabel, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { getProfile, uploadUserAvatar } from '../features/auth/authSlice';
import CustomCancelButton from './custom/btn/CustomCancelButton';
import { showErrorSnackbar, showSuccessSnackbar } from './custom/snackbar/snackbarSlice';

interface UploadFormProps {
	onClose: () => void;
}

const UploadAvatarForm = ({ onClose }: UploadFormProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const [file, setFile] = useState<File | null>(null);
	const [animate, setAnimate] = useState(false);

	const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic'];

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event.target.files && event.target.files.length > 0) {
			setFile(event.target.files[0]);
			setAnimate(true);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!file) {
			dispatch(showErrorSnackbar({ message: t('error.fileNotChosen') }));
			return;
		}

		const fileExtension = file.name.split('.').pop()?.toLowerCase();
		if (!allowedExtensions.includes(fileExtension || '')) {
			dispatch(showErrorSnackbar({ message: t('error.invalidFileFormat') }));
			return;
		}

		const dispatchResult = await dispatch(uploadUserAvatar({ file }));

		if (uploadUserAvatar.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('userAvatarWasUploaded') }));
			dispatch(getProfile());
			onClose();
		}
		if (uploadUserAvatar.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
		setAnimate(false);
	};

	const handleCancel = (): void => {
		onClose();
	};

	return (
		<Box>
			{/* <Typography sx={{ fontFamily: "'Exo 2'" }}>{t('changePhoto')}</Typography> */}
			<FormControl component="form" onSubmit={handleSubmit}>
				<InputLabel htmlFor="imageInput" />
				<TextField
					type="file"
					id="imageInput"
					inputProps={{ accept: 'image/jpeg,image/png,image/webp,image/heic' }}
					onChange={handleImageChange}
					style={{ display: 'none' }}
				/>

				<label htmlFor="imageInput">
					<Button
						component="span"
						variant={animate ? 'contained' : 'outlined'}
						color={animate ? 'warning' : 'info'}
						sx={{
							height: '2.5rem',
							px: 1,
							borderColor: '#F0F0F0DC',
							display: 'flex',
							alignItems: 'center',
							position: 'relative',
							overflow: 'hidden',
							backgroundColor: '#D7D7D7DC',
							transition: 'background-color 1.5s ease',
						}}
					>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="'Exo 2'"
							color={animate ? 'whitesmoke' : '#1C3780FF'}
						>
							{file ? file.name : t('selectFile')}
						</Typography>
					</Button>
				</label>
				<Box>
					<Typography sx={{ fontFamily: "'Exo 2'", fontSize: '0.85rem' }}>
						*{t('maxFileSize2MB')}
					</Typography>
				</Box>

				<Box sx={{ mt: 2, mb: 1, mr: 1 }}>
					<CustomCancelButton onClick={handleCancel} />
					<Button type="submit" sx={{ height: '2rem', px: 1 }} variant="contained" color="success">
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							{t('btnText.accept')}
						</Typography>
					</Button>
				</Box>
			</FormControl>
		</Box>
	);
};

export default UploadAvatarForm;
