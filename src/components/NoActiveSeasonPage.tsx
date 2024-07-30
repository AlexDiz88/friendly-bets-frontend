import Box from '@mui/material/Box';
import { t } from 'i18next';

export default function NoActiveSeasonPage(): JSX.Element {
	return (
		<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown', pt: 10, fontSize: 20 }}>
			{t('noActiveSeasonsAtThisMoment')}
		</Box>
	);
}
