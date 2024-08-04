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
}

export default function CustomBetInputDialog({
	open,
	onClose,
	onSave,
	title,
	summaryComponent,
}: DialogProps): JSX.Element {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogContent>
				<Box sx={{ fontSize: '1rem', width: '14rem' }}>
					{title && <Box sx={{ fontWeight: 600 }}>{title}</Box>}
					{summaryComponent && summaryComponent}
				</Box>
			</DialogContent>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<DialogActions>
					<CustomCancelButton onClick={onClose} />
					<CustomSuccessButton onClick={onSave} buttonText={t('btnText.accept')} />
				</DialogActions>
			</Box>
		</Dialog>
	);
}
