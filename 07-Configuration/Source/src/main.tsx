/**
 * FormosaStudio (FORM) — React 18 Application Entry Point
 * Traces to: FORM-REQ-0018, FORM-REQ-0021
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
