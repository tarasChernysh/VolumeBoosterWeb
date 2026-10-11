#!/usr/bin/env node
// EQfy static site generator — zero dependencies (Node 18+). Usage: `node build.mjs`
//
// Reads   src/site.json, src/i18n/<lang>.json, src/content/<lang>/faq.json, src/content/<lang>/blog/<id>.html
// Writes  <prefix>/blog/**, <prefix>/faq/, 404.html, sitemap.xml, llms.txt
//         and the "latest posts" block between <!-- blog:latest --> markers in the landing pages.
// Only the generated folders above are deleted/rewritten; everything else is left untouched.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const abs = (p) => path.join(ROOT, p.replace(/^\//, ''));
const read = (p) => fs.readFileSync(abs(p), 'utf8');
const readJSON = (p) => {
  try { return JSON.parse(read(p)); } catch (e) { fail(`${p}: ${e.message}`); }
};
const write = (p, s) => { fs.mkdirSync(path.dirname(abs(p)), { recursive: true }); fs.writeFileSync(abs(p), s); };
const exists = (p) => fs.existsSync(abs(p));
function fail(msg) { console.error(`✖ ${msg}`); process.exit(1); }
const warn = (msg) => console.warn(`⚠ ${msg}`);

// ---------- helpers ----------
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', nbsp: ' ' };
const decode = (s) => String(s).replace(/&(#39|[a-z]+);/g, (m, k) => ENTITIES[k] ?? m);
const esc = (s) => decode(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (s) => decode(String(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const ld = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

function imageSize(url) {
  const b = fs.readFileSync(abs(url));
  if (b.toString('ascii', 1, 4) === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const t = b.toString('ascii', 12, 16);
    if (t === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (t === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (t === 'VP8L') { const n = b.readUInt32LE(21); return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
  }
  fail(`${url}: only PNG and WebP images are supported`);
}

// ---------- load ----------
const site = readJSON('src/site.json');
const O = site.origin;
const L = site.langs;
const LANGS = site.contentLangs.filter((l) => {
  if (exists(`src/i18n/${l}.json`) && exists(`src/content/${l}/faq.json`)) return true;
  warn(`skipping language "${l}" (missing src/i18n/${l}.json or src/content/${l}/faq.json)`);
  return false;
});
if (!LANGS.includes('en')) fail('English content is required');
const T = Object.fromEntries(LANGS.map((l) => [l, readJSON(`src/i18n/${l}.json`)]));
const FAQ = Object.fromEntries(LANGS.map((l) => [l, readJSON(`src/content/${l}/faq.json`)]));

const REQUIRED = ['slug', 'title', 'description', 'date', 'updated', 'image', 'imageAlt', 'category'];
function loadPost(lang, file) {
  const p = `src/content/${lang}/blog/${file}`;
  const m = read(p).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) fail(`${p}: expected a JSON front-matter block between --- lines`);
  let fm;
  try { fm = JSON.parse(m[1]); } catch (e) { fail(`${p}: front-matter JSON — ${e.message}`); }
  for (const k of REQUIRED) if (!fm[k]) fail(`${p}: missing "${k}"`);
  if (!/^[a-z0-9-]+$/.test(fm.slug)) fail(`${p}: slug must be lowercase ASCII with dashes`);
  for (const k of ['date', 'updated']) if (!/^\d{4}-\d{2}-\d{2}$/.test(fm[k])) fail(`${p}: ${k} must be YYYY-MM-DD`);
  if (!T[lang].post.categories[fm.category]) fail(`${p}: unknown category "${fm.category}"`);
  if (/<h1[\s>]/i.test(m[2])) fail(`${p}: the body must not contain <h1> (the template renders it)`);
  for (const u of [fm.image, fm.ogImage].filter(Boolean)) if (!exists(u)) fail(`${p}: image not found ${u}`);
  return { ...fm, id: file.replace(/\.html$/, ''), lang, body: m[2].trim(), file: p, faq: fm.faq || [], related: fm.related || [] };
}
const POSTS = {};
for (const lang of LANGS) {
  const dir = `src/content/${lang}/blog`;
  const files = exists(dir) ? fs.readdirSync(abs(dir)).filter((f) => f.endsWith('.html')).sort() : [];
  POSTS[lang] = Object.fromEntries(files.map((f) => { const p = loadPost(lang, f); return [p.id, p]; }));
  const slugs = Object.values(POSTS[lang]).map((p) => p.slug);
  const dup = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (dup) fail(`duplicate slug "${dup}" in ${lang}`);
}
const IDS = Object.keys(POSTS.en);
for (const lang of LANGS) for (const id of Object.keys(POSTS[lang])) if (!POSTS.en[id]) fail(`${lang}/${id}: no English original`);
for (const lang of LANGS.filter((l) => l !== 'en')) {
  const missing = IDS.filter((id) => !POSTS[lang][id]);
  if (missing.length) warn(`${lang}: missing translations for ${missing.join(', ')}`);
}

// ---------- urls ----------
const home = (lang) => `${L[lang].prefix}/`;
const blogUrl = (lang) => `${L[lang].prefix}/blog/`;
const faqUrl = (lang) => `${L[lang].prefix}/faq/`;
const postUrl = (lang, id) => {
  const p = POSTS[lang]?.[id];
  return p ? `${L[lang].prefix}/blog/${p.slug}/` : null;
};
const full = (u) => (u.startsWith('http') ? u : O + u);

function resolveLinks(html, lang, where) {
  return html.replace(/\{\{\s*([a-z]+)(?::([a-z0-9-]+))?\s*\}\}/g, (m, key, arg) => {
    if (key === 'post') {
      const u = postUrl(lang, arg) || (POSTS.en[arg] && postUrl('en', arg));
      if (!u) fail(`${where}: unknown post id in ${m}`);
      return u;
    }
    if (key === 'blog') return blogUrl(lang);
    if (key === 'faq') return faqUrl(lang);
    if (key === 'home') return home(lang);
    if (key === 'appstore') return site.appStoreUrl;
    fail(`${where}: unknown placeholder ${m}`);
  });
}
const absLinks = (html) => html.replace(/href="\//g, `href="${O}/`);

const fmtDate = (lang, d) => new Intl.DateTimeFormat(T[lang].dateLocale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}T00:00:00Z`));
function readingMinutes(lang, html) {
  const text = stripTags(html);
  const units = lang === 'zh' ? text.replace(/\s/g, '').length / 400 : text.split(' ').length / 220;
  return Math.max(1, Math.round(units));
}

// ---------- shared template ----------
const cssHash = crypto.createHash('sha1').update(read('assets/css/site.css')).digest('hex').slice(0, 8);
const FONTS = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&family=Outfit:wght@400;500;600;700;800&display=swap';
const APPLE_SVG = '<svg class="icon-apple" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';
const SCRIPT = `<script>
(function(){var n=document.querySelector('.nav');addEventListener('scroll',function(){n.classList.toggle('nav--scrolled',scrollY>40)},{passive:true});
document.addEventListener('click',function(e){var b=e.target.closest('[data-toggle]');if(b){document.querySelector(b.getAttribute('data-toggle')).classList.toggle('is-open');return}var d=document.querySelector('.lang-switcher__dropdown');if(d&&!e.target.closest('.lang-switcher'))d.classList.remove('is-open')});})();
</script>`;

/**
 * Full HTML page. `alternates` = { lang: url } of this page's translations (drives hreflang + switcher).
 */
function layout({ lang, title, description, url, alternates, image = site.defaultImage, imageAlt = site.brand, ogType = 'website', jsonld, main, noindex = false, current }) {
  const t = T[lang] || T.en;
  const [iw, ih] = imageSize(image);
  const hreflang = alternates
    ? Object.entries(alternates).map(([l, u]) => `    <link rel="alternate" hreflang="${L[l].hreflang}" href="${full(u)}">`).join('\n') +
      `\n    <link rel="alternate" hreflang="x-default" href="${full(alternates.en || url)}">`
    : '';
  const switcher = alternates && Object.keys(alternates).length > 1
    ? `<div class="lang-switcher">
                <button class="lang-switcher__btn" data-toggle=".lang-switcher__dropdown" aria-label="${esc(t.nav.changeLanguage)}">🌐 ${L[lang].code} ▾</button>
                <div class="lang-switcher__dropdown">
${Object.entries(alternates).map(([l, u]) => `                    <a href="${u}" class="lang-switcher__option${l === lang ? ' lang-switcher__option--active' : ''}" hreflang="${L[l].hreflang}" lang="${L[l].htmlLang}">${L[l].label}</a>`).join('\n')}
                </div>
            </div>`
    : '';
  const links = [
    [`${home(lang)}#features`, t.nav.features], [`${home(lang)}#equalizer`, t.nav.equalizer], [`${home(lang)}#ai-audio`, t.nav.aiStudio],
    [faqUrl(lang), t.nav.faq, 'faq'], [blogUrl(lang), t.nav.blog, 'blog'],
  ];
  const navLinks = links.map(([u, label, key]) => `<li><a href="${u}" class="nav__link"${key && key === current ? ' aria-current="page"' : ''}>${esc(label)}</a></li>`);
  return `<!DOCTYPE html>
<html lang="${L[lang].htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>if(/\\.github\\.io$/.test(location.hostname))location.replace('https://eqfy.app'+location.pathname.replace(/^\\/VolumeBoosterWeb/,'')+location.search+location.hash)</script>
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
    <meta name="theme-color" content="#0A1A0A">
${noindex ? '' : `    <link rel="canonical" href="${full(url)}">\n${hreflang}\n`}
    <meta property="og:site_name" content="${esc(site.brand)}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${full(url)}">
    <meta property="og:image" content="${full(image)}">
    <meta property="og:image:width" content="${iw}">
    <meta property="og:image:height" content="${ih}">
    <meta property="og:image:alt" content="${esc(imageAlt)}">
    <meta property="og:locale" content="${L[lang].ogLocale}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image" content="${full(image)}">
    <meta name="apple-itunes-app" content="app-id=${site.appId}">

    <link rel="icon" type="image/png" href="/assets/images/favicon.png">
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${FONTS}"></noscript>
    <link rel="stylesheet" href="/assets/css/site.css?v=${cssHash}">
${jsonld ? `    <script type="application/ld+json">\n${ld(jsonld)}\n    </script>\n` : ''}</head>
<body>
    <div class="bg-glow bg-glow--green" aria-hidden="true"></div>
    <div class="bg-glow bg-glow--purple" aria-hidden="true"></div>

    <nav class="nav" aria-label="Main navigation">
        <div class="nav__inner">
            <a href="${home(lang)}" class="nav__logo">
                <span class="nav__logo-icon"><img src="${site.logo}" alt="${esc(t.nav.logoAlt)}" width="36" height="36"></span>
                ${esc(site.brand)}
            </a>
            <ul class="nav__links">
                ${navLinks.join('\n                ')}
            </ul>
            ${switcher}
            <a href="${site.appStoreUrl}" class="nav__cta nav__cta--desktop" target="_blank" rel="noopener">${APPLE_SVG} ${esc(t.nav.download)}</a>
            <button class="nav__mobile-toggle" data-toggle=".nav__mobile-menu" aria-label="${esc(t.nav.menu)}"><span></span><span></span><span></span></button>
        </div>
    </nav>
    <div class="nav__mobile-menu">
        <ul>
            ${navLinks.map((l) => l.replace(' class="nav__link"', '')).join('\n            ')}
        </ul>
        <a href="${site.appStoreUrl}" class="nav__cta" target="_blank" rel="noopener">${APPLE_SVG} ${esc(t.nav.download)}</a>
    </div>

${main}

    <footer class="footer">
        <div class="container">
            <div class="footer__inner">
                <div class="footer__brand">
                    <div class="footer__logo"><span class="footer__logo-icon"><img src="${site.logo}" alt="" width="32" height="32"></span>${esc(site.brand)}</div>
                    <p class="footer__tagline">${esc(t.footer.tagline)}</p>
                </div>
                <div class="footer__links">
                    <div class="footer__column">
                        <p class="footer__heading">${esc(t.footer.features)}</p>
                        <ul>
                            <li><a href="${home(lang)}#volume-booster">${esc(t.footer.volumeBooster)}</a></li>
                            <li><a href="${home(lang)}#equalizer">${esc(t.footer.bassEq)}</a></li>
                            <li><a href="${home(lang)}#spatial-audio">${esc(t.footer.spatial)}</a></li>
                            <li><a href="${home(lang)}#ai-audio">${esc(t.footer.aiStudio)}</a></li>
                        </ul>
                    </div>
                    <div class="footer__column">
                        <p class="footer__heading">${esc(t.footer.resources)}</p>
                        <ul>
                            <li><a href="${blogUrl(lang)}">${esc(t.nav.blog)}</a></li>
                            <li><a href="${faqUrl(lang)}">${esc(t.nav.faq)}</a></li>
                            <li><a href="mailto:${site.supportEmail}">${esc(t.footer.support)}</a></li>
                            <li><a href="${site.appStoreUrl}" target="_blank" rel="noopener">${esc(t.footer.appStore)}</a></li>
                        </ul>
                    </div>
                    <div class="footer__column">
                        <p class="footer__heading">${esc(t.footer.legal)}</p>
                        <ul>
                            <li><a href="/privacy">${esc(t.footer.privacy)}</a></li>
                            <li><a href="/terms">${esc(t.footer.terms)}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer__bottom">
                <span>&copy; 2026 ${esc(site.shortBrand)}. ${esc(t.footer.rights)}</span>
                <span>${esc(t.footer.trademark)}</span>
            </div>
        </div>
    </footer>
${SCRIPT}
</body>
</html>
`;
}

// ---------- components ----------
const breadcrumb = (items) => `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${items.map(([label, u], i) =>
  i === items.length - 1 ? `<li aria-current="page">${esc(label)}</li>` : `<li><a href="${u}">${esc(label)}</a></li>`).join('')}</ol></nav>`;
const breadcrumbLD = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name: decode(name), item: full(u) })),
});
const faqLD = (items, lang, where) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: decode(q), acceptedAnswer: { '@type': 'Answer', text: absLinks(resolveLinks(a, lang, where)) } })),
});
const faqItems = (items, lang, where) => items.map(({ q, a }) =>
  `<details class="faq__item"><summary class="faq__q">${esc(q)}</summary><div class="faq__a">${/^\s*<p[\s>]/.test(a) ? '' : '<p>'}${resolveLinks(a, lang, where)}${/^\s*<p[\s>]/.test(a) ? '' : '</p>'}</div></details>`).join('\n');
