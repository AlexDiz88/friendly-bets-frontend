import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
// Слайсы - это отдельные модули нашего приложения. У каждого слайса - свой редьюсер.
import tasksSlice from './features/tasks/tasksSlice';
import authSlice from './features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: tasksSlice,
  },
});

// для правильной типизации будем использовать useAppDispatch вместо useDispatch
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
