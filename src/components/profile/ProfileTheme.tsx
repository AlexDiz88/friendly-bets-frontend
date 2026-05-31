import {
	Box,
	FormControlLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Switch,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { getProfile } from '../../features/auth/authSlice';
import {
	normalizeThemePreference,
	themePreferenceIcon,
	themePreferenceLabelKey,
	type ThemePreference,
} from '../../features/theme/themePreferences';
import { saveUserThemeSettingsAsync } from '../../features/theme/themeSlice';
import { useThemeMode } from '../../theme/ThemeModeContext';
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

const THEME_OPTIONS: ThemePreference[] = ['light', 'dark', 'system'];

function ThemePreferenceLabel({ preference }: { preference: ThemePreference }): JSX.Element {
	const Icon = themePreferenceIcon(preference);
	return (
		<Box sx={profileItemValueRowSx}>
			<Icon fontSize="small" color="action" aria-hidden />
			<Typography sx={profileItemValueSx}>{t(themePreferenceLabelKey(preference))}</Typography>
		</Box>
	);
}

type ProfileThemeProps = {
	themePreference: string | undefined;
	showThemeToggle: boolean | undefined;
};

export default function ProfileTheme({
	themePreference,
	showThemeToggle,
}: ProfileThemeProps): JSX.Element {
	const dispatch = useAppDispatch();
	const { setPreference } = useThemeMode();
	const [showThemeChange, setShowThemeChange] = useState(false);
	const [preference, setLocalPreference] = useState<ThemePreference>(
		normalizeThemePreference(themePreference)
	);
	const [headerToggleVisible, setHeaderToggleVisible] = useState(showThemeToggle ?? true);

	const currentPreference = normalizeThemePreference(themePreference);

	const handleSaveThemeSettings = useCallback(async () => {
		const dispatchResult = await dispatch(
			saveUserThemeSettingsAsync({
				themePreference: preference,
				showThemeToggle: headerToggleVisible,
			})
		);
		if (saveUserThemeSettingsAsync.fulfilled.match(dispatchResult)) {
			setPreference(preference);
			dispatch(showSuccessSnackbar({ message: t('themeSettingsSuccessfullyChanged') }));
			dispatch(getProfile());
			setShowThemeChange(false);
		}
		if (saveUserThemeSettingsAsync.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, headerToggleVisible, preference, setPreference]);

	const handlePreferenceChange = (event: SelectChangeEvent<ThemePreference>): void => {
		setLocalPreference(event.target.value as ThemePreference);
	};

	const handleEditTheme = (): void => {
		setLocalPreference(currentPreference);
		setHeaderToggleVisible(showThemeToggle ?? true);
		setShowThemeChange(true);
	};

	const handleCancel = (): void => {
		setShowThemeChange(false);
	};

	return (
		<Box sx={profileItemCardSx}>
			{showThemeChange ? (
				<Box sx={profileEditPanelSx}>
					<Select
						fullWidth
						size="small"
						value={preference}
						onChange={handlePreferenceChange}
						sx={profileFullWidthFieldSx}
					>
						{THEME_OPTIONS.map((option) => {
							const OptionIcon = themePreferenceIcon(option);
							return (
								<MenuItem key={option} value={option}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<OptionIcon fontSize="small" color="action" aria-hidden />
										{t(themePreferenceLabelKey(option))}
									</Box>
								</MenuItem>
							);
						})}
					</Select>
					<FormControlLabel
						sx={{ m: 0, alignItems: 'flex-start' }}
						control={
							<Switch
								checked={headerToggleVisible}
								onChange={(_, checked) => setHeaderToggleVisible(checked)}
							/>
						}
						label={
							<Typography sx={{ fontSize: '0.875rem', lineHeight: 1.45, pt: 0.75 }}>
								{t('showThemeToggleInHeader')}
							</Typography>
						}
					/>
					<ProfileEditActions
						onCancel={handleCancel}
						onSave={() => void handleSaveThemeSettings()}
						saveText={t('btnText.accept')}
					/>
				</Box>
			) : (
				<Box sx={profileItemRowSx}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography sx={profileItemLabelSx}>{t('currentDefaultTheme')}</Typography>
						<ThemePreferenceLabel preference={currentPreference} />
						<Typography
							sx={{
								fontSize: '0.6875rem',
								fontWeight: 700,
								letterSpacing: '0.06em',
								textTransform: 'uppercase',
								color: 'text.secondary',
								mb: 0.35,
								mt: 1,
							}}
						>
							{t('showThemeToggleInHeader')}
						</Typography>
						<Typography sx={profileItemValueSx}>
							{showThemeToggle ?? true ? t('yes') : t('no')}
						</Typography>
					</Box>
					<CustomButton
						onClick={handleEditTheme}
						buttonText={t('changeThemeSettings')}
						sx={profileItemActionSx}
					/>
				</Box>
			)}
		</Box>
	);
}
