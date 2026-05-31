import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material';
import { t } from 'i18next';
import {
	customButtonLabelSx,
	customButtonRootSx,
	type CustomButtonVariant,
} from './customButtonStyles';

const CustomCancelButton = ({
	onClick,
	buttonVariant = 'contained',
	buttonText = t('btnText.cancel'),
	sx,
	textSize = '0.875rem',
	disabled = false,
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonVariant?: CustomButtonVariant;
	buttonText?: string;
	sx?: SxProps<Theme>;
	textSize?: string;
	disabled?: boolean;
}): JSX.Element => {
	return (
		<Button
			disableElevation
			color="inherit"
			sx={
				[
					customButtonRootSx('error', buttonVariant),
					{ height: '2.25rem', px: 1.75, mr: 1 },
					sx,
				] as SxProps<Theme>
			}
			variant={buttonVariant}
			onClick={onClick}
			disabled={disabled}
		>
			<Typography component="span" sx={customButtonLabelSx(textSize)}>
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomCancelButton;
