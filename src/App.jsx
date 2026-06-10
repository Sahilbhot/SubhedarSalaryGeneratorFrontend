import { useState } from 'react';
import EmployeesPage from './pages/EmployeesPage.jsx';
import CalculateSalaryPage from './pages/CalculateSalaryPage.jsx';
import logoUrl from './assets/logo.jpg';
import './App.css';

const NAV = [
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'calculate', label: 'Calculate Salary', icon: '🧮' },
];

export default function App() {
  const [active, setActive] = useState('employees');

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoUrl} alt="Hotel Subhedar" className="brand-logo" onError={e => { e.target.style.display = 'none'; }} />
          <div className="brand-text">
            <span className="brand-name">Hotel Subhedar</span>
            <span className="brand-sub">Salary Manager</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span>© 2025 Hotel Subhedar</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            {NAV.find(n => n.id === active)?.icon}{' '}
            {NAV.find(n => n.id === active)?.label}
          </div>
          <div className="topbar-addr">
            Sheetal Baug Rd, Bhosari, Pimpri-Chinchwad, MH 411039
          </div>
        </header>

        <div className="content-area">
          {active === 'employees' && <EmployeesPage />}
          {active === 'calculate' && <CalculateSalaryPage />}
        </div>
      </main>
    </div>
  );
}
