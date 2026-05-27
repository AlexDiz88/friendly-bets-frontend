import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import * as api from './api';
import CalendarsState from './types/CalendarsState';
import NewCalendar from './types/NewCalendar';

const initialState: CalendarsState = {
	allCalendarNodes: [],
	calendarNodesHasBets: [],
	actualCalendarNodeBets: [],
	calendarNode: undefined,
	betsByCalendarNode: undefined,
	betsByCalendarNodeId: {},
	gameweeksOverviewLoadedAt: undefined,
	gameweeksOverviewSeasonId: undefined,
	gameweeksBetsLoading: false,
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

export const fetchGameweeksOverview = createAsyncThunk(
	'calendars/fetchGameweeksOverview',
	async ({
		seasonId,
		calendarNodeId,
	}: {
		seasonId: string;
		calendarNodeId?: string;
	}) => api.getGameweeksOverview(seasonId, calendarNodeId)
);

export const fetchGameweekBets = createAsyncThunk(
	'calendars/fetchGameweekBets',
	async (calendarNodeId: string) => api.getBetsByCalendarNode(calendarNodeId)
);

export const getActualCalendarNodeBets = createAsyncThunk(
	'calendars/getActualCalendarNodeBets',
	async (seasonId: string) => api.getActualCalendarNodeBets(seasonId)
);

export const createCalendarNode = createAsyncThunk(
	'calendars/createCalendarNode',
	async (newCalendarNode: NewCalendar) => api.createCalendarNode(newCalendarNode)
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
		invalidateGameweeksOverview: (state) => {
			state.gameweeksOverviewLoadedAt = undefined;
		},
		invalidateGameweeksBetsCache: (state) => {
			state.betsByCalendarNodeId = {};
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
			.addCase(fetchGameweeksOverview.pending, (state) => {
				state.error = undefined;
			})
			.addCase(fetchGameweeksOverview.fulfilled, (state, action) => {
				state.calendarNodesHasBets = action.payload.calendarNodes;
				state.gameweeksOverviewLoadedAt = Date.now();
				state.gameweeksOverviewSeasonId = action.meta.arg.seasonId;
				if (action.meta.arg.calendarNodeId && action.payload.bets) {
					state.betsByCalendarNodeId[action.meta.arg.calendarNodeId] = action.payload.bets;
					state.gameweeksBetsLoading = false;
				}
			})
			.addCase(fetchGameweeksOverview.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(fetchGameweekBets.pending, (state) => {
				state.gameweeksBetsLoading = true;
			})
			.addCase(fetchGameweekBets.fulfilled, (state, action) => {
				state.betsByCalendarNodeId[action.meta.arg] = action.payload;
				state.gameweeksBetsLoading = false;
			})
			.addCase(fetchGameweekBets.rejected, (state, action) => {
				state.gameweeksBetsLoading = false;
				state.error = action.error.message;
			})
			.addCase(getActualCalendarNodeBets.fulfilled, (state, action) => {
				state.actualCalendarNodeBets = action.payload.bets;
			})
			.addCase(getActualCalendarNodeBets.rejected, (state, action) => {
				state.error = action.error.message;
				state.actualCalendarNodeBets = [];
			})
			.addCase(createCalendarNode.fulfilled, (state, action) => {
				state.allCalendarNodes = [action.payload, ...state.allCalendarNodes].sort((a, b) =>
					dayjs(a.startDate).isBefore(dayjs(b.startDate)) ? 1 : -1
				);
				state.gameweeksOverviewLoadedAt = undefined;
			})
			.addCase(createCalendarNode.rejected, (state, action) => {
				state.error = action.error.message;
				state.calendarNode = undefined;
			})
			.addCase(getBetsByCalendarNode.fulfilled, (state, action) => {
				state.betsByCalendarNode = action.payload;
				state.betsByCalendarNodeId[action.meta.arg] = action.payload;
			})
			.addCase(getBetsByCalendarNode.rejected, (state, action) => {
				state.error = action.error.message;
				state.betsByCalendarNode = undefined;
			})
			.addCase(deleteCalendarNode.fulfilled, (state, action) => {
				state.allCalendarNodes = state.allCalendarNodes.filter((n) => n.id !== action.payload.id);
				state.gameweeksOverviewLoadedAt = undefined;
			})
			.addCase(deleteCalendarNode.rejected, (state, action) => {
				state.error = action.error.message;
				state.calendarNode = undefined;
			});
	},
});

export const { resetError, invalidateGameweeksOverview, invalidateGameweeksBetsCache } =
	calendarsSlice.actions;

export default calendarsSlice.reducer;