const ORG = { '@type': 'Organization', '@id': `${O}/#org`, name: site.shortBrand, url: `${O}/`, logo: { '@type': 'ImageObject', url: full(site.logo) } };

function card(post, { heading = 'h2', featured = false } = {}) {
  const t = T[post.lang];
  const u = postUrl(post.lang, post.id);
  const [w, h] = imageSize(post.image);
  return `<article class="card${featured ? ' card--featured' : ''}">
                <a class="card__image" href="${u}" tabindex="-1" aria-hidden="true"><img src="${post.image}" alt="" width="${w}" height="${h}" loading="lazy" decoding="async"></a>
                <div class="card__body">
                    <span class="card__tag">${esc(t.post.categories[post.category])}</span>
                    <${heading} class="card__title"><a href="${u}">${esc(post.title)}</a></${heading}>
                    <p class="card__text">${esc(post.description)}</p>
                    <a class="card__more" href="${u}" aria-label="${esc(t.post.readMore.replace(/\s*→\s*$/, ''))}: ${esc(post.title)}">${esc(t.post.readMore)}</a>
                </div>
            </article>`;
}
const ctaBox = (lang) => {
  const t = T[lang];
  return `<aside class="cta-box" aria-label="${esc(t.cta.title)}">
            <img class="cta-box__icon" src="${site.logo}" alt="${esc(t.cta.iconAlt)}" width="64" height="64" loading="lazy">
            <p class="cta-box__title">${esc(t.cta.title)}</p>
            <p>${esc(t.cta.text)}</p>
            <a href="${site.appStoreUrl}" class="btn-primary" target="_blank" rel="noopener">${APPLE_SVG} ${esc(t.cta.button)}</a>
        </aside>`;
};
const sortPosts = (list) => [...list].sort((a, b) => (b.pinned === true) - (a.pinned === true) || b.date.localeCompare(a.date) || IDS.indexOf(a.id) - IDS.indexOf(b.id));
const altsFor = (fn) => Object.fromEntries(LANGS.map((l) => [l, fn(l)]).filter(([, u]) => u));

