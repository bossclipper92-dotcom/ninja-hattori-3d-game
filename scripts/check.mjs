#!/usr/bin/env node
/**
 * Quality checks for the built website.
 *
 *   npm run check
 *
 * Looks at every generated .html file and reports problems that would hurt visitors,
 * search engines or Facebook previews: broken links and anchors, missing alt text,
 * wrong WhatsApp number / email, bad titles and descriptions, duplicate ids,
 * unlabeled form fields and risky marketing claims.
 * Exit code is 1 when something must be fixed (warnings do not fail the check).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = (await import(pathToFileURL(path.join(ROOT, 'content', 'site.js')).href)).default;
if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/+$/, '');

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// ---------------------------------------------------------------- collect pages
const pages = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')),
  ...(fs.existsSync(path.join(ROOT, 'blog'))
    ? fs.readdirSync(path.join(ROOT, 'blog')).filter((f) => f.endsWith('.html')).map((f) => `blog/${f}`)
    : []),
];
if (!pages.length) {
  console.error('No .html files found. Run "npm run build" first.');
  process.exit(1);
}

// ---------------------------------------------------------------- helpers
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function attrsOf(raw) {
  const out = {};
  for (const m of raw.matchAll(/([:@\w.-]+)(?:\s*=\s*"([^"]*)")?/g)) out[m[1].toLowerCase()] = m[2] === undefined ? '' : decode(m[2]);
  return out;
}
function tags(html, name) {
  const re = new RegExp(`<${name}\\b([^>]*)>`, 'gi');
  return [...html.matchAll(re)].map((m) => attrsOf(m[1]));
}
function visibleText(html) {
  return decode(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  ).trim();
}
const idCache = new Map();
function idsOf(rel) {
  if (!idCache.has(rel)) {
    const html = read(rel);
    idCache.set(rel, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(rel);
}
function resolveLocal(fromRel, ref) {
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return fromRel;
  const abs = clean.startsWith('/')
    ? path.join(ROOT, clean)
    : path.resolve(path.dirname(path.join(ROOT, fromRel)), clean);
  if (!abs.startsWith(ROOT)) return null;
  let rel = path.relative(ROOT, abs);
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) rel = path.join(rel, 'index.html');
  return rel || 'index.html';
}
const isExternal = (u) => /^(https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(u);

// ---------------------------------------------------------------- risky-claim patterns
const CLAIMS = [
  { re: /\b\d{1,3}\s*%/, why: 'percentage figure' },
  { re: /\bthousands?\b|\bhundreds of\b|\bmillions?\b/i, why: 'vague big-number claim' },
  {
    re: /\bguarantee(?:d|s)?\b/i,
    allow: /(?:cannot|can't|can’t|no|not|without|never|nor)\s+(?:\w+\s+)?guarantee|guarantee(?:s)?\s+(?:any|no)\b|can you guarantee/i,
    why: 'guarantee wording',
  },
  { re: /\bno\.?\s?1\b|\bnumber one\b|#1\b/i, why: '"No.1" ranking claim' },
  { re: /\b(?:we are|we’re|we're|achieve aboard is)\s+(?:the\s+)?(?:best|leading|top|only|largest|biggest)\b/i, why: 'self-praise superlative' },
  { re: /\btop[- ](?:ranked|rated)\b|\bworld[- ]class\b|\baward[- ]winning\b/i, why: 'unverifiable accolade' },
  { re: /\b\d[\d,]*\s?\+(?!\d)/, why: 'numeric "N+" claim' },
  { re: /\byears? of experience\b|\bsince (?:19|20)\d{2}\b|\bfounded\b|\bestablished in\b/i, why: 'history/experience claim' },
  { re: /\bsuccess rate\b|\bsuccess stories\b/i, why: 'success-rate claim' },
  { re: /\bofficial partner\b|\bpartner universit|\bpartnered with\b|\bin partnership with\b|\bour partners\b/i, why: 'university partnership claim' },
];

// ---------------------------------------------------------------- per-page checks
let waLinks = 0;
for (const file of pages) {
  const html = read(file);
  const is404 = file === '404.html';

  // title + description
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
  if (!title) err(file, 'missing <title>');
  else {
    const t = decode(title).trim();
    if (t.length > 65) warn(file, `title is ${t.length} characters (aim for 60 or fewer): "${t}"`);
    if (t.length < 15) warn(file, `title is very short: "${t}"`);
  }
  const desc = tags(html, 'meta').find((m) => m.name === 'description');
  if (!desc && !is404) err(file, 'missing meta description');
  else if (desc) {
    if (desc.content.length > 160) warn(file, `description is ${desc.content.length} characters (aim for 155 or fewer)`);
    if (desc.content.length < 70) warn(file, `description is only ${desc.content.length} characters`);
  }

  // Open Graph
  if (!is404) {
    const metas = tags(html, 'meta');
    for (const p of ['og:title', 'og:description', 'og:type', 'og:image']) {
      if (!metas.some((m) => m.property === p)) warn(file, `missing <meta property="${p}">${p === 'og:image' ? ' (add assets/img/og-image.jpg)' : ''}`);
    }
    if (site.url && !metas.some((m) => m.property === 'og:url')) warn(file, 'missing og:url');
    if (site.url && !tags(html, 'link').some((l) => l.rel === 'canonical')) warn(file, 'missing canonical link');
  }

  // headings
  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) err(file, `expected exactly one <h1>, found ${h1}`);

  // images
  for (const img of tags(html, 'img')) {
    if (img.alt === undefined) err(file, `<img src="${img.src}"> has no alt attribute`);
    if (!img.width || !img.height) err(file, `<img src="${img.src}"> is missing width/height (causes layout shift)`);
  }

  // links, assets and anchors
  const refs = [];
  for (const el of [...tags(html, 'a'), ...tags(html, 'link'), ...tags(html, 'img'), ...tags(html, 'script'), ...tags(html, 'source')]) {
    if (el.href) refs.push(el.href);
    if (el.src) refs.push(el.src);
    for (const key of ['srcset', 'imagesrcset']) {
      if (el[key]) for (const part of el[key].split(',')) refs.push(part.trim().split(/\s+/)[0]);
    }
  }
  for (const ref of new Set(refs)) {
    if (!ref || isExternal(ref)) continue;
    const target = resolveLocal(file, ref);
    if (!target || !fs.existsSync(path.join(ROOT, target))) {
      err(file, `broken link or file: ${ref}`);
      continue;
    }
    const hash = ref.includes('#') ? ref.split('#')[1] : '';
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) err(file, `anchor not found: ${ref}`);
  }

  // duplicate ids
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) err(file, `duplicate id "${id}"`);
    seen.add(id);
  }

  // icon sprite
  for (const m of html.matchAll(/<use href="#(i-[\w-]+)"/g)) {
    if (!seen.has(m[1])) err(file, `icon "${m[1]}" is used but missing from the sprite`);
  }

  // aria / label references
  for (const m of html.matchAll(/aria-(?:labelledby|controls|describedby)="([^"]+)"/g)) {
    for (const id of m[1].split(/\s+/)) if (!seen.has(id)) err(file, `aria reference to missing id "${id}"`);
  }
  const labelFor = new Set([...html.matchAll(/<label\b[^>]*\sfor="([^"]+)"/g)].map((m) => m[1]));
  for (const f of [...tags(html, 'input'), ...tags(html, 'select'), ...tags(html, 'textarea')]) {
    if (f.type === 'hidden') continue;
    if (!f.id || !(labelFor.has(f.id) || f['aria-label'] || f['aria-labelledby'])) {
      err(file, `form field "${f.name || f.id || f.type}" has no label`);
    }
  }

  // accessible names for buttons and links
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const a = attrsOf(m[1]);
    if (!a['aria-label'] && !visibleText(m[2])) err(file, 'a <button> has no accessible name');
  }
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const a = attrsOf(m[1]);
    if (!a['aria-label'] && !visibleText(m[2]) && !/<img\b[^>]*\salt="[^"]+"/i.test(m[2])) {
      err(file, `a link has no accessible name (href="${a.href}")`);
    }
    if (a.target === '_blank' && !/noopener/.test(a.rel || '')) err(file, `target=_blank link without rel="noopener": ${a.href}`);
    // WhatsApp + email consistency
    if (a.href && /wa\.me\//.test(a.href)) {
      waLinks += 1;
      const num = (a.href.match(/wa\.me\/(\d+)/) || [])[1];
      if (num !== site.contact.whatsapp.number) err(file, `WhatsApp link uses the wrong number (${num}): ${a.href}`);
    }
    if (a.href && a.href.startsWith('mailto:')) {
      const to = a.href.slice(7).split('?')[0];
      if (to !== site.contact.email) err(file, `mailto link uses the wrong address: ${to}`);
    }
  }

  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      err(file, `invalid JSON-LD: ${e.message}`);
    }
  }

  // risky claims in visible text
  const text = visibleText(html);
  for (const c of CLAIMS) {
    const re = new RegExp(c.re.source, c.re.flags.includes('g') ? c.re.flags : `${c.re.flags}g`);
    for (const m of text.matchAll(re)) {
      const around = text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40);
      if (c.allow && c.allow.test(around)) continue;
      err(file, `risky claim (${c.why}): "…${around.trim()}…" — remove it or make sure it can be proven`);
    }
  }
}

// ---------------------------------------------------------------- site-wide checks
for (const f of ['robots.txt', 'site.webmanifest', 'favicon.ico', '404.html', 'assets/css/styles.css', 'assets/js/main.js']) {
  if (!fs.existsSync(path.join(ROOT, f))) err('site', `missing ${f}`);
}
if (site.url && !fs.existsSync(path.join(ROOT, 'sitemap.xml'))) err('site', 'sitemap.xml missing although "url" is set — run npm run build');
if (!site.url) warn('site', '"url" is not set in content/site.js (canonical links, sitemap and the Facebook share image need it)');

// image weights
const heavy = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(png|jpe?g|webp|gif)$/i.test(e.name)) {
      const kb = fs.statSync(p).size / 1024;
      const limit = e.name.startsWith('og-image') ? 300 : /logo-512|icon-512/.test(e.name) ? 60 : 150;
      if (kb > limit) heavy.push(`${path.relative(ROOT, p)} is ${Math.round(kb)} KB (limit ${limit} KB)`);
    }
  }
})(path.join(ROOT, 'assets', 'img'));
for (const h of heavy) warn('images', h);

// first-load weight of the home page (before compression)
const weight = (rels) => rels.filter((r) => fs.existsSync(path.join(ROOT, r))).reduce((n, r) => n + fs.statSync(path.join(ROOT, r)).size, 0);
const homeKb = Math.round(
  weight(['index.html', 'assets/css/styles.css', 'assets/js/main.js', 'assets/fonts/figtree-var.woff2', 'assets/fonts/fraunces-var.woff2', 'assets/img/photos/hero-760.webp', 'assets/img/logo.svg']) / 1024,
);

// ---------------------------------------------------------------- report
console.log(`Checked ${pages.length} pages · ${waLinks} WhatsApp links · home page first load ≈ ${homeKb} KB before gzip (images below the fold load lazily)\n`);
if (warnings.length) {
  console.log(`⚠ ${warnings.length} warning${warnings.length > 1 ? 's' : ''}:`);
  for (const w of warnings) console.log(`  • ${w}`);
  console.log('');
}
if (errors.length) {
  console.log(`✖ ${errors.length} problem${errors.length > 1 ? 's' : ''} to fix:`);
  for (const e of errors) console.log(`  • ${e}`);
  process.exit(1);
}
console.log('✔ All checks passed');
