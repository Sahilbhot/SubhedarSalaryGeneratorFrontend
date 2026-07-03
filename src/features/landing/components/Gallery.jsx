import { GALLERY } from '@/data/hotel.js';

export default function Gallery() {
  return (
    <section id="gallery" className="lp-section">
      <div className="lp-container">
        <div className="lp-section-head">
          <span className="lp-eyebrow">Gallery</span>
          <h2 className="lp-heading">A taste of what awaits</h2>
          <p>
            Signature dishes from our kitchen. (Placeholder tiles — swap in real photos anytime.)
          </p>
        </div>

        <div className="lp-gallery-grid">
          {GALLERY.map((g, i) => (
            <figure key={i} className="lp-gallery-card">
              <span className="lp-gallery-emoji" aria-hidden="true">
                {g.emoji}
              </span>
              <figcaption className="lp-gallery-label">{g.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