// ---------- clean generated folders ----------
for (const lang of site.contentLangs) {
  for (const dir of ['blog', 'faq']) fs.rmSync(abs(`${L[lang].prefix}/${dir}`), { recursive: true, force: true });
}

const sitemap = [];
const addToSitemap = (alternates, lastmod) => {
  for (const u of Object.values(alternates)) sitemap.push({ loc: u, alternates, lastmod });
};

// ---------- posts ----------
for (const lang of LANGS) {
  const t = T[lang];
  for (const post of Object.values(POSTS[lang])) {
    const url = postUrl(lang, post.id);
    const where = post.file;
    const crumbs = [[t.home, home(lang)], [t.nav.blog, blogUrl(lang)], [post.title, url]];
    const ogImage = post.ogImage || site.defaultImage;
    const related = post.related.map((id) => {
      const p = POSTS[lang][id] || fail(`${where}: related post "${id}" not found in ${lang}`);
      return card(p, { heading: 'h3' });
    });
    const updated = post.updated !== post.date ? ` · <span>${esc(t.post.updated)} <time datetime="${post.updated}">${fmtDate(lang, post.updated)}</time></span>` : '';
    const main = `    <main class="page">
        <div class="container">
        ${breadcrumb(crumbs)}
        <article>
            <header class="page__header">
                <span class="eyebrow">${esc(t.post.categories[post.category])}</span>
                <h1 class="page__title">${esc(post.title)}</h1>
                <p class="post-meta"><span>${esc(t.post.by)}</span> · <span>${esc(t.post.published)} <time datetime="${post.date}">${fmtDate(lang, post.date)}</time></span>${updated} · <span>${esc(t.post.minRead.replace('{n}', readingMinutes(lang, post.body)))}</span></p>
            </header>
            <div class="prose">
${resolveLinks(post.body, lang, where)}
            </div>
${post.faq.length ? `            <section class="post-faq" aria-labelledby="post-faq-title">
                <h2 id="post-faq-title">${esc(t.post.faqTitle)}</h2>
                <div class="faq__list">
${faqItems(post.faq, lang, where)}
                </div>
            </section>\n` : ''}        </article>
        ${ctaBox(lang)}
${related.length ? `        <section class="related" aria-labelledby="related-title">
            <h2 id="related-title">${esc(t.post.related)}</h2>
            <div class="cards">
            ${related.join('\n            ')}
            </div>
        </section>\n` : ''}        </div>
    </main>`;
    const graph = [
      {
        '@type': 'BlogPosting', '@id': `${full(url)}#article`, headline: decode(post.title), description: decode(post.description),
        image: [full(ogImage), full(post.image)].filter((v, i, a) => a.indexOf(v) === i),
        datePublished: post.date, dateModified: post.updated, inLanguage: L[lang].hreflang, mainEntityOfPage: full(url),
        ...(post.keyword ? { keywords: post.keyword } : {}),
        author: { '@type': 'Organization', name: site.shortBrand, url: `${O}/` }, publisher: ORG,
      },
      breadcrumbLD(crumbs),
    ];
    if (post.faq.length) graph.push(faqLD(post.faq, lang, where));
    const alternates = altsFor((l) => postUrl(l, post.id));
    write(`${url}index.html`, layout({
      lang, title: `${post.title} | ${site.shortBrand}`, description: post.description, url, alternates,
      image: ogImage, imageAlt: post.imageAlt, ogType: 'article', main, current: 'blog',
      jsonld: { '@context': 'https://schema.org', '@graph': graph },
    }));
    if (lang === 'en') addToSitemap(alternates, maxUpdated(post.id));
  }
}
function maxUpdated(id) { return LANGS.map((l) => POSTS[l][id]?.updated).filter(Boolean).sort().pop(); }

