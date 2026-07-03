import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, LogIn } from 'lucide-react';
import logoUrl from '@/assets/logo.png';
import { HOTEL } from '@/data/hotel.js';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'menu', label: 'Menu' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'contact', label: 'Contact Us' },
];

export default function Navbar({ onLogin, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : 'lp-nav--top'}`}>
        <div className="lp-container lp-nav-inner">
          <a href="#home" className="lp-brand" onClick={closeMobile}>
            <img
              src={logoUrl}
              alt={HOTEL.name}
              onError={(e) => {
                e.target.style.visibility = 'hidden';
              }}
            />
            <span className="lp-brand-text">
              <span className="lp-brand-name">{HOTEL.name}</span>
              <span className="lp-brand-tag" lang="mr">
                {HOTEL.taglineMarathi}
              </span>
            </span>
          </a>

          <nav className="lp-nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="lp-nav-cta">
            <button
              className="lp-icon-btn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon /> : <Sun />}
            </button>
            <button className="lp-login" onClick={onLogin}>
              <LogIn />
              <span>Login</span>
            </button>
            <button
              className="lp-icon-btn lp-hamburger"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      <div className={`lp-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="lp-mobile-close" aria-label="Close menu" onClick={closeMobile}>
          <X />
        </button>
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={closeMobile}>
            {l.label}
          </a>
        ))}
        <button
          className="lp-btn lp-btn--gold"
          onClick={() => {
            closeMobile();
            onLogin();
          }}
        >
          <LogIn />
          Login
        </button>
      </div>
    </>
  );
}
