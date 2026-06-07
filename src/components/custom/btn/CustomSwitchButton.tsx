import type { SxProps, Theme } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const defaultButtonSx: SxProps<Theme> = {
	height: '2.3rem',
	minWidth: 0,
	boxShadow: 'none',
	textTransform: 'none',
	borderRadius: 0,
	bgcolor: 'transparent',
	color: 'inherit',
	'&:hover': {
		bgcolor: 'transparent',
		boxShadow: 'none',
	},
	'&:active': {
		bgcolor: 'transparent',
		boxShadow: 'none',
	},
	'&:focus': {
		bgcolor: 'transparent',
		boxShadow: 'none',
	},
};

const CustomSwitchButton = ({
	onClick,
	buttonText,
	isActive,
	sx,
	labelSx,
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonText: string;
	isActive?: boolean;
	sx?: SxProps<Theme>;
	labelSx?: SxProps<Theme>;
}): JSX.Element => {
	const legacySx: SxProps<Theme> = sx
		? sx
		: {
				pb: 0.5,
				color: '#6E7175',
				borderBottom: isActive ? '2px solid #1c77d0' : '2px solid transparent',
				'&:active': {
					borderBottomColor: '#074078',
				},
			};

	return (
		<Button
			color="inherit"
			disableElevation
			variant="text"
			onClick={onClick}
			sx={[defaultButtonSx, legacySx] as SxProps<Theme>}
		>
			<Typography
				component="span"
				sx={
					[
						{
							fontWeight: 600,
							fontSize: '1rem',
							fontFamily: "'Exo 2'",
							textTransform: 'none',
						},
						labelSx ?? {},
					] as SxProps<Theme>
				}
			>
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomSwitchButton;
