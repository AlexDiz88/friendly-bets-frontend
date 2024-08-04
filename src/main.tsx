import { ThemeProvider } from '@mui/material/styles';
// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import { HashRouter } from 'react-router-dom';
import App from './App';
import SnackbarProvider from './components/custom/snackbar/SnackbarProvider';
import './i18n';
import './index.css';
import theme from './theme/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<>
		<Provider store={store}>
			<HashRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<App />
					<SnackbarProvider />
				</ThemeProvider>
			</HashRouter>
		</Provider>
	</>
);
