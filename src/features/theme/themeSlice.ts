import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api';
import type { ThemeSettingsPayload } from './themePreferences';

export const saveUserThemeSettingsAsync = createAsyncThunk(
	'theme/saveUserThemeSettings',
	async (payload: ThemeSettingsPayload) => api.changeThemeSettings(payload)
);
