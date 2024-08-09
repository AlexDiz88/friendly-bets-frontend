import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import { hideSnackbar } from './snackbarSlice';

const SnackbarProvider = (): JSX.Element => {
	const dispatch = useDispatch();
	const snackbar = useSelector((state: RootState) => state.snackbar);

	return (
		<NotificationSnackbar
			open={snackbar.open}
			onClose={() => dispatch(hideSnackbar())}
			severity={snackbar.severity}
			message={snackbar.message}
			duration={snackbar.duration}
		/>
	);
};

export default SnackbarProvider;
