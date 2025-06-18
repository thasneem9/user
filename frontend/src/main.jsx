// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />  {/* ✅ App is already wrapped in <RecoilRoot> */}
  </React.StrictMode>
);
