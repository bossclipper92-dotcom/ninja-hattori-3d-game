# ACHIEVE ABOARD — Study Abroad Website

A fast, mobile-first website for **Achieve Aboard**, a study abroad consultancy.
Its main job is to turn visitors (especially people arriving from Facebook) into **WhatsApp inquiries and applications**.

> **Study Abroad | University Admission | Student Guidance**
> WhatsApp: +60167217612 · Email: achieveaboard4@gmail.com

It is a plain static website: no database, no server code and **no dependencies to install**.
All wording, universities, courses, destinations, testimonials and statistics live in simple files in [`content/`](content/) that you can edit with any text editor.

---

## What is on the site

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Hero, trust cards, about, 9 services, 8 destinations, searchable universities, 8 course areas, why us, 5-step process, testimonials, FAQ and the inquiry form |
| Study Destinations | `destinations.html` | Detailed cards for every destination |
| Universities | `universities.html` | Search + filter by country and program (deep links like `universities.html?country=Malaysia`) |
| Courses | `courses.html` | The 8 course categories with example programs |
| Services | `services.html` | The 9 services in detail |
| About Us | `about.html` | Story, approach and values |
| Blog | `blog.html` + `blog/*.html` | 4 starter guides, easy to add more |
| Contact | `contact.html` | WhatsApp, email, inquiry form and FAQ |
| Privacy | `privacy.html` | Plain-language privacy policy |
| 404 | `404.html` | Friendly "page not found" |

Built in: floating WhatsApp button (desktop + mobile), WhatsApp buttons every few sections, an inquiry form that opens WhatsApp (or email) with the visitor's details already typed, per-page SEO titles/descriptions, Open Graph / Facebook share image, favicon + app icons, JSON-LD structured data, sitemap + robots.txt, accessible menu and forms, and subtle animations that respect "reduce motion".

---

## Quick start

