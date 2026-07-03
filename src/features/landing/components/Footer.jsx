import { Camera, Phone, MapPin } from 'lucide-react';
import logoUrl from '@/assets/logo.jpg';
import { HOTEL, HOURS } from '@/data/hotel.js';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'menu', label: 'Menu' },
  { id: 'contact', label: 'Contact Us' },
];

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-grid">
          <div>
            <div className="lp-footer-brand">
              <img
                src={logoUrl}
                alt={HOTEL.name}
                onError={(e) => {
                  e.target.style.visibility = 'hidden';
                }}
              />
              <div>
                <div className="n">{HOTEL.name}</div>
                <div className="t">
                  {HOTEL.tagline} · {HOTEL.taglineMarathi}
                </div>
              </div>
            </div>
            <p>
              {HOTEL.address.line1},<br />
              {HOTEL.address.line2}, {HOTEL.address.city}
            </p>
            <p>
              <a href={`tel:+${HOTEL.phoneRaw}`}>{HOTEL.phone}</a>
              {' · '}
              <a href={`mailto:${HOTEL.email}`}>{HOTEL.email}</a>
            </p>
            <div className="lp-footer-social">
              <a href={HOTEL.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Camera />
              </a>
              <a href={`tel:+${HOTEL.phoneRaw}`} aria-label="Call">
                <Phone />
              </a>
              <a href={HOTEL.mapsLink} target="_blank" rel="noreferrer" aria-label="Directions">
                <MapPin />
              </a>
            </div>
          </div>

          <div>
            <h5>Quick Links</h5>
            <ul className="lp-footer-links">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5>Opening Hours</h5>
            <ul className="lp-footer-links">
              {HOURS.map((h) => (
                <li key={h.meal}>
                  <strong style={{ color: '#fff' }}>{h.meal}</strong>
                  <br />
                  {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lp-footer-bottom">
          © {HOTEL.established} {HOTEL.name}. All rights reserved. · {HOTEL.website}
        </div>
      </div>
    </footer>
  );
}
