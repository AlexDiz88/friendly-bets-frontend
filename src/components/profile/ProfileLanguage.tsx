import { Avatar, Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { getProfile } from '../../features/auth/authSlice';
import { saveUserLanguageAsync } from '../../features/languages/languageSlice';
import Language from '../../features/languages/types/Language';
import CustomButton from '../custom/btn/CustomButton';
import CustomCancelButton from '../custom/btn/CustomCancelButton';
import CustomSuccessButton from '../custom/btn/CustomSuccessButton';
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
			dispatch(showSuccessSnackbar({ message: t('siteLanguageWasChanged') }));
			dispatch(getProfile());
			setShowLangChange(false);
		}
		if (saveUserLanguageAsync.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [language]);

	const handleLanguageChange = (event: SelectChangeEvent<string>): void => {
		setLanguage(event.target.value);
	};

	const handleEditLanguage = (): void => {
		setShowLangChange(true);
	};

	const handleCancel = (): void => {
		setShowLangChange(false);
	};

	return (
		<>
			<Box sx={{ pt: 1, mx: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Box sx={{ mr: 1, textAlign: 'center', fontWeight: 600 }}>{t('currentSiteLanguage')}:</Box>
				<Avatar
					sx={{ mr: 0.5, width: 30, height: 20, border: 0.5, borderRadius: 0 }}
					alt="language_flag"
					src={`/upload/locales/${currentLng?.img || ''}`}
				/>
			</Box>
			{showLangChange ? (
				<>
					<Select
						sx={{ mt: 1, pt: 0.5, mb: 1.5, minWidth: '13rem' }}
						size="small"
						value={language}
						onChange={handleLanguageChange}
					>
						{languages.map((lang) => (
							<MenuItem key={lang.code} value={lang.code}>
								<Box sx={{ mb: 0.8, ml: 0, display: 'flex', alignItems: 'center' }}>
									<Avatar
										sx={{ mr: 0.5, py: 0, width: 30, height: 20, border: 0.5, borderRadius: 0 }}
										alt="language_flag"
										src={`/upload/locales/${lang.img}`}
									/>
									{lang.name}
								</Box>
							</MenuItem>
						))}
					</Select>
					<Box>
						<CustomCancelButton onClick={handleCancel} />
						<CustomSuccessButton onClick={handleSaveLanguage} buttonText={t('btnText.accept')} />
					</Box>
				</>
			) : (
				<Box sx={{ textAlign: 'left', mx: 2, mt: 1, mb: 2 }}>
					<CustomButton onClick={handleEditLanguage} buttonText={t('changeLanguage')} />
				</Box>
			)}
		</>
	);
};

export default ProfileLanguage;
