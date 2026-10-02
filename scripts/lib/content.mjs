/**
 * Loads every file in /content, validates it and returns one tidy "content" object.
 * Problems with clear, human-readable messages are collected in `errors`
 * (build stops) or `warnings` (build continues and prints them).
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ICONS } from './icon-data.mjs';
import { fillTokens, listJoin } from './util.mjs';

const FILES = [
  'site', 'pages', 'stats', 'services', 'destinations', 'universities',
  'courses', 'why', 'process', 'testimonials', 'faq', 'blog',
];

export const PAGE_KEYS = [
  'home', 'destinations', 'universities', 'courses', 'services', 'about', 'blog', 'contact', 'privacy',
];

export const FACEBOOK_PLACEHOLDER = 'https://www.facebook.com/';

export async function loadContent(root, env = process.env) {
  const c = {};
  const stamp = Date.now(); // lets the dev server re-import edited files
  for (const name of FILES) {
    const file = path.join(root, 'content', `${name}.js`);
    if (!fs.existsSync(file)) throw new Error(`Missing content file: content/${name}.js`);
    const mod = await import(`${pathToFileURL(file).href}?t=${stamp}`);
    c[name] = mod.default;
  }

  const errors = [];
  const warnings = [];
  const err = (file, msg) => errors.push(`content/${file}.js — ${msg}`);
  const warn = (msg) => warnings.push(msg);
  const exists = (rel) => fs.existsSync(path.join(root, rel));
  const isArr = (v) => Array.isArray(v);
  const str = (v) => typeof v === 'string' && v.trim().length > 0;

  // ---------------------------------------------------------------- site
  const site = c.site;
  if (env.SITE_URL) site.url = env.SITE_URL;
  site.url = String(site.url || '').trim().replace(/\/+$/, '');
  if (site.url && !/^https?:\/\/[^\s/]+/.test(site.url)) {
    err('site', `"url" must start with https:// (got "${site.url}")`);
  }
  if (!str(site.contact?.email) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.contact.email)) {
    err('site', '"contact.email" is not a valid email address');
  }
  const wa = site.contact?.whatsapp || {};
  if (!/^\d{8,15}$/.test(String(wa.number || ''))) {
    err('site', '"contact.whatsapp.number" must be digits only with the country code (e.g. 60167217612)');
  }
  if (!str(wa.display)) err('site', '"contact.whatsapp.display" is empty');
  if (!str(wa.message)) err('site', '"contact.whatsapp.message" is empty');
  for (const key of ['name', 'shortName', 'tagline', 'description']) {
    if (!str(site.brand?.[key])) err('site', `"brand.${key}" is empty`);
  }
  for (const key of ['logo', 'logoPng']) {
    if (str(site.brand?.[key]) && !exists(site.brand[key])) err('site', `brand.${key} file not found: ${site.brand[key]}`);
  }
  const fb = String(site.social?.facebook || '').trim();
  if (fb && !/^https?:\/\//.test(fb)) err('site', '"social.facebook" must start with https:// (or be empty to hide the icon)');
  if (!fb || fb === FACEBOOK_PLACEHOLDER) {
    warn('Facebook link is still the placeholder — set "social.facebook" in content/site.js');
  }
  if (!site.url) {
    warn('"url" is empty in content/site.js — the Facebook share image, canonical links and sitemap need your real address (see README → Launch checklist)');
  }
  if (!isArr(site.nav) || !site.nav.length) err('site', '"nav" is empty');
  for (const item of [...(site.nav || []), ...(site.footerLinks || [])]) {
    if (!PAGE_KEYS.includes(item.page)) err('site', `navigation item "${item.label}" points to unknown page "${item.page}"`);
  }
  if (!isArr(site.studyLevels) || !site.studyLevels.length) err('site', '"studyLevels" is empty');
  if (str(site.seo?.ogImage) && !exists(site.seo.ogImage)) {
    warn(`Share image not found: ${site.seo.ogImage} (Facebook link previews will have no picture)`);
  }
  site.analytics = site.analytics || {};
  const px = String(site.analytics.metaPixelId || '').trim();
  const ga = String(site.analytics.googleAnalyticsId || '').trim();
  if (px && !/^\d{5,20}$/.test(px)) err('site', '"analytics.metaPixelId" should be digits only (your Meta Pixel ID)');
  if (ga && !/^(G|AW)-[A-Z0-9]{4,14}$/i.test(ga)) err('site', '"analytics.googleAnalyticsId" should look like G-XXXXXXXXXX');

  // --------------------------------------------------------------- pages
  for (const key of PAGE_KEYS) {
    const p = c.pages?.[key];
    if (!p?.seo?.title || !p?.seo?.description) err('pages', `"${key}.seo" needs a title and a description`);
    else {
      if (p.seo.title.length > 65) warn(`SEO title for "${key}" is ${p.seo.title.length} characters (aim for 60 or fewer)`);
      if (p.seo.description.length > 160) warn(`SEO description for "${key}" is ${p.seo.description.length} characters (aim for 155 or fewer)`);
    }
  }

  // -------------------------------------------------------- destinations
  const dests = c.destinations;
  if (!isArr(dests) || !dests.length) err('destinations', 'the list is empty — add at least one destination');
  const destNames = new Set();
  for (const [i, d] of (dests || []).entries()) {
    const label = d?.name || `#${i + 1}`;
    if (!str(d.name)) err('destinations', `entry #${i + 1} has no "name"`);
    if (destNames.has(d.name)) err('destinations', `"${d.name}" appears twice`);
    destNames.add(d.name);
    if (!str(d.tagline)) err('destinations', `${label}: "tagline" is empty`);
    if (!str(d.imageAlt)) err('destinations', `${label}: "imageAlt" is empty (needed for accessibility)`);
    if (!str(d.image)) err('destinations', `${label}: "image" is empty`);
    else if (!exists(d.image)) err('destinations', `${label}: image file not found: ${d.image}`);
    if (!isArr(d.highlights)) err('destinations', `${label}: "highlights" must be a list`);
    if (!isArr(d.fields)) err('destinations', `${label}: "fields" must be a list`);
    d.phrase = d.phrase || d.name;
  }

  // ------------------------------------------------------------- courses
  const courseNames = new Set();
  if (!isArr(c.courses) || !c.courses.length) err('courses', 'the list is empty');
  for (const [i, x] of (c.courses || []).entries()) {
    if (!str(x.name)) err('courses', `entry #${i + 1} has no "name"`);
    if (courseNames.has(x.name)) err('courses', `"${x.name}" appears twice`);
    courseNames.add(x.name);
    if (!str(x.summary)) err('courses', `${x.name}: "summary" is empty`);
    if (!isArr(x.programs)) err('courses', `${x.name}: "programs" must be a list`);
  }

  // -------------------------------------------------------- universities
  if (!isArr(c.universities)) err('universities', 'must be a list (it can be empty)');
  let placeholderUnis = 0;
  for (const [i, u] of (c.universities || []).entries()) {
    const label = u?.name || `#${i + 1}`;
    if (!str(u.name)) err('universities', `entry #${i + 1} has no "name"`);
    if (!destNames.has(u.country)) {
      err('universities', `${label}: country "${u.country}" is not listed in content/destinations.js (${[...destNames].join(', ')})`);
    }
    if (!isArr(u.programs) || !u.programs.length) err('universities', `${label}: "programs" must be a list with at least one item`);
    else {
      for (const p of u.programs) {
        if (!courseNames.has(p)) warn(`universities: ${label} lists program "${p}", which is not a course category — it will show on the card but not in the Program filter`);
      }
    }
    if (u.placeholder) placeholderUnis += 1;
  }
  if (placeholderUnis) warn(`${placeholderUnis} placeholder universities are shown (marked "Sample") — replace them in content/universities.js`);

  // ------------------------------------------------------------ services / why / process / stats
  const need = (file, list, fields) => {
    if (!isArr(list) || !list.length) {
      err(file, 'the list is empty');
      return;
    }
    for (const [i, item] of list.entries()) {
      for (const f of fields) if (!str(item?.[f])) err(file, `entry #${i + 1} is missing "${f}"`);
    }
  };
  need('services', c.services, ['icon', 'title', 'summary']);
  need('why', c.why, ['icon', 'title', 'text']);
  need('process', c.process, ['icon', 'title', 'text']);
  need('stats', c.stats, ['icon', 'label', 'text']);
  need('courses', c.courses, ['icon']);
  need('faq', c.faq, ['q', 'a']);
  if (!isArr(c.testimonials)) err('testimonials', 'must be a list (it can be empty)');
  for (const [i, t] of (c.testimonials || []).entries()) {
    for (const f of ['quote', 'name']) if (!str(t?.[f])) err('testimonials', `entry #${i + 1} is missing "${f}"`);
  }
  const placeholderTesti = (c.testimonials || []).filter((t) => t.placeholder).length;
  if (placeholderTesti) warn(`${placeholderTesti} placeholder testimonials are shown (marked "Sample") — replace them in content/testimonials.js`);

  // ---------------------------------------------------------------- blog
  const slugs = new Set();
  if (!isArr(c.blog) || !c.blog.length) err('blog', 'add at least one post (or remove "blog" from the navigation)');
  for (const [i, p] of (c.blog || []).entries()) {
    const label = p?.slug || `#${i + 1}`;
    for (const f of ['slug', 'title', 'excerpt', 'date', 'category', 'icon', 'body']) {
      if (!str(p?.[f])) err('blog', `${label}: "${f}" is empty`);
    }
    if (p.slug && !/^[a-z0-9-]+$/.test(p.slug)) err('blog', `${label}: slug may only contain lowercase letters, numbers and dashes`);
    if (slugs.has(p.slug)) err('blog', `slug "${p.slug}" appears twice`);
    slugs.add(p.slug);
    if (p.date && !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) err('blog', `${label}: date must look like 2026-10-02`);
    p.tone = ['blue', 'green', 'red', 'navy'].includes(p.tone) ? p.tone : 'blue';
  }

  // ----------------------------------------------------- icons referenced
  const iconRefs = [];
  const collect = (file, items, key = 'icon') => {
    for (const it of items || []) if (it && it[key]) iconRefs.push([file, it[key]]);
  };
  collect('services', c.services);
  collect('why', c.why);
  collect('process', c.process);
  collect('stats', c.stats);
  collect('courses', c.courses);
  collect('blog', c.blog);
  collect('pages (about)', c.pages?.sections?.about?.points);
  collect('pages (about values)', c.pages?.about?.promise?.values);
  for (const [file, name] of iconRefs) {
    if (!ICONS[name]) err(file.split(' ')[0], `unknown icon "${name}" — see scripts/lib/icon-data.mjs for the list of icon names`);
  }

  // ------------------------------------------------------------- derived
  const destinationList = listJoin(dests.map((d) => d.name));
  c.tokens = {
    destinations: destinationList,
    phone: wa.display,
    email: site.contact.email,
  };
  c.fill = (text) => fillTokens(text, c.tokens);
  c.destNames = [...destNames];
  c.courseNames = [...courseNames];

  return { c, errors, warnings };
}
