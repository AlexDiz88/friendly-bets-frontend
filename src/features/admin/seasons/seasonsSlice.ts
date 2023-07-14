import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SeasonsState from './types/SeasonsState';
import * as api from './api';

const initialState: SeasonsState = {
  seasons: [],
  statuses: [],
  error: undefined,
};

export const addSeason = createAsyncThunk(
  'seasons/addSeason',
  async ({
    title,
    betCountPerMatchDay,
  }: {
    title: string;
    betCountPerMatchDay: number;
  }) => {
    if (!title.trim()) {
      throw new Error('Название сезона не должно быть пустым');
    }
    if (betCountPerMatchDay && betCountPerMatchDay <= 0) {
      throw new Error('Количество ставок на игровой день должно быть больше 0');
    }
    return api.addSeason(title, betCountPerMatchDay);
  }
);

export const getSeasons = createAsyncThunk('seasons/getSeasons', async () =>
  api.getSeasons()
);

export const getSeasonStatusList = createAsyncThunk(
  'seasons/getSeasonStatusList',
  async () => api.getSeasonStatusList()
);

export const changeSeasonStatus = createAsyncThunk(
  'seasons/changeSeasonStatus',
  async ({ title, status }: { title: string; status: string }) => {
    if (!title.trim()) {
      throw new Error('Название сезона не должно быть пустым');
    }
    return api.changeSeasonStatus(title, status);
  }
);

const seasonsSlice = createSlice({
  name: 'seasons',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSeason.fulfilled, (state, action) => {
        state.seasons.push(action.payload);
      })
      .addCase(addSeason.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getSeasons.fulfilled, (state, action) => {
        state.seasons = action.payload.seasons;
      })
      .addCase(getSeasons.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getSeasonStatusList.fulfilled, (state, action) => {
        state.statuses = action.payload;
      })
      .addCase(getSeasonStatusList.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(changeSeasonStatus.fulfilled, (state, action) => {
        state.seasons = state.seasons.map((season) =>
          season.id === action.payload.id ? action.payload : season
        );
      })
      .addCase(changeSeasonStatus.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { resetError } = seasonsSlice.actions;

export default seasonsSlice.reducer;
