import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { t } from 'i18next';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';
const defaultSeverity: SnackbarSeverity = 'info';
const defaultDuration = 2500;

interface SnackbarState {
	open: boolean;
	message: string;
	severity: SnackbarSeverity;
	duration: number;
}

const initialState: SnackbarState = {
	open: false,
	message: '',
	severity: defaultSeverity,
	duration: defaultDuration,
};

const snackbarSlice = createSlice({
	name: 'snackbar',
	initialState,
	reducers: {
		showSuccessSnackbar: (state, action: PayloadAction<{ message: string; duration?: number }>) => {
			state.open = true;
			state.message = action.payload.message;
			state.severity = 'success';
			state.duration = action.payload.duration ?? defaultDuration;
		},
		showErrorSnackbar: (
			state,
			action: PayloadAction<{ message: string | undefined; duration?: number }>
		) => {
			state.open = true;
			state.message = t(`error.${action.payload.message || t('error.unknownError')}`);
			state.severity = 'error';
			state.duration = action.payload.duration ?? defaultDuration;
		},
		showInfoSnackbar: (state, action: PayloadAction<{ message: string; duration?: number }>) => {
			state.open = true;
			state.message = action.payload.message;
			state.severity = 'info';
			state.duration = action.payload.duration ?? defaultDuration;
		},
		showWarningSnackbar: (state, action: PayloadAction<{ message: string; duration?: number }>) => {
			state.open = true;
			state.message = action.payload.message;
			state.severity = 'warning';
			state.duration = action.payload.duration ?? defaultDuration;
		},
		hideSnackbar: (state) => {
			state.open = false;
		},
	},
});

export const {
	showSuccessSnackbar,
	showErrorSnackbar,
	showInfoSnackbar,
	showWarningSnackbar,
	hideSnackbar,
} = snackbarSlice.actions;
export default snackbarSlice.reducer;
