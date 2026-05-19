import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './header/Header';

export default function Layout(): JSX.Element {
	return (
		<>
			<Header />
			<Box
				sx={(theme) => ({
					mt: 9,
					mb: 3,
					mx: 0.5,
					display: 'flex',
					flexDirection: 'column',
					// mt + minHeight + mb must not exceed 100vh (fixed header is out of flow)
					minHeight: `calc(100vh - ${theme.spacing(9)} - ${theme.spacing(3)})`,
					bgcolor: 'background.default',
					color: 'text.primary',
				})}
			>
				<Outlet />
			</Box>
		</>
	);
}
