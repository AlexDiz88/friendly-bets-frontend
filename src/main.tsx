// eslint-disable-next-line import/default
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
import SnackbarProvider from './components/custom/snackbar/SnackbarProvider';
import './i18n';
import './index.css';
import { ThemeModeProvider } from './theme/ThemeModeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<>
		<Provider store={store}>
			<HashRouter>
				<ThemeModeProvider>
					<App />
					<SnackbarProvider />
				</ThemeModeProvider>
			</HashRouter>
		</Provider>
	</>
);
