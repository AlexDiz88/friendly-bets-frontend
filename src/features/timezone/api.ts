import { apiFetch } from '../../shared/apiClient';
import type User from '../auth/types/User';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function changeTimezone(timezone: string): Promise<User> {
	const result = await apiFetch(apiUrl('/api/users/my/profile/timezone'), {
		method: 'PUT',
		body: JSON.stringify({ timezone }),
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
