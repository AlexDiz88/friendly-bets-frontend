import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CustomButton = ({
	onClick,
	buttonColor = 'primary',
	buttonVariant = 'contained',
	buttonSize = 'medium',
	buttonText,
	sx,
	autoFocus,
	textSize = '0.9rem',
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
	buttonVariant?: 'text' | 'contained' | 'outlined';
	buttonSize?: 'small' | 'medium' | 'large';
	buttonText: string;
	sx?: {};
	autoFocus?: boolean | undefined;
	textSize?: string;
}): JSX.Element => {
	return (
		<Button
			sx={{ height: '2.3rem', ...sx }}
			variant={buttonVariant}
			color={buttonColor}
			size={buttonSize}
			onClick={onClick}
			autoFocus={autoFocus}
		>
			<Typography variant="button" fontWeight="600" fontSize={textSize} fontFamily="Shantell Sans">
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomButton;
