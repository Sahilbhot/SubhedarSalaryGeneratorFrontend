import { useState } from 'react';
import logoUrl from '../assets/logo.jpg';
import './LoginPage.css';

/* Demo staff credentials — change these as needed.
   (No auth backend exists yet, so this is a client-side gate.) */
const VALID = { username: 'admin', password: 'subhedar@2026' };

const svg = (d) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const IcUser = svg(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
const IcLock = svg(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>);
const IcEye = svg(<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>);
const IcEyeOff = svg(<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /></>);
const IcAlert = svg(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>);
const IcArrow = svg(<path d="M19 12H5M12 19l-7-7 7-7" />);
const IcLogin = svg(<><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5M15 12H3" /></>);

export default function LoginPage({ onSuccess, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    // simulate a short auth round-trip for a polished feel
    setTimeout(() => {
      const ok =
        username.trim().toLowerCase() === VALID.username &&
        password === VALID.password;
      if (ok) {
        onSuccess?.(remember);
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 650);
  };

  return (
    <div className="login-page">
      <form className="lp-card" onSubmit={submit}>
        <div className="lp-brand">
          <img src={logoUrl} alt="Hotel Subhedar" className="lp-logo"
               onError={e => { e.target.style.visibility = 'hidden'; }} />
          <div className="lp-name">Hotel Subhedar</div>
          <div className="lp-sub">Staff Portal</div>
          <div className="lp-mr">॥ कर्मचारी प्रवेश ॥</div>
        </div>

        <div className="lp-head">
          <h2>Welcome Back</h2>
          <p>Sign in to access the Salary Manager</p>
        </div>

        {error && <div className="lp-error">{IcAlert} {error}</div>}

        <div className="lp-field">
          <label htmlFor="lp-user">Username</label>
          <div className="lp-input">
            <span className="lp-ic">{IcUser}</span>
            <input
              id="lp-user" type="text" autoComplete="username"
              placeholder="Enter your username"
              value={username} onChange={e => setUsername(e.target.value)}
              autoFocus required
            />
          </div>
        </div>

        <div className="lp-field">
          <label htmlFor="lp-pass">Password</label>
          <div className="lp-input">
            <span className="lp-ic">{IcLock}</span>
            <input
              id="lp-pass" type={show ? 'text' : 'password'} autoComplete="current-password"
              placeholder="Enter your password"
              value={password} onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" className="lp-eye" onClick={() => setShow(s => !s)}
                    aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? IcEyeOff : IcEye}
            </button>
          </div>
        </div>

        <div className="lp-row">
          <label className="lp-remember">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Remember me
          </label>
          <button type="button" className="lp-forgot"
                  onClick={() => alert('Please contact the administrator to reset your password.')}>
            Forgot password?
          </button>
        </div>

        <button type="submit" className="lp-btn" disabled={loading}>
          {loading ? <><span className="lp-spin" /> Signing in…</> : <>{IcLogin} Sign In</>}
        </button>

        <div className="lp-foot">
          <button type="button" className="lp-back" onClick={onBack}>{IcArrow} Back to Website</button>
          <div className="lp-hint">Authorised staff only · Hotel Subhedar © 2026</div>
        </div>
      </form>
    </div>
  );
}
