#!/usr/bin/env node
// Localized landing pages from the English one — zero dependencies.
//
//   node src/landing-i18n.mjs extract <lang>   → src/landing/<lang>.json   (adds new EN strings with "" values, keeps existing translations)
//   node src/landing-i18n.mjs apply <lang>     → <lang>/index.html         (index.html with every string translated; markup identical)
//
// Strings are text runs between block-level tags. Inline markup inside a run is replaced by {0}, {1}, …
// tokens that the translation must keep. Also translated: alt / aria-label attributes, SEO meta contents
// and the app description in the JSON-LD. Run `node build.mjs` afterwards to fill the latest-posts block.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const site = JSON.parse(rd('src/site.json'));
const [, , cmd, lang] = process.argv;
if (!['extract', 'apply'].includes(cmd) || !site.langs[lang] || lang === 'en') {
  console.error('usage: node src/landing-i18n.mjs extract|apply <es|de|tr|zh|da>');
  process.exit(1);
}
const dictFile = `src/landing/${lang}.json`;

// ---------- tokenizer ----------
const BLOCK = new Set('html head body title meta link p h1 h2 h3 h4 h5 h6 li ul ol div summary details section article header footer main nav button aside figure figcaption'.split(' '));
const TOKEN = /<!-- blog:latest -->[\s\S]*?<!-- \/blog:latest -->|<!--[\s\S]*?-->|<(script|style)\b[\s\S]*?<\/\1>|<svg\b[\s\S]*?<\/svg>|<div class="lang-switcher__dropdown">[\s\S]*?<\/div>|<[^>]+>|[^<]+/g;
const tagName = (t) => (t.match(/^<\/?([a-zA-Z0-9]+)/) || [])[1]?.toLowerCase();
// Block tags and classed inline tags (buttons, badges, labels) end a run; classless inline tags (<a href>, <br>, <strong>) stay inside it.
const isBoundary = (t) => t.startsWith('<!--') || /^<(script|style|div class="lang-switcher__dropdown")/.test(t) || BLOCK.has(tagName(t)) || /^<[a-z]+\s[^>]*\bclass="/.test(t);
const ATTR_META = /^(description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)$/;
const hasLetters = (s) => /\p{L}/u.test(s);

