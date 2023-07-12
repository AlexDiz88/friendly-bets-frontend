import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import App from './App/App';
import './index.css';
import theme from './theme/theme';
import store from './store';

const container = document.getElementById('root');
const root = container && createRoot(container);

root!.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
);
