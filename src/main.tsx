// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { store } from './app/store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import theme from './theme/theme';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<>
		<Provider store={store}>
			<HashRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<App />
				</ThemeProvider>
			</HashRouter>
		</Provider>
	</>
);
