import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import App from './App';
import './index.css';
import theme from './theme/theme';
import { store } from './app/store';

const container = document.getElementById('root');
const root = container && createRoot(container);

root!.render(
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</Provider>
);
