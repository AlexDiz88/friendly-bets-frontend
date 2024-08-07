import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import languageSlice from '../components/utils/languageSlice';
import seasonsSlice from '../features/admin/seasons/seasonsSlice';
import teamsSlice from '../features/admin/teams/teamsSlice';
import authSlice from '../features/auth/authSlice';
import betsSlice from '../features/bets/betsSlice';
import statsSlice from '../features/stats/statsSlice';

export const store = configureStore({
	reducer: {
		auth: authSlice,
		seasons: seasonsSlice,
		teams: teamsSlice,
		bets: betsSlice,
		playersStats: statsSlice,
		language: languageSlice,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
