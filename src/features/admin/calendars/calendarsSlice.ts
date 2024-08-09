import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';
import CalendarsState from './types/CalendarsState';
import NewCalendar from './types/NewCalendar';

const initialState: CalendarsState = {
	allCalendarNodes: [],
	calendarNodesHasBets: [],
	actualCalendarNodeBets: [],
	calendarNode: undefined,
	betsByCalendarNode: undefined,
	error: undefined,
};

export const getAllSeasonCalendarNodes = createAsyncThunk(
	'calendars/getAllSeasonCalendarNodes',
	async (seasonId: string) => api.getAllSeasonCalendarNodes(seasonId)
);

export const getSeasonCalendarHasBetsNodes = createAsyncThunk(
	'calendars/getSeasonCalendarHasBetsNodes',
	async (seasonId: string) => api.getSeasonCalendarHasBetsNodes(seasonId)
);

export const getActualCalendarNodeBets = createAsyncThunk(
	'calendars/getActualCalendarNodeBets',
	async (seasonId: string) => api.getActualCalendarNodeBets(seasonId)
);

export const createCalendarNode = createAsyncThunk(
	'calendars/createCalendarNode',
	async (newCalendarNode: NewCalendar) => api.createCalendarNode(newCalendarNode)
);

export const addBetToCalendarNode = createAsyncThunk(
	'calendars/addBetToCalendarNode',
	async ({
		betId,
		calendarNodeId,
		leagueId,
	}: {
		betId: string;
		calendarNodeId: string;
		leagueId: string;
	}) => api.addBetToCalendarNode(betId, calendarNodeId, leagueId)
);

export const getBetsByCalendarNode = createAsyncThunk(
	'calendars/getBetsByCalendarNode',
	async (calendarNodeId: string) => api.getBetsByCalendarNode(calendarNodeId)
);

export const deleteCalendarNode = createAsyncThunk(
	'calendars/deleteCalendarNode',
	async (calendarNodeId: string) => api.deleteCalendarNode(calendarNodeId)
);

const calendarsSlice = createSlice({
	name: 'calendars',
	initialState,
	reducers: {
		resetError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllSeasonCalendarNodes.fulfilled, (state, action) => {
				state.allCalendarNodes = action.payload.calendarNodes;
			})
			.addCase(getAllSeasonCalendarNodes.rejected, (state, action) => {
				state.error = action.error.message;
				state.allCalendarNodes = [];
			})
			.addCase(getSeasonCalendarHasBetsNodes.fulfilled, (state, action) => {
				state.calendarNodesHasBets = action.payload.calendarNodes;
			})
			.addCase(getSeasonCalendarHasBetsNodes.rejected, (state, action) => {
				state.error = action.error.message;
				state.calendarNodesHasBets = [];
			})
			.addCase(getActualCalendarNodeBets.fulfilled, (state, action) => {
				state.actualCalendarNodeBets = action.payload.bets;
			})
			.addCase(getActualCalendarNodeBets.rejected, (state, action) => {
				state.error = action.error.message;
				state.actualCalendarNodeBets = [];
			})
			.addCase(createCalendarNode.fulfilled, (state, action) => {
				state.calendarNode = action.payload;
				state.allCalendarNodes.unshift(action.payload);
			})
			.addCase(createCalendarNode.rejected, (state, action) => {
				state.error = action.error.message;
				state.calendarNode = undefined;
			})
			.addCase(addBetToCalendarNode.fulfilled, (state, action) => {
				state.calendarNode = action.payload;
			})
			.addCase(addBetToCalendarNode.rejected, (state, action) => {
				state.error = action.error.message;
				state.calendarNode = undefined;
			})
			.addCase(getBetsByCalendarNode.fulfilled, (state, action) => {
				state.betsByCalendarNode = action.payload;
			})
			.addCase(getBetsByCalendarNode.rejected, (state, action) => {
				state.error = action.error.message;
				state.betsByCalendarNode = undefined;
			})
			.addCase(deleteCalendarNode.fulfilled, (state, action) => {
				state.allCalendarNodes = state.allCalendarNodes.filter((n) => n.id !== action.payload.id);
			})
			.addCase(deleteCalendarNode.rejected, (state, action) => {
				state.error = action.error.message;
				state.calendarNode = undefined;
			});
	},
});

export const { resetError } = calendarsSlice.actions;

export default calendarsSlice.reducer;
