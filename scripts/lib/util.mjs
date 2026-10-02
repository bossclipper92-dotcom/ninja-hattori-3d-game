/**
 * Small, dependency-free helpers shared by the generator.
 */

/** Escape text for safe use in HTML text nodes and attribute values. */
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Serialize an object for a <script type="application/ld+json"> block. */
export const jsonLd = (obj) =>
  JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

/** "Computer Science & IT" -> "computer-science-and-it" */
export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** ['A','B','C'] -> "A, B and C" */
export function listJoin(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** '2026-10-02' -> '2 October 2026' (no timezone surprises) */
export function formatDate(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Initials for monograms: "Sample Tech University" -> "ST" (skips the word "of"/"the"/"and"). */
export function initials(name, max = 2) {
  const words = String(name)
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !/^(of|the|and|for)$/i.test(w));
  return words
    .slice(0, max)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/** Replace {destinations}, {phone}, {email} tokens in a text. */
export function fillTokens(text, tokens) {
  return String(text).replace(/\{(\w+)\}/g, (m, key) => (key in tokens ? tokens[key] : m));
}

/** Escape + turn {highlight} into <span class="hl">highlight</span>. */
export function highlight(text) {
  return esc(text).replace(/\{([^}]+)\}/g, '<span class="hl">$1</span>');
}

/** Plain text version of a highlighted headline (braces removed). */
export const plain = (text) => String(text).replace(/[{}]/g, '');

/** Truncate nicely for meta descriptions. */
export function truncate(text, max = 155) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Whitespace-only body text for word counting / reading time. */
export const wordCount = (md) =>
  String(md)
    .replace(/[#*>\-_`[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