// ---------- blog index ----------
const blogAlts = altsFor(blogUrl);
for (const lang of LANGS) {
  const t = T[lang];
  const url = blogUrl(lang);
  const posts = sortPosts(Object.values(POSTS[lang]));
  const crumbs = [[t.home, home(lang)], [t.nav.blog, url]];
  const main = `    <main class="page">
        <div class="container">
        ${breadcrumb(crumbs)}
        <header class="page__header page__header--center">
            <span class="eyebrow">${esc(t.blog.eyebrow)}</span>
            <h1 class="page__title">${esc(t.blog.h1)}</h1>
            <p class="page__lead">${esc(t.blog.lead)}</p>
        </header>
        <div class="cards">
            ${posts.map((p, i) => card(p, { featured: i === 0 && p.pinned })).join('\n            ')}
        </div>
        ${ctaBox(lang)}
        </div>
    </main>`;
  write(`${url}index.html`, layout({
    lang, title: t.blog.title, description: t.blog.description, url, alternates: blogAlts, main, current: 'blog',
    jsonld: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Blog', '@id': `${full(url)}#blog`, name: decode(t.blog.h1), description: decode(t.blog.description), url: full(url), inLanguage: L[lang].hreflang, publisher: ORG },
        { '@type': 'ItemList', itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: full(postUrl(lang, p.id)), name: decode(p.title) })) },
        breadcrumbLD(crumbs),
      ],
    },
  }));
}
addToSitemap(blogAlts, IDS.map(maxUpdated).sort().pop());

