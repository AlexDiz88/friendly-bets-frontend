import { Box, Dialog, DialogActions, DialogContent } from '@mui/material';
import { t } from 'i18next';
import CustomCancelButton from '../btn/CustomCancelButton';
import CustomSuccessButton from '../btn/CustomSuccessButton';

interface DialogProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	title?: string;
	summaryComponent?: JSX.Element;
	helperText?: string;
	buttonAcceptText?: string;
}

export default function CustomCalendarDialog({
	open,
	onClose,
	onSave,
	title,
	summaryComponent,
	helperText,
	buttonAcceptText,
}: DialogProps): JSX.Element {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogContent>
				<Box sx={{ fontSize: '1rem', width: '14rem' }}>
					{title && <Box sx={{ fontWeight: 600 }}>{title}</Box>}
					<Box sx={{ my: 1 }}>{helperText}</Box>
					{summaryComponent && summaryComponent}
				</Box>
			</DialogContent>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<DialogActions>
					<CustomCancelButton onClick={onClose} />
					<CustomSuccessButton
						onClick={onSave}
						buttonText={buttonAcceptText || t('btnText.accept')}
					/>
				</DialogActions>
			</Box>
		</Dialog>
	);
}
