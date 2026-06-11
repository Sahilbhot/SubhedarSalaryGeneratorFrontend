import { useState, useEffect, useRef, useCallback } from 'react';
import logoUrl from '../assets/logo.jpg';
import './LandingPage.css';

/* ─── tiny inline icon set (stroke) ─── */
const I = {
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  star: <path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.6 3.2L6.7 14l-5-4.8 7-.9L12 2z"/>,
  play: <path d="M5 3l16 9-16 9V3z"/>,
  leaf: <><path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 12-9-1 7-3 13-5 16z"/><path d="M4 21c2-4 5-7 9-9"/></>,
  chef: <><path d="M6 13a4 4 0 1 1 1-7.87A4 4 0 0 1 15 5a4 4 0 1 1 1 8"/><path d="M6 13v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/></>,
  truck: <><rect x="1" y="5" width="13" height="11" rx="1"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
  award: <><circle cx="12" cy="8" r="6"/><path d="M9 13l-2 8 5-3 5 3-2-8"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>,
  smile: <><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></>,
  utensils: <><path d="M3 2v7a3 3 0 0 0 3 3v10M9 2v20M6 2v7"/><path d="M17 2v20c3 0 4-2 4-6s-1-7-4-8V2z"/></>,
  check: <path d="M20 6L9 17l-5-5"/>,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7"/>,
  fb: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>,
  ig: <><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
  tw: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>,
  yt: <><path d="M22 12s0-3.5-.45-5.18a2.78 2.78 0 0 0-1.96-1.96C17.9 4.41 12 4.41 12 4.41s-5.9 0-7.59.45A2.78 2.78 0 0 0 2.45 6.82 29 29 0 0 0 2 12a29 29 0 0 0 .45 5.18 2.78 2.78 0 0 0 1.96 1.96c1.69.45 7.59.45 7.59.45s5.9 0 7.59-.45a2.78 2.78 0 0 0 1.96-1.96C22 15.5 22 12 22 12z"/><path d="m10 15 5-3-5-3z"/></>,
};
const Icon = ({ d, w = 20 }) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

/* ─── data ─── */
const NAV = [
  ['Home', 'home'], ['About', 'about'], ['Menu', 'menu'],
  ['Specials', 'specials'], ['Gallery', 'gallery'], ['Contact', 'contact'],
];

