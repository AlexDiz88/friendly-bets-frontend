/* eslint-disable @typescript-eslint/restrict-template-expressions */

import User from '../auth/types/User';

export async function changeLanguage(language: string): Promise<User> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/users/my/profile/language`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/users/my/profile/language`;
	}
	const result = await fetch(`${url}`, {
		method: 'PUT',
		body: language,
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
