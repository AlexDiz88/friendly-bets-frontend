import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';

const CustomSuccessButton = ({
	onClick,
	buttonVariant = 'contained',
	buttonText = t('btnText.accept'),
	sx,
	textSize = '0.9rem',
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonVariant?: 'text' | 'contained' | 'outlined';
	buttonText?: string;
	sx?: {};
	textSize?: string;
}): JSX.Element => {
	return (
		<Button
			sx={{ height: '2rem', px: 1, mr: 1, ...sx }}
			variant={buttonVariant}
			color="success"
			onClick={onClick}
		>
			<Typography variant="button" fontWeight="600" fontSize={textSize} fontFamily="Shantell Sans">
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomSuccessButton;
