/**
 * STUDY DESTINATIONS
 * ==============================================================
 * One entry = one destination card. The countries listed here also appear in:
 *   • the university filter       • the contact-form "Country of Interest" list
 *   • the footer-free text {destinations}
 *
 * TO ADD A COUNTRY:   copy a block { ... }, paste it below, change the text.
 *                     Put a photo in assets/img/destinations/ (a 3:2 landscape .webp or .jpg, ~800px wide).
 * TO REMOVE ONE:      delete its block.
 *
 * Fields
 *   name       – country name shown on the card (must match `country` in content/universities.js)
 *   phrase     – how it reads in a sentence, e.g. 'the UK'  (optional, defaults to name)
 *   code       – small airport-style tag on the photo, e.g. 'KUL'  (optional)
 *   image      – path to the photo. If a smaller "-480" version exists next to it
 *                (e.g. malaysia-480.webp) it is used automatically on phones.
 *   imageAlt   – short description of the photo (for accessibility + SEO)
 *   tagline    – one line shown on the card
 *   highlights – 3 short points (Destinations page)
 *   fields     – popular study areas (shown as small tags)
 *
 * NOTE: keep claims factual and general — avoid costs, rankings, work-rights or visa promises
 *       unless you can back them up with an official source.
 */
export default [
  {
    name: 'Malaysia',
    code: 'KUL',
    image: 'assets/img/destinations/malaysia.webp',
    imageAlt: 'Kuala Lumpur skyline with the Petronas Twin Towers at golden hour',
    tagline: 'A multicultural study hub with international campuses and English-taught programs.',
    highlights: [
      'Wide range of programs in business, IT, engineering and more',
      'A diverse, international student community',
      'English-taught programs available',
    ],
    fields: ['Business', 'IT', 'Engineering', 'Hospitality'],
  },
  {
    name: 'Australia',
    code: 'SYD',
    image: 'assets/img/destinations/australia.webp',
    imageAlt: 'Sydney Opera House and Harbour Bridge on a sunny day',
    tagline: 'Career-focused courses in welcoming, multicultural cities.',
    highlights: [
      'Practical, career-focused course options',
      'Established support services for international students',
      'Vibrant, multicultural cities',
    ],
    fields: ['Business', 'IT', 'Health', 'Hospitality'],
  },
  {
    name: 'UK',
    phrase: 'the UK',
    code: 'LHR',
    image: 'assets/img/destinations/uk.webp',
    imageAlt: 'Big Ben and Westminster Bridge in London with a red double-decker bus',
    tagline: 'Historic universities and a wide choice of undergraduate and postgraduate programs.',
    highlights: [
      'A long academic tradition and diverse course options',
      'Many undergraduate and postgraduate programs to explore',
      'Rich culture, history and global connections',
    ],
    fields: ['Business', 'Finance', 'Social Sciences', 'Computing'],
  },
  {
    name: 'Canada',
    code: 'YYZ',
    image: 'assets/img/destinations/canada.webp',
    imageAlt: 'Toronto skyline and CN Tower at sunset framed by red maple leaves',
    tagline: 'Welcoming cities and a strong focus on practical, hands-on learning.',
    highlights: [
      'Friendly, multicultural communities',
      'Programs with practical learning components',
      'A wide choice of colleges and universities',
    ],
    fields: ['Engineering', 'IT', 'Business', 'Health'],
  },
  {
    name: 'USA',
    phrase: 'the USA',
    code: 'JFK',
    image: 'assets/img/destinations/usa.webp',
    imageAlt: 'Manhattan skyline and the Brooklyn Bridge at golden hour',
    tagline: 'A huge range of universities, majors and campus experiences.',
    highlights: [
      'Flexible degree structures at many universities',
      'An extensive choice of majors and campus life',
      'A strong research and innovation culture',
    ],
    fields: ['Computer Science', 'Business', 'Engineering', 'Data Science'],
  },
  {
    name: 'Europe',
    code: 'FRA',
    image: 'assets/img/destinations/europe.webp',
    imageAlt: 'Historic European riverside town with a stone bridge and cathedral spires',
    tagline: 'Study across many countries, with a growing range of English-taught programs.',
    highlights: [
      'Many countries, languages and cultures to choose from',
      'English-taught programs in many countries',
      'Easy travel between neighboring countries',
    ],
    fields: ['Business', 'Engineering', 'Hospitality', 'Social Sciences'],
  },
  {
    name: 'Japan',
    code: 'NRT',
    image: 'assets/img/destinations/japan.webp',
    imageAlt: 'Cherry blossoms along a Tokyo river with a pagoda and city skyline',
    tagline: 'Technology, engineering and design education in a land of tradition and innovation.',
    highlights: [
      'Known for technology, engineering and design',
      'A unique blend of tradition and modern innovation',
      'Opportunities to learn Japanese language and culture',
    ],
    fields: ['Engineering', 'IT', 'Design', 'Business'],
  },
  {
    name: 'South Korea',
    code: 'ICN',
    image: 'assets/img/destinations/south-korea.webp',
    imageAlt: 'Gyeongbokgung Palace in Seoul with modern skyscrapers and mountains behind',
    tagline: 'A tech-forward education hub with a vibrant youth culture.',
    highlights: [
      'A strong focus on technology and innovation',
      'Dynamic modern cities with deep traditions',
      'Opportunities to learn Korean language and culture',
    ],
    fields: ['IT', 'Engineering', 'Business', 'Media'],
  },
];
