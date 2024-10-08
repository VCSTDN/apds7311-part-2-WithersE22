import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';  // Import React Router for routing
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <App />   {/* Wrapping App with Router for routing capabilities */}
    </Router>
  </React.StrictMode>
);

// Log performance if needed (for example: reportWebVitals(console.log))
reportWebVitals();
