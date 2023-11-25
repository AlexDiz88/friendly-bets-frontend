import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Box } from '@mui/material';

interface NotificationSnackbarProps {
	open: boolean;
	onClose: () => void;
	severity: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration: number;
}

export default function NotificationSnackbar({
	open,
	onClose,
	severity,
	message,
	duration,
}: NotificationSnackbarProps): JSX.Element {
	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string): void => {
		if (reason === 'clickaway') {
			return;
		}
		onClose();
	};

	return (
		<Box sx={{ textAlign: 'center' }}>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				sx={{
					justifyContent: 'center',
					mb: 3,
				}}
				open={open}
				autoHideDuration={duration}
				onClose={handleClose}
			>
				<MuiAlert onClose={handleClose} severity={severity} elevation={6} variant="filled">
					{message}
				</MuiAlert>
			</Snackbar>
		</Box>
	);
}
