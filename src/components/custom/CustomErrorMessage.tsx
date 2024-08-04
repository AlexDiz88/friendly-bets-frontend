import { Box } from '@mui/material';
import { t } from 'i18next';

const CustomErrorMessage = ({
	message,
	sx,
}: {
	message: string | undefined;
	sx?: {};
}): JSX.Element => {
	return (
		<>
			{message ? (
				<Box sx={{ fontWeight: 600, px: 2, py: 5, color: 'brown', textAlign: 'center', ...sx }}>
					{t(`error.${message}`)}
				</Box>
			) : (
				<Box sx={{ fontWeight: 600 }}>{t('error.unknownError')}</Box>
			)}
		</>
	);
};

export default CustomErrorMessage;
