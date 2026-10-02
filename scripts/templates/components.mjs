/**
 * Small reusable building blocks (buttons, section headings, badges).
 */
import { esc } from '../lib/util.mjs';

/** Section heading block: eyebrow + h2 + lead. */
export function sectionHead(ctx, { eyebrow, title, lead, center = false, id, light = false, tag = 'h2' }) {
  const cls = ['section__head', center && 'section__head--center', light && 'section__head--light', 'reveal']
    .filter(Boolean)
    .join(' ');
  return `<header class="${cls}">
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <${tag} class="section__title"${id ? ` id="${id}"` : ''}>${esc(title)}</${tag}>
      ${lead ? `<p class="section__lead">${esc(lead)}</p>` : ''}
    </header>`;
}

/**
 * WhatsApp button. Every WhatsApp link on the site goes through here so they all share
 * the same number, safe target/rel attributes and a `data-wa` label for optional tracking.
 */
export function waButton(
  ctx,
  { label, message, loc, size = '', variant = 'wa', block = false, icon = 'whatsapp', cls = '' },
) {
  const classes = ['btn', `btn--${variant}`, size && `btn--${size}`, block && 'btn--block', cls]
    .filter(Boolean)
    .join(' ');
  return `<a class="${classes}" href="${esc(ctx.wa(message))}" target="_blank" rel="noopener noreferrer" data-wa="${esc(loc)}">${
    icon ? ctx.icon(icon) : ''
  }<span>${esc(label)}</span><span class="sr-only"> (opens WhatsApp in a new tab)</span></a>`;
}

/** Plain link styled as a button. */
export function linkButton(
  ctx,
  { href, label, variant = 'outline', size = '', icon = '', iconRight = '', block = false, cls = '', attrs = '' },
) {
  const classes = ['btn', `btn--${variant}`, size && `btn--${size}`, block && 'btn--block', cls]
    .filter(Boolean)
    .join(' ');
  return `<a class="${classes}" href="${esc(href)}"${attrs ? ` ${attrs}` : ''}>${icon ? ctx.icon(icon) : ''}<span>${esc(
    label,
  )}</span>${iconRight ? ctx.icon(iconRight) : ''}</a>`;
}

/** Small tag shown on placeholder content. */
export function sampleBadge(ctx, text = 'Sample') {
  return ctx.site.features?.showSampleBadges === false ? '' : `<span class="badge">${esc(text)}</span>`;
}
