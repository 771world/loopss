import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './pages/Layout';
import { DAppProvider } from '@usedapp/core';
import { DAPP_CONFIG } from "./constants/config";
import { Toaster } from 'react-hot-toast';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <>
    <Toaster />
    {/* @ts-ignore */}
    <DAppProvider DAppProvider config={DAPP_CONFIG} >
      <Layout />
    </DAppProvider >
  </>
);

reportWebVitals();
