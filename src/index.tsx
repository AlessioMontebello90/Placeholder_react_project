import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Assicurati che l'elemento 'root' non sia null
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // Rimuovi temporaneamente React.StrictMode per evitare doppie chiamate API
    <App />
  );
}

// Se vuoi monitorare le prestazioni, usa questa riga
reportWebVitals(console.log);
