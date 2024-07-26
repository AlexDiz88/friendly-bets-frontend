import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';
import TeamsState from './types/TeamsState';

const initialState: TeamsState = {
	teams: [],
	leagueTeams: [],
	error: undefined,
};

export const createTeam = createAsyncThunk(
	'teams/createTeam',
	async ({
		fullTitleRu,
		fullTitleEn,
		country,
	}: {
		fullTitleRu: string;
		fullTitleEn: string;
		country: string;
	}) => {
		if (!fullTitleRu.trim() || !fullTitleEn.trim()) {
			throw new Error('Названия команды (RU/EN) не должны быть пустыми');
		}
		if (!country.trim()) {
			throw new Error('Страна команды не должна быть пустой');
		}
		return api.createTeam(fullTitleRu, fullTitleEn, country);
	}
);

export const getAllTeams = createAsyncThunk('teams/getAllTeams', async () => api.getAllTeams());

export const getLeagueTeams = createAsyncThunk(
	'teams/getLeagueTeams',
	async ({ leagueId }: { leagueId: string }) => api.getLeagueTeams(leagueId)
);

const teamsSlice = createSlice({
	name: 'teams',
	initialState,
	reducers: {
		resetError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createTeam.fulfilled, (state, action) => {
				state.teams.push(action.payload);
			})
			.addCase(createTeam.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(getAllTeams.fulfilled, (state, action) => {
				state.teams = action.payload.teams;
			})
			.addCase(getAllTeams.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(getLeagueTeams.fulfilled, (state, action) => {
				state.leagueTeams = action.payload.teams;
			})
			.addCase(getLeagueTeams.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetError } = teamsSlice.actions;

export default teamsSlice.reducer;
