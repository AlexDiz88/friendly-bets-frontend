import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';

const CustomSuccessButton = ({
	onClick,
	buttonVariant = 'contained',
	buttonText = t('btnText.accept'),
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonVariant?: 'text' | 'contained' | 'outlined';
	buttonText?: string;
}): JSX.Element => {
	return (
		<Button
			sx={{ height: '1.8rem', px: 1, mr: 1 }}
			variant={buttonVariant}
			color="success"
			onClick={onClick}
		>
			<Typography variant="button" fontWeight="600" fontSize="0.9rem" fontFamily="Shantell Sans">
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomSuccessButton;
