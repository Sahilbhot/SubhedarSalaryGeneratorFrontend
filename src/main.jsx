import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// tailwind.css imports index.css + App.css into the `legacy` cascade layer,
// so those must NOT be imported again here (that would re-add them unlayered).
import './styles/tailwind.css';
import App from './App.jsx';
import { AuthProvider } from '@/features/auth/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
