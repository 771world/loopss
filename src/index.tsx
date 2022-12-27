import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './pages/Layout';
import { DAppProvider } from '@usedapp/core';
import { DAPP_CONFIG } from "./constants/config";
import { Toaster } from 'react-hot-toast';
import reportWebVitals from './reportWebVitals';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(99 102 241)',
      contrastText: '#fff',
    },
    secondary: {
      main: 'rgb(99 102 241)',
      contrastText: '#000',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <>
    <Toaster />
    {/* @ts-ignore */}
    <DAppProvider DAppProvider config={DAPP_CONFIG} >
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Layout />
        </LocalizationProvider>
      </ThemeProvider>
    </DAppProvider >
  </>
);

reportWebVitals();
