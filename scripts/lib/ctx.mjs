/**
 * Per-page rendering context: link helpers, WhatsApp links, icon registry.
 * One context is created for every page that is generated.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ICONS } from './icon-data.mjs';
import { imageSize } from './imagesize.mjs';
import { esc } from './util.mjs';

export const PAGE_FILES = {
  home: 'index.html',
  destinations: 'destinations.html',
  universities: 'universities.html',
  courses: 'courses.html',
  services: 'services.html',
  about: 'about.html',
  blog: 'blog.html',
  contact: 'contact.html',
  privacy: 'privacy.html',
};

export function createCtx({ root, c, page, file, depth = 0, assetVersion = {} }) {
  const site = c.site;
  const prefix = '../'.repeat(depth);
  const used = new Set();

  const ctx = {
    root,
    c,
    site,
    page,
    file,
    depth,
    prefix,
    used,
    assetVersion,

    /** Relative URL to a file in the repo, from the current page. */
    asset(p) {
      return prefix + p;
    },

    /** Absolute URL if the site address is known, otherwise a relative one. */
    abs(p) {
      return site.url ? `${site.url}/${p}` : prefix + p;
    },

    /** Link to another page (optionally with #hash). */
    href(key, hash = '') {
      const f = PAGE_FILES[key];
      if (!f) throw new Error(`Unknown page key "${key}"`);
      if (key === page && hash && depth === 0) return hash;
      return prefix + f + hash;
    },

    /** wa.me link with a pre-filled message. */
    wa(message) {
      const text = message || site.contact.whatsapp.message;
      return `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(text)}`;
    },

    mailto(subject = '', body = '') {
      const q = [];
      if (subject) q.push(`subject=${encodeURIComponent(subject)}`);
      if (body) q.push(`body=${encodeURIComponent(body)}`);
      return `mailto:${site.contact.email}${q.length ? `?${q.join('&')}` : ''}`;
    },

    /** <svg><use/></svg> for an icon; remembers it so the sprite only holds what is used. */
    icon(name, cls = '') {
      if (!ICONS[name]) throw new Error(`Unknown icon "${name}"`);
      used.add(name);
      return `<svg class="icon${cls ? ` ${cls}` : ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
    },

    /** Hidden SVG sprite with every icon used on this page. */
    sprite() {
      const symbols = [...used]
        .sort()
        .map((name) => {
          const { type, body } = ICONS[name];
          const attrs =
            type === 'stroke'
              ? 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
              : 'fill="currentColor"';
          return `<symbol id="i-${name}" viewBox="0 0 24 24" ${attrs}>${body}</symbol>`;
        })
        .join('');
      return `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${symbols}</svg>`;
    },

    /** Pixel size of an image file in the repo. */
    size(rel) {
      return imageSize(path.join(root, rel));
    },

    exists(rel) {
      return fs.existsSync(path.join(root, rel));
    },

    /** Versioned URL for CSS/JS (cache-busting). */
    versioned(rel) {
      const v = assetVersion[rel];
      return prefix + rel + (v ? `?v=${v}` : '');
    },

    /** <img> tag with width/height, and srcset when a "-480" sibling exists. */
    img({ src, alt, sizes, cls = '', eager = false, srcset, extra = '' }) {
      const { width, height } = imageSize(path.join(root, src));
      const attrs = [
        `class="${cls}"`,
        `src="${esc(prefix + src)}"`,
        srcset ? `srcset="${esc(srcset)}"` : '',
        srcset && sizes ? `sizes="${esc(sizes)}"` : '',
        `width="${width}"`,
        `height="${height}"`,
        `alt="${esc(alt)}"`,
        eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"',
        extra,
      ].filter(Boolean);
      return `<img ${attrs.join(' ')}>`;
    },

    /** srcset for a destination image + its "-480" companion, if present. */
    destSrcset(src) {
      const small = src.replace(/\.(webp|jpe?g|png)$/i, '-480.$1');
      if (small === src || !fs.existsSync(path.join(root, small))) return '';
      const w1 = imageSize(path.join(root, small)).width;
      const w2 = imageSize(path.join(root, src)).width;
      return `${prefix}${small} ${w1}w, ${prefix}${src} ${w2}w`;
    },
  };
  return ctx;
}
