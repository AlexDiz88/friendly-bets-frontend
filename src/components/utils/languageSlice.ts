import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import i18n from 'i18next';

export const changeLanguageAsync = createAsyncThunk(
	'language/changeLanguage',
	async (lng: string) => {
		await i18n.changeLanguage(lng);
		return lng;
	}
);

const languageSlice = createSlice({
	name: 'language',
	initialState: i18n.language || 'ru',
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(changeLanguageAsync.fulfilled, (state, action) => {
			return action.payload;
		});
	},
});

export default languageSlice.reducer;
