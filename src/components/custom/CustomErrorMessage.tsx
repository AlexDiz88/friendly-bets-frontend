import { Box } from '@mui/material';
import { t } from 'i18next';

const CustomErrorMessage = ({
	message,
	sx,
	info = false,
}: {
	message: string | undefined;
	sx?: {};
	info?: boolean;
}): JSX.Element => {
	return (
		<>
			{message ? (
				<Box sx={{ fontWeight: 600, px: 2, py: 5, color: 'brown', textAlign: 'center', ...sx }}>
					{info ? t(message) : t(`error.${message}`)}
				</Box>
			) : (
				<Box sx={{ fontWeight: 600 }}>{t('error.unknownError')}</Box>
			)}
		</>
	);
};

export default CustomErrorMessage;
