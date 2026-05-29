import { Box, type SxProps, type Theme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { headerAppBarSx } from './headerPageStyles';
import ThemeModeToggle from '../../theme/ThemeModeToggle';
import { APP_HEADER_HEIGHT_PX } from './headerLayout';
import { HeaderNavCenter, HeaderNavLeft, useHeaderMenu } from './MenuPages';
import UserSettings from './UserSettings';

export default function Header(): JSX.Element {
	const menu = useHeaderMenu();

	return (
		<AppBar
			position="fixed"
			elevation={4}
			sx={
				[
					headerAppBarSx,
					{ height: APP_HEADER_HEIGHT_PX, justifyContent: 'center' },
				] as SxProps<Theme>
			}
		>
			<Container
				maxWidth={false}
				disableGutters
				sx={{ position: 'relative', zIndex: 1, px: { xs: 0.5, sm: 1, md: 2 } }}
			>
				<Toolbar
					disableGutters
					sx={{
						display: 'grid',
						gridTemplateColumns: '1fr auto 1fr',
						alignItems: 'center',
						width: '100%',
						height: APP_HEADER_HEIGHT_PX,
						minHeight: APP_HEADER_HEIGHT_PX,
						maxHeight: APP_HEADER_HEIGHT_PX,
						color: 'inherit',
					}}
				>
					<Box sx={{ justifySelf: 'start', display: 'flex', alignItems: 'center', minWidth: 0 }}>
						<HeaderNavLeft menu={menu} />
					</Box>

					<Box
						sx={{
							justifySelf: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							minWidth: 0,
							maxWidth: '100%',
						}}
					>
						<HeaderNavCenter menu={menu} />
					</Box>

					<Box
						sx={{
							justifySelf: 'end',
							display: 'flex',
							alignItems: 'center',
							gap: 0.5,
							minWidth: 0,
						}}
					>
						<ThemeModeToggle />
						<UserSettings />
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
