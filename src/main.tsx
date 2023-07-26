import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FronteggProvider } from '@frontegg/react';
import { initializeApp } from 'firebase/app';


// Initialize Firebase
initializeApp({
  apiKey: 'AIzaSyCNCLmqDPW8nQwiu2IiDsMnNVR5wLXxkl0',
  authDomain: 'test-frontegg-integration.firebaseapp.com',
  projectId: 'test-frontegg-integration',
  storageBucket: 'test-frontegg-integration.appspot.com',
  messagingSenderId: '397043190502',
  appId: '1:397043190502:web:73270761e83a7310594927',
  measurementId: 'G-T2PL3XTBPP'
});


const contextOptions = {
  baseUrl: 'https://app-0wco61t63fgb.stg.frontegg.com',
  clientId: '795403e8-9134-4958-98e9-b52bec06614c'
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FronteggProvider contextOptions={contextOptions} hostedLoginBox>
      <App/>
    </FronteggProvider>
  </React.StrictMode>,
)
