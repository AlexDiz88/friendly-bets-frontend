import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './api';

export const saveUserTimezoneAsync = createAsyncThunk(
	'timezone/saveUserTimezone',
	async (timezone: string) => api.changeTimezone(timezone)
);