// ---------- FAQ page ----------
const faqAlts = altsFor(faqUrl);
for (const lang of LANGS) {
  const t = T[lang];
  const f = FAQ[lang];
  const where = `src/content/${lang}/faq.json`;
  for (const k of ['title', 'description', 'groups']) if (!f[k]) fail(`${where}: missing "${k}"`);
  const url = faqUrl(lang);
  const crumbs = [[t.home, home(lang)], [t.nav.faq, url]];
  const groups = f.groups.map((g, i) => ({ ...g, id: `topic-${i + 1}` }));
  const main = `    <main class="page">
        <div class="container">
        ${breadcrumb(crumbs)}
        <header class="page__header page__header--center">
            <span class="eyebrow">${esc(t.faqPage.eyebrow)}</span>
            <h1 class="page__title">${esc(f.h1 || f.title)}</h1>
            ${f.intro ? `<div class="page__lead">${resolveLinks(f.intro, lang, where)}</div>` : ''}
            <nav class="faq-toc" aria-label="${esc(t.faqPage.jumpTo)}">${groups.map((g) => `<a href="#${g.id}">${esc(g.heading)}</a>`).join('')}</nav>
        </header>
        <div class="faq">
${groups.map((g) => `            <section class="faq__group" aria-labelledby="${g.id}">
                <h2 class="faq__heading" id="${g.id}">${esc(g.heading)}</h2>
                <div class="faq__list">
${faqItems(g.items, lang, where)}
                </div>
            </section>`).join('\n')}
        </div>
        ${ctaBox(lang)}
        </div>
    </main>`;
  write(`${url}index.html`, layout({
    lang, title: `${f.title} | ${site.shortBrand}`, description: f.description, url, alternates: faqAlts, main, current: 'faq',
    jsonld: { '@context': 'https://schema.org', '@graph': [{ ...faqLD(groups.flatMap((g) => g.items), lang, where), '@id': `${full(url)}#faq`, inLanguage: L[lang].hreflang }, breadcrumbLD(crumbs)] },
  }));
}
addToSitemap(faqAlts, FAQ.en.updated);

