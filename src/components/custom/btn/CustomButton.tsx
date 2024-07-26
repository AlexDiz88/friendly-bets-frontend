import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CustomButton = ({
	onClick,
	buttonColor = 'primary',
	buttonVariant = 'contained',
	buttonSize = 'medium',
	buttonText,
	sx,
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
	buttonVariant?: 'text' | 'contained' | 'outlined';
	buttonSize?: 'small' | 'medium' | 'large';
	buttonText: string;
	sx?: {};
}): JSX.Element => {
	return (
		<Button
			sx={{ ...sx }}
			variant={buttonVariant}
			color={buttonColor}
			size={buttonSize}
			onClick={onClick}
		>
			<Typography variant="button" fontWeight="600" fontSize="0.9rem" fontFamily="Shantell Sans">
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomButton;
