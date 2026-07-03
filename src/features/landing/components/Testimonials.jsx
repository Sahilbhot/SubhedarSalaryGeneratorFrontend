import { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS, REVIEW_SUMMARY, HOTEL } from '@/data/hotel.js';
import { fetchReviews } from '@/shared/services/reviews.js';

const AUTOPLAY_MS = 5000;

function Stars({ rating }) {
  return (
    <div className="lp-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.round(rating) ? 'on' : 'off'}
          fill={i < Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState(TESTIMONIALS);
  const [summary, setSummary] = useState(REVIEW_SUMMARY);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = reviews.length;

  const goTo = useCallback((i) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((v) => (v + 1) % count), [count]);
  const prev = useCallback(() => setIndex((v) => (v - 1 + count) % count), [count]);

  // Pull live Google reviews when VITE_REVIEWS_URL is configured; otherwise
  // the sample data above stays in place.
  useEffect(() => {
    let active = true;
    fetchReviews()
      .then((data) => {
        if (!active || !data) return;
        if (data.reviews.length > 0) {
          setReviews(data.reviews);
          setIndex(0);
        }
        if (data.summary.rating) {
          setSummary((s) => ({
            rating: data.summary.rating,
            count: data.summary.count || s.count,
          }));
        }
      })
      .catch(() => {
        /* keep sample reviews on failure */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;
    const id = setInterval(() => setIndex((v) => (v + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <section id="testimonials" className="lp-section">
      <div className="lp-container">
        <div className="lp-section-head">
          <span className="lp-eyebrow">Testimonials</span>
          <h2 className="lp-heading">What our guests say</h2>
          <div className="lp-rating-summary">
            <Stars rating={summary.rating} />
            <strong>{Number(summary.rating).toFixed(1)}</strong>
            <span>· {summary.count}+ Google reviews</span>
          </div>
        </div>

        <div
          className="lp-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button className="lp-carousel-arrow" onClick={prev} aria-label="Previous review">
            <ChevronLeft size={20} />
          </button>

          <div className="lp-carousel-viewport">
            <div
              className="lp-carousel-track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {reviews.map((r, i) => (
                <article className="lp-review" key={i} aria-hidden={i !== index}>
                  <Quote className="lp-review-quote" size={30} />
                  <Stars rating={r.rating} />
                  <p className="lp-review-text">{r.text}</p>
                  <div className="lp-review-author">
                    <div className="lp-review-avatar">
                      {r.photo ? (
                        <img src={r.photo} alt="" referrerPolicy="no-referrer" />
                      ) : (
                        <span>{(r.author || 'G').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <div className="lp-review-name">{r.author}</div>
                      <div className="lp-review-meta">{r.time}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button className="lp-carousel-arrow" onClick={next} aria-label="Next review">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="lp-carousel-dots" role="tablist" aria-label="Choose a review">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`lp-dot ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to review ${i + 1}`}
              aria-selected={i === index}
              role="tab"
            />
          ))}
        </div>

        <div className="lp-reviews-foot">
          <a href={HOTEL.mapsLink} target="_blank" rel="noreferrer" className="lp-btn lp-btn--gold">
            Read all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
