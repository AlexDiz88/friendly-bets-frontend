/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import i18n from 'i18next';
import * as api from './api';
import LanguagesState from './types/LanguagesState';

const initialState: LanguagesState = {
	language: i18n.language || 'ru',
	error: undefined,
};

export const changeLanguageAsync = createAsyncThunk(
	'language/changeLanguage',
	async (lng: string, { rejectWithValue }) => {
		try {
			await i18n.changeLanguage(lng);
			return lng;
		} catch (error) {
			return rejectWithValue('Failed to change language');
		}
	}
);

export const saveUserLanguageAsync = createAsyncThunk(
	'language/saveUserLanguage',
	async (lng: string) => {
		const user = await api.changeLanguage(lng);
		await i18n.changeLanguage(lng);
		return user;
	}
);

const languageSlice = createSlice({
	name: 'language',
	initialState,
	reducers: {
		resetError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(changeLanguageAsync.fulfilled, (state, action) => {
				state.language = action.payload;
			})
			.addCase(changeLanguageAsync.rejected, (state, action) => {
				state.error = action.payload as string;
			})
			.addCase(saveUserLanguageAsync.fulfilled, (state, action) => {
				state.language = action.payload.language || 'ru';
			})
			.addCase(saveUserLanguageAsync.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export default languageSlice.reducer;
