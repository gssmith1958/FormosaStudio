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

// Register lightweight offline PWA cache on HTTPS origins (GitHub Pages / iPad / Mobile)
if (window.location.protocol === 'https:' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Ignore registration failures on unsupported environments
    });
  });
}
