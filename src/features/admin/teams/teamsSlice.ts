import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';
import { UpdateTeamPayload } from './teamFormUtils';
import NewTeam from './types/NewTeam';
import Team from './types/Team';
import TeamsState from './types/TeamsState';

const initialState: TeamsState = {
	teams: [],
	leagueTeams: [],
	error: undefined,
};

export const createTeam = createAsyncThunk('teams/createTeam', async (payload: NewTeam) => {
	if (!payload.title.trim()) {
		throw new Error('teamTitleRequired');
	}
	if (!payload.country.trim()) {
		throw new Error('Страна команды не должна быть пустой');
	}
	return api.createTeam(payload);
});

export const getAllTeams = createAsyncThunk('teams/getAllTeams', async () => api.getAllTeams());

export const getLeagueTeams = createAsyncThunk(
	'teams/getLeagueTeams',
	async ({ leagueId }: { leagueId: string }) => api.getLeagueTeams(leagueId)
);

export const updateTeam = createAsyncThunk(
	'teams/updateTeam',
	async ({ teamId, payload }: { teamId: string; payload: UpdateTeamPayload }) =>
		api.updateTeam(teamId, payload)
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
			})
			.addCase(updateTeam.fulfilled, (state, action) => {
				const idx = state.teams.findIndex((t) => t.id === action.payload.id);
				if (idx >= 0) {
					state.teams[idx] = action.payload;
				}
				state.leagueTeams = state.leagueTeams.map((t) =>
					t.id === action.payload.id ? action.payload : t
				);
			})
			.addCase(updateTeam.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetError } = teamsSlice.actions;

export default teamsSlice.reducer;
