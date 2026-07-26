import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import { getProfile } from '../../features/auth/authSlice';
import { saveUserTimezoneAsync } from '../../features/timezone/timezoneSlice';
import {
	DEFAULT_USER_TIMEZONE,
	SUPPORTED_USER_TIMEZONES,
	formatUtcOffsetLabel,
	resolveUserTimeZone,
	timeZoneCityI18nKey,
} from '../../shared/userTimeZones';
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

export default function ProfileTimezone({
	timezone,
}: {
	timezone: string | undefined;
}): JSX.Element {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const current = resolveUserTimeZone(timezone);
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(current);

	const optionLabel = useCallback(
		(tz: string): string => `${t(timeZoneCityI18nKey(tz))} (${formatUtcOffsetLabel(tz)})`,
		[t]
	);

	const handleSave = useCallback(async () => {
		const dispatchResult = await dispatch(saveUserTimezoneAsync(draft));
		if (saveUserTimezoneAsync.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('timezoneSuccessfullyChanged') }));
			dispatch(getProfile());
			setEditing(false);
		}
		if (saveUserTimezoneAsync.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, draft, t]);

	const handleEdit = (): void => {
		setDraft(resolveUserTimeZone(timezone) || DEFAULT_USER_TIMEZONE);
		setEditing(true);
	};

	return (
		<Box sx={profileItemCardSx}>
			{editing ? (
				<Box sx={profileEditPanelSx}>
					<Select
						fullWidth
						size="small"
						value={SUPPORTED_USER_TIMEZONES.includes(draft) ? draft : DEFAULT_USER_TIMEZONE}
						onChange={(e: SelectChangeEvent<string>) => setDraft(e.target.value)}
						sx={profileFullWidthFieldSx}
					>
						{SUPPORTED_USER_TIMEZONES.map((tz) => (
							<MenuItem key={tz} value={tz}>
								{optionLabel(tz)}
							</MenuItem>
						))}
					</Select>
					<ProfileEditActions
						onSave={() => void handleSave()}
						onCancel={() => setEditing(false)}
						saveText={t('btnText.accept')}
					/>
				</Box>
			) : (
				<Box sx={profileItemRowSx}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography sx={profileItemLabelSx}>{t('timezoneLabel')}</Typography>
						<Box sx={profileItemValueRowSx}>
							<Typography sx={profileItemValueSx}>{optionLabel(current)}</Typography>
						</Box>
					</Box>
					<CustomButton
						onClick={handleEdit}
						buttonText={t('selectTimezoneRegion')}
						sx={profileItemActionSx}
					/>
				</Box>
			)}
		</Box>
	);
}
