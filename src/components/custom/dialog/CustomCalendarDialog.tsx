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
	submitting?: boolean;
	submittingButtonText?: string;
	disableTextSelection?: boolean;
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
	submitting = false,
	submittingButtonText,
	disableTextSelection = false,
}: DialogProps): JSX.Element {
	const handleClose = () => {
		if (submitting) {
			return;
		}
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{ sx: { overflow: 'hidden', maxWidth: 'calc(100vw - 1.5rem)' } }}
		>
			<DialogContent sx={{ overflow: 'hidden', py: 2 }}>
				<Box
					sx={{
						fontSize: '1rem',
						width: contentWidth ?? '14rem',
						maxWidth: '100%',
						boxSizing: 'border-box',
						...(disableTextSelection ? { userSelect: 'none' } : {}),
					}}
				>
					{title && <Box sx={{ fontWeight: 600 }}>{title}</Box>}
					{helperText ? (
						<Box sx={{ my: 1, lineHeight: 1.45, overflowWrap: 'anywhere' }}>{helperText}</Box>
					) : null}
					{summaryComponent && summaryComponent}
				</Box>
			</DialogContent>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<DialogActions>
					<CustomCancelButton onClick={handleClose} disabled={submitting} />
					<CustomSuccessButton
						onClick={onSave}
						loading={submitting}
						buttonText={
							submitting
								? submittingButtonText || t('btnText.processing')
								: buttonAcceptText || t('btnText.accept')
						}
					/>
				</DialogActions>
			</Box>
		</Dialog>
	);
}
