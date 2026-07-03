import { useState } from 'react';
import { MENU } from '../data/hotel.js';

const ALL = 'All';

export default function MenuSection() {
  const [active, setActive] = useState(ALL);

  const categories = active === ALL ? MENU : MENU.filter(c => c.category === active);

  return (
      <section id="menu" className="lp-section lp-section--tint">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Our Menu</span>
            <h2 className="lp-heading">Freshly cooked, honestly priced</h2>
            <p>From sizzling starters to our signature Subhedar Special Thali — every dish is made to order.</p>
          </div>

          <div className="lp-menu-tabs" role="tablist">
            <button
                className={`lp-tab ${active === ALL ? 'lp-tab--active' : ''}`}
                onClick={() => setActive(ALL)}
            >{ALL}</button>
            {MENU.map(c => (
                <button
                    key={c.category}
                    className={`lp-tab ${active === c.category ? 'lp-tab--active' : ''}`}
                    onClick={() => setActive(c.category)}
                >{c.category}</button>
            ))}
          </div>

          <div className="lp-menu-grid">
            {categories.map(cat => (
                <div key={cat.category} style={{ display: 'contents' }}>
                  <h3 className="lp-menu-cat-title">{cat.category}</h3>
                  {cat.items.map((item, i) => (
                      <div key={i} className="lp-menu-item">
                        <div className="lp-menu-item-info">
                          <div className="lp-menu-item-name">
                            {item.name}
                            {item.serves && <span className="lp-menu-item-serves">{item.serves}</span>}
                          </div>
                          {item.desc && <div className="lp-menu-item-desc">{item.desc}</div>}
                        </div>
                        <div className="lp-menu-item-price">{item.price}</div>
                      </div>
                  ))}
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}
