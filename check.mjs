#!/usr/bin/env node
// EQfy site checker — zero dependencies. Usage: `node check.mjs` (exit 1 on errors).
// Validates every deployed HTML page: links resolve the way Cloudflare Pages serves them, canonical + hreflang,
// one <h1>, image attributes, JSON-LD, title/description lengths, sitemap coverage and landing-page structure.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://eqfy.app';
const SKIP_DIRS = new Set(['.git', '.claude', '.wrangler', 'node_modules', 'src', 'tasks', '_to_delete']);
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// ---------- collect pages ----------
function walk(dir) {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) return SKIP_DIRS.has(e.name) ? [] : walk(rel);
    return e.name.endsWith('.html') && !/^google[0-9a-f]+\.html$/.test(e.name) ? [rel] : [];
  });
}
const files = walk('.').map((f) => f.replace(/^\.\//, ''));
const urlOf = (file) => '/' + file.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
const pages = new Map(files.map((f) => [urlOf(f), { file: f, html: fs.readFileSync(path.join(ROOT, f), 'utf8') }]));

// Resolve a URL path the way Cloudflare Pages does; returns the page key or null.
function resolve(p) {
  if (p.endsWith('/')) return pages.has(p) ? p : null;
  if (pages.has(p)) return p; // /privacy -> privacy.html
  const f = path.join(ROOT, p);
  return fs.existsSync(f) && fs.statSync(f).isFile() ? p : null;
}
const stripLD = (html) => html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const text = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&[a-z#0-9]+;/g, 'x').trim();

// ---------- per page ----------
const titles = new Map();
const descs = new Map();
const canonicals = new Set();
for (const [url, { file, html }] of pages) {
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const lang = (html.match(/<html lang="([^"]+)"/) || [])[1];
  if (!lang) err(file, 'missing <html lang>');
  const isZh = /^(zh|ja)\b/.test(lang || ''); // CJK length rules

  // headings
  const heads = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  const h1 = heads.filter((h) => h === 1).length;
  if (h1 !== 1) err(file, `expected exactly one <h1>, found ${h1}`);
  heads.forEach((h, i) => { if (i && h > heads[i - 1] + 1) warn(file, `heading level skips h${heads[i - 1]} → h${h}`); });

  // title + description
  const title = text((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (!title) err(file, 'missing <title>');
  if (!desc) err(file, 'missing meta description');
  const maxT = isZh ? 34 : 60;
  if ([...title].length > maxT) warn(file, `title ${[...title].length} chars (> ${maxT}): ${title}`);
  const dl = [...text(desc)].length;
  if (!noindex && (isZh ? dl < 30 || dl > 100 : dl < 70 || dl > 165)) warn(file, `description ${dl} chars`);
  if (!noindex) {
    if (titles.has(title)) warn(file, `duplicate title with ${titles.get(title)}`); else titles.set(title, file);
    if (descs.has(desc)) warn(file, `duplicate description with ${descs.get(desc)}`); else descs.set(desc, file);
  }

  // canonical
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!noindex) {
    if (!canonical) err(file, 'missing canonical');
    else if (canonical !== ORIGIN + url) err(file, `canonical ${canonical} ≠ ${ORIGIN + url}`);
    else canonicals.add(url);
  }

  // hreflang reciprocity
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  if (alts.length && !alts.some(([, , h]) => h === ORIGIN + url)) err(file, 'hreflang set does not include the page itself');
  for (const [, hl, href] of alts) {
    if (!href.startsWith(ORIGIN)) { err(file, `hreflang ${hl} not absolute: ${href}`); continue; }
    const target = resolve(href.slice(ORIGIN.length));
    if (!target) { err(file, `hreflang ${hl} → missing page ${href}`); continue; }
    if (!pages.get(target).html.includes(`href="${ORIGIN + url}"`)) err(file, `hreflang ${hl} → ${href} does not link back`);
  }

  // links + images
  const body = stripLD(html);
  const pageIds = ids(html);
  for (const m of body.matchAll(/<(a|link|img|script|source)\b[^>]*>/g)) {
    const tag = m[0];
    if (m[1] === 'img') {
      for (const a of ['alt', 'width', 'height']) if (attr(tag, a) === undefined) err(file, `<img> without ${a}: ${tag.slice(0, 90)}`);
    }
    const ref = attr(tag, 'href') ?? attr(tag, 'src');
    if (!ref || /^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    const [pathPart, hash] = ref.split('#');
    if (!pathPart) { if (hash && !pageIds.has(hash)) err(file, `anchor #${hash} not found on page`); continue; }
    const target = new URL(pathPart, ORIGIN + url).pathname;
    if (/\/(privacy|terms)\.html$/.test(target)) err(file, `links to redirecting URL ${ref} (use ${target.replace('.html', '')})`);
    const key = resolve(decodeURI(target));
    if (!key) {
      if (!target.endsWith('/') && pages.has(target + '/')) err(file, `missing trailing slash (308 redirect): ${ref}`);
      else err(file, `broken link: ${ref}`);
      continue;
    }
    if (hash && pages.has(key) && !ids(pages.get(key).html).has(hash)) err(file, `anchor not found: ${ref}`);
  }

  // JSON-LD
  for (const [, raw] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(raw); } catch (e) { err(file, `JSON-LD parse error: ${e.message}`); continue; }
    for (const node of data['@graph'] || [data]) {
      const t = node['@type'];
      if (t === 'BlogPosting') {
        for (const k of ['headline', 'image', 'datePublished', 'dateModified', 'author', 'publisher']) if (!node[k]) err(file, `BlogPosting missing ${k}`);
        if ([...(node.headline || '')].length > 110) err(file, 'BlogPosting headline > 110 chars');
      }
      if (t === 'FAQPage') {
        if (!node.mainEntity?.length) err(file, 'FAQPage without questions');
        for (const q of node.mainEntity || []) if (!q.name || !q.acceptedAnswer?.text) err(file, 'FAQ item missing name/text');
        // visible text must contain every question
        for (const q of node.mainEntity || []) if (!text(body).includes(text(q.name).slice(0, 40))) err(file, `FAQ question not visible on page: ${q.name}`);
      }
      if (t === 'BreadcrumbList') {
        (node.itemListElement || []).forEach((it, i) => { if (it.position !== i + 1 || !it.name || !it.item) err(file, 'BreadcrumbList item invalid'); });
      }
      if (t === 'MobileApplication' || t === 'SoftwareApplication') {
        if (!node.offers || !node.aggregateRating) err(file, `${t} needs offers + aggregateRating`);
        if (!node.operatingSystem || !node.applicationCategory) err(file, `${t} needs operatingSystem + applicationCategory`);
      }
    }
  }
}

// ---------- sitemap ----------
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) if (!resolve(loc.replace(ORIGIN, ''))) err('sitemap.xml', `missing page for ${loc}`);
for (const u of canonicals) if (!locs.includes(ORIGIN + u)) err('sitemap.xml', `indexable page not listed: ${u}`);
for (const [, href] of sitemap.matchAll(/hreflang="[^"]+" href="([^"]+)"/g)) if (!locs.includes(href)) err('sitemap.xml', `alternate not listed as <loc>: ${href}`);

// ---------- landing-page structure (localized copies must mirror EN) ----------
const skeleton = (html) => stripLD(html)
  .replace(/<!-- blog:latest -->[\s\S]*?<!-- \/blog:latest -->/, '')
  .match(/<[a-z][a-z0-9]*\b[^>]*\s(?:class|id)="[^"]*"[^>]*>/g)
  .map((tag) => `${tag.match(/^<([a-z0-9]+)/)[1]}.${(attr(tag, 'class') || '').replace(' lang-switcher__option--active', '')}#${attr(tag, 'id') || ''}`);
const base = skeleton(pages.get('/').html);
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/site.json'), 'utf8'));
for (const l of site.landingLangs.filter((x) => x !== 'en')) {
  const p = pages.get(`${site.langs[l].prefix}/`);
  if (!p) continue;
  const s = skeleton(p.html);
  const i = base.findIndex((x, k) => x !== s[k]);
  if (i !== -1 || s.length !== base.length) err(p.file, `structure differs from index.html at element #${i}: expected ${base[i]}, found ${s[i]}`);
}

// ---------- report ----------
for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);
console.log(`${errors.length ? '✖' : '✔'} ${pages.size} pages checked — ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
