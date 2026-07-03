import { Sparkles, UtensilsCrossed, MapPin, ChevronDown } from 'lucide-react';
import logoUrl from '../assets/logo.png';
import { HOTEL } from '../data/hotel.js';

export default function Hero() {
  return (
      <section id="home" className="lp-hero">
        {/* Logo watermark behind the text (#9) */}
        <img src={logoUrl} alt="" aria-hidden="true" className="lp-hero-watermark" />

        <div className="lp-hero-inner">
          <span className="lp-hero-est">
            <Sparkles /> Est. {HOTEL.established} · {HOTEL.type}
          </span>
          <h1>{HOTEL.name}</h1>
          <p className="lp-hero-marathi" lang="mr">{HOTEL.taglineMarathi}</p>
          <p className="lp-hero-desc">
            Authentic Maharashtrian flavours, freshly hand-ground masalas, and honest
            home-style cooking — served the way it was always meant to be.
          </p>
          <div className="lp-hero-actions">
            <a href="#menu" className="lp-btn lp-btn--gold"><UtensilsCrossed />View Menu</a>
            <a href={HOTEL.mapsLink} target="_blank" rel="noreferrer" className="lp-btn lp-btn--outline"><MapPin />Find Us</a>
          </div>
        </div>

        <a href="#about" className="lp-scroll-cue" aria-label="Scroll down">
          <ChevronDown />
        </a>
      </section>
  );
}
