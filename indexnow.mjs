#!/usr/bin/env node
// Notify IndexNow (Bing, Yandex, Seznam, Naver, …) about site URLs — zero dependencies (Node 18+).
// Run AFTER deploying: the key file https://eqfy.app/<indexNowKey>.txt must be live.
//
//   node indexnow.mjs                      every URL in sitemap.xml
//   node indexnow.mjs --since 2026-10-11   only URLs whose <lastmod> is on/after that date
//   node indexnow.mjs --dry-run            list the URLs without sending anything

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/site.json'), 'utf8'));
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const since = args.includes('--since') ? args[args.indexOf('--since') + 1] : null;
if (since && !/^\d{4}-\d{2}-\d{2}$/.test(since)) fail('--since expects YYYY-MM-DD');

function fail(msg) { console.error(`✖ ${msg}`); process.exit(1); }

const key = site.indexNowKey;
if (!key) fail('src/site.json has no "indexNowKey"');
if (!fs.existsSync(path.join(ROOT, `${key}.txt`))) fail(`key file ${key}.txt is missing in the repo root`);
const keyLocation = `${site.origin}/${key}.txt`;

// URLs (+ lastmod) from the generated sitemap
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
  loc: (block.match(/<loc>([^<]+)<\/loc>/) || [])[1],
  lastmod: (block.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1],
}));
const urlList = [...new Set(entries.filter((e) => e.loc && (!since || (e.lastmod && e.lastmod >= since))).map((e) => e.loc))];
if (!urlList.length) fail('no URLs to submit');

if (dryRun) {
  console.log(urlList.join('\n'));
  console.log(`\n${urlList.length} URLs (dry run, nothing sent)`);
  process.exit(0);
}

// The search engines fetch the key file to verify ownership — make sure it is deployed first.
const live = await fetch(keyLocation).then((r) => (r.ok ? r.text() : '')).catch(() => '');
if (live.trim() !== key) fail(`${keyLocation} is not live yet — deploy first`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(site.origin).host, key, keyLocation, urlList }),
});
const meaning = {
  200: 'OK — URLs submitted',
  202: 'Accepted — URLs received, key validation pending',
  400: 'Bad request — invalid format',
  403: 'Forbidden — key not valid (key file missing or different)',
  422: 'Unprocessable — URLs do not belong to the host or key mismatch',
  429: 'Too many requests — try again later',
}[res.status] || (await res.text());
console.log(`${res.status < 300 ? '✔' : '✖'} IndexNow ${res.status}: ${meaning} (${urlList.length} URLs)`);
process.exit(res.status < 300 ? 0 : 1);
