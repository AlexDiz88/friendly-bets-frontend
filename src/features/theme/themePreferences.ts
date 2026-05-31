import BrightnessAutoOutlined from '@mui/icons-material/BrightnessAutoOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeSettingsPayload {
	themePreference: ThemePreference;
	showThemeToggle: boolean;
}

export function normalizeThemePreference(value: string | undefined | null): ThemePreference {
	if (value === 'dark' || value === 'system') {
		return value;
	}
	return 'light';
}

export function resolveThemeMode(preference: ThemePreference, systemPrefersDark: boolean): 'light' | 'dark' {
	if (preference === 'system') {
		return systemPrefersDark ? 'dark' : 'light';
	}
	return preference;
}

export function themePreferenceLabelKey(preference: ThemePreference): string {
	switch (preference) {
		case 'dark':
			return 'themePreferenceDark';
		case 'system':
			return 'themePreferenceSystem';
		default:
			return 'themePreferenceLight';
	}
}

export function themePreferenceIcon(preference: ThemePreference): typeof LightModeOutlined {
	switch (preference) {
		case 'dark':
			return DarkModeOutlined;
		case 'system':
			return BrightnessAutoOutlined;
		default:
			return LightModeOutlined;
	}
}
