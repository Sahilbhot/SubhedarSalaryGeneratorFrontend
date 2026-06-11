import { useState, useCallback } from 'react';
import EmployeesPage from './pages/EmployeesPage.jsx';
import CalculateSalaryPage from './pages/CalculateSalaryPage.jsx';
import logoUrl from './assets/logo.jpg';
import './App.css';

const svg = (d) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICONS = {
  employees: svg(<><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  calculate: svg(<><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 10h2M8 14h2M8 18h2M14 10h2M14 14h2M14 18h2" /></>),
  globe: svg(<><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" /></>),
  logout: svg(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>),
};
const PIN = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const NAV = [
  { id: 'employees',  label: 'Employees',        icon: ICONS.employees },
  { id: 'calculate',  label: 'Calculate Salary', icon: ICONS.calculate },
];

export default function App({ onViewSite, onLogout }) {
  const [active, setActive] = useState('employees');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useCallback((id) => {
    setActive(id);
    setSidebarOpen(false);
  }, []);

  // const currentNav = NAV.find(n => n.id === active);

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
                onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="brand-text">
              <span className="brand-name">Hotel Subhedar</span>
              <span className="brand-sub">Salary Manager</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section">Management</div>
            {NAV.map(item => (
                <button
                    key={item.id}
                    className={`nav-item ${active === item.id ? 'active' : ''}`}
                    onClick={() => navigate(item.id)}
                    aria-current={active === item.id ? 'page' : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            {(onViewSite || onLogout) && (
                <div className="sidebar-actions">
                  {onLogout && (
                      <button className="sb-action sb-logout" onClick={onLogout}>
                        <span className="nav-icon" aria-hidden="true">{ICONS.logout}</span>
                        Logout
                      </button>
                  )}
                </div>
            )}
            <div className="sidebar-copy">© 2026 Hotel Subhedar</div>
          </div>
        </aside>

        {/* Main content */}
        <main className="main-content">
          <header className="topbar">
            <div className="topbar-left">
              <button
                  className="hamburger"
                  onClick={() => setSidebarOpen(v => !v)}
                  aria-label="Toggle menu"
                  aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? '✕' : '☰'}
              </button>
              {/* <div className="topbar-title">
                <span aria-hidden="true">{currentNav?.icon}</span>
                {currentNav?.label}
              </div> */}
            </div>
            <div className="topbar-addr">
              {PIN} Sheetal Baug Rd, Bhosari, Pimpri-Chinchwad, MH 411039
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
