import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material';
import { RefObject } from 'react';
import {
	CUSTOM_BUTTON_FONT,
	customButtonLabelSx,
	customButtonRootSx,
	type CustomButtonColor,
	type CustomButtonVariant,
} from './customButtonStyles';

const CustomButton = ({
	onClick,
	buttonColor = 'primary',
	buttonVariant = 'contained',
	buttonSize = 'medium',
	buttonText,
	sx,
	autoFocus,
	textSize = '0.875rem',
	fontFamily = CUSTOM_BUTTON_FONT,
	ref,
	disabled = false,
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonColor?: CustomButtonColor;
	buttonVariant?: CustomButtonVariant;
	buttonSize?: 'small' | 'medium' | 'large';
	buttonText: string;
	sx?: SxProps<Theme>;
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
			disableElevation
			color="inherit"
			sx={
				[
					customButtonRootSx(buttonColor, buttonVariant),
					sx,
				] as SxProps<Theme>
			}
			variant={buttonVariant}
			size={buttonSize}
			onClick={onClick}
			autoFocus={autoFocus}
		>
			<Typography
				component="span"
				sx={{ ...customButtonLabelSx(textSize), fontFamily } as SxProps<Theme>}
			>
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomButton;
