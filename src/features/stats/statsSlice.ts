import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';
import PlayersStatsState from './types/PlayersStatsState';

const initialState: PlayersStatsState = {
	playersStats: [],
	playersStatsByLeague: [],
	playersStatsByTeams: [],
	statsByTeams: undefined,
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

export const getAllStatsByTeamsInSeason = createAsyncThunk(
	'stats/getAllStatsByTeamsInSeason',
	async (seasonId: string) => api.getAllStatsByTeamsInSeason(seasonId)
);

export const getStatsByTeams = createAsyncThunk(
	'stats/getStatsByTeams',
	async ({ seasonId, leagueId, userId }: { seasonId: string; leagueId: string; userId: string }) =>
		api.getStatsByTeams(seasonId, leagueId, userId)
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
			.addCase(getAllStatsByTeamsInSeason.fulfilled, (state, action) => {
				state.playersStatsByTeams = action.payload.playersStatsByTeams;
			})
			.addCase(getAllStatsByTeamsInSeason.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(getStatsByTeams.fulfilled, (state, action) => {
				state.statsByTeams = action.payload.statsByTeams;
			})
			.addCase(getStatsByTeams.rejected, (state, action) => {
				state.statsByTeams = undefined;
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
