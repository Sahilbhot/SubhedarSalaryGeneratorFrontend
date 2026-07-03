import { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import About from './About.jsx';
import MenuSection from './MenuSection.jsx';
import Contact from './Contact.jsx';
import Footer from './Footer.jsx';
import './landing.css';

const THEME_KEY = 'subhedar-theme';

export default function LandingPage({ onLogin }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
      <div className="lp" data-theme={theme}>
        <a href="#main" className="lp-skip">Skip to content</a>
        <Navbar onLogin={onLogin} theme={theme} onToggleTheme={toggleTheme} />
        <main id="main">
          <Hero />
          <About />
          <MenuSection />
          {/* Gallery hidden for now — re-enable when real photos are ready. */}
          <Contact />
        </main>
        <Footer />
      </div>
  );
}