You only need [Node.js](https://nodejs.org) 18 or newer. There is nothing to `npm install`.

```bash
npm run dev     # live preview at http://localhost:8080 (refreshes automatically when you save a file)
npm run build   # regenerate the HTML pages from /content
npm run check   # quality check: broken links, alt text, WhatsApp number, risky claims…
npm test        # build + check in one go
```

The generated `.html` files are **committed to the repository**, so the project can be published as-is on any static host.
After you edit content, run `npm run build` and commit the files that changed.

---

## Where to edit things

| To change… | Edit this file |
| --- | --- |
| WhatsApp number & default message, email, **Facebook link**, menu, study levels, tracking IDs, footer disclaimer | [`content/site.js`](content/site.js) |
| Headlines, introductions, SEO titles & descriptions, call-to-action wording, About text | [`content/pages.js`](content/pages.js) |
| The four trust cards under the hero (add real numbers if you can prove them) | [`content/stats.js`](content/stats.js) |
| Services | [`content/services.js`](content/services.js) |
| **Study destinations** (add / remove) | [`content/destinations.js`](content/destinations.js) + a photo in `assets/img/destinations/` |
| **Universities** (currently placeholders) | [`content/universities.js`](content/universities.js) |
| **Courses** | [`content/courses.js`](content/courses.js) |
| Why choose us / How it works | [`content/why.js`](content/why.js) · [`content/process.js`](content/process.js) |
| **Testimonials** (empty the list to hide the section) | [`content/testimonials.js`](content/testimonials.js) |
| FAQ | [`content/faq.js`](content/faq.js) |
| Blog posts | [`content/blog.js`](content/blog.js) |
| Colours, fonts, spacing | variables at the top of [`assets/css/styles.css`](assets/css/styles.css) |

Every content file starts with a comment that explains each field. If something is wrong (for example a country that is not in the destinations list), `npm run build` stops and tells you exactly what to fix.

### Adding a destination
1. Add a photo to `assets/img/destinations/` (3:2 landscape, ~800 px wide, WebP or JPG; an optional `name-480.webp` copy is used automatically on phones).
2. Copy one block in `content/destinations.js`, change the text, and point `image` at your photo.
3. Run `npm run build`. The new country appears on the home page, the destinations page, the university filter and the contact form.

### Adding a university
Copy a block in `content/universities.js`, keep `country` identical to a destination name, and list `programs` using names from `content/courses.js` (so the Program filter works). **Delete `placeholder: true`** on real entries to remove the "Sample" tag.

---

## Launch checklist

`npm run build` prints reminders for your website address, Facebook link, sample universities and sample testimonials until they are done.

1. **Set your website address** — `url` in `content/site.js` (for example `https://www.yourdomain.com`, no trailing slash).
   Facebook needs a full address for the share image; it also switches on canonical links, `og:url` and `sitemap.xml`.
   For deployments you can also run `SITE_URL=https://www.yourdomain.com npm run build`.
2. **Paste your Facebook Page link** — `social.facebook` in `content/site.js`. It is used in the footer, the contact section and search-engine data. Set it to `''` to hide the icon.
3. **Replace the sample universities and testimonials** with real, permitted information. They are labelled "Sample" on purpose and no partnerships are claimed.
4. **Check the trust cards** in `content/stats.js`. They contain no numbers. Add figures only if you can prove them.
5. **Replace the photos** with real ones if you have them (see below) and **swap in your original logo file** (see below).
6. **Read the Privacy page and the footer disclaimer** and adjust the wording to your situation.
7. `npm test` must finish with “All checks passed”.
8. Publish (below), then test a link in the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and press **Scrape Again**.
9. Optional: add your Meta Pixel ID and/or GA4 ID in `content/site.js → analytics`. WhatsApp clicks are then reported as *Contact* events and form sends as *Lead* (add a cookie notice if your audience's laws require one).

---

## Publishing

Because the HTML is already generated, the repository root *is* the website.

* **GitHub Pages** — Settings → Pages → *Deploy from a branch* → `main` and `/ (root)`. A `.nojekyll` file is included. All links are relative, so it also works under `https://<user>.github.io/<repo>/`.
* **Netlify / Cloudflare Pages** — connect the repository, leave the build command empty (or use `npm run build`) and set the publish directory to `/`. `_headers` adds sensible caching and security headers.
* **Any web host** — upload the project files (you can leave out `content/`, `scripts/`, `package.json` and `README.md`).

Tip: the 404 page uses root-relative links, so it looks best on a custom domain or root site.

---

## About the images and logo

* **Logo** — the original logo file was not available while building this site, so `assets/img/logo.svg` is a **faithful vector recreation** of the supplied badge (blue "A", red/white/green ribbon, flag, towers, hills, wordmark). To use your original artwork instead, save it in `assets/img/` (a square PNG, WebP or SVG works best), set `brand.logo` in `content/site.js`, and replace the favicon files (`favicon.ico` and everything in `assets/img/icons/`; a tool such as realfavicongenerator.net does this in one step).
* **Photos** — the hero, about and destination pictures are **AI-generated illustrations**. They do not show real students, clients, offices or events. Replace them with your own photography when you can: hero 4:5 (1040×1300), about 4:3 (900×675), destinations 3:2 (800×533). Keep each file under about 100 KB (WebP or JPG). The hero and about image paths are in `content/pages.js`; destination paths are in `content/destinations.js`.
* **Facebook share image** — `assets/img/og-image.jpg` (1200×630) is built from the logo, headline and hero photo. Replace it with any 1200×630 JPG; update `seo.ogImageAlt` in `content/site.js` to match.

---

## Wording policy (important for trust)

The site avoids anything that cannot be proven: no “guaranteed admission/visa”, no invented statistics, student counts, rankings, years in business, awards, partnerships or testimonials. “24/7 Guidance” is explained honestly as *message us any time; we reply as soon as we can*.
`npm run check` scans every page for risky phrases (guarantees, percentages, “thousands”, “No.1”, “partner universities”…) and fails if it finds one — keep it that way when you edit.

---

## How the contact form works

The form does not store anything on a server. When a visitor presses **Send Inquiry on WhatsApp**, the site checks the required fields (name and phone), builds a message such as

```
Hello Achieve Aboard, I want to know about studying abroad.

*Name:* …
*Phone/WhatsApp:* …
*Country of interest:* Malaysia
*Study level:* Bachelor's Degree
*Preferred course:* Computer Science
```

and opens `https://wa.me/60167217612?text=…`. Empty optional fields are left out. **Send by email instead** does the same with `mailto:achieveaboard4@gmail.com`.
The buttons are real links, so they work inside Facebook's in-app browser too.

---

## Project structure

```
index.html … contact.html, privacy.html, 404.html   generated pages
blog/*.html                                          generated blog posts
content/                                             ← YOUR EDITABLE CONTENT (start here)
assets/css/styles.css                                all styling (colour variables at the top)
assets/js/main.js                                    menu, filters, form (≈15 KB, about 4 KB compressed, no libraries)
assets/img/                                          logo, photos, destination images, icons, share image
assets/fonts/                                        self-hosted Fraunces + Figtree (WOFF2) and their licenses
scripts/build.mjs                                    the page generator (npm run build)
scripts/dev.mjs                                      local preview with live reload (npm run dev)
scripts/check.mjs                                    quality checks (npm run check)
scripts/templates/, scripts/lib/                     page templates and helpers
sitemap.xml, robots.txt, site.webmanifest, _headers  generated SEO / hosting files
```

---

## Performance, accessibility and SEO notes

* Pre-rendered HTML (fast first paint, readable by search engines and Facebook's crawler), one small CSS file, one small script, **no third-party requests** unless you add a Pixel/GA tag.
* Images are WebP with `srcset`, explicit width/height and lazy loading below the fold. Fonts are self-hosted and preloaded. CSS/JS URLs carry a content hash for cache-busting.
* Keyboard-friendly menu with focus handling and `Esc` to close, skip link, labelled form fields with clear error messages, visible focus rings, `prefers-reduced-motion` support, and a no-JavaScript fallback (content and menu stay usable).
* Unique `<title>` and meta description per page, Open Graph + Twitter tags, canonical URLs (once `url` is set), JSON-LD for the organisation, FAQ, breadcrumbs and blog posts.

---

## Credits and licenses

* Site code: MIT (see [`LICENSE`](LICENSE)).
* Fonts: **Fraunces** and **Figtree**, SIL Open Font License 1.1 (license files are in `assets/fonts/`).
* Interface icons: **Lucide** (ISC License, see [`scripts/lib/LICENSE-lucide.txt`](scripts/lib/LICENSE-lucide.txt)). WhatsApp and Facebook glyphs: **Simple Icons** (CC0). WhatsApp and Facebook are trademarks of their respective owners; the glyphs are used only to link to those services.
