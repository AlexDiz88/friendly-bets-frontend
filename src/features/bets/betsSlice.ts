import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BetsState from './types/BetsState';
import * as api from './api';
import { BetId } from './types/Bet';

const initialState: BetsState = {
  bets: [],
  error: undefined,
};

export const getUserBets = createAsyncThunk('bets/getAllBets', async () =>
  api.getAllBets()
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .addCase(getUserBets.fulfilled, (state, action) => {
      //   state.bets.push(action.payload);
      })
      .addCase(getUserBets.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { resetError } = betsSlice.actions;

export default betsSlice.reducer;
