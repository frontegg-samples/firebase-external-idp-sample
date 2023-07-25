import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FronteggProvider } from "@frontegg/react";

const root = ReactDOM.createRoot(document.getElementById('root'));

const contextOptions = {
    baseUrl: 'https://app-0wco61t63fgb.stg.frontegg.com',
    clientId: '795403e8-9134-4958-98e9-b52bec06614c'
};

root.render(
  <React.StrictMode>
      <FronteggProvider contextOptions={contextOptions} hostedLoginBox={true}>
          <App />
      </FronteggProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