const MENU = {
  Starters: [
    ['Veg Crispy', 'Crunchy fried vegetables tossed in tangy schezwan', 180, 'veg', 'unsplash:photo-1606491956689-2ea866880c84'],
    ['Chicken 65', 'Fiery South-Indian style fried chicken bites', 260, 'spicy', 'unsplash:photo-1610057099431-d73a1c9d2f2f'],
    ['Paneer Tikka', 'Cottage cheese chargrilled with smoky spices', 240, 'veg', 'unsplash:photo-1599487488170-d11ec9c172f0'],
    ['Tandoori Wings', 'Clay-oven roasted wings, mint chutney', 290, 'chef', 'unsplash:photo-1567620832903-9fc6debc209f'],
  ],
  'Main Course': [
    ['Butter Chicken', 'Tandoori chicken in silky tomato-butter gravy', 340, 'chef', 'unsplash:photo-1603894584373-5ac82b2ae398'],
    ['Paneer Lababdar', 'Rich creamy paneer in royal Mughlai gravy', 280, 'veg', 'unsplash:photo-1631452180519-c014fe946bc7'],
    ['Mutton Rogan Josh', 'Slow-cooked Kashmiri lamb, aromatic spices', 420, 'spicy', 'unsplash:photo-1545247181-516773cae754'],
    ['Dal Tadka', 'Yellow lentils tempered with ghee & garlic', 190, 'veg', 'unsplash:photo-1546833999-b9f581a1996d'],
  ],
  'Biryani & Rice': [
    ['Hyderabadi Dum Biryani', 'Fragrant basmati layered with marinated meat', 320, 'chef', 'unsplash:photo-1563379091339-03b21ab4a4f8'],
    ['Veg Dum Biryani', 'Saffron rice with garden vegetables & nuts', 240, 'veg', 'unsplash:photo-1589302168068-964664d93dc0'],
    ['Jeera Rice', 'Basmati tempered with cumin & whole spices', 150, 'veg', 'unsplash:photo-1516684732162-798a0062be99'],
    ['Prawn Biryani', "Coastal-style biryani with juicy prawns", 380, 'spicy', 'unsplash:photo-1633945274405-b6c8069047b0'],
  ],
  'Breads & Tandoor': [
    ['Butter Naan', 'Soft leavened bread brushed with butter', 50, 'veg', 'unsplash:photo-1626777552726-4a6b54c97e46'],
    ['Garlic Kulcha', 'Stuffed bread with garlic & coriander', 70, 'veg', 'unsplash:photo-1565557623262-b51c2513a641'],
    ['Tandoori Roti', 'Whole-wheat clay-oven flatbread', 35, 'veg', 'unsplash:photo-1574653853027-5d3ac9b9a6e7'],
    ['Laccha Paratha', 'Flaky multi-layered hand-rolled paratha', 60, 'veg', 'unsplash:photo-1601050690597-df0568f70950'],
  ],
  Desserts: [
    ['Gulab Jamun', 'Warm milk dumplings in rose-cardamom syrup', 90, 'veg', 'unsplash:photo-1605197788044-5a32c7078486'],
    ['Gajar Halwa', 'Slow-cooked carrot pudding with dry fruits', 120, 'chef', 'unsplash:photo-1589119908995-c6837fa14848'],
    ['Rasmalai', 'Soft cheese discs in saffron-cream milk', 110, 'veg', 'unsplash:photo-1488477181946-6428a0291777'],
    ['Kulfi Falooda', 'Traditional frozen kulfi with vermicelli', 130, 'veg', 'unsplash:photo-1497034825429-c343d7c6a68f'],
  ],
};

const SPECIALS = [
  ['Royal Subhedar Thali', 'A grand platter of 12 authentic delicacies — a feast fit for royalty.', 449, 'unsplash:photo-1585937421612-70a008356fbe'],
  ['Signature Dum Biryani', 'Our most-loved dish, sealed and slow-cooked in dum style.', 320, 'unsplash:photo-1563379091339-03b21ab4a4f8'],
  ['Tandoori Platter', 'An assortment of chargrilled kebabs straight from the clay oven.', 540, 'unsplash:photo-1599487488170-d11ec9c172f0'],
];

const TESTIMONIALS = [
  ['Kamran Khan', 'Pune, Maharashtra', 'The Chicken Kharda here is absolutely fire! That spicy, authentic flavour is hard to find anywhere else. Generous portions and friendly staff. I will definitely be coming back.'],
  ['Ashish Dhanorkar', 'Amravati, Maharashtra', 'Went for a family dinner and ordered the Chicken Thali — it was loaded, fresh and full of flavour. Clean, cozy ambience and warm service. Highly recommended!'],
  ['Maheboob Pathan', 'Nagpur, Maharashtra', "It's a new place, but the taste feels just like home. You must try the Mutton Thali — tender, rich and absolutely worth it. Great value for money and full satisfaction."],
];

const GALLERY = [
  ['unsplash:photo-1517248135467-4c7edcad34c4', 'wide'],
  ['unsplash:photo-1555396273-367ea4eb4db5', 'tall'],
  ['unsplash:photo-1551782450-a2132b4ba21d', ''],
  ['unsplash:photo-1414235077428-338989a2e8c0', ''],
  ['unsplash:photo-1466978913421-dad2ebd01d17', ''],
  ['unsplash:photo-1559339352-11d035aa65de', 'wide'],
  ['unsplash:photo-1574071318508-1cdbab80d002', ''],
  ['unsplash:photo-1559847844-5315695dadae', ''],
];

const img = (id, w = 600) =>
  `https://images.unsplash.com/${id.replace('unsplash:', '')}?auto=format&fit=crop&w=${w}&q=80`;

