/**
 * ACHIEVE ABOARD — SITE SETTINGS
 * ==============================================================
 * Contact details, social links, navigation and SEO defaults.
 *
 * HOW TO EDIT
 *   1. Change the values below (text between quotes).
 *   2. Save the file.
 *   3. Run   npm run build   to regenerate the website pages.
 *
 * Tip: keep the quotes ' ' and commas , exactly as they are.
 */
export default {
  // ------------------------------------------------------------
  // BRAND
  // ------------------------------------------------------------
  brand: {
    name: 'ACHIEVE ABOARD',
    shortName: 'Achieve Aboard',
    tagline: 'Study Abroad | University Admission | Student Guidance',
    description:
      'Achieve Aboard is a study abroad consultancy that helps students explore international education, choose the right university and course, and get guidance from application to arrival.',
    logo: 'assets/img/logo.svg', //        header + footer logo
    logoPng: 'assets/img/logo-512.png', // used in search-engine structured data
  },

  // ------------------------------------------------------------
  // YOUR WEBSITE ADDRESS  (⚠ set this before you publish)
  // Example: 'https://www.yourdomain.com'   (no slash at the end)
  // It is needed for the Facebook share image, canonical links and the sitemap.
  // You can also set it at build time:  SITE_URL=https://yourdomain.com npm run build
  // ------------------------------------------------------------
  url: '',

  // ------------------------------------------------------------
  // CONTACT
  // ------------------------------------------------------------
  contact: {
    email: 'achieveaboard4@gmail.com',
    whatsapp: {
      number: '60167217612', //     digits only, with country code (no +, spaces or dashes) — used for wa.me links
      display: '+60167217612', //   how the number is shown on the page (spaced style also works, e.g. '+60 16-721 7612')
      message: 'Hello Achieve Aboard, I want to know about studying abroad.', // default pre-filled message
    },
  },

  // ------------------------------------------------------------
  // SOCIAL LINKS  (✏ paste your own page links; leave '' to hide an icon)
  // ------------------------------------------------------------
  social: {
    facebook: 'https://www.facebook.com/', // ← replace with your Facebook Page link
  },

  // ------------------------------------------------------------
  // NAVIGATION  (page keys: home, destinations, universities, courses, services, about, blog, contact)
  // ------------------------------------------------------------
  nav: [
    { label: 'Home', page: 'home' },
    { label: 'Study Destinations', page: 'destinations' },
    { label: 'Universities', page: 'universities' },
    { label: 'Courses', page: 'courses' },
    { label: 'Services', page: 'services' },
    { label: 'About Us', page: 'about' },
    { label: 'Blog', page: 'blog' },
    { label: 'Contact', page: 'contact' },
  ],
  headerCta: 'WhatsApp Us',

  footerLinks: [
    { label: 'Home', page: 'home' },
    { label: 'Destinations', page: 'destinations' },
    { label: 'Universities', page: 'universities' },
    { label: 'Courses', page: 'courses' },
    { label: 'Services', page: 'services' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ],

  // ------------------------------------------------------------
  // CONTACT FORM OPTIONS
  // (Countries come automatically from content/destinations.js)
  // ------------------------------------------------------------
  studyLevels: [
    'Foundation / Pre-University',
    'Diploma',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD / Doctorate',
    'English Language / Short Course',
    'Not sure yet',
  ],

  // ------------------------------------------------------------
  // LEGAL LINE shown in the footer on every page
  // ------------------------------------------------------------
  disclaimer:
    'Achieve Aboard provides guidance and support. Admission and visa decisions are made by universities and government authorities, and we cannot guarantee any outcome.',

  // ------------------------------------------------------------
  // SEO / SOCIAL SHARING
  // ------------------------------------------------------------
  seo: {
    locale: 'en_US',
    themeColor: '#0B1D4A',
    // Facebook / WhatsApp share image (1200 x 630). Replace the file to change it.
    ogImage: 'assets/img/og-image.jpg',
    ogImageAlt: 'Achieve Aboard — Your Journey to Global Education Starts Here',
  },

  // ------------------------------------------------------------
  // OPTIONAL TRACKING (leave '' to keep the site free of trackers)
  //   metaPixelId       — your Facebook/Meta Pixel ID, e.g. '1234567890'
  //   googleAnalyticsId — your GA4 Measurement ID, e.g. 'G-XXXXXXXXXX'
  // When set, WhatsApp clicks are reported as "Contact" events and form sends as "Lead".
  // ------------------------------------------------------------
  analytics: {
    metaPixelId: '',
    googleAnalyticsId: '',
  },

  // ------------------------------------------------------------
  // DISPLAY OPTIONS
  // ------------------------------------------------------------
  features: {
    // Shows a small "Sample" tag on placeholder universities / testimonials.
    // Remove `placeholder: true` from an entry once it is real, or set this to false to hide all tags.
    showSampleBadges: true,
  },
};
