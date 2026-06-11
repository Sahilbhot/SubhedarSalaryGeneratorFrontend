import { useState, useEffect, useCallback } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import App from './App.jsx';

const AUTH_KEY = 'subhedar_auth';
const isAuthed = () => {
  try {
    return localStorage.getItem(AUTH_KEY) === '1' ||
           sessionStorage.getItem(AUTH_KEY) === '1';
  } catch { return false; }
};

/**
 * Top-level router:
 *   site  → public restaurant website (LandingPage)
 *   login → staff login screen (LoginPage)
 *   admin → internal Salary Manager (App)  [requires auth]
 */
export default function Root() {
  const [view, setView] = useState(() => {
    if (window.location.hash === '#admin') return isAuthed() ? 'admin' : 'login';
    return 'site';
  });

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#admin') {
        setView(isAuthed() ? 'admin' : 'login');
      } else {
        setView('site');
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Login button (navbar / mobile / footer "Staff Login")
  const openLogin = useCallback(() => {
    setView(isAuthed() ? 'admin' : 'login');
    window.scrollTo(0, 0);
  }, []);

  const handleSuccess = useCallback((remember) => {
    try {
      (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, '1');
    } catch { /* storage unavailable */ }
    window.location.hash = '#admin';
    setView('admin');
    window.scrollTo(0, 0);
  }, []);

  const backToSite = useCallback(() => {
    window.location.hash = '';
    setView('site');
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(AUTH_KEY);
    } catch { /* ignore */ }
    window.location.hash = '';
    setView('site');
  }, []);

  if (view === 'login') {
    return <LoginPage onSuccess={handleSuccess} onBack={backToSite} />;
  }

  if (view === 'admin') {
    return <App onViewSite={backToSite} onLogout={logout} />;
  }

  return <LandingPage onStaffLogin={openLogin} />;
}
