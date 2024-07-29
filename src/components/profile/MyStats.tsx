import { Box } from '@mui/material';
import { t } from 'i18next';

export default function MyStats(): JSX.Element {
	return (
		<Box sx={{ textAlign: 'center', p: 2, color: 'brown' }}>
			<b>{t('contentInProgress')}</b>
		</Box>
	);
}
