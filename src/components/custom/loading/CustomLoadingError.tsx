import { Box } from '@mui/material';
import { t } from 'i18next';

const CustomLoadingError = (): JSX.Element => {
	return (
		<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown', pt: 10, fontSize: 18 }}>
			{t('loadingError')}
		</Box>
	);
};

export default CustomLoadingError;
