import { Avatar, Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { getProfile } from '../../features/auth/authSlice';
import { saveUserLanguageAsync } from '../../features/languages/languageSlice';
import Language from '../../features/languages/types/Language';
import CustomButton from '../custom/btn/CustomButton';
import ProfileEditActions from './ProfileEditActions';
import {
	profileEditPanelSx,
	profileFullWidthFieldSx,
	profileItemActionSx,
	profileItemCardSx,
	profileItemLabelSx,
	profileItemRowSx,
	profileItemValueRowSx,
	profileItemValueSx,
} from './profilePageStyles';
import { showErrorSnackbar, showSuccessSnackbar } from '../custom/snackbar/snackbarSlice';

const ProfileLanguage = ({ lng }: { lng: string | undefined }): JSX.Element => {
	const dispatch = useAppDispatch();
	const [showLangChange, setShowLangChange] = useState(false);
	const [language, setLanguage] = useState<string>(lng || 'ru');

	const languages: Language[] = [
		{ code: 'en', name: 'English', img: 'english.png' },
		{ code: 'de', name: 'Deutsch', img: 'german.png' },
		{ code: 'ru', name: 'Русский', img: 'russian.png' },
	];

	const currentLng = languages.find((l) => l.code === lng);

	const handleSaveLanguage = useCallback(async () => {
		const dispatchResult = await dispatch(saveUserLanguageAsync(language));
		if (saveUserLanguageAsync.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('siteLanguageSuccessfullyChanged') }));
			dispatch(getProfile());
			setShowLangChange(false);
		}
		if (saveUserLanguageAsync.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, language]);

	const handleLanguageChange = (event: SelectChangeEvent<string>): void => {
		setLanguage(event.target.value);
	};

	const handleEditLanguage = (): void => {
		setLanguage(lng || 'ru');
		setShowLangChange(true);
	};

	const handleCancel = (): void => {
		setShowLangChange(false);
	};

	return (
		<Box sx={profileItemCardSx}>
			{showLangChange ? (
				<Box sx={profileEditPanelSx}>
					<Select
						fullWidth
						size="small"
						value={language}
						onChange={handleLanguageChange}
						sx={profileFullWidthFieldSx}
					>
						{languages.map((lang) => (
							<MenuItem key={lang.code} value={lang.code}>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<Avatar
										sx={{ mr: 1, width: 28, height: 18, border: 0.5, borderRadius: 0 }}
										alt="language_flag"
										src={`/upload/locales/${lang.img}`}
									/>
									{lang.name}
								</Box>
							</MenuItem>
						))}
					</Select>
					<ProfileEditActions
						onCancel={handleCancel}
						onSave={() => void handleSaveLanguage()}
						saveText={t('btnText.accept')}
					/>
				</Box>
			) : (
				<Box sx={profileItemRowSx}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography sx={profileItemLabelSx}>{t('currentSiteLanguage')}</Typography>
						<Box sx={profileItemValueRowSx}>
							<Avatar
								sx={{ width: 28, height: 18, border: 0.5, borderRadius: 0 }}
								alt="language_flag"
								src={`/upload/locales/${currentLng?.img || ''}`}
							/>
							<Typography sx={profileItemValueSx}>{currentLng?.name || lng || '—'}</Typography>
						</Box>
					</Box>
					<CustomButton
						onClick={handleEditLanguage}
						buttonText={t('changeLanguage')}
						sx={profileItemActionSx}
					/>
				</Box>
			)}
		</Box>
	);
};

export default ProfileLanguage;
