import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Amplify } from 'aws-amplify';
import config from './app-config';
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(config);

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </React.StrictMode>,
  );
}
