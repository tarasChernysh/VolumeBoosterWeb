#!/usr/bin/env node
// Renders the 1200×630 share images with headless Chrome, then converts them to JPEG with macOS `sips`:
//   assets/images/og-image.jpg            ← src/og/site.html (default for pages without their own image)
//   assets/images/og/<lang>-<id>.jpg      ← src/og/post.html, one per blog post and language
// Posts whose front-matter sets "ogImage" keep that image and are skipped.
// Usage: node src/og/render.mjs   (then `node build.mjs`, which picks the images up)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const site = readJSON('src/site.json');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eqfy-og-'));

function render(page, query, out) {
  const png = path.join(tmp, 'shot.png');
  const url = 'file://' + path.join(ROOT, page) + (query ? '?' + new URLSearchParams(query) : '');
  execFileSync(CHROME, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
    '--virtual-time-budget=5000', `--screenshot=${png}`, url], { stdio: 'ignore' });
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', png, '--out', path.join(ROOT, out)], { stdio: 'ignore' });
}

render('src/og/site.html', null, 'assets/images/og-image.jpg');
fs.mkdirSync(path.join(ROOT, 'assets/images/og'), { recursive: true });
let count = 1;
for (const lang of site.contentLangs) {
  const t = readJSON(`src/i18n/${lang}.json`);
  const dir = `src/content/${lang}/blog`;
  for (const file of fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.html'))) {
    const fm = JSON.parse(fs.readFileSync(path.join(ROOT, dir, file), 'utf8').match(/^---\n([\s\S]*?)\n---\n/)[1]);
    if (fm.ogImage) continue;
    const id = file.replace(/\.html$/, '');
    render('src/og/post.html', { title: fm.title, tag: t.post.categories[fm.category], img: fm.image, lang: site.langs[lang].htmlLang },
      `assets/images/og/${lang}-${id}.jpg`);
    count++;
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`✔ rendered ${count} share images`);
