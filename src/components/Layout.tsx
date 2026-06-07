import { Outlet } from 'react-router-dom';
import { Box, type SxProps, type Theme } from '@mui/material';
import { APP_MAIN_MIN_HEIGHT, APP_MAIN_PADDING_TOP } from './header/headerLayout';
import { appMainBackgroundSx } from './layoutMainStyles';
import Header from './header/Header';

export default function Layout(): JSX.Element {
	return (
		<>
			<Header />
			<Box
				component="main"
				sx={
					[
						{
							pt: APP_MAIN_PADDING_TOP,
							pb: 3,
							px: '3px',
							minHeight: APP_MAIN_MIN_HEIGHT,
							color: 'text.primary',
							boxSizing: 'border-box',
						},
						appMainBackgroundSx,
					] as SxProps<Theme>
				}
			>
				<Outlet />
			</Box>
		</>
	);
}
