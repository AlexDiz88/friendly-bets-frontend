import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material';
import { t } from 'i18next';
import {
	customButtonLabelSx,
	customButtonRootSx,
	type CustomButtonVariant,
} from './customButtonStyles';

const CustomSuccessButton = ({
	onClick,
	buttonVariant = 'contained',
	buttonText = t('btnText.accept'),
	sx,
	textSize = '0.875rem',
	disabled = false,
	loading = false,
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonVariant?: CustomButtonVariant;
	buttonText?: string;
	sx?: SxProps<Theme>;
	textSize?: string;
	disabled?: boolean;
	loading?: boolean;
}): JSX.Element => {
	return (
		<Button
			disableElevation
			color="inherit"
			sx={
				[
					customButtonRootSx('success', buttonVariant),
					{ height: '2.25rem', px: 1.75, mr: 1 },
					loading ? { display: 'inline-flex', alignItems: 'center', gap: 1 } : null,
					sx,
				] as SxProps<Theme>
			}
			variant={buttonVariant}
			onClick={onClick}
			disabled={disabled || loading}
		>
			{loading ? (
				<CircularProgress size={16} thickness={5} sx={{ color: 'inherit', flexShrink: 0 }} />
			) : null}
			<Typography component="span" sx={customButtonLabelSx(textSize)}>
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomSuccessButton;
