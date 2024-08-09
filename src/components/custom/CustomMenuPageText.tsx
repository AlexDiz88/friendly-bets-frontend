import { Typography } from '@mui/material';

const CustomMenuPageText = ({
	title,
	href,
	onClick,
	onClickCapture,
}: {
	title: string;
	href?: string;
	onClick?(event: React.MouseEvent<HTMLAnchorElement>): void;
	onClickCapture?(event: React.MouseEvent<HTMLAnchorElement>): void;
}): JSX.Element => {
	return (
		<>
			<Typography
				variant="h5"
				noWrap
				component="a"
				href={href}
				onClick={onClick}
				onClickCapture={onClickCapture}
				sx={{
					px: { xs: 0, md: 0.5 },
					my: 2,
					mx: 1.2,
					fontWeight: 600,
					fontSize: '1rem',
					color: 'inherit',
					textDecoration: 'none',
					cursor: 'pointer',
					'&:hover': {
						color: '#ff9800',
					},
				}}
			>
				{title}
			</Typography>
		</>
	);
};

export default CustomMenuPageText;
