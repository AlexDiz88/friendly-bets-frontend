import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import UserSettings from './UserSettings';
import MenuPages from './MenuPages';

export default function Header(): JSX.Element {
	return (
		<AppBar position="fixed" sx={{ bgcolor: '#1e3471' }}>
			<Container
				maxWidth="xl"
				sx={{
					display: { xs: 'block', md: 'flex' },
					justifyContent: { xs: 'block', md: 'space-evenly' },
				}}
			>
				<Toolbar disableGutters>
					<MenuPages />
					<UserSettings />
				</Toolbar>
			</Container>
		</AppBar>
	);
}
