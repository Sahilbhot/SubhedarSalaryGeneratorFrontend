// Fetches live Google reviews from a Featurable widget (free, refreshes daily,
// no Google Cloud billing). Set the widget's API URL in .env:
//   VITE_REVIEWS_URL=https://api.featurable.com/v2/widgets/<your-widget-id>
//
// When the var is unset, the request fails, or the widget still shows example
// data, the carousel keeps its sample reviews from data/hotel.js.
const REVIEWS_URL = import.meta.env.VITE_REVIEWS_URL;

// Turn an ISO timestamp into a Google-style relative label ("a week ago").
function relativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return months <= 1 ? 'a month ago' : `${months} months ago`;
  const years = Math.floor(days / 365);
  return years <= 1 ? 'a year ago' : `${years} years ago`;
}

// Featurable v2 shape: { success, widget: { reviews[], gbpLocationSummary, isExampleReviews } }
function normalize(json) {
  const widget = json?.widget || json || {};

  // Don't display Featurable's generic placeholders before the widget is linked.
  if (widget.isExampleReviews) return { reviews: [], summary: {} };

  const list = Array.isArray(widget.reviews) ? widget.reviews : [];
  const reviews = list
    .map((r) => ({
      author: r.author?.name || 'Guest',
      rating: r.rating?.value ?? r.rating ?? 5,
      text: (r.text || r.originalText || '').trim(),
      time: relativeTime(r.publishedAt || r.createdAt),
      photo: r.author?.avatarUrl || null,
    }))
    .filter((r) => r.text); // skip star-only reviews with no comment

  const s = widget.gbpLocationSummary || {};
  const summary = {
    rating: s.rating ?? s.averageRating ?? null,
    count: s.reviewsCount ?? s.totalReviewCount ?? s.count ?? null,
  };

  return { reviews, summary };
}

export function isReviewsConfigured() {
  return Boolean(REVIEWS_URL);
}

export async function fetchReviews() {
  if (!REVIEWS_URL) return null;
  const res = await fetch(REVIEWS_URL);
  if (!res.ok) throw new Error(`Reviews request failed (${res.status})`);
  return normalize(await res.json());
}
