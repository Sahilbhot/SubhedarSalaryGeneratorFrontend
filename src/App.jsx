import { useState } from 'react';
import LandingPage from '@/features/landing/LandingPage.jsx';
import AdminApp from '@/features/salary/AdminApp.jsx';
import LoginPage from '@/features/auth/LoginPage.jsx';
import { useAuth } from '@/features/auth/AuthContext.jsx';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'admin'

  if (loading) {
    return (
      <div
        style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#171009' }}
      >
        <div className="spinner" style={{ borderTopColor: '#ffbe00' }} />
      </div>
    );
  }

  if (view === 'login') {
    return <LoginPage onSuccess={() => setView('admin')} onBack={() => setView('landing')} />;
  }

  if (view === 'admin') {
    if (!isAuthenticated) {
      return <LoginPage onSuccess={() => setView('admin')} onBack={() => setView('landing')} />;
    }
    return <AdminApp onExit={() => setView('landing')} />;
  }

  // Landing: the Login button jumps straight to admin if already signed in.
  return <LandingPage onLogin={() => setView(isAuthenticated ? 'admin' : 'login')} />;
}
