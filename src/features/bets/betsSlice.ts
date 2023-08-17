import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BetsState from './types/BetsState';
import * as api from './api';
import { BetId } from './types/Bet';
import NewBet from './types/NewBet';

const initialState: BetsState = {
  bet: undefined,
  bets: [],
  error: undefined,
};

export const getUserBets = createAsyncThunk('bets/getAllBets', async () =>
  api.getAllBets()
);

export const updateBetInLeagueInSeason = createAsyncThunk(
  'bets/updateBetInLeagueInSeason',
  async ({ betId, newBet }: { betId: string; newBet: NewBet }) => {
    if (!newBet.betTitle) {
      throw new Error('Отсутствует ставка');
    }
    // TODO доделать проверки
    return api.updateBetInLeagueInSeason(betId, newBet);
  }
);

export const deleteBet = createAsyncThunk('bets/deleteBet', async (id: BetId) => {
  await api.deleteBet(id);
  return id;
});

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
      .addCase(getUserBets.fulfilled, (state, action) => {
        state.bets = action.payload.bets;
      })
      .addCase(getUserBets.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateBetInLeagueInSeason.fulfilled, (state, action) => {
        state.bet = action.payload;
      })
      .addCase(updateBetInLeagueInSeason.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { resetError } = betsSlice.actions;

export default betsSlice.reducer;
