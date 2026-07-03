import { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS, REVIEW_SUMMARY, HOTEL } from '@/data/hotel.js';
import { fetchReviews } from '@/shared/services/reviews.js';

const AUTOPLAY_MS = 5000;
const READ_MORE_CHARS = 200; // show a "Read more" toggle beyond this length

// Cards visible at once, by viewport width.
function getPerView() {
  if (typeof window === 'undefined') return 1;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 640) return 2;
  return 1;
}

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
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [perView, setPerView] = useState(getPerView);

  const count = reviews.length;
  const maxIndex = Math.max(0, count - perView);
  const activeIndex = Math.min(index, maxIndex); // clamp when perView grows
  const pages = maxIndex + 1;

  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Navigating collapses any expanded review (and resumes autoplay).
  const goTo = useCallback(
    (i) => {
      setExpandedIndex(null);
      setIndex(Math.min(Math.max(i, 0), maxIndex));
    },
    [maxIndex],
  );
  const next = useCallback(() => {
    setExpandedIndex(null);
    setIndex((v) => (v >= maxIndex ? 0 : v + 1));
  }, [maxIndex]);
  const prev = useCallback(() => {
    setExpandedIndex(null);
    setIndex((v) => (v <= 0 ? maxIndex : v - 1));
  }, [maxIndex]);

  // Pull live Google reviews when VITE_REVIEWS_URL is configured; otherwise
  // the sample data stays in place.
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
    // Pause autoplay while hovering or while a review is expanded for reading.
    if (paused || expandedIndex !== null || maxIndex < 1) return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;
    const id = setInterval(() => setIndex((v) => (v >= maxIndex ? 0 : v + 1)), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, expandedIndex, maxIndex]);

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
          <button className="lp-carousel-arrow" onClick={prev} aria-label="Previous reviews">
            <ChevronLeft size={20} />
          </button>

          <div className="lp-carousel-viewport">
            <div
              className="lp-carousel-track"
              style={{
                '--per-view': perView,
                transform: `translateX(-${(activeIndex * 100) / perView}%)`,
              }}
            >
              {reviews.map((r, i) => {
                const isExpanded = expandedIndex === i;
                const isLong = r.text.length > READ_MORE_CHARS;
                const visible = i >= activeIndex && i < activeIndex + perView;
                return (
                  <div className="lp-slide" key={i}>
                    <article className="lp-review" aria-hidden={!visible}>
                      <Quote className="lp-review-quote" size={30} />
                      <Stars rating={r.rating} />
                      <p className={`lp-review-text ${isExpanded ? 'is-expanded' : ''}`}>
                        {r.text}
                      </p>
                      {isLong && (
                        <button
                          type="button"
                          className="lp-review-more"
                          onClick={() => setExpandedIndex(isExpanded ? null : i)}
                        >
                          {isExpanded ? 'Read less' : 'Read more'}
                        </button>
                      )}
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
                  </div>
                );
              })}
            </div>
          </div>

          <button className="lp-carousel-arrow" onClick={next} aria-label="Next reviews">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="lp-carousel-dots" role="tablist" aria-label="Choose reviews">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              className={`lp-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to review page ${i + 1}`}
              aria-selected={i === activeIndex}
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
