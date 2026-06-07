import { apiFetch } from '../../shared/apiClient';
import User from '../auth/types/User';
import type { ThemeSettingsPayload } from './themePreferences';

function themeSettingsUrl(): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return '/api/users/my/profile/theme-settings';
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}/api/users/my/profile/theme-settings`;
}

export async function changeThemeSettings(payload: ThemeSettingsPayload): Promise<User> {
	const result = await apiFetch(themeSettingsUrl(), {
		method: 'PUT',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
