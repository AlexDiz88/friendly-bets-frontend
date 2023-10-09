import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';
import PlayersStatsState from './types/PlayersStatsState';

const initialState: PlayersStatsState = {
	playersStats: [],
	playersStatsByLeague: [],
	error: undefined,
};

// TODO добавить GET методы на getAllByLeagueInSeason,
// TODO getAllBySeason, getAllByPlayerInSeason, getAllByPlayerByLeagueInSeason

export const getAllPlayersStatsBySeason = createAsyncThunk(
	'stats/getAllPlayersStatsBySeason',
	async (seasonId: string) => api.getAllPlayersStatsBySeason(seasonId)
);

export const getAllPlayersStatsByLeagues = createAsyncThunk(
	'stats/getPlayersStatsByLeagues',
	async (seasonId: string) => api.getAllPlayersStatsByLeagues(seasonId)
);

export const playersStatsFullRecalculation = createAsyncThunk(
	'stats/playersStatsFullRecalculation',
	async (seasonId: string) => api.playersStatsFullRecalculation(seasonId)
);

const statsSlice = createSlice({
	name: 'stats',
	initialState,
	reducers: {
		resetError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllPlayersStatsBySeason.fulfilled, (state, action) => {
				state.playersStats = action.payload.playersStats;
			})
			.addCase(getAllPlayersStatsBySeason.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(getAllPlayersStatsByLeagues.fulfilled, (state, action) => {
				state.playersStatsByLeague = action.payload.playersStatsByLeagues;
			})
			.addCase(getAllPlayersStatsByLeagues.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(playersStatsFullRecalculation.fulfilled, (state, action) => {
				state.playersStats = action.payload.playersStats;
			})
			.addCase(playersStatsFullRecalculation.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetError } = statsSlice.actions;

export default statsSlice.reducer;
