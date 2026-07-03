import { useState, useCallback, useMemo } from 'react';
import {
  Users as UsersIcon,
  Calculator,
  ShieldCheck,
  Building2,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import EmployeesPage from './pages/EmployeesPage.jsx';
import CalculateSalaryPage from './pages/CalculateSalaryPage.jsx';
import UsersPage from '@/features/users/UsersPage.jsx';
import BranchesPage from '@/features/branches/BranchesPage.jsx';
import { useAuth } from '@/features/auth/AuthContext.jsx';
import { ROLES, ROLE_LABELS } from '@/shared/constants/roles.js';
import logoUrl from '@/assets/logo.jpg';
import './styles/App.css';

// Each nav item lists the roles allowed to see it.
const NAV = [
  { id: 'employees', label: 'Employees', icon: UsersIcon, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  {
    id: 'calculate',
    label: 'Calculate Salary',
    icon: Calculator,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
  },
  { id: 'users', label: 'Users', icon: ShieldCheck, roles: [ROLES.ADMIN] },
  { id: 'branches', label: 'Branches', icon: Building2, roles: [ROLES.ADMIN] },
];

const PAGES = {
  employees: EmployeesPage,
  calculate: CalculateSalaryPage,
  users: UsersPage,
  branches: BranchesPage,
};

export default function AdminApp({ onExit }) {
  const { user, logout } = useAuth();
  const nav = useMemo(() => NAV.filter((item) => item.roles.includes(user?.role)), [user?.role]);

  const [active, setActive] = useState(() => nav[0]?.id ?? 'calculate');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useCallback((id) => {
    setActive(id);
    setSidebarOpen(false);
  }, []);

  function handleLogout() {
    logout();
    onExit?.();
  }

  const currentNav = nav.find((n) => n.id === active) ?? nav[0];
  const ActivePage = PAGES[currentNav?.id];
  const CurrentIcon = currentNav?.icon;

  return (
    <div className="app">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

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
            <span className="brand-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
                aria-current={active === item.id ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{ROLE_LABELS[user?.role] || user?.role}</div>
          </div>
          <button className="nav-item" onClick={onExit}>
            <span className="nav-icon" aria-hidden="true">
              <ArrowLeft size={18} />
            </span>
            <span className="nav-label">Back to Site</span>
          </button>
          <button className="nav-item" onClick={handleLogout}>
            <span className="nav-icon" aria-hidden="true">
              <LogOut size={18} />
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="topbar-title">
              {CurrentIcon && <CurrentIcon size={18} aria-hidden="true" />}
              {currentNav?.label}
            </div>
          </div>
          <div className="topbar-addr">Sheetal Baug Rd, Bhosari, Pimpri-Chinchwad, MH 411039</div>
        </header>

        <div className="content-area">{ActivePage && <ActivePage />}</div>
      </main>
    </div>
  );
}
