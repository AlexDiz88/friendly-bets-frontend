import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';
import PlayersStatsState from './types/PlayersStatsState';

const initialState: PlayersStatsState = {
  playersStats: [],
  error: undefined,
};

// TODO добавить GET методы на getAllByLeagueInSeason,
// TODO getAllBySeason, getAllByPlayerInSeason, getAllByPlayerByLeagueInSeason

export const getPlayersStatsBySeason = createAsyncThunk(
  'stats/getPlayersStatsBySeason',
  async (seasonId: string) => api.getPlayersStatsBySeason(seasonId)
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
      .addCase(getPlayersStatsBySeason.fulfilled, (state, action) => {
        state.playersStats = action.payload.playersStats;
      })
      .addCase(getPlayersStatsBySeason.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { resetError } = statsSlice.actions;

export default statsSlice.reducer;