const ADDRESS = 'Sheetal Baug Rd, Bhosari, Pimpri-Chinchwad, Maharashtra 411039';
const MAP_SRC =
  'https://www.google.com/maps?q=' +
  encodeURIComponent('Sheetal Baug Rd, Bhosari, Pimpri-Chinchwad, Maharashtra 411039') +
  '&t=&z=15&ie=UTF8&iwloc=&output=embed';

/* ─── reveal-on-scroll hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}


export default function LandingPage({ onStaffLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState('Starters');
  // const [booked, setBooked] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const heroRef = useRef(null);

  useReveal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowTop(window.scrollY > 600);
      if (heroRef.current) {
        setOnHero(window.scrollY < heroRef.current.offsetHeight - 100);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = useCallback((id) => (e) => {
    e?.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // const submitBooking = (e) => {
  //   e.preventDefault();
  //   setBooked(true);
  //   e.target.reset();
  //   setTimeout(() => setBooked(false), 6000);
  // };

  return (
    <div className="site">
      {/* ─── Top info bar ─── */}
      <div className="topinfo">
        <div className="site-wrap">
          <div className="topinfo-l">
            <span className="topinfo-i"><Icon d={I.phone} w={14} /><span>+91 7218100050</span></span>
            <span className="topinfo-i"><Icon d={I.clock} w={14} /><span>Mon–Sun · 12–4 PM &amp; 7–11 PM</span></span>
            <span className="topinfo-i"><Icon d={I.pin} w={14} /><span>Bhosari, Pimpri-Chinchwad</span></span>
          </div>
          <div className="topinfo-r">
            <span className="lbl">Follow us</span>
            <div className="topinfo-social">
              <a href="#" aria-label="Facebook"><Icon d={I.fb} /></a>
              <a href="#" aria-label="Instagram"><Icon d={I.ig} /></a>
              <a href="#" aria-label="Twitter"><Icon d={I.tw} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Navbar ─── */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''} ${onHero ? 'on-hero' : ''}`}>
        <div className="site-wrap">
          <a className="brand" href="#home" onClick={go('home')}>
            <img src={logoUrl} alt="Hotel Subhedar" className="brand-logo"
                 onError={e => { e.target.style.visibility = 'hidden'; }} />
            <div>
              <div className="brand-name">Hotel Subhedar</div>
              <div className="brand-sub">Fine Indian Dining</div>
            </div>
          </a>
          <ul className="nav-links">
            {NAV.map(([label, id]) => (
              <li key={id}><a href={`#${id}`} onClick={go(id)}>{label}</a></li>
            ))}
          </ul>
          <div className="nav-cta">
            <button type="button" className="btn btn--primary" onClick={() => { setMenuOpen(false); onStaffLogin?.(); }}>Login</button>
            <button className="nav-toggle" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile menu ─── */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close">×</button>
        {NAV.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={go(id)}>{label}</a>
        ))}
        <button type="button" className="btn btn--gold" onClick={() => { setMenuOpen(false); onStaffLogin?.(); }}>Login</button>
      </div>

      {/* ─── Hero ─── */}
      <header className="hero" id="home" ref={heroRef}>
        <div className="site-wrap">
          <div className="hero-inner">
            <span className="hero-badge reveal in">✦ Newly Opened in Bhosari · Est. 2026</span>
            <span className="hero-mr reveal in">॥ आपलं मनःपूर्वक स्वागत आहे ॥</span>
            <h1 className="reveal in d1">
              Where Every Bite <br /> Tells a <span className="hl">Royal Story</span>
            </h1>
            <p className="reveal in d2">
              Experience the rich flavours of traditional Indian & Maharashtrian cuisine,
              crafted with love and the finest spices — right in the heart of Bhosari.
            </p>
          </div>
        </div>
        <div className="hero-scroll"><span>Scroll</span><span className="mouse" /></div>
      </header>

      {/* ─── About ─── */}
      <section className="section section--cream" id="about">
        <div className="site-wrap about-grid">
          <div className="about-media reveal left">
            <div className="about-badge"><b>2026</b><span>Proudly Established</span></div>
            <img src={img('unsplash:photo-1414235077428-338989a2e8c0', 800)} alt="Restaurant ambience" />
            <img className="img-2" src={img('unsplash:photo-1559339352-11d035aa65de', 600)} alt="Chef plating food" />
          </div>
          <div className="about-text reveal right">
            <div className="eyebrow">About Hotel Subhedar</div>
            <h2>A Legacy of Flavour, Served with Warmth</h2>
            <p className="about-mr">घरच्या जेवणाची चव, सुभेदार हॉटेलमध्ये — २०२६ पासून आपल्या सेवेत.</p>
            <p>
              Freshly opened in 2026, Hotel Subhedar is the newest home of authentic Indian dining
              in Pimpri-Chinchwad. What began as a family dream is fast becoming a favourite spot
              for food lovers who crave honest, soulful cooking.
            </p>
            <p>
              Every dish is prepared fresh with hand-ground spices, farm-fresh produce and time-honoured
              family recipes — because we believe great food brings people together.
            </p>
            <div className="about-feats">
              {[
                [I.leaf, 'Farm Fresh', 'Locally sourced daily'],
                [I.chef, 'Skilled Chefs', 'Years of expertise'],
                [I.award, 'Highly Rated', 'Loved by locals'],
                [I.utensils, 'Authentic Recipes', 'Traditional & pure'],
              ].map(([ic, t, s]) => (
                <div className="about-feat" key={t}>
                  <span className="ic"><Icon d={ic} /></span>
                  <div><b>{t}</b><small>{s}</small></div>
                </div>
              ))}
            </div>
            <div className="sign">
              <div className="sign-name">Bhot Family
                <small>Founders & Owners</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="section section--cream2">
        <div className="site-wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Why Choose Us</div>
            <h2 className="section-title">The <span className="hl">Subhedar</span> Difference</h2>
            <div className="divider"><span /><Icon d={I.utensils} /><span /></div>
          </div>
          <div className="feat-grid">
            {[
              [I.chef, 'Expert Chefs', 'Our skilled chefs bring years of culinary mastery to every plate they craft.'],
              [I.leaf, 'Fresh Ingredients', 'We handpick the freshest produce and grind our spices in-house, every single day.'],
              [I.truck, 'Quick Delivery', 'Hot, fresh and on time — enjoy your favourite meals at home in record time.'],
            ].map(([ic, t, d], i) => (
              <div className={`feat-card reveal d${i + 1}`} key={t}>
                <div className="feat-ic"><Icon d={ic} w={34} /></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Menu ─── */}
      <section className="section section--cream" id="menu">
        <div className="site-wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Our Menu</div>
            <h2 className="section-title">Crafted to <span className="hl">Delight</span></h2>
            <p className="section-sub">From sizzling starters to royal mains — explore flavours loved by thousands.</p>
            <div className="divider"><span /><Icon d={I.utensils} /><span /></div>
          </div>
          <div className="menu-tabs reveal">
            {Object.keys(MENU).map(cat => (
              <button key={cat} className={`menu-tab ${tab === cat ? 'active' : ''}`} onClick={() => setTab(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className="menu-grid">
            {MENU[tab].map(([name, desc, price, tag, image], i) => (
              <div className="menu-item" key={name} style={{ animationDelay: `${i * 0.06}s` }}>
                <img src={img(image, 200)} alt={name} loading="lazy"
                     onError={e => { e.target.src = img('unsplash:photo-1504674900247-0877df9cc836', 200); }} />
                <div className="mi-body">
                  <div className="mi-top">
                    <span className="mi-name">{name}</span>
                    <span className={`menu-tag ${tag}`}>{tag === 'veg' ? 'VEG' : tag === 'spicy' ? 'SPICY' : "CHEF'S"}</span>
                    <span className="mi-dots" />
                    <span className="mi-price">₹{price}</span>
                  </div>
                  <div className="mi-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Specials ─── */}
      <section className="section section--cream2" id="specials">
        <div className="site-wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Chef's Recommendations</div>
            <h2 className="section-title">Today's <span className="hl">Specials</span></h2>
            <div className="divider"><span /><Icon d={I.chef} /><span /></div>
          </div>
          <div className="spec-grid">
            {SPECIALS.map(([name, desc, price, image], i) => (
              <div className={`spec-card reveal d${i + 1}`} key={name}>
                <div className="spec-thumb">
                  <img src={img(image, 700)} alt={name} loading="lazy" />
                  <span className="spec-price">₹{price}</span>
                </div>
                <div className="spec-body">
                  <div className="stars">★★★★★</div>
                  <h3>{name}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="section section--cream">
        <div className="site-wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Testimonials</div>
            <h2 className="section-title">What Our <span className="hl">Guests</span> Say</h2>
            <div className="divider"><span /><Icon d={I.smile} /><span /></div>
          </div>
          <div className="tst-grid">
            {TESTIMONIALS.map(([name, role, text], i) => (
              <div className={`tst-card reveal d${i + 1}`} key={name}>
                <span className="tst-quote">”</span>
                <div className="tst-stars">★★★★★</div>
                <p>{text}</p>
                <div className="tst-who">
                  <span className="tst-avatar">{name.charAt(0)}</span>
                  <div><b>{name}</b><small>{role}</small></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section className="section section--cream2" id="gallery">
        <div className="site-wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Gallery</div>
            <h2 className="section-title">A Glimpse Into <span className="hl">Subhedar</span></h2>
            <div className="divider"><span /><Icon d={I.utensils} /><span /></div>
          </div>
          <div className="gallery-grid">
            {GALLERY.map(([image, cls], i) => (
              <div className={`gal-item ${cls} reveal zoom`} key={i}>
                <img src={img(image, cls === 'wide' ? 900 : 600)} alt="Gallery" loading="lazy" />
                <span className="gal-ic"><Icon d={I.utensils} w={28} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Reservation ─── */}
      <section className="section book" id="book">
        <div className="site-wrap book-grid">
          <div className="book-left reveal left">
            <div className="eyebrow">Reservations</div>
            <h2>Book Your <span className="hl">Table</span> Today</h2>
            <p>
              Planning a family dinner, a celebration or a quiet date night? Reserve your spot
              and let us take care of the rest. We can't wait to host you.
            </p>
            <div className="book-contact">
              <div className="bc">
                <span className="ic"><Icon d={I.phone} /></span>
                <div><small>Call to reserve</small><b>+91 7218100050</b></div>
              </div>
              <div className="bc">
                <span className="ic"><Icon d={I.clock} /></span>
                <div><small>Open daily</small><b>12–4 PM &amp; 7–11 PM</b></div>
              </div>
            </div>
          </div>
          {/* <form className="book-form reveal right" onSubmit={submitBooking}>
            <h3>Reserve a Table</h3>
            <p className="fhint">Fill in your details and we'll confirm shortly.</p>
            <div className="book-row">
              <div className="book-field">
                <label>Full Name</label>
                <input type="text" required placeholder="Your name" />
              </div>
              <div className="book-field">
                <label>Phone</label>
                <input type="tel" required placeholder="+91 ..." />
              </div>
            </div>
            <div className="book-row">
              <div className="book-field">
                <label>Date</label>
                <input type="date" required />
              </div>
              <div className="book-field">
                <label>Time</label>
                <input type="time" required />
              </div>
            </div>
            <div className="book-row">
              <div className="book-field">
                <label>Guests</label>
                <select defaultValue="2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n}>{n}</option>)}
                  <option>8+</option>
                </select>
              </div>
              <div className="book-field">
                <label>Occasion</label>
                <select defaultValue="">
                  <option value="">Select</option>
                  <option>Birthday</option><option>Anniversary</option>
                  <option>Family Dinner</option><option>Business Meal</option>
                </select>
              </div>
            </div>
            <div className="book-field" style={{ marginBottom: 14 }}>
              <label>Special Request</label>
              <textarea rows={2} placeholder="Any preferences?" />
            </div>
            <button type="submit" className="btn btn--primary">Confirm Reservation</button>
            {booked && (
              <div className="book-ok">
                <Icon d={I.check} w={18} /> Thank you! Your table request has been received.
              </div>
            )}
          </form> */}
        </div>
      </section>

      {/* ─── Contact + Map ─── */}
      <section className="section section--cream" id="contact">
        <div className="site-wrap">
          <div className="section-head reveal">
            <div className="eyebrow">Get in Touch</div>
            <h2 className="section-title">Visit <span className="hl">Us</span></h2>
            <p className="section-sub">We'd love to welcome you. Find us easily on the map below.</p>
            <div className="divider"><span /><Icon d={I.pin} /><span /></div>
          </div>
          <div className="contact-grid">
            <div className="contact-cards reveal left">
              <div className="contact-card">
                <span className="ic"><Icon d={I.pin} /></span>
                <div><h4>Our Location</h4><p>{ADDRESS}</p></div>
              </div>
              <div className="contact-card">
                <span className="ic"><Icon d={I.phone} /></span>
                <div><h4>Call Us</h4><p><a href="tel:+919000012345">+91 7218100050</a><br />
                  </p></div>
              </div>
              <div className="contact-card">
                <span className="ic"><Icon d={I.mail} /></span>
                <div><h4>Email Us</h4><p><a href="mailto:subhedar.restro@gmail.com">subhedar.restro@gmail.com</a></p></div>
              </div>
              <div className="contact-card">
                <span className="ic"><Icon d={I.clock} /></span>
                <div><h4>Opening Hours</h4><p>Monday – Sunday<br />Lunch: 12:00 PM – 4:00 PM<br />Dinner: 7:00 PM – 11:00 PM</p></div>
              </div>
            </div>
            <div className="map-wrap reveal right">
              <div className="map-pin">
                <span className="ic"><Icon d={I.pin} /></span>
                <div><b>Hotel Subhedar</b><small>Bhosari, Pimpri-Chinchwad</small></div>
              </div>
              <iframe
                title="Hotel Subhedar location on Google Maps"
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="site-wrap footer-grid">
          <div className="footer-about">
            <div className="brand">
              <img src={logoUrl} alt="Hotel Subhedar" className="brand-logo"
                   onError={e => { e.target.style.visibility = 'hidden'; }} />
              <div>
                <div className="brand-name">Hotel Subhedar</div>
                <div className="brand-sub">Fine Indian Dining</div>
              </div>
            </div>
            <p className="footer-mr">चव परंपरेची, सेवा आपुलकीची</p>
            <p>Serving authentic Indian & Maharashtrian flavours with love since 2026.
              Come hungry, leave happy — that's the Subhedar promise.</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><Icon d={I.fb} /></a>
              <a href="#" aria-label="Instagram"><Icon d={I.ig} /></a>
              <a href="#" aria-label="Twitter"><Icon d={I.tw} /></a>
              <a href="#" aria-label="YouTube"><Icon d={I.yt} /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {NAV.map(([label, id]) => (
                <li key={id}><a href={`#${id}`} onClick={go(id)}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Opening Hours</h4>
            <div className="footer-hours"><span>Open All Days</span><span>Mon – Sun</span></div>
            <div className="footer-hours"><span>Lunch</span><span>12 – 4 PM</span></div>
            <div className="footer-hours"><span>Dinner</span><span>7 – 11 PM</span></div>
          </div>
          <div className="footer-col">
            <h4>Newsletter</h4>
            <p>Subscribe for exclusive offers, new dishes and special events.</p>
            <form className="footer-news" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email" aria-label="Email" />
              <button type="submit" aria-label="Subscribe"><Icon d={I.mail} w={16} /></button>
            </form>
          </div>
        </div>
        <div className="footer-bar">
          <div className="site-wrap">
            <span>© 2026 Hotel Subhedar. All rights reserved.</span>
            <span>
              Crafted with ❤ in Pimpri-Chinchwad ·{' '}
              <a className="staff-link" onClick={onStaffLogin}>Staff Login</a>
            </span>
          </div>
        </div>
      </footer>

      {/* ─── Scroll to top ─── */}
      <button className={`to-top ${showTop ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        <Icon d={I.arrowUp} w={20} />
      </button>
    </div>
  );
}