/** Walks the EN page and calls `onRun(key)` / `onAttr(value)`; returns the rebuilt page using their return values. */
function transform(html, onRun, onAttr) {
  const tokens = html.match(TOKEN);
  const out = [];
  let run = [];
  const flush = () => {
    const first = run.findIndex((t) => !t.startsWith('<') && t.trim());
    const last = run.length - 1 - [...run].reverse().findIndex((t) => !t.startsWith('<') && t.trim());
    if (first === -1) { out.push(...run); run = []; return; }
    const inner = run.slice(first, last + 1);
    const lead = inner[0].match(/^\s*/)[0];
    const trail = inner[inner.length - 1].match(/\s*$/)[0];
    const tags = [];
    let key = inner.map((t) => (t.startsWith('<') ? `{${tags.push(t) - 1}}` : t)).join('');
    key = key.slice(lead.length, key.length - trail.length).replace(/\s+/g, ' ');
    let res = hasLetters(key.replace(/\{\d+\}/g, '')) && !key.startsWith('🌐') ? onRun(key) : key;
    res = res.replace(/\{(\d+)\}/g, (m, i) => tags[+i] ?? m);
    out.push(...run.slice(0, first), lead + res + trail, ...run.slice(last + 1));
    run = [];
  };
  for (const t of tokens) {
    if (!t.startsWith('<') || (!isBoundary(t) && !t.startsWith('<svg'))) {
      run.push(t.startsWith('<') ? translateAttrs(t, onAttr) : t);
      continue;
    }
    if (t.startsWith('<svg')) { run.push(t); continue; }
    flush();
    out.push(t.startsWith('<') && !/^<(script|style|!--|div class="lang-switcher__dropdown")/.test(t) ? translateAttrs(t, onAttr) : t);
  }
  flush();
  return out.join('');
}
function translateAttrs(tag, onAttr) {
  let t = tag.replace(/(\s(?:alt|aria-label)=")([^"]+)(")/g, (m, a, v, b) => (hasLetters(v) ? a + onAttr(v) + b : m));
  if (/^<meta\b/.test(t)) {
    const name = (t.match(/\s(?:name|property)="([^"]+)"/) || [])[1] || '';
    if (ATTR_META.test(name)) t = t.replace(/(\scontent=")([^"]+)(")/, (m, a, v, b) => a + onAttr(v) + b);
  }
  return t;
}

// ---------- JSON-LD (app graph) ----------
const LD = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g;
const appNode = (data) => data['@graph']?.find((n) => n['@type'] === 'MobileApplication');
function ldStrings(data) {
  const app = appNode(data);
  return app ? [app.description, app.featureList, ...app.offers.map((o) => o.description)] : [];
}

const EN = rd('index.html');

if (cmd === 'extract') {
  const keys = [];
  const add = (k) => { if (!keys.includes(k)) keys.push(k); return k; };
  transform(EN, add, add);
  for (const [, , json] of EN.matchAll(LD)) ldStrings(JSON.parse(json)).forEach(add);
  const old = fs.existsSync(path.join(ROOT, dictFile)) ? JSON.parse(rd(dictFile)) : {};
  const dict = Object.fromEntries(keys.map((k) => [k, old[k] ?? '']));
  fs.mkdirSync(path.join(ROOT, 'src/landing'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, dictFile), JSON.stringify(dict, null, 2) + '\n');
  const todo = keys.filter((k) => !dict[k]).length;
  console.log(`✔ ${dictFile}: ${keys.length} strings, ${todo} to translate`);
  process.exit(0);
}

// ---------- apply ----------
const dict = JSON.parse(rd(dictFile));
const missing = new Set();
const tr = (k) => {
  const v = dict[k];
  if (!v) { missing.add(k); return k; }
  const want = (k.match(/\{\d+\}/g) || []).sort().join();
  if ((v.match(/\{\d+\}/g) || []).sort().join() !== want) { console.error(`✖ token mismatch for: ${k}\n  → ${v}`); process.exit(1); }
  return v;
};
let html = transform(EN, tr, tr);
if (missing.size) {
  console.error(`✖ ${missing.size} untranslated strings in ${dictFile}:\n` + [...missing].slice(0, 20).map((k) => `  - ${k}`).join('\n'));
  process.exit(1);
}

const L = site.langs[lang];
const hasContent = site.contentLangs.includes(lang);
const pre = L.prefix;

// localized post URLs: /blog/<en-slug>/ → /<lang>/blog/<slug>/
const slugOf = (l, id) => {
  const f = path.join(ROOT, `src/content/${l}/blog/${id}.html`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---\n/)[1]).slug : null;
};
const postMap = {};
if (hasContent) {
  for (const f of fs.readdirSync(path.join(ROOT, 'src/content/en/blog'))) {
    const id = f.replace(/\.html$/, '');
    const s = slugOf(lang, id);
    if (s) postMap[`/blog/${slugOf('en', id)}/`] = `${pre}/blog/${s}/`;
  }
}

html = html
  .replace(/<!-- blog:latest -->[\s\S]*?<!-- \/blog:latest -->/, '<!-- blog:latest --><!-- /blog:latest -->') // filled by build.mjs
  .replace('<html lang="en">', `<html lang="${L.htmlLang}">`)
  .replace(/\s*<!-- Google Search Console -->\n\s*<meta name="google-site-verification"[^>]*>\n/, '\n')
  .replace('<link rel="canonical" href="https://eqfy.app/">', `<link rel="canonical" href="https://eqfy.app${pre}/">`)
  .replace('<meta property="og:url" content="https://eqfy.app/">', `<meta property="og:url" content="https://eqfy.app${pre}/">`)
  .replace('<meta property="og:locale" content="en_US">', `<meta property="og:locale" content="${L.ogLocale}">`)
  .replace(/(\s(?:src|href)=")assets\//g, '$1../assets/')
  .replace(/href="\/blog\/[a-z0-9-]+\/"/g, (m) => {
    const u = m.slice(6, -1);
    return postMap[u] ? `href="${postMap[u]}"` : m;
  })
  .replace(/href="\/faq\/"/g, hasContent ? `href="${pre}/faq/"` : 'href="#faq"')
  .replace(/href="\/blog\/"/g, hasContent ? `href="${pre}/blog/"` : 'href="/blog/" hreflang="en"')
  .replace(/(<a href=")\/(" class="nav__logo">)/, `$1${pre}/$2`)
  .replace(/<div class="lang-switcher__dropdown">[\s\S]*?<\/div>/, (block) => block
    .replace(' lang-switcher__option--active', '')
    .replace(`href="${pre}/" class="lang-switcher__option"`, `href="${pre}/" class="lang-switcher__option lang-switcher__option--active"`))
  .replace('🌐 EN ▾', `🌐 ${L.code} ▾`);

// JSON-LD: translate app strings, localize inLanguage/url; rebuild FAQPage from the translated visible FAQ
const decode = (s) => s.replace(/<[^>]+>/g, (t) => t).replace(/&amp;/g, '&').replace(/&rsquo;/g, '’').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&quot;/g, '"');
html = html.replace(LD, (m, open, json, close) => {
  const data = JSON.parse(json);
  if (data['@type'] === 'FAQPage') {
    const items = [...html.matchAll(/<details class="faq__item"><summary class="faq__q">([\s\S]*?)<\/summary><p class="faq__a">([\s\S]*?)<\/p><\/details>/g)];
    data.mainEntity = items.map(([, q, a]) => ({ '@type': 'Question', name: decode(q), acceptedAnswer: { '@type': 'Answer', text: decode(a) } }));
    return `${open}\n        ${JSON.stringify(data, null, 4).replace(/\n/g, '\n        ')}\n        ${close}`;
  }
  const app = appNode(data);
  if (!app) return m;
  app.description = tr(app.description);
  app.featureList = tr(app.featureList);
  app.offers.forEach((o) => { o.description = tr(o.description); });
  app.inLanguage = L.hreflang;
  app.url = `https://eqfy.app${pre}/`;
  const ws = data['@graph'].find((n) => n['@type'] === 'WebSite');
  if (ws) ws.inLanguage = L.hreflang;
  return `${open}\n    ${JSON.stringify(data, null, 4).replace(/\n/g, '\n    ')}\n    ${close}`;
});

fs.mkdirSync(path.join(ROOT, lang), { recursive: true });
fs.writeFileSync(path.join(ROOT, `${lang}/index.html`), html);
console.log(`✔ ${lang}/index.html written (${Object.keys(dict).length} strings)`);