// ---------- 404 ----------
write('404.html', layout({
  lang: 'en', title: `Page not found | ${site.shortBrand}`, description: 'The page you are looking for does not exist.', url: '/404.html', noindex: true,
  main: `    <main class="page">
        <div class="container notfound">
            <p class="notfound__code">404</p>
            <h1 class="page__title">Page not found</h1>
            <p class="page__lead">The page you’re looking for doesn’t exist or has moved. Try one of these instead:</p>
            <div class="notfound__links">
                <a class="btn-primary" href="/">Home</a>
                <a class="btn-secondary" href="/blog/">Blog</a>
                <a class="btn-secondary" href="/faq/">FAQ</a>
            </div>
            <p class="notfound__links">${site.landingLangs.filter((l) => l !== 'en' && exists(`${L[l].prefix}/index.html`)).map((l) => `<a href="${home(l)}" lang="${L[l].htmlLang}">${L[l].label}</a>`).join(' · ')}</p>
        </div>
    </main>`,
}));

// ---------- latest posts on landing pages ----------
for (const lang of LANGS) {
  const file = `${home(lang)}index.html`;
  if (!exists(file)) continue;
  const html = read(file);
  const re = /<!-- blog:latest -->[\s\S]*?<!-- \/blog:latest -->/;
  if (!re.test(html)) { warn(`${file}: no <!-- blog:latest --> markers, skipped`); continue; }
  const t = T[lang];
  const picks = site.latestPosts.map((id) => POSTS[lang][id]).filter(Boolean);
  const block = `<!-- blog:latest -->
        <section class="section" id="blog" aria-labelledby="blog-title">
            <div class="container">
                <div class="features__header">
                    <span class="section__eyebrow">${esc(t.latest.eyebrow)}</span>
                    <h2 class="section__title" id="blog-title">${esc(t.latest.title)}</h2>
                    <p class="section__description">${esc(t.latest.description)}</p>
                </div>
                <div class="features__grid">
${picks.map((p) => `                    <article class="feature-card">
                        <span class="section__eyebrow">${esc(t.post.categories[p.category])}</span>
                        <h3 class="feature-card__title"><a href="${postUrl(lang, p.id)}">${esc(p.title)}</a></h3>
                        <p class="feature-card__text">${esc(p.description)}</p>
                    </article>`).join('\n')}
                </div>
                <p class="faq__more"><a href="${blogUrl(lang)}" class="btn-secondary">${esc(t.latest.all)}</a></p>
            </div>
        </section>
        <!-- /blog:latest -->`;
  const next = html.replace(re, block);
  if (next !== html) write(file, next);
}

