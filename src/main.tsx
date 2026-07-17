import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * CHALO NE! APPLICATION MOUNT ENTRY
 * Optimized for zero-error type compliance during pipeline actions.
 */

const rootNode = document.getElementById('root');

if (rootNode) {
  const root = ReactDOM.createRoot(rootNode);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Critical: Root mounting node targeted inside index.html was not found.");
}
