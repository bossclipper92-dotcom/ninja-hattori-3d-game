/**
 * Page sections. Each function returns an HTML string and takes the page context.
 * Texts come from /content — nothing is hard-coded here except small UI labels.
 */
import { esc, highlight, initials, listJoin, slugify } from '../lib/util.mjs';
import { linkButton, sampleBadge, sectionHead, waButton } from './components.mjs';

/** Section heading, or a screen-reader-only <h2> when the page hero already says the same thing. */
function headOrHidden(ctx, show, data, id) {
  return show
    ? sectionHead(ctx, { ...data, id })
    : `<h2 class="sr-only" id="${id}">${esc(data.title)}</h2>`;
}

/* ------------------------------------------------------------------ */
/* Page hero (inner pages)                                             */
/* ------------------------------------------------------------------ */
export function pageHero(ctx, { eyebrow, title, lead, crumb, extra = '' }) {
  return `
<section class="page-hero">
  <div class="container page-hero__inner">
    <nav class="crumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="${ctx.href('home')}">Home</a></li>
        <li aria-current="page">${esc(crumb || title)}</li>
      </ol>
    </nav>
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1 class="page-hero__title">${esc(title)}</h1>
    ${lead ? `<p class="page-hero__lead">${esc(lead)}</p>` : ''}
    ${extra}
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Home hero                                                           */
/* ------------------------------------------------------------------ */
export function hero(ctx) {
  const h = ctx.c.pages.home.hero;
  const img = h.image;
  const srcset = img.widths.map((w) => `${ctx.asset(`${img.base}-${w}.webp`)} ${w}w`).join(', ');
  const main = `${img.base}-${img.width}.webp`;
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow">${esc(h.eyebrow)}</p>
      <h1 class="hero__title" id="hero-title">${highlight(h.title)}</h1>
      <p class="hero__lead">${esc(h.lead)}</p>
      <div class="hero__actions">
        ${waButton(ctx, { label: h.primaryCta, loc: 'hero', size: 'lg' })}
        ${linkButton(ctx, { href: '#contact', label: h.secondaryCta, variant: 'outline', size: 'lg', iconRight: 'arrow-right' })}
      </div>
      <ul class="hero__points">
        ${h.points.map((p) => `<li>${ctx.icon('check-circle')}<span>${esc(p)}</span></li>`).join('')}
      </ul>
    </div>
    <div class="hero__media">
      <div class="hero__frame">
        ${ctx.img({
          src: main,
          alt: img.alt,
          cls: 'hero__img',
          eager: true,
          srcset,
          sizes: '(min-width: 960px) 460px, min(88vw, 380px)',
        })}
      </div>
      <div class="hero__card">
        <p class="hero__card-title">${esc(h.helpsLabel)}</p>
        <ul>
          ${h.helps.map((x) => `<li>${ctx.icon('check')}<span>${esc(x)}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Trust cards                                                         */
/* ------------------------------------------------------------------ */
export function trust(ctx) {
  const { c } = ctx;
  return `
<section class="trust" aria-label="${esc(c.pages.sections.trust.label)}">
  <div class="container">
    <ul class="trust__grid">
      ${c.stats
        .map(
          (s, i) => `
      <li class="trust__item reveal" style="--i:${i}">
        <span class="tile">${ctx.icon(s.icon)}</span>
        <div class="trust__body">
          ${s.value ? `<p class="trust__value">${esc(s.value)}</p>` : ''}
          <h3 class="trust__label">${esc(s.label)}</h3>
          <p class="trust__text">${esc(c.fill(s.text))}</p>
        </div>
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */
export function about(ctx, { home = true } = {}) {
  const a = ctx.c.pages.sections.about;
  const im = a.image;
  const srcset = im.widths.map((w) => `${ctx.asset(`${im.base}-${w}.webp`)} ${w}w`).join(', ');
  return `
<section class="section" id="about" aria-labelledby="about-title">
  <div class="container about">
    <div class="about__media reveal">
      <div class="about__frame">
        ${ctx.img({
          src: `${im.base}-${im.width}.webp`,
          alt: im.alt,
          cls: 'about__img',
          srcset,
          sizes: '(min-width: 960px) 520px, 92vw',
        })}
      </div>
      <div class="about__card">
        <span class="tile tile--green">${ctx.icon('message-text')}</span>
        <div><strong>${esc(a.card.title)}</strong><span>${esc(a.card.text)}</span></div>
      </div>
    </div>
    <div class="about__copy">
      ${sectionHead(ctx, { eyebrow: a.eyebrow, title: a.title, id: 'about-title' })}
      ${a.paragraphs.map((p) => `<p class="about__p reveal">${esc(p)}</p>`).join('')}
      <ul class="about__points">
        ${a.points
          .map(
            (p, i) => `
        <li class="reveal" style="--i:${i % 2}">
          <span class="tile tile--sm">${ctx.icon(p.icon)}</span>
          <div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>
        </li>`,
          )
          .join('')}
      </ul>
      <div class="about__actions reveal">
        ${waButton(ctx, { label: a.cta, loc: 'about', size: 'lg' })}
        ${home ? linkButton(ctx, { href: ctx.href('about'), label: a.secondaryCta, variant: 'ghost', iconRight: 'arrow-right' }) : ''}
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
export function services(ctx, { detailed = false, soft = true, after = '', heading = true } = {}) {
  const { c } = ctx;
  const s = c.pages.sections.services;
  return `
<section class="section${soft ? ' section--soft' : ''}${heading ? '' : ' section--flush'}" id="services" aria-labelledby="services-title">
  <div class="container">
    ${headOrHidden(ctx, heading, s, 'services-title')}
    <div class="grid services${detailed ? ' services--detailed' : ''}">
      ${c.services
        .map(
          (x, i) => `
      <article class="card service reveal" style="--i:${i % 3}">
        <span class="tile">${ctx.icon(x.icon)}</span>
        <div class="service__body">
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.summary)}</p>
          ${
            detailed
              ? `<ul class="ticks">${(x.bullets || []).map((b) => `<li>${ctx.icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
          <a class="textlink" href="${esc(ctx.wa(`Hello Achieve Aboard, I would like to know more about your ${x.title} service.`))}" target="_blank" rel="noopener noreferrer" data-wa="service">Ask about this service ${ctx.icon('arrow-up-right')}<span class="sr-only"> (opens WhatsApp in a new tab)</span></a>`
              : ''
          }
        </div>
      </article>`,
        )
        .join('')}
    </div>
    ${after}
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* CTA strip (between sections) and CTA band (big)                     */
/* ------------------------------------------------------------------ */
export function ctaStrip(ctx, { title, text, loc = 'strip', message } = {}) {
  const m = ctx.c.pages.cta.mini;
  return `
<aside class="cta-strip reveal" aria-label="Chat with us">
  <div class="cta-strip__copy">
    <span class="tile tile--wa">${ctx.icon('whatsapp')}</span>
    <div>
      <p class="cta-strip__title">${esc(title || m.title)}</p>
      <p class="cta-strip__text">${esc(text || m.text)}</p>
    </div>
  </div>
  ${waButton(ctx, { label: 'Chat on WhatsApp', loc, message })}
</aside>`;
}

export function ctaBand(ctx, { title, text, loc = 'band', id = 'cta-title' } = {}) {
  const t = ctx.c.pages.cta;
  return `
<section class="cta-band" aria-labelledby="${id}">
  <div class="container">
    <div class="cta-band__inner reveal">
      <div class="cta-band__copy">
        <h2 id="${id}">${esc(title || t.title)}</h2>
        <p>${esc(text || t.text)}</p>
      </div>
      <div class="cta-band__actions">
        ${waButton(ctx, { label: t.primary, loc, size: 'lg' })}
        ${linkButton(ctx, { href: ctx.mailto('Study abroad inquiry'), label: t.secondary, variant: 'outline-light', size: 'lg', icon: 'mail' })}
      </div>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Destinations                                                        */
/* ------------------------------------------------------------------ */
function destImage(ctx, d, sizes) {
  return ctx.img({
    src: d.image,
    alt: d.imageAlt,
    cls: 'dest__img',
    srcset: ctx.destSrcset(d.image),
    sizes,
  });
}

export function destinations(ctx, { detailed = false, soft = false, heading = true } = {}) {
  const { c } = ctx;
  const s = c.pages.sections.destinations;
  const cards = detailed
    ? c.destinations
        .map(
          (d, i) => `
      <article class="dest dest--detailed reveal" id="${slugify(d.name)}" style="--i:${i % 2}">
        <div class="dest__media">
          ${destImage(ctx, d, '(min-width: 960px) 560px, (min-width: 640px) 46vw, 92vw')}
          ${d.code ? `<span class="dest__code">${esc(d.code)}</span>` : ''}
        </div>
        <div class="dest__body">
          <h3 class="dest__name">${esc(d.name)}</h3>
          <p class="dest__tagline">${esc(d.tagline)}</p>
          <ul class="ticks">${d.highlights.map((h) => `<li>${ctx.icon('check')}<span>${esc(h)}</span></li>`).join('')}</ul>
          ${
            d.fields?.length
              ? `<p class="dest__label">Popular study areas</p><ul class="chips">${d.fields.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`
              : ''
          }
          <div class="dest__actions">
            ${waButton(ctx, { label: `Ask about ${d.name}`, loc: `destination:${d.name}`, size: 'sm', message: `Hello Achieve Aboard, I want to know about studying in ${d.phrase}.` })}
            ${linkButton(ctx, { href: `${ctx.href('universities')}?country=${encodeURIComponent(d.name)}`, label: 'View universities', variant: 'outline', size: 'sm', iconRight: 'arrow-right' })}
          </div>
        </div>
      </article>`,
        )
        .join('')
    : c.destinations
        .map(
          (d, i) => `
      <article class="dest reveal" style="--i:${i % 4}">
        <div class="dest__media">
          ${destImage(ctx, d, '(min-width: 1024px) 285px, (min-width: 640px) 31vw, 46vw')}
          ${d.code ? `<span class="dest__code">${esc(d.code)}</span>` : ''}
        </div>
        <div class="dest__body">
          <h3 class="dest__name"><a class="stretched" href="${esc(ctx.wa(`Hello Achieve Aboard, I want to know about studying in ${d.phrase}.`))}" target="_blank" rel="noopener noreferrer" data-wa="destination:${esc(d.name)}">${esc(d.name)}<span class="sr-only"> — ask about studying in ${esc(d.phrase)} on WhatsApp (opens in a new tab)</span></a></h3>
          <p class="dest__tagline">${esc(d.tagline)}</p>
          <span class="dest__cta" aria-hidden="true">${ctx.icon('whatsapp')}<span>Ask about ${esc(d.name)}</span></span>
        </div>
      </article>`,
        )
        .join('');

  return `
<section class="section${soft ? ' section--soft' : ''}${heading ? '' : ' section--flush'}" id="destinations" aria-labelledby="destinations-title">
  <div class="container">
    ${headOrHidden(ctx, heading, s, 'destinations-title')}
    <div class="dest-grid${detailed ? ' dest-grid--detailed' : ''}">
      ${cards}
    </div>
    ${
      detailed
        ? ''
        : `<div class="section__foot reveal">${linkButton(ctx, { href: ctx.href('destinations'), label: 'Explore all study destinations', variant: 'outline', iconRight: 'arrow-right' })}</div>`
    }
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Universities (search + filter)                                      */
/* ------------------------------------------------------------------ */
function uniCard(ctx, u, i) {
  const { c } = ctx;
  const countryIndex = Math.max(0, c.destNames.indexOf(u.country));
  const programs = u.programs || [];
  const search = [u.name, u.country, ...programs, u.note || ''].join(' ').toLowerCase();
  const message = `Hello Achieve Aboard, I would like to ask about ${u.name} (${u.country}).`;
  return `
      <article class="uni reveal" style="--i:${i % 3}" data-country="${esc(u.country)}" data-programs="${esc(programs.join('|'))}" data-search="${esc(search)}">
        <div class="uni__top">
          <span class="uni__logo uni__logo--c${countryIndex % 4}" aria-hidden="true">${esc(initials(u.name))}</span>
          <div class="uni__id">
            <h3 class="uni__name">${esc(u.name)}</h3>
            <p class="uni__country">${ctx.icon('pin')}<span>${esc(u.country)}</span></p>
          </div>
          ${u.placeholder ? sampleBadge(ctx) : ''}
        </div>
        ${u.note ? `<p class="uni__note">${esc(u.note)}</p>` : ''}
        <p class="uni__label">Popular programs</p>
        <ul class="chips">${programs.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <div class="uni__foot">
          ${waButton(ctx, { label: 'Ask About This University', message, loc: `university:${u.name}`, variant: 'wa-soft', size: 'sm', block: true })}
          ${u.website ? `<a class="textlink textlink--muted" href="${esc(u.website)}" target="_blank" rel="noopener noreferrer">Official website ${ctx.icon('external')}</a>` : ''}
        </div>
      </article>`;
}

export function universities(ctx, { pageSize = 6, showAllLink = false, soft = true, heading = true } = {}) {
  const { c } = ctx;
  const s = c.pages.sections.universities;
  const countries = [...new Set(c.universities.map((u) => u.country))];
  const ordered = c.destNames.filter((n) => countries.includes(n));
  const total = c.universities.length;
  return `
<section class="section${soft ? ' section--soft' : ''}${heading ? '' : ' section--flush'}" id="universities" aria-labelledby="universities-title">
  <div class="container">
    ${heading ? sectionHead(ctx, { ...s, id: 'universities-title' }) : `<h2 class="sr-only" id="universities-title">${esc(s.title)}</h2>`}
    <div class="uni-filter" data-uni-filter data-page-size="${pageSize}">
      <div class="uni-filter__bar">
        <div class="field field--search">
          <label class="sr-only" for="uni-q">Search universities</label>
          ${ctx.icon('search')}
          <input id="uni-q" type="search" placeholder="Search name, country or program" autocomplete="off" enterkeyhint="search" data-q>
        </div>
        <div class="field field--select">
          <label class="sr-only" for="uni-program">Filter by program area</label>
          <select id="uni-program" data-program>
            <option value="">All program areas</option>
            ${c.courseNames.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}
          </select>
          ${ctx.icon('chevron-down')}
        </div>
      </div>
      <div class="chip-row" role="group" aria-label="Filter by country">
        <button class="chip-btn is-active" type="button" data-country-btn="" aria-pressed="true">All countries</button>
        ${ordered.map((n) => `<button class="chip-btn" type="button" data-country-btn="${esc(n)}" aria-pressed="false">${esc(n)}</button>`).join('')}
      </div>
      <div class="uni-filter__meta">
        <p class="uni-filter__count" role="status" aria-live="polite" data-count>Showing ${Math.min(pageSize, total)} of ${total} universities</p>
        <button class="textlink" type="button" data-reset hidden>Clear filters</button>
      </div>
      <div class="uni-grid" data-grid>
        ${c.universities.map((u, i) => uniCard(ctx, u, i)).join('')}
      </div>
      <div class="uni-empty" data-empty hidden>
        <span class="tile">${ctx.icon('search-file')}</span>
        <h3>${esc(s.empty)}</h3>
        <p>${esc(s.emptyHelp)}</p>
        ${waButton(ctx, { label: 'Ask Us on WhatsApp', loc: 'university-empty', message: 'Hello Achieve Aboard, I am looking for a university and need some help.' })}
      </div>
      <div class="uni-filter__more" data-more-wrap hidden>
        <button class="btn btn--outline" type="button" data-more>Show more universities</button>
      </div>
    </div>
    ${
      showAllLink
        ? `<div class="section__foot reveal">${linkButton(ctx, { href: ctx.href('universities'), label: 'Browse all universities', variant: 'ghost', iconRight: 'arrow-right' })}</div>`
        : ''
    }
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */
export function courses(ctx, { detailed = false, soft = false, heading = true } = {}) {
  const { c } = ctx;
  const s = c.pages.sections.courses;
  const msg = (x) => `Hello Achieve Aboard, I need help choosing a course. I am interested in ${x.name}.`;
  const cards = c.courses
    .map((x, i) =>
      detailed
        ? `
      <article class="course course--detailed reveal" style="--i:${i % 2}">
        <div class="course__head">
          <span class="tile">${ctx.icon(x.icon)}</span>
          <div><h3 class="course__name">${esc(x.name)}</h3><p>${esc(x.summary)}</p></div>
        </div>
        <ul class="chips">${x.programs.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        ${x.note ? `<p class="course__note">${ctx.icon('info')}<span>${esc(x.note)}</span></p>` : ''}
        <div class="course__foot">
          ${waButton(ctx, { label: s.cta, message: msg(x), loc: `course:${x.name}`, size: 'sm' })}
          ${linkButton(ctx, { href: `${ctx.href('universities')}?program=${encodeURIComponent(x.name)}`, label: 'See universities', variant: 'ghost', size: 'sm', iconRight: 'arrow-right' })}
        </div>
      </article>`
        : `
      <article class="course reveal" style="--i:${i % 4}">
        <span class="tile">${ctx.icon(x.icon)}</span>
        <h3 class="course__name"><a class="stretched" href="${esc(ctx.wa(msg(x)))}" target="_blank" rel="noopener noreferrer" data-wa="course:${esc(x.name)}">${esc(x.name)}<span class="sr-only"> — find my course on WhatsApp (opens in a new tab)</span></a></h3>
        <p class="course__summary">${esc(x.summary)}</p>
        <span class="course__go" aria-hidden="true">${ctx.icon('arrow-up-right')}</span>
      </article>`,
    )
    .join('');
  return `
<section class="section${soft ? ' section--soft' : ''}${heading ? '' : ' section--flush'}" id="courses" aria-labelledby="courses-title">
  <div class="container">
    ${headOrHidden(ctx, heading, { eyebrow: s.eyebrow, title: s.title, lead: s.lead }, 'courses-title')}
    <div class="course-grid${detailed ? ' course-grid--detailed' : ''}">
      ${cards}
    </div>
    <div class="find-course reveal">
      <div class="find-course__copy">
        <span class="tile tile--green">${ctx.icon('compass')}</span>
        <p>${esc(s.ctaText)}</p>
      </div>
      ${waButton(ctx, { label: s.cta, loc: 'courses-cta', size: 'lg', message: 'Hello Achieve Aboard, I need help choosing a course.' })}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Why Achieve Aboard                                                  */
/* ------------------------------------------------------------------ */
export function why(ctx, { soft = true } = {}) {
  const { c } = ctx;
  const s = c.pages.sections.why;
  return `
<section class="section${soft ? ' section--soft' : ''}" id="why" aria-labelledby="why-title">
  <div class="container">
    ${sectionHead(ctx, { ...s, id: 'why-title' })}
    <div class="grid why">
      ${c.why
        .map(
          (x, i) => `
      <article class="why__item reveal" style="--i:${i % 3}">
        <span class="tile tile--lg">${ctx.icon(x.icon)}</span>
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.text)}</p>
      </article>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */
export function process(ctx, { soft = false } = {}) {
  const { c } = ctx;
  const s = c.pages.sections.process;
  return `
<section class="section${soft ? ' section--soft' : ''}" id="process" aria-labelledby="process-title">
  <div class="container">
    ${sectionHead(ctx, { ...s, id: 'process-title', center: true })}
    <ol class="steps">
      ${c.process
        .map(
          (x, i) => `
      <li class="step reveal" style="--i:${i}">
        <span class="step__num" aria-hidden="true">${i + 1}</span>
        <div class="step__card">
          <span class="tile">${ctx.icon(x.icon)}</span>
          <h3><span class="sr-only">Step ${i + 1}: </span>${esc(x.title)}</h3>
          <p>${esc(x.text)}</p>
        </div>
      </li>`,
        )
        .join('')}
    </ol>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Testimonials (hidden when the list is empty)                        */
/* ------------------------------------------------------------------ */
export function testimonials(ctx, { soft = true } = {}) {
  const { c } = ctx;
  if (!c.testimonials.length) return '';
  const s = c.pages.sections.testimonials;
  return `
<section class="section${soft ? ' section--soft' : ''}" id="testimonials" aria-labelledby="testimonials-title">
  <div class="container">
    ${sectionHead(ctx, { ...s, id: 'testimonials-title' })}
    <div class="grid quotes">
      ${c.testimonials
        .map(
          (t, i) => `
      <figure class="quote reveal" style="--i:${i % 3}">
        <span class="quote__mark" aria-hidden="true">${ctx.icon('quote')}</span>
        <blockquote><p>${esc(t.quote)}</p></blockquote>
        <figcaption>
          <span class="avatar" aria-hidden="true">${esc(initials(t.name) || '•')}</span>
          <span class="quote__who"><strong>${esc(t.name)}</strong>${t.detail ? `<span>${esc(t.detail)}</span>` : ''}</span>
          ${t.placeholder ? sampleBadge(ctx) : ''}
        </figcaption>
      </figure>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */
export function faq(ctx, { soft = false } = {}) {
  const { c } = ctx;
  const s = c.pages.sections.faq;
  return `
<section class="section${soft ? ' section--soft' : ''}" id="faq" aria-labelledby="faq-title">
  <div class="container faq">
    <div class="faq__intro">
      ${sectionHead(ctx, { ...s, id: 'faq-title' })}
      <div class="faq__help faq__help--side">
        <p>Still have a question?</p>
        ${waButton(ctx, { label: 'Ask on WhatsApp', loc: 'faq', variant: 'wa-soft' })}
      </div>
    </div>
    <div class="faq__list">
      ${c.faq
        .map(
          (x, i) => `
      <details class="faq__item reveal" style="--i:${Math.min(i, 4)}" name="faq">
        <summary>
          <span>${esc(c.fill(x.q))}</span>
          <span class="faq__chev" aria-hidden="true">${ctx.icon('chevron-down')}</span>
        </summary>
        <div class="faq__a"><p>${esc(c.fill(x.a))}</p></div>
      </details>`,
        )
        .join('')}
    </div>
    <div class="faq__help faq__help--after">
      <p>Still have a question?</p>
      ${waButton(ctx, { label: 'Ask on WhatsApp', loc: 'faq-bottom', variant: 'wa-soft' })}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Contact form + details                                              */
/* ------------------------------------------------------------------ */
export function contactForm(ctx) {
  const { c, site } = ctx;
  const s = c.pages.sections.contact;
  const wa = site.contact.whatsapp;
  const countries = [...c.destNames, 'Not sure yet'];
  return `
<form class="form reveal" id="inquiry-form" novalidate
      data-wa-number="${esc(wa.number)}" data-wa-intro="${esc(wa.message)}" data-email="${esc(site.contact.email)}">
  <h3 class="form__title">${esc(s.formTitle)}</h3>
  <div class="form__grid">
    <div class="field">
      <label for="f-name">Name <span class="req" aria-hidden="true">*</span></label>
      <input id="f-name" name="name" type="text" autocomplete="name" required placeholder="Your full name" aria-describedby="e-name">
      <p class="field__error" id="e-name" hidden>Please enter your name.</p>
    </div>
    <div class="field">
      <label for="f-phone">Phone / WhatsApp <span class="req" aria-hidden="true">*</span></label>
      <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="Include country code" aria-describedby="e-phone">
      <p class="field__error" id="e-phone" hidden>Please enter a phone number we can reach you on.</p>
    </div>
    <div class="field field--wide">
      <label for="f-email">Email</label>
      <input id="f-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" aria-describedby="e-email">
      <p class="field__error" id="e-email" hidden>That email address doesn’t look right.</p>
    </div>
    <div class="field">
      <label for="f-country">Country of Interest</label>
      <div class="select">
        <select id="f-country" name="country">
          <option value="">Select a country</option>
          ${countries.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}
        </select>
        ${ctx.icon('chevron-down')}
      </div>
    </div>
    <div class="field">
      <label for="f-level">Study Level</label>
      <div class="select">
        <select id="f-level" name="level">
          <option value="">Select a level</option>
          ${site.studyLevels.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}
        </select>
        ${ctx.icon('chevron-down')}
      </div>
    </div>
    <div class="field field--wide">
      <label for="f-course">Preferred Course</label>
      <input id="f-course" name="course" type="text" list="course-list" autocomplete="off" placeholder="e.g. Computer Science or Business">
      <datalist id="course-list">
        ${c.courseNames.map((n) => `<option value="${esc(n)}"></option>`).join('')}
      </datalist>
    </div>
    <div class="field field--wide">
      <label for="f-message">Message</label>
      <textarea id="f-message" name="message" rows="4" placeholder="Tell us a little about your plans or questions"></textarea>
    </div>
  </div>
  <div class="form__actions">
    <a class="btn btn--wa btn--xl btn--block" id="f-send-wa" href="${esc(ctx.wa())}" target="_blank" rel="noopener noreferrer" data-wa="form">${ctx.icon('whatsapp')}<span>Send Inquiry on WhatsApp</span><span class="sr-only"> (opens WhatsApp in a new tab)</span></a>
    <a class="btn btn--outline btn--block" id="f-send-mail" href="${esc(ctx.mailto('Study abroad inquiry'))}" data-wa="form-email">${ctx.icon('mail')}<span>Send by email instead</span></a>
  </div>
  <p class="form__status" id="form-status" role="status" aria-live="polite" hidden></p>
  <p class="form__note">${ctx.icon('lock')}<span>${esc(s.formNote)}</span></p>
</form>`;
}

export function contactDetails(ctx) {
  const { c, site } = ctx;
  const wa = site.contact.whatsapp;
  const fb = site.social?.facebook;
  return `
<div class="contact__cards">
  <a class="contact-card contact-card--wa reveal" href="${esc(ctx.wa())}" target="_blank" rel="noopener noreferrer" data-wa="contact-card">
    <span class="tile tile--wa">${ctx.icon('whatsapp')}</span>
    <span class="contact-card__body">
      <span class="contact-card__label">WhatsApp · fastest reply</span>
      <span class="contact-card__value">${esc(wa.display)}</span>
      <span class="contact-card__hint">Tap to start a chat <span class="sr-only">(opens WhatsApp in a new tab)</span></span>
    </span>
    ${ctx.icon('arrow-up-right', 'contact-card__go')}
  </a>
  <a class="contact-card reveal" style="--i:1" href="${esc(ctx.mailto('Study abroad inquiry'))}">
    <span class="tile">${ctx.icon('mail')}</span>
    <span class="contact-card__body">
      <span class="contact-card__label">Email</span>
      <span class="contact-card__value contact-card__value--email">${esc(site.contact.email)}</span>
      <span class="contact-card__hint">We read every message</span>
    </span>
    ${ctx.icon('arrow-up-right', 'contact-card__go')}
  </a>
  <div class="contact-card contact-card--static reveal" style="--i:2">
    <span class="tile">${ctx.icon('clock')}</span>
    <span class="contact-card__body">
      <span class="contact-card__label">When can I message?</span>
      <span class="contact-card__value contact-card__value--sm">Any time</span>
      <span class="contact-card__hint">Send a message whenever suits you. We reply as soon as we can.</span>
    </span>
  </div>
  ${
    fb
      ? `<a class="contact-card reveal" style="--i:3" href="${esc(fb)}" target="_blank" rel="noopener noreferrer" data-wa="facebook">
    <span class="tile tile--fb">${ctx.icon('facebook')}</span>
    <span class="contact-card__body">
      <span class="contact-card__label">Facebook</span>
      <span class="contact-card__value contact-card__value--sm">Follow Achieve Aboard</span>
      <span class="contact-card__hint">Updates and study abroad tips <span class="sr-only">(opens in a new tab)</span></span>
    </span>
    ${ctx.icon('arrow-up-right', 'contact-card__go')}
  </a>`
      : ''
  }
</div>`;
}

export function contact(ctx, { id = 'contact', soft = true, heading = 'h2' } = {}) {
  const s = ctx.c.pages.sections.contact;
  return `
<section class="section${soft ? ' section--soft' : ''}" id="${id}" aria-labelledby="contact-title">
  <div class="container contact">
    <div class="contact__info">
      ${sectionHead(ctx, { eyebrow: s.eyebrow, title: s.title, lead: s.lead, id: 'contact-title', tag: heading })}
      ${contactDetails(ctx)}
    </div>
    <div class="contact__form">
      ${contactForm(ctx)}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* About page extras                                                   */
/* ------------------------------------------------------------------ */
export function promise(ctx) {
  const p = ctx.c.pages.about.promise;
  return `
<section class="section section--soft" aria-labelledby="promise-title">
  <div class="container promise">
    <div class="promise__copy">
      ${sectionHead(ctx, { eyebrow: p.eyebrow, title: p.title, id: 'promise-title' })}
      ${p.paragraphs.map((t) => `<p class="reveal">${esc(t)}</p>`).join('')}
    </div>
    <ul class="promise__values">
      ${p.values
        .map(
          (v, i) => `
      <li class="reveal" style="--i:${i}">
        <span class="tile">${ctx.icon(v.icon)}</span>
        <div><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ */
/* Help band shown at the foot of destination / university pages       */
/* ------------------------------------------------------------------ */
export function helpBand(ctx, { title, text, loc, message }) {
  return `
<section class="section section--tight" aria-label="${esc(title)}">
  <div class="container">
    <div class="help-band reveal">
      <div class="help-band__copy">
        <span class="tile tile--green">${ctx.icon('whatsapp')}</span>
        <div><h2 class="help-band__title">${esc(title)}</h2><p>${esc(text)}</p></div>
      </div>
      ${waButton(ctx, { label: 'Chat on WhatsApp', loc, size: 'lg', message })}
    </div>
  </div>
</section>`;
}

export { listJoin };
