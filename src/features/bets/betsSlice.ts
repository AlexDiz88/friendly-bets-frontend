import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BetsState from './types/BetsState';
import * as api from './api';
import NewBet from './types/NewBet';

const initialState: BetsState = {
	bet: undefined,
	bets: [],
	error: undefined,
};

export const getUserBets = createAsyncThunk('bets/getAllBets', async () => api.getAllBets());

export const updateBet = createAsyncThunk(
	'bets/updateBet',
	async ({ betId, newBet }: { betId: string; newBet: NewBet }) => {
		if (!newBet.betTitle) {
			throw new Error('Отсутствует ставка');
		}
		// TODO доделать проверки
		return api.updateBet(betId, newBet);
	}
);

export const deleteBet = createAsyncThunk(
	'bets/deleteBet',
	async ({ betId, seasonId, leagueId }: { betId: string; seasonId: string; leagueId: string }) => {
		if (!betId) {
			throw new Error('Отсутствует ID ставки');
		}
		return api.deleteBet(betId, seasonId, leagueId);
	}
);

const betsSlice = createSlice({
	name: 'bets',
	initialState,
	reducers: {
		resetError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserBets.fulfilled, (state, action) => {
				state.bets = action.payload.bets;
			})
			.addCase(getUserBets.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateBet.fulfilled, (state, action) => {
				state.bet = action.payload;
			})
			.addCase(updateBet.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(deleteBet.fulfilled, (state, action) => {
				state.bet = action.payload;
			})
			.addCase(deleteBet.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetError } = betsSlice.actions;

export default betsSlice.reducer;
