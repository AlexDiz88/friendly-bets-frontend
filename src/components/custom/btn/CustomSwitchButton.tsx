import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CustomSwitchButton = ({
	onClick,
	buttonText,
	isActive,
	sx,
}: {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	buttonText: string;
	isActive?: boolean;
	sx?: {};
}): JSX.Element => {
	return (
		<Button
			sx={{
				height: '2.3rem',
				boxShadow: 'none',
				bgcolor: 'white',
				color: '#6E7175',
				pb: 0.5,
				textTransform: 'none',
				borderRadius: 0,
				borderBottom: isActive ? '2px solid #1c77d0' : '2px solid white',
				'&:active': {
					bgcolor: 'white',
					boxShadow: 'none',
					borderBottomColor: '#074078',
				},
				'&:hover': {
					bgcolor: 'white',
					boxShadow: 'none',
				},
				'&:focus': {
					bgcolor: 'white',
					boxShadow: 'none',
				},
				...sx,
			}}
			onClick={onClick}
		>
			<Typography
				sx={{
					fontWeight: 600,
					fontSize: '1rem',
					fontFamily: "'Exo 2'",
					textTransform: 'none',
					'&:active': {
						color: '#1c77d0',
					},
				}}
			>
				{buttonText}
			</Typography>
		</Button>
	);
};

export default CustomSwitchButton;
