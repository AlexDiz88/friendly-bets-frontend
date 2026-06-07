import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRef, useState } from 'react';
import { PixelCrop } from 'react-image-crop';
import { useAppDispatch } from '../app/hooks';
import { getProfile, uploadUserAvatar } from '../features/auth/authSlice';
import CustomButton from './custom/btn/CustomButton';
import ProfileEditActions from './profile/ProfileEditActions';
import { profileUploadHintSx, profileUploadPanelSx } from './profile/profilePageStyles';
import { showErrorSnackbar, showSuccessSnackbar } from './custom/snackbar/snackbarSlice';
import ImageCropper from './utils/ImageCropper';
import convertHeicToJpeg from './utils/convertHeicToJpeg';
import getCroppedImage from './utils/getCroppedImage';

interface UploadFormProps {
	onClose: () => void;
}

const UploadAvatarForm = ({ onClose }: UploadFormProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileToUpload, setFileToUpload] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
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
		}
	};

	const handleCropComplete = async (completedCrop: PixelCrop): Promise<void> => {
		if (imageElement) {
			const croppedFile = await getCroppedImage(imageElement, completedCrop);
			setFileToUpload(croppedFile);
		}
	};

	const handleSubmit = async (): Promise<void> => {
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
	};

	const handleSelectFileClick = (): void => {
		fileInputRef.current?.click();
	};

	return (
		<Box sx={profileUploadPanelSx} component="form" onSubmit={(e) => e.preventDefault()}>
			{imageUrl && (
				<Box sx={{ mb: 1.5 }}>
					<ImageCropper
						src={imageUrl}
						onCropComplete={handleCropComplete}
						setImageElement={setImageElement}
					/>
				</Box>
			)}

			<input
				ref={fileInputRef}
				type="file"
				id="imageInput"
				accept="image/jpeg,image/png,image/webp,image/heic"
				onChange={handleImageChange}
				hidden
			/>

			<CustomButton
				onClick={handleSelectFileClick}
				buttonText={fileToUpload ? t('selectAnotherFile') : t('selectFile')}
				buttonVariant="outlined"
				buttonColor={imageUrl ? 'warning' : 'primary'}
				sx={{ width: { xs: '100%', sm: 'auto' } }}
			/>

			<Typography sx={profileUploadHintSx}>*{t('maxFileSize50MB')}</Typography>

			<ProfileEditActions
				inline
				onCancel={onClose}
				onSave={() => void handleSubmit()}
				saveText={t('btnText.accept')}
			/>
		</Box>
	);
};

export default UploadAvatarForm;
