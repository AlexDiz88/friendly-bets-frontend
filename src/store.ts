import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import tasksSlice from './features/tasks/tasksSlice';
import authSlice from './features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: tasksSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
