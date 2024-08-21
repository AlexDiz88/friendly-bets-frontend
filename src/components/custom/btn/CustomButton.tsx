import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { RefObject } from 'react';

const CustomButton = ({
	onClick,
	buttonColor = 'primary',
	buttonVariant = 'contained',
	buttonSize = 'medium',
	buttonText,
	sx,
	autoFocus,
	textSize = '0.9rem',
	fontFamily = 'Shantell Sans',
	ref,
	disabled = false,
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
	buttonVariant?: 'text' | 'contained' | 'outlined';
	buttonSize?: 'small' | 'medium' | 'large';
	buttonText: string;
	sx?: {};
	autoFocus?: boolean | undefined;
	textSize?: string;
	fontFamily?: string;
	ref?: RefObject<HTMLButtonElement>;
	disabled?: boolean;
}): JSX.Element => {
	return (
		<Button
			disabled={disabled}
			ref={ref}
			sx={{ height: '2.3rem', ...sx }}
			variant={buttonVariant}
			color={buttonColor}
			size={buttonSize}
			onClick={onClick}
			autoFocus={autoFocus}
		>
			<Typography fontWeight="600" fontSize={textSize} fontFamily={fontFamily}>
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomButton;
