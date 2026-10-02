/**
 * Page compositions: which sections appear on which page, in which order.
 * Each builder returns { title, description, main, schema?, preload?, ... }.
 */
import { markdown } from '../lib/markdown.mjs';
import { esc, formatDate, plain, truncate, wordCount } from '../lib/util.mjs';
import { linkButton, sectionHead, waButton } from './components.mjs';
import { breadcrumbSchema, faqSchema } from './layout.mjs';
import * as S from './sections.mjs';

const seoOf = (ctx, key) => ctx.c.pages[key].seo;
const heroOf = (ctx, key) => ctx.c.pages[key].hero;

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */
function home(ctx) {
  const { c } = ctx;
  const h = c.pages.home.hero.image;
  const srcset = h.widths.map((w) => `${ctx.asset(`${h.base}-${w}.webp`)} ${w}w`).join(', ');
  const main = [
    S.hero(ctx),
    S.trust(ctx),
    S.about(ctx),
    S.services(ctx, { after: S.ctaStrip(ctx, { loc: 'services-strip' }) }),
    S.destinations(ctx),
    S.universities(ctx, { pageSize: 6, showAllLink: true }),
    S.courses(ctx),
    S.why(ctx),
    S.process(ctx),
    S.ctaBand(ctx, { loc: 'home-band' }),
    S.testimonials(ctx),
    S.faq(ctx),
    S.contact(ctx),
  ].join('\n');
  return {
    ...seoOf(ctx, 'home'),
    main,
    schema: [faqSchema(ctx)],
    preload: `<link rel="preload" as="image" href="${ctx.asset(`${h.base}-${h.width}.webp`)}" imagesrcset="${esc(srcset)}" imagesizes="(min-width: 960px) 460px, min(88vw, 380px)" fetchpriority="high">`,
  };
}

/* ------------------------------------------------------------------ */
/* Inner pages                                                         */
/* ------------------------------------------------------------------ */
function destinationsPage(ctx) {
  const hero = heroOf(ctx, 'destinations');
  const help = ctx.c.pages.destinations.help;
  return {
    ...seoOf(ctx, 'destinations'),
    main: [
      S.pageHero(ctx, { ...hero, crumb: 'Study Destinations' }),
      S.destinations(ctx, { detailed: true, heading: false }),
      S.helpBand(ctx, { ...help, loc: 'destinations-help', message: 'Hello Achieve Aboard, I need help choosing a study destination.' }),
      S.process(ctx, { soft: true }),
      S.ctaBand(ctx, { loc: 'destinations-band' }),
    ].join('\n'),
    schema: [breadcrumbSchema(ctx, [{ name: 'Home', path: 'index.html' }, { name: 'Study Destinations', path: ctx.file }])],
  };
}

function universitiesPage(ctx) {
  const hero = heroOf(ctx, 'universities');
  const help = ctx.c.pages.universities.help;
  return {
    ...seoOf(ctx, 'universities'),
    main: [
      S.pageHero(ctx, { ...hero, crumb: 'Universities' }),
      S.universities(ctx, { pageSize: 12, soft: false, heading: false }),
      S.helpBand(ctx, { ...help, loc: 'universities-help', message: 'Hello Achieve Aboard, I am looking for a university and need some help.' }),
      S.ctaBand(ctx, { loc: 'universities-band' }),
    ].join('\n'),
    schema: [breadcrumbSchema(ctx, [{ name: 'Home', path: 'index.html' }, { name: 'Universities', path: ctx.file }])],
  };
}

function coursesPage(ctx) {
  const hero = heroOf(ctx, 'courses');
  return {
    ...seoOf(ctx, 'courses'),
    main: [
      S.pageHero(ctx, { ...hero, crumb: 'Courses' }),
      S.courses(ctx, { detailed: true, heading: false }),
      S.process(ctx, { soft: true }),
      S.ctaBand(ctx, { loc: 'courses-band' }),
    ].join('\n'),
    schema: [breadcrumbSchema(ctx, [{ name: 'Home', path: 'index.html' }, { name: 'Courses', path: ctx.file }])],
  };
}

function servicesPage(ctx) {
  const hero = heroOf(ctx, 'services');
  return {
    ...seoOf(ctx, 'services'),
    main: [
      S.pageHero(ctx, { ...hero, crumb: 'Services' }),
      S.services(ctx, { detailed: true, soft: false, heading: false }),
      S.process(ctx, { soft: true }),
      S.ctaBand(ctx, { loc: 'services-band' }),
    ].join('\n'),
    schema: [breadcrumbSchema(ctx, [{ name: 'Home', path: 'index.html' }, { name: 'Services', path: ctx.file }])],
  };
}

