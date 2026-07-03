import { useState } from 'react';
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import logoUrl from '@/assets/logo.png';
import { HOTEL } from '@/data/hotel.js';
import { useAuth } from './AuthContext.jsx';
import './auth.css';

export default function LoginPage({ onSuccess, onBack }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <button type="button" className="auth-back" onClick={onBack}>
          <ArrowLeft size={16} /> Back to site
        </button>

        <div className="auth-brand">
          <img src={logoUrl} alt={HOTEL.name} />
          <h1>{HOTEL.name}</h1>
          <p>Staff Login</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              required
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <div className="auth-password">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            <LogIn size={18} />
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-hint">Accounts are created by an administrator.</p>
      </div>
    </div>
  );
}
