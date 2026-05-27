/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { apiFetch } from '../../shared/apiClient';
import Credentials from './types/Credentials';
import RegisterData from './types/RegisterData';
import ResponseDto from './types/ResponseDto';
import User from './types/User';

function authApiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function getProfile(): Promise<User> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/users/my/profile`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/users/my/profile';
	}
	const result = await apiFetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function login(credentials: Credentials): Promise<User> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/login`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/login';
	}
	const body = new URLSearchParams({
		username: credentials.email,
		password: credentials.password,
		'remember-me': 'true',
	});
	const result = await apiFetch(`${url}`, {
		method: 'POST',
		mode: 'cors',
		body: body.toString(),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function register(data: RegisterData): Promise<User> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/register`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/register';
	}
	const result = await apiFetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify(data),
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

export async function logout(): Promise<void> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/logout`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/logout';
	}
	await apiFetch(`${url}`, {
		method: 'PUT',
	});
}

export async function editEmail({ newEmail }: { newEmail: string }): Promise<User> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/users/my/profile/email`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/users/my/profile/email';
	}
	const result = await apiFetch(`${url}`, {
		method: 'PUT',
		body: JSON.stringify({ newEmail }),
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

export async function editPassword({
	currentPassword,
	newPassword,
}: {
	currentPassword: string;
	newPassword: string;
}): Promise<User> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/users/my/profile/password`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/users/my/profile/password';
	}
	const result = await apiFetch(`${url}`, {
		method: 'PUT',
		body: JSON.stringify({ currentPassword, newPassword }),
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

export async function editUsername({ newUsername }: { newUsername: string }): Promise<User> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/users/my/profile/username`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/users/my/profile/username';
	}
	const result = await apiFetch(`${url}`, {
		method: 'PUT',
		body: JSON.stringify({ newUsername }),
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

export async function uploadFile({
	file,
	folder,
}: {
	file: File;
	folder?: string;
}): Promise<ResponseDto> {
	const formData = new FormData();
	formData.append('file', file);
	if (folder) {
		formData.append('folder', folder);
	}
	let url = `${(import.meta.env.VITE_PRODUCT_SERVER as string) || ''}/api/files/upload`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/files/upload';
	}
	const result = await apiFetch(`${url}`, {
		method: 'POST',
		body: formData,
	});

	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function uploadUserAvatar({ file }: { file: File }): Promise<ResponseDto> {
	const formData = new FormData();
	formData.append('file', file);
	let url = `${(import.meta.env.VITE_PRODUCT_SERVER as string) || ''}/api/files/upload/avatars`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/files/upload/avatars';
	}
	const result = await apiFetch(`${url}`, {
		method: 'POST',
		body: formData,
	});

	if (result.status >= 400) {
		if (result.status === 413) {
			throw new Error('error.fileSizeLimit');
		}
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function confirmEmail(token: string): Promise<void> {
	const result = await apiFetch(
		`${authApiUrl('/api/auth/confirm-email')}?token=${encodeURIComponent(token)}`
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}

export async function forgotPassword(email: string): Promise<void> {
	const result = await apiFetch(`${authApiUrl('/api/auth/forgot-password')}`, {
		method: 'POST',
		body: JSON.stringify({ email }),
		headers: { 'Content-Type': 'application/json' },
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}

export async function resetPassword(data: {
	token: string;
	password: string;
	passwordRepeat: string;
}): Promise<void> {
	const result = await apiFetch(`${authApiUrl('/api/auth/reset-password')}`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: { 'Content-Type': 'application/json' },
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}

export async function resendVerificationEmail(email: string): Promise<void> {
	const result = await apiFetch(`${authApiUrl('/api/auth/resend-verification')}`, {
		method: 'POST',
		body: JSON.stringify({ email }),
		headers: { 'Content-Type': 'application/json' },
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}
