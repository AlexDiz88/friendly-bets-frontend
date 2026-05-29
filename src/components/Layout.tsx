import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { APP_MAIN_MIN_HEIGHT, APP_MAIN_PADDING_TOP } from './header/headerLayout';
import Header from './header/Header';

export default function Layout(): JSX.Element {
	return (
		<>
			<Header />
			<Box
				component="main"
				sx={{
					pt: APP_MAIN_PADDING_TOP,
					pb: 3,
					px: 0.5,
					minHeight: APP_MAIN_MIN_HEIGHT,
					bgcolor: 'background.default',
					color: 'text.primary',
					boxSizing: 'border-box',
				}}
			>
				<Outlet />
			</Box>
		</>
	);
}
