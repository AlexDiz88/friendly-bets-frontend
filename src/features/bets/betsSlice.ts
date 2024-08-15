import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';
import BetsState from './types/BetsState';
import NewBet from './types/NewBet';
import NewEmptyBet from './types/NewEmptyBet';
import NewGameResult from './types/NewGameResult';
import UpdatedBet from './types/UpdatedBet';

const initialState: BetsState = {
	bet: undefined,
	openedBets: [],
	completedBets: [],
	allBets: [],
	totalPages: 1,
	error: undefined,
};

export const addBet = createAsyncThunk('bets/addBet', async ({ newBet }: { newBet: NewBet }) => {
	if (!newBet.betTitle) {
		throw new Error('Отсутствует ставка');
	}
	// TODO доделать проверки
	return api.addBet(newBet);
});

export const addEmptyBet = createAsyncThunk(
	'bets/addEmptyBet',
	async ({ newEmptyBet }: { newEmptyBet: NewEmptyBet }) => api.addEmptyBet(newEmptyBet)
);

export const setBetResult = createAsyncThunk(
	'bets/setBetResult',
	async ({ betId, newGameResult }: { betId: string; newGameResult: NewGameResult }) =>
		api.setBetResult(betId, newGameResult)
);

export const getOpenedBets = createAsyncThunk(
	'bets/getOpenedBets',
	async ({ seasonId }: { seasonId: string }) => api.getOpenedBets(seasonId)
);

export const getCompletedBets = createAsyncThunk(
	'bets/getCompletedBets',
	async ({
		seasonId,
		playerId,
		leagueId,
		pageSize,
		pageNumber,
	}: {
		seasonId: string;
		playerId?: string;
		leagueId?: string;
		pageSize?: string;
		pageNumber?: number;
	}) => api.getCompletedBets(seasonId, playerId, leagueId, pageSize, pageNumber)
);

export const getAllBets = createAsyncThunk(
	'bets/getAllBets',
	async ({
		seasonId,
		pageSize,
		pageNumber,
	}: {
		seasonId: string;
		pageSize?: string;
		pageNumber?: number;
	}) => api.getAllBets(seasonId, pageSize, pageNumber)
);

export const updateBet = createAsyncThunk(
	'bets/updateBet',
	async ({ betId, editedBet }: { betId: string; editedBet: UpdatedBet }) =>
		api.updateBet(betId, editedBet)
);

export const deleteBet = createAsyncThunk(
	'bets/deleteBet',
	async ({
		betId,
		seasonId,
		leagueId,
		calendarNodeId,
	}: {
		betId: string;
		seasonId: string;
		leagueId: string;
		calendarNodeId: string;
	}) => api.deleteBet(betId, seasonId, leagueId, calendarNodeId)
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
			.addCase(addBet.fulfilled, (state, action) => {
				state.bet = action.payload;
			})
			.addCase(addBet.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(addEmptyBet.fulfilled, (state, action) => {
				state.bet = action.payload;
			})
			.addCase(addEmptyBet.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(setBetResult.fulfilled, (state, action) => {
				state.openedBets = state.openedBets.filter((bet) => bet.id !== action.payload.id);
			})
			.addCase(setBetResult.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(getOpenedBets.fulfilled, (state, action) => {
				state.openedBets = action.payload.bets;
			})
			.addCase(getOpenedBets.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(getCompletedBets.fulfilled, (state, action) => {
				state.completedBets = action.payload.bets;
				state.totalPages = action.payload.totalPages;
			})
			.addCase(getCompletedBets.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(getAllBets.fulfilled, (state, action) => {
				state.allBets = action.payload.bets;
				state.totalPages = action.payload.totalPages;
			})
			.addCase(getAllBets.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateBet.fulfilled, (state, action) => {
				state.allBets = state.allBets.map((bet) => {
					if (bet.id === action.payload.id) {
						return action.payload;
					}
					return bet;
				});
			})
			.addCase(updateBet.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(deleteBet.fulfilled, (state, action) => {
				state.allBets = state.allBets.filter((bet) => bet.id !== action.payload.id);
			})
			.addCase(deleteBet.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetError } = betsSlice.actions;

export default betsSlice.reducer;
