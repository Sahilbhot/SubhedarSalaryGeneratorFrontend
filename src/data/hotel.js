// Central source of truth for all Hotel Subhedar public content.
// Edit this file to update the landing page — components read from here.

export const HOTEL = {
  name: 'Hotel Subhedar',
  tagline: 'Assal Gavakadcha',
  taglineMarathi: 'अस्सल गावाकडचं',
  established: 2026,
  type: 'Authentic Maharashtrian Restaurant',
  address: {
    line1: 'Sheetal Baug Rd, Century Enka Colony',
    line2: 'Bhosari, Pimpri-Chinchwad',
    city: 'Pune, Maharashtra 411039',
    full: 'Sheetal Baug Rd, Century Enka Colony, Bhosari, Pimpri-Chinchwad, Pune, Maharashtra 411039',
  },
  phone: '+91 72181 00050',
  phoneRaw: '917218100050', // for tel: / wa.me links
  email: 'subhedar.restro@gmail.com',
  website: 'hotelsubhedar.com',
  instagram: '@hotelsubhedar_',
  instagramUrl: 'https://instagram.com/hotelsubhedar_',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.0685687260866!2d73.84881100000001!3d18.6159854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c726d35311c7%3A0xc7e2ea2387f38773!2sHotel%20Subhedar%2C%20Veg%20%26%20Non%20Veg%2C%20Bhosari!5e0!3m2!1sen!2sae!4v1783078379839!5m2!1sen!2sae',
  mapsLink: 'https://maps.google.com/?q=Hotel+Subhedar+Bhosari+Pune',
};

export const HOURS = [
  { meal: 'Lunch', time: '12:00 PM – 4:00 PM' },
  { meal: 'Dinner', time: '7:00 PM – 11:00 PM' },
];

// Our Promise — shown in About Us as highlight cards.
// `icon` is a Lucide icon name (mapped to a component in About.jsx).
export const PROMISES = [
  {
    icon: 'Leaf',
    text: 'All spices freshly hand-ground in-house every morning using traditional methods',
  },
  { icon: 'Ban', text: 'No ready-made masalas, no MSG, no artificial flavour enhancers' },
  {
    icon: 'Palette',
    text: 'No artificial food colours — natural colour only from fresh ingredients and slow cooking',
  },
  { icon: 'Droplets', text: 'Gravies prepared without starch or chemical thickeners' },
  {
    icon: 'Beef',
    text: 'Only fresh, locally sourced meat and vegetables — never frozen or preserved',
  },
  { icon: 'Flame', text: 'Cooked in small batches with minimal oil — oil is never reused' },
  { icon: 'ShieldCheck', text: 'No artificial preservatives at any stage' },
  { icon: 'Home', text: 'Honest, home-style cooking with refined traditional taste' },
];

export const RULES = [
  'Please allow 20 minutes to serve you better',
  'Each Thali is served for 1 person only',
  'Sharing of Thali is not allowed',
];

