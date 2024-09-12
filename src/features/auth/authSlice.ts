import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';
import * as api from './api';
import AuthState from './types/AuthState';
import Credentials from './types/Credentials';
import RegisterData from './types/RegisterData';

const initialState: AuthState = {
	authChecked: false,
	user: undefined,
	loginFormError: undefined,
	registerFormError: undefined,
	error: undefined,
};

export const getProfile = createAsyncThunk('api/users/my/profile', async () => api.getProfile());

export const login = createAsyncThunk('login', async (credentials: Credentials) => {
	if (!credentials.email.trim() || !credentials.password.trim()) {
		throw new Error(t('error.emptyFields'));
	}
	return api.login(credentials);
});

export const register = createAsyncThunk('auth/register', async (data: RegisterData) => {
	if (data.password !== data.passwordRepeat) {
		throw new Error(t('error.enteredPasswordsNotEqual'));
	}
	if (!data.email.trim() || !data.password.trim()) {
		throw new Error(t('error.emptyFields'));
	}
	return api.register(data);
});

export const logout = createAsyncThunk('logout', api.logout);

export const editEmail = createAsyncThunk(
	'api/users/my/profile/editEmail',
	async ({ newEmail }: { newEmail: string }) => {
		if (!newEmail.trim()) {
			throw new Error(t('error.emailCannotBeEmpty'));
		}
		return api.editEmail({ newEmail });
	}
);

export const editPassword = createAsyncThunk(
	'api/users/my/profile/editPassword',
	async ({
		currentPassword,
		newPassword,
		newPasswordRepeat,
	}: {
		currentPassword: string;
		newPassword: string;
		newPasswordRepeat: string;
	}) => {
		if (!currentPassword || !newPassword || !newPasswordRepeat) {
			throw new Error(t('error.actualOrNewPasswordsCannotBeEmpty'));
		}
		if (newPassword !== newPasswordRepeat) {
			throw new Error(t('error.newAndRepeatPasswordsNotEqual'));
		}
		return api.editPassword({ currentPassword, newPassword });
	}
);

export const editUsername = createAsyncThunk(
	'api/users/my/profile/editUsername',
	async ({ newUsername }: { newUsername: string }) => {
		if (!newUsername.trim()) {
			throw new Error(t('error.usernameCannotBeEmpty'));
		}
		return api.editUsername({ newUsername });
	}
);

export const uploadFile = createAsyncThunk(
	'api/files/upload',
	async ({ file, folder }: { file: File; folder?: string }) => api.uploadFile({ file, folder })
);

export const uploadUserAvatar = createAsyncThunk(
	'api/files/upload/avatars',
	async ({ file }: { file: File }) => api.uploadUserAvatar({ file })
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		resetLoginFormError: (state) => {
			state.loginFormError = undefined;
		},
		resetRegisterFormError: (state) => {
			state.registerFormError = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getProfile.fulfilled, (state, action) => {
				state.authChecked = true;
				state.user = action.payload;
				state.error = undefined;
			})
			.addCase(getProfile.rejected, (state, action) => {
				state.authChecked = true;
				state.user = undefined;
				state.error = action.error.message;
			})

			.addCase(login.fulfilled, (state) => {
				state.loginFormError = undefined;
			})
			.addCase(login.rejected, (state, action) => {
				state.loginFormError = action.error.message;
			})

			.addCase(logout.fulfilled, (state) => {
				state.user = undefined;
				state.authChecked = true;
			})

			.addCase(register.fulfilled, (state, action) => {
				state.user = action.payload;
				state.registerFormError = undefined;
			})
			.addCase(register.rejected, (state, action) => {
				state.registerFormError = action.error.message;
			})

			.addCase(editEmail.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(editEmail.rejected, (state, action) => {
				state.error = action.error.message;
			})

			.addCase(editUsername.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(editUsername.rejected, (state, action) => {
				state.error = action.error.message;
			})

			.addCase(editPassword.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(editPassword.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetLoginFormError, resetRegisterFormError } = authSlice.actions;

export default authSlice.reducer;
