import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BetsState from './types/BetsState';
import * as api from './api';
import Bet, { BetId } from './types/Bet';

const initialState: BetsState = {
  bets: [],
  error: undefined,
};

export const addBet = createAsyncThunk('bets/addBet', async (bet: Bet) => {
  api.addBet(bet);
});

export const getUserBets = createAsyncThunk('bets/getBets', async () => {
  api.getUserBets();
});

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .addCase(addBet.fulfilled, (state, action) => {
        //   state.bets.push(action.payload);
      })
      .addCase(addBet.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { resetError } = betsSlice.actions;

export default betsSlice.reducer;
