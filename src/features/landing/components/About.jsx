import { Leaf, Ban, Palette, Droplets, Beef, Flame, ShieldCheck, Home, Check } from 'lucide-react';
import { HOTEL, PROMISES, RULES } from '@/data/hotel.js';

// Map data-file icon names → Lucide components.
const ICONS = { Leaf, Ban, Palette, Droplets, Beef, Flame, ShieldCheck, Home };

export default function About() {
  return (
    <section id="about" className="lp-section">
      <div className="lp-container">
        <div className="lp-about-grid">
          <div>
            <span className="lp-eyebrow">Our Story</span>
            <h2 className="lp-heading">Assal Gavakadcha — the true taste of the village</h2>
            <p className="lp-about-lead">
              At <strong>{HOTEL.name}</strong>, every dish is a tribute to authentic Maharashtrian
              cooking. We grind our spices by hand each morning and cook in small batches so every
              plate carries the honest, home-style flavour our guests come back for.
            </p>
            <p className="lp-about-lead">
              No shortcuts, no compromises — just fresh ingredients, traditional methods, and a
              promise of quality in every bite.
            </p>

            <div className="lp-rules">
              <h4>A few things to know before you dine</h4>
              <ul>
                {RULES.map((rule, i) => (
                  <li key={i}>
                    <Check />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <span className="lp-eyebrow">Our Promise</span>
            <h2 className="lp-heading" style={{ fontSize: '27px' }}>
              What makes every plate honest
            </h2>
            <div className="lp-promises">
              {PROMISES.map((p, i) => {
                const Icon = ICONS[p.icon] || Leaf;
                return (
                  <div key={i} className="lp-promise">
                    <div className="lp-promise-icon">
                      <Icon />
                    </div>
                    <p>{p.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
