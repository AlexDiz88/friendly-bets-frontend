import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SeasonsState from './types/SeasonsState';
import * as api from './api';
import NewBet from '../../bets/types/NewBet';

const initialState: SeasonsState = {
  seasons: [],
  statuses: [],
  activeSeason: null,
  scheduledSeason: null,
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
  async ({ id, status }: { id: string; status: string }) =>
    api.changeSeasonStatus(id, status)
);

export const getActiveSeason = createAsyncThunk(
  'seasons/getActiveSeason',
  async () => api.getActiveSeason()
);

export const getScheduledSeason = createAsyncThunk(
  'seasons/getScheduledSeason',
  async () => api.getScheduledSeason()
);

export const registrationInSeason = createAsyncThunk(
  'seasons/registrationInSeason',
  async ({ seasonId }: { seasonId: string }) => api.registrationInSeason(seasonId)
);

// export const getLeaguesBySeason = createAsyncThunk(
//   'seasons/getLeaguesBySeason',
//   async ({ seasonId }: { seasonId: string }) => api.getLeaguesBySeason(seasonId)
// );

export const addLeagueToSeason = createAsyncThunk(
  'seasons/addLeagueToSeason',
  async ({
    seasonId,
    displayNameRu,
    displayNameEn,
  }: {
    seasonId: string;
    displayNameRu: string;
    displayNameEn: string;
  }) => {
    if (!displayNameRu.trim() || !displayNameEn.trim()) {
      throw new Error('Название лиги не должно быть пустым');
    }
    return api.addLeagueToSeason(seasonId, displayNameRu, displayNameEn);
  }
);

export const addTeamToLeagueInSeason = createAsyncThunk(
  'seasons/addTeamToLeagueInSeason',
  async ({
    seasonId,
    leagueId,
    teamId,
  }: {
    seasonId: string;
    leagueId: string;
    teamId: string;
  }) => api.addTeamToLeagueInSeason(seasonId, leagueId, teamId)
);

export const addBetToLeagueInSeason = createAsyncThunk(
  'bets/addBetToLeagueInSeason',
  async ({
    seasonId,
    leagueId,
    newBet,
  }: {
    seasonId: string;
    leagueId: string;
    newBet: NewBet;
  }) => {
    if (!newBet.betTitle) {
      throw new Error('Отсутствует ставка');
    }
    // TODO доделать проверки
    return api.addBetToLeagueInSeason(seasonId, leagueId, newBet);
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
      })
      .addCase(getActiveSeason.fulfilled, (state, action) => {
        state.activeSeason = action.payload;
      })
      .addCase(getActiveSeason.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getScheduledSeason.fulfilled, (state, action) => {
        state.scheduledSeason = action.payload;
      })
      .addCase(getScheduledSeason.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(registrationInSeason.fulfilled, (state, action) => {
        state.seasons = state.seasons.map((season) =>
          season.id === action.payload.id ? action.payload : season
        );
      })
      .addCase(registrationInSeason.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addLeagueToSeason.fulfilled, (state, action) => {
        state.seasons = state.seasons.map((season) =>
          season.id === action.payload.id ? action.payload : season
        );
      })
      .addCase(addLeagueToSeason.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addTeamToLeagueInSeason.fulfilled, (state, action) => {
        state.seasons = state.seasons.map((season) =>
          season.id === action.payload.id ? action.payload : season
        );
      })
      .addCase(addTeamToLeagueInSeason.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addBetToLeagueInSeason.fulfilled, (state, action) => {
        state.seasons = state.seasons.map((season) =>
          season.id === action.payload.id ? action.payload : season
        );
      })
      .addCase(addBetToLeagueInSeason.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { resetError } = seasonsSlice.actions;

export default seasonsSlice.reducer;
