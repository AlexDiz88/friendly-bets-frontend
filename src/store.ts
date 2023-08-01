import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import tasksSlice from './features/tasks/tasksSlice';
import authSlice from './features/auth/authSlice';
import seasonsSlice from './features/admin/seasons/seasonsSlice';
import teamsSlice from './features/admin/teams/teamsSlice';
import betsSlice from './features/bets/betsSlice';
import statsSlice from './features/stats/statsSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    seasons: seasonsSlice,
    teams: teamsSlice,
    tasks: tasksSlice,
    bets: betsSlice,
    playersStats: statsSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
