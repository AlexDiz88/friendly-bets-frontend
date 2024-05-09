import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CustomButton = ({
	onClick,
	buttonColor = 'primary',
	buttonVariant = 'contained',
	buttonText,
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
	buttonVariant?: 'text' | 'contained' | 'outlined';
	buttonText: string;
}): JSX.Element => {
	return (
		<Button
			sx={{ height: '1.8rem', px: 1, mr: 1 }}
			variant={buttonVariant}
			color={buttonColor}
			onClick={onClick}
		>
			<Typography variant="button" fontWeight="600" fontSize="0.9rem" fontFamily="Shantell Sans">
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomButton;
