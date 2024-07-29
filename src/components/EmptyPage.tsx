import Box from '@mui/material/Box';
import { t } from 'i18next';

export default function EmptyPage(): JSX.Element {
	return (
		<Box sx={{ textAlign: 'center', p: 2, color: 'brown' }}>
			<b>{t('contentInProgress')}</b>
		</Box>
	);
}