// Menu grouped into categories. Each item: { name, price, desc?, serves? }
export const MENU = [
  {
    category: 'Mutton Starters',
    items: [
      { name: 'Mutton Kharda (Green)', price: 280 },
      { name: 'Mutton Sukka', price: 270 },
      { name: 'Mutton Ukkad', price: 300 },
      { name: 'Mutton Aalni Fry', price: 270 },
    ],
  },
  {
    category: 'Chicken Starters',
    items: [
      { name: 'Chicken Kharda (Green)', price: 190 },
      { name: 'Chicken Sukka', price: 190 },
      { name: 'Chicken Ukkad', price: 220 },
      { name: 'Chicken Aalni Fry', price: 190 },
    ],
  },
  {
    category: 'Other Starters',
    items: [
      { name: 'Roasted Papad', price: 30 },
      { name: 'Boiled Egg Plate (2 Eggs)', price: 40 },
      { name: 'Masala Papad', price: 60 },
      { name: 'Fry Papad', price: 40 },
    ],
  },
  {
    category: 'Mutton Thali',
    items: [
      {
        name: 'Subhedar Special Mutton Thali',
        price: 430,
        desc: 'Sukka + Rassa + Kheema + Sukhat + Aalni Soup + Indrayani Rice + Solkhadi + 2 Bhakri/Chapati',
      },
      {
        name: 'Mutton Thali',
        price: 380,
        desc: 'Sukka + Rassa + Indrayani Rice + 2 Bhakri/Chapati',
      },
      {
        name: 'Mutton Kheema Thali',
        price: 250,
        desc: 'Kheema + Rassa + Indrayani Rice + 2 Bhakri/Chapati',
      },
    ],
  },
  {
    category: 'Chicken Thali',
    items: [
      {
        name: 'Subhedar Special Chicken Thali',
        price: 360,
        desc: 'Sukka + Rassa + Kheema + Sukhat + Aalni Soup + Indrayani Rice + Solkhadi + 2 Bhakri/Chapati',
      },
      {
        name: 'Chicken Thali',
        price: 310,
        desc: 'Sukka + Rassa + Indrayani Rice + 2 Bhakri/Chapati',
      },
      {
        name: 'Chicken Kheema Thali',
        price: 230,
        desc: 'Kheema + Unlimited Rassa + Indrayani Rice + 2 Bhakri/Chapati',
      },
    ],
  },
  {
    category: 'Egg Thali',
    items: [
      { name: 'Aanda Thali', price: 200, desc: 'Egg Curry + Indrayani Rice + 2 Bhakri/Chapati' },
    ],
  },
  {
    category: 'Mutton Dish',
    items: [
      { name: 'Mutton Curry', price: 350 },
      { name: 'Mutton Kheema', price: 250 },
      { name: 'Mutton Handi Half', price: 580, serves: 'Serves 2' },
      { name: 'Mutton Handi Full', price: 950, serves: 'Serves 4' },
    ],
  },
  {
    category: 'Chicken Dish',
    items: [
      { name: 'Chicken Curry', price: 300 },
      { name: 'Chicken Kheema', price: 200 },
      { name: 'Chicken Handi Half', price: 450, serves: 'Serves 2' },
      { name: 'Chicken Handi Full', price: 700, serves: 'Serves 4' },
    ],
  },
  {
    category: 'Egg Dish',
    items: [
      { name: 'Egg Masala', price: 170 },
      { name: 'Egg Curry', price: 150 },
      { name: 'Omelette', price: 60 },
    ],
  },
  {
    category: 'Veg Dish',
    items: [
      { name: 'Masala Shev Bhaji', price: 180 },
      { name: 'Pithla Bhakri', price: 170 },
    ],
  },
  {
    category: 'Others',
    items: [
      { name: 'Aalni Bhat (Half / Full)', price: '170 / 220' },
      { name: 'Indrayani Rice (Half / Full)', price: '100 / 150' },
      { name: 'Indrayani Rice Bowl', price: 40 },
      { name: 'Soup Bowl', price: 50 },
      { name: 'Rassa Bowl', price: 50 },
      { name: 'Rassa Handi', price: 160 },
      { name: 'Solkhadi', price: 30 },
      { name: 'Sukhat', price: 50 },
      { name: 'Chapati', price: 25 },
      { name: 'Bajri / Jawari Bhakri', price: 35 },
      { name: 'Mineral Water', price: 20 },
    ],
  },
  {
    category: 'Party Orders',
    items: [
      { name: 'Mutton 1 kg', price: 1750, desc: 'Rassa + Sukka' },
      { name: 'Chicken 1 kg', price: 1250, desc: 'Rassa + Sukka' },
    ],
  },
];

// Gallery is placeholder-driven until real photos are added.
// Drop images into src/assets and swap `emoji`/gradient for <img> when available.
export const GALLERY = [
  { title: 'Subhedar Special Thali', emoji: '🍛' },
  { title: 'Mutton Handi', emoji: '🥘' },
  { title: 'Hand-Ground Masalas', emoji: '🌶️' },
  { title: 'Bhakri & Rassa', emoji: '🫓' },
  { title: 'Solkadhi', emoji: '🥥' },
  { title: 'Chicken Sukka', emoji: '🍗' },
];
