import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Remove the <StrictMode> wrapper
createRoot(document.getElementById('root')).render(
  <App />
);