// ---------- sitemap.xml ----------
const landing = site.landingLangs.filter((l) => exists(`${home(l)}index.html`));
const landingAlts = Object.fromEntries(landing.map((l) => [l, home(l)]));
const entries = [
  ...landing.map((l) => ({ loc: home(l), alternates: landingAlts })),
  ...site.legalPages.map((p) => ({ loc: p })),
  ...sitemap,
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((e) => `  <url>
    <loc>${full(e.loc)}</loc>
${e.alternates ? Object.entries(e.alternates).map(([l, u]) => `    <xhtml:link rel="alternate" hreflang="${L[l].hreflang}" href="${full(u)}"/>\n`).join('') + `    <xhtml:link rel="alternate" hreflang="x-default" href="${full(e.alternates.en)}"/>\n` : ''}${e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ''}  </url>`).join('\n')}
</urlset>
`;
write('sitemap.xml', xml);

// ---------- llms.txt ----------
const en = Object.values(POSTS.en);
write('llms.txt', `# ${site.brand}

> ${site.brand} (on the US App Store as "${site.appStoreName}") is an iPhone app that makes music and audio files louder and better: a volume booster up to 200% (+12 dB), a bass booster, a 7-band equalizer with 9 presets, 3D audio, left/right balance, a haptic player and AI Studio tools (music generator, sound effects, text to speech, noise reducer).

Key facts:
- Platform: iPhone, iOS 16 or later. Free to download; optional Premium subscription. Rated ${site.rating.value} on the US App Store.
- EQfy boosts audio played inside EQfy (imported songs, Files, discovered tracks). iOS does not allow it to boost other apps, calls or system sounds.
- iPhone Duo support (full inner display, sidebar and side-by-side layouts) is coming in v2.2.23.
- Support: ${site.supportEmail} · App Store: https://apps.apple.com/app/id${site.appId}
- Developer: Taras Chernysh (App Store seller). The App Store listing name differs by country; App ID ${site.appId} is the same app everywhere.
- Not related to similarly named apps from other developers, such as "Louder Volume: Sound Booster" or "Equalizer Fx".

## Main pages
- [Home](${O}/): features overview
- [FAQ](${full(faqUrl('en'))}): pricing, compatibility, how the tools work
- [Blog](${full(blogUrl('en'))}): guides and news

## Articles
${sortPosts(en).map((p) => `- [${decode(p.title)}](${full(postUrl('en', p.id))}): ${decode(p.description)}`).join('\n')}

## Other languages
${landing.filter((l) => l !== 'en').map((l) => `- [${L[l].label.replace(/^\S+\s/, '')}](${full(home(l))})`).join('\n')}

## Legal
- [Privacy Policy](${O}/privacy)
- [Terms of Use](${O}/terms)
`);

const count = LANGS.reduce((n, l) => n + Object.keys(POSTS[l]).length, 0);
console.log(`✔ built ${count} posts, ${LANGS.length} blog indexes, ${LANGS.length} FAQ pages (${LANGS.join(', ')}), 404.html, sitemap.xml (${entries.length} URLs), llms.txt`);
