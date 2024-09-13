/* eslint-disable import/named */
import { Box, Button, FormControl, InputLabel, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { PixelCrop } from 'react-image-crop';
import { useAppDispatch } from '../app/hooks';
import { getProfile, uploadUserAvatar } from '../features/auth/authSlice';
import CustomCancelButton from './custom/btn/CustomCancelButton';
import { showErrorSnackbar, showSuccessSnackbar } from './custom/snackbar/snackbarSlice';
import ImageCropper from './utils/ImageCropper';
import convertHeicToJpeg from './utils/convertHeicToJpeg';
import getCroppedImage from './utils/getCroppedImage';

interface UploadFormProps {
	onClose: () => void;
}

const UploadAvatarForm = ({ onClose }: UploadFormProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const [fileToUpload, setFileToUpload] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [animate, setAnimate] = useState(false);
	const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

	const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic'];

	const getFileExtension = (file: File): string => {
		return file.name.split('.').pop()?.toLowerCase() || '';
	};

	const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			if (getFileExtension(file) === 'heic') {
				const convertedFile = await convertHeicToJpeg(file);
				if (convertedFile) {
					setImageUrl(URL.createObjectURL(convertedFile));
				} else {
					dispatch(showErrorSnackbar({ message: t('failedToConvertHeicImage') }));
				}
			} else {
				setImageUrl(URL.createObjectURL(file));
			}
			setAnimate(true);
		}
	};

	const handleCropComplete = async (completedCrop: PixelCrop): Promise<void> => {
		if (imageElement) {
			const croppedFile = await getCroppedImage(imageElement, completedCrop);
			setFileToUpload(croppedFile);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		if (!fileToUpload) {
			dispatch(showErrorSnackbar({ message: t('fileNotChosen') }));
			return;
		}

		if (!allowedExtensions.includes(getFileExtension(fileToUpload))) {
			dispatch(showErrorSnackbar({ message: t('invalidFileFormat') }));
			return;
		}

		const dispatchResult = await dispatch(uploadUserAvatar({ file: fileToUpload }));

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
			{imageUrl && (
				<Box>
					<ImageCropper
						src={imageUrl}
						onCropComplete={handleCropComplete}
						setImageElement={setImageElement}
					/>
				</Box>
			)}
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
							backgroundColor: animate ? '#ed6c00' : '#D7D7D7DC',
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
							{fileToUpload ? t('selectAnotherFile') : t('selectFile')}
						</Typography>
					</Button>
				</label>
				<Box>
					<Typography sx={{ fontFamily: "'Exo 2'", fontSize: '0.85rem' }}>
						*{t('maxFileSize50MB')}
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
