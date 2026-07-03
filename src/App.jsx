import { useState } from 'react';
import LandingPage from './landing/LandingPage.jsx';
import AdminApp from './admin/AdminApp.jsx';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'admin'

  if (view === 'admin') {
    return <AdminApp onExit={() => setView('landing')} />;
  }
  return <LandingPage onLogin={() => setView('admin')} />;
}
