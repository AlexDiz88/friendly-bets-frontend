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
	contentWidth?: string;
}

export default function CustomCalendarDialog({
	open,
	onClose,
	onSave,
	title,
	summaryComponent,
	helperText,
	buttonAcceptText,
	contentWidth,
}: DialogProps): JSX.Element {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{ sx: { overflow: 'hidden', maxWidth: 'calc(100vw - 1.5rem)' } }}
		>
			<DialogContent sx={{ overflow: 'hidden', py: 2 }}>
				<Box
					sx={{
						fontSize: '1rem',
						width: contentWidth ?? '14rem',
						maxWidth: '100%',
						boxSizing: 'border-box',
					}}
				>
					{title && <Box sx={{ fontWeight: 600 }}>{title}</Box>}
					<Box sx={{ my: 1, lineHeight: 1.45, overflowWrap: 'anywhere' }}>{helperText}</Box>
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