function aboutPage(ctx) {
  const hero = heroOf(ctx, 'about');
  return {
    ...seoOf(ctx, 'about'),
    main: [
      S.pageHero(ctx, { ...hero, crumb: 'About Us' }),
      S.about(ctx, { home: false }),
      S.promise(ctx),
      S.why(ctx, { soft: false }),
      S.ctaBand(ctx, { loc: 'about-band' }),
    ].join('\n'),
    schema: [breadcrumbSchema(ctx, [{ name: 'Home', path: 'index.html' }, { name: 'About Us', path: ctx.file }])],
  };
}

function contactPage(ctx) {
  const hero = heroOf(ctx, 'contact');
  return {
    ...seoOf(ctx, 'contact'),
    main: [
      S.pageHero(ctx, { ...hero, crumb: 'Contact' }),
      S.contact(ctx, { soft: false }),
      S.faq(ctx, { soft: true }),
    ].join('\n'),
    schema: [faqSchema(ctx), breadcrumbSchema(ctx, [{ name: 'Home', path: 'index.html' }, { name: 'Contact', path: ctx.file }])],
  };
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */
export const readingTime = (post) => Math.max(1, Math.round(wordCount(post.body) / 200));
export const postPath = (post) => `blog/${post.slug}.html`;

function postCard(ctx, post, i) {
  return `
      <article class="post-card reveal" style="--i:${i % 3}">
        <div class="post-card__cover post-card__cover--${post.tone}" aria-hidden="true">
          ${ctx.icon(post.icon, 'post-card__icon')}
          <span class="post-card__cat">${esc(post.category)}</span>
        </div>
        <div class="post-card__body">
          <p class="post-card__meta"><time datetime="${esc(post.date)}">${esc(formatDate(post.date))}</time><span aria-hidden="true">·</span><span>${readingTime(post)} min read</span></p>
          <h3 class="post-card__title"><a class="stretched" href="${ctx.prefix}${postPath(post)}">${esc(post.title)}</a></h3>
          <p class="post-card__excerpt">${esc(post.excerpt)}</p>
          <span class="post-card__more" aria-hidden="true">Read article ${ctx.icon('arrow-right')}</span>
        </div>
      </article>`;
}

/** "Short title | Brand" — falls back to the short title alone when the full line would be too long for Google. */
function postSeoTitle(post, site) {
  const base = post.seoTitle || post.title;
  const full = `${base} | ${site.brand.shortName}`;
  return full.length <= 65 ? full : base;
}

const sortedPosts = (c) => [...c.blog].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

function blogPage(ctx) {
  const { c } = ctx;
  const s = c.pages.sections.blog;
  const posts = sortedPosts(c);
  return {
    ...seoOf(ctx, 'blog'),
    main: [
      S.pageHero(ctx, { eyebrow: s.eyebrow, title: s.title, lead: s.lead, crumb: 'Blog' }),
      `<section class="section" aria-label="Articles"><div class="container"><div class="post-grid">${posts.map((p, i) => postCard(ctx, p, i)).join('')}</div></div></section>`,
      S.ctaBand(ctx, { loc: 'blog-band', title: 'Have a question about studying abroad?', text: 'Our guides are a starting point. For advice that fits your situation, message us on WhatsApp.' }),
    ].join('\n'),
    schema: [breadcrumbSchema(ctx, [{ name: 'Home', path: 'index.html' }, { name: 'Blog', path: ctx.file }])],
  };
}

export function blogPostPage(ctx, post) {
  const { c, site } = ctx;
  const { html, headings } = markdown(post.body);
  const related = sortedPosts(c).filter((p) => p.slug !== post.slug).slice(0, 3);
  const waMessage = `Hello Achieve Aboard, I just read "${post.title}" and have a question.`;
  const main = `
<article class="post">
  <header class="post__head">
    <div class="container container--narrow">
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href="${ctx.href('home')}">Home</a></li>
          <li><a href="${ctx.href('blog')}">Blog</a></li>
          <li aria-current="page">${esc(post.category)}</li>
        </ol>
      </nav>
      <p class="eyebrow">${esc(post.category)}</p>
      <h1 class="post__title">${esc(post.title)}</h1>
      <p class="post__meta">By ${esc(site.brand.shortName)} Team<span aria-hidden="true">·</span><time datetime="${esc(post.date)}">${esc(formatDate(post.date))}</time><span aria-hidden="true">·</span>${readingTime(post)} min read</p>
    </div>
  </header>
  <div class="container container--narrow post__body">
    ${
      headings.length > 2
        ? `<nav class="toc" aria-label="In this article"><p class="toc__title">In this article</p><ol>${headings.map((h) => `<li><a href="#${h.id}">${esc(h.text.replace(/^\d+\.\s*/, ''))}</a></li>`).join('')}</ol></nav>`
        : ''
    }
    <div class="prose">
      ${html}
    </div>
    <aside class="post__cta" aria-label="Talk to us">
      <div>
        <h2>Questions about your own plans?</h2>
        <p>Every student’s situation is different. Message us and we’ll help you work out your next step.</p>
      </div>
      ${waButton(ctx, { label: 'Chat on WhatsApp', loc: 'post-cta', size: 'lg', message: waMessage })}
    </aside>
    <p class="post__note">${esc('This article is general guidance only. Requirements, fees and rules change, so always confirm current details with the university and official government sources.')}</p>
  </div>
</article>
<section class="section section--soft" aria-labelledby="related-title">
  <div class="container">
    ${sectionHead(ctx, { eyebrow: 'Keep reading', title: 'More study abroad guides', id: 'related-title' })}
    <div class="post-grid">${related.map((p, i) => postCard(ctx, p, i)).join('')}</div>
  </div>
</section>
${S.ctaBand(ctx, { loc: 'post-band' })}`;
  const url = site.url ? `${site.url}/${postPath(post)}` : undefined;
  const ogImage = site.url && ctx.exists(site.seo.ogImage) ? `${site.url}/${site.seo.ogImage}` : undefined;
  return {
    title: postSeoTitle(post, site),
    description: truncate(post.excerpt, 158),
    main,
    type: 'article',
    article: { date: post.date, category: post.category },
    schema: [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Organization', name: site.brand.shortName },
        publisher: { '@type': 'Organization', name: site.brand.shortName },
        mainEntityOfPage: url,
        image: ogImage,
      },
      breadcrumbSchema(ctx, [
        { name: 'Home', path: 'index.html' },
        { name: 'Blog', path: 'blog.html' },
        { name: post.title, path: postPath(post) },
      ]),
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Privacy policy                                                      */
/* ------------------------------------------------------------------ */
function privacyPage(ctx) {
  const { c, site } = ctx;
  const p = c.pages.privacy;
  const tracking = Boolean(site.analytics?.metaPixelId || site.analytics?.googleAnalyticsId);
  const trackingText = tracking
    ? 'This website uses analytics and advertising tools (Meta Pixel and/or Google Analytics). They may set cookies or use similar technologies to measure how visitors use the site and how our ads perform. You can control cookies in your browser settings.'
    : 'This website does not currently use analytics or advertising cookies. If we add tools such as Meta Pixel or Google Analytics in future, this page will be updated to say so.';
  const md = `
Achieve Aboard (“we”, “us”) respects your privacy. This page explains what information we collect through this website and how we use it.

## Information you give us

When you use the contact form, we ask for your name, phone or WhatsApp number, email address, country of interest, study level, preferred course and a message. Only your name and phone number are required — you choose what else to share.

## How the contact form works

This website does not store form submissions on its own servers. When you press **Send Inquiry on WhatsApp**, your device opens WhatsApp with a message that contains your details, ready for you to review and send. When you choose **Send by email instead**, your email app opens with a pre-filled message. Nothing is sent to us until you press send in WhatsApp or in your email app.

## How we use your information

We use the information you send us to reply to your inquiry, to give you study abroad guidance, and to follow up on the services you ask about. We do not sell your personal information.

## Third-party services

Messages sent through WhatsApp are handled by WhatsApp (Meta) under its own terms and privacy policy. Email is handled by your email provider. Links to Facebook and other websites are governed by those websites’ own policies. ${trackingText}

## Keeping your information

We keep the messages we receive for as long as we need them to help you and to meet our obligations, and we delete them on request where possible.

## Your choices

You can ask us to access, correct or delete the personal information you have sent us by emailing ${site.contact.email} or messaging us on WhatsApp at ${site.contact.whatsapp.display}.

## Changes to this policy

We may update this policy from time to time. The date below shows when it was last changed.

**Last updated: ${p.updated}**
`;
  const { html } = markdown(md);
  return {
    ...seoOf(ctx, 'privacy'),
    main: `${S.pageHero(ctx, { ...p.hero, crumb: 'Privacy Policy' })}
<section class="section"><div class="container container--narrow"><div class="prose">${html}</div></div></section>`,
  };
}

/* ------------------------------------------------------------------ */
export const PAGE_BUILDERS = {
  home,
  destinations: destinationsPage,
  universities: universitiesPage,
  courses: coursesPage,
  services: servicesPage,
  about: aboutPage,
  blog: blogPage,
  contact: contactPage,
  privacy: privacyPage,
};

export { plain, linkButton };
