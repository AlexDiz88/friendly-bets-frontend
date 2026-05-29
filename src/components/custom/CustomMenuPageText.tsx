import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { headerNavLinkSx } from '../header/headerPageStyles';

const CustomMenuPageText = ({
	title,
	href,
	onClick,
	onClickCapture,
	sx,
}: {
	title: string;
	href?: string;
	onClick?(event: React.MouseEvent<HTMLAnchorElement>): void;
	onClickCapture?(event: React.MouseEvent<HTMLAnchorElement>): void;
	sx?: SxProps<Theme>;
}): JSX.Element => {
	return (
		<Typography
			variant="h5"
			noWrap
			component="a"
			href={href}
			onClick={onClick}
			onClickCapture={onClickCapture}
			sx={[
				{
					px: { xs: 0, md: 0.5 },
					py: 0.75,
					mx: 1.2,
					fontWeight: 600,
					fontSize: '1rem',
					lineHeight: 1.25,
					textDecoration: 'none',
					cursor: 'pointer',
				},
				headerNavLinkSx,
				...(Array.isArray(sx) ? sx : sx ? [sx] : []),
			]}
		>
			{title}
		</Typography>
	);
};

export default CustomMenuPageText;
