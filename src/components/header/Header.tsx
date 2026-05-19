import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import ThemeModeToggle from '../../theme/ThemeModeToggle';
import MenuPages from './MenuPages';
import UserSettings from './UserSettings';

export default function Header(): JSX.Element {
	return (
		<AppBar position="fixed" color="primary" sx={{ bgcolor: 'primary.dark' }}>
			<Container
				maxWidth="xl"
				sx={{
					display: { xs: 'block', md: 'flex' },
					justifyContent: { xs: 'block', md: 'space-evenly' },
				}}
			>
				<Toolbar disableGutters>
					<MenuPages />
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<ThemeModeToggle />
						<UserSettings />
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
