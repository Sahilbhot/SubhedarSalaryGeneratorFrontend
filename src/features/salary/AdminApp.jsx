import { useState, useCallback } from 'react';
import EmployeesPage from './pages/EmployeesPage.jsx';
import CalculateSalaryPage from './pages/CalculateSalaryPage.jsx';
import logoUrl from '@/assets/logo.jpg';
import './styles/App.css';

const NAV = [
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'calculate', label: 'Calculate Salary', icon: '🧮' },
];

export default function AdminApp({ onExit }) {
  const [active, setActive] = useState('employees');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useCallback((id) => {
    setActive(id);
    setSidebarOpen(false);
  }, []);

  const currentNav = NAV.find((n) => n.id === active);

  return (
    <div className="app">
      {/* Mobile sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Navigation">
        <div className="sidebar-brand">
          <img
            src={logoUrl}
            alt="Hotel Subhedar"
            className="brand-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="brand-text">
            <span className="brand-name">Hotel Subhedar</span>
            <span className="brand-sub">Salary Manager</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {onExit && (
            <button className="nav-item" onClick={onExit} style={{ marginBottom: 8 }}>
              <span className="nav-icon" aria-hidden="true">
                ←
              </span>
              <span className="nav-label">Back to Site</span>
            </button>
          )}
          © 2025 Hotel Subhedar
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
            <div className="topbar-title">
              <span aria-hidden="true">{currentNav?.icon}</span>
              {currentNav?.label}
            </div>
          </div>
          <div className="topbar-addr">Sheetal Baug Rd, Bhosari, Pimpri-Chinchwad, MH 411039</div>
        </header>

        <div className="content-area">
          {active === 'employees' && <EmployeesPage />}
          {active === 'calculate' && <CalculateSalaryPage />}
        </div>
      </main>
    </div>
  );
}
