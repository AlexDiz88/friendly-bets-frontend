import { Box, CircularProgress } from '@mui/material';
import { t } from 'i18next';

const CustomLoading = ({ text }: { text?: string }): JSX.Element => {
	return (
		<Box
			sx={{
				height: '70vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown', pt: 10, fontSize: 18 }}>
				{text ? t(`${text}`) : t('loading')}
			</Box>
			<CircularProgress sx={{ mt: 5 }} size={100} color="primary" />
		</Box>
	);
};

export default CustomLoading;
