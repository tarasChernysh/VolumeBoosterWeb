# EQfy SEO overhaul — multilingual blog, FAQ, technical fixes

Branch: `seo-blog-i18n` (off `origin/main` a1ec95f). Full plan: `~/.claude/plans/please-use-searchfit-seo-abstract-flute.md`.
Supporting docs: [facts.md](facts.md) (single source of truth for writers) · [keyword-map.md](keyword-map.md) (SearchFit keyword clusters + slugs).

Decisions: brand **"EQfy - Louder Volume"** · Duo post = **"coming in v2.2.23"** · 10 posts · blog + FAQ in **en, es, zh-Hans, tr, de** · new **/es/** + **/zh/** homepages, **/da/** kept & fixed (no Danish blog) · tiny zero-dependency Node generator · Duo images = outer-display screenshots only.

## Checklist

- [x] 1. Setup: branch, `tasks/todo.md`, `tasks/keyword-map.md`, `tasks/facts.md`
- [x] 2. Images: Duo screenshots → WebP (`assets/images/blog/iphone-duo/`), new 1200×630 OG image(s)
- [x] 3. EN `index.html` fixes (head, schema, nav/footer, accuracy, screenshots grid, FAQ, blog markers); privacy/terms head+chrome; `_headers`; delete `sitemap.txt`
- [x] 4. Generator: `assets/css/site.css`, `build.mjs`, `check.mjs`, `src/site.json`, `src/i18n/en.json`; build + preview; lock template
- [x] 5. EN content: 10 posts + EN FAQ (SearchFit create-content), fact-check pass, internal-linking pass
- [x] 6. Localization (SearchFit translate-content): es/de/tr/zh posts + FAQ + i18n + homepages; da homepage fix; per-language review
- [x] 7. Verify: `node build.mjs && node check.mjs`, idempotent rebuild, `xmllint`, browser preview (375/768/1280), SearchFit seo-check per template
- [x] 8. Commit on branch + open PR (deploy stays manual via wrangler) — https://github.com/tarasChernysh/VolumeBoosterWeb/pull/5
- [x] 9. Review section (below)

## Review

**What changed (high level)**
- **Brand & accuracy (EN homepage):** "EQfy - Louder Volume" everywhere; title now targets the top Search Console query ("Free Sound Amplifier for iPhone"). Removed claims the app can't back: 10-band EQ → 7 bands + preamp with the real 9 presets; "AI Audio Enhancement" (hidden since v2.2.22) → AI Studio's 4 real tools; "Hearing Aid Equalizer" → "Clarity EQ" + not-a-medical-device note; "Dynamics Processor prevents distortion", "20% AI credit discount", "makes calls louder", "thousands of users"; Free/Pro badges now match the code (only Volume Boost + library are free). Fixed swapped screenshot captions, dropped the hidden-feature and duplicate screenshot, WebP screenshots (1.6 MB → 0.5 MB), centred FAQ header, 8-question FAQ, mobile horizontal scroll (final-CTA glow), nav breakpoint (hamburger ≤ 1024 px).
- **Technical SEO:** real `404.html` (no more soft 404s), clean canonical URLs (`/privacy`, `/terms`, folder URLs), `sitemap.xml` with hreflang for 68 URLs (stale `sitemap.txt` removed), 1200×630 share images, Organization + WebSite + MobileApplication schema with the real rating (4.5 / 40), BlogPosting/BreadcrumbList/FAQPage on posts, `llms.txt`, `_headers` (noindex for tooling + pages.dev, image caching), `.nojekyll` + a one-line redirect so the old github.io copy forwards to eqfy.app. All App Store links use `ct=VB%20website`.
- **Blog + FAQ:** 10 posts (incl. "iPhone Duo support is coming in v2.2.23" with 9 outer-display screenshots) + a 22-question FAQ hub, in **en, es, de, tr, zh** = 50 posts, 5 blog indexes, 5 FAQ pages. Fact-checked against the app code (limiter, head tracking, Custom EQ not saved, DRM limit, in-app-only boosting) and current iOS (Late Night EQ removed in iOS 26). Localized Apple Support/WHO links where they exist.
- **Homepages:** new `/es/` and `/zh/`; `/de/ /tr/ /da/` regenerated with real diacritics, App Store links instead of OneLink, translated JSON-LD + FAQ. All built from `index.html` by `src/landing-i18n.mjs`, so markup is identical (checked).
- **Tooling (zero dependencies):** `build.mjs` (generator), `check.mjs` (links/canonical/hreflang/headings/images/JSON-LD/sitemap/structure validator), `src/landing-i18n.mjs` (homepage translations). README rewritten.

**Verification:** `node build.mjs && node check.mjs` → 69 pages, 0 errors, 0 warnings; second build is byte-identical; `xmllint` OK; translation validator OK for es/de/tr/zh; browser checks at 375/800/1280 px (no overflow, CJK font stack, hreflang + language switcher); SearchFit seo-check on post/home/FAQ/DE post.

**Open items for Taras (manual / decisions)**
1. Deploy (wrangler) after merge; then in Search Console add `https://eqfy.app/` (the existing google-site-verification tag/file should verify it), submit `sitemap.xml`, request indexing for `/`, `/blog/`, the Duo post and `/es/`.
2. Bind `www.eqfy.app` in Cloudflare Pages (currently 522) + 301 www → apex.
3. Keep GitHub Pages on for a few months (it now redirects to eqfy.app), then disable it.
4. When v2.2.23 ships: switch the Duo post + FAQ answer from "coming" to "available" in 5 languages, bump `updated`, rebuild.
5. Verify on a localized iPhone: Apple Music EQ preset names in de/es/tr/zh (not listed on Apple's pages).
6. App-side: untranslated labels (Compose Song, Enter song name, Music Generator, reverb preset names), Turkish "Acoustic" = "Sesle ilgili", "Made for iPhone Duo" in App Store notes (two background tasks were suggested for these).
7. Old homepage screenshots still have baked-in "Hearing Aid Equalizer" / "AI Sound Amplifier" text — re-export from AppScreens when convenient.

---

# AI visibility audit (SearchFit ai-visibility) — report only

Plan: `~/.claude/plans/crystalline-petting-stallman.md`. Deliverable: `docs/AI_VISIBILITY.md` (private app repo). Scope chosen by Taras: report only (no site changes); "EQfy vs Boom" page + rivals Boom, Equalizer+ HD, Equalizer Fx, Increase/Higher Volume go into the report as recommendations.

- [x] 1. Pull rival App Store facts via iTunes lookup API
- [x] 2. Write `docs/AI_VISIBILITY.md` (private app repo) (score, prompt analysis, competitors, action plan, content to create, monitoring)
- [x] 3. Verify (`node check.mjs`, `git status`, numbers trace to sources)
- [x] 4. Review section

## Review

**What changed:** added `docs/AI_VISIBILITY.md` (private app repo) (report only, no site changes). `node check.mjs` → 69 pages, 0 errors; `git status` shows only `tasks/` files.

**Key findings:** estimated AI visibility **23/100**. EQfy is named in 0 of 6 discovery prompts, and the brand query "EQfy" returns other apps.
- eqfy.app is not indexed yet.
- The App Store listing never says "EQfy", still advertises the hidden "AI-Powered Audio Enhancement", and its `sellerUrl` is taraschernysh.com (which links to the old github.io site).
- Rivals AI engines recommend: Boom (4 of 6 prompts), Equalizer Fx, Equalizer+ HD, Increase Volume, Higher Volume.
- Crawler access, schema and `llms.txt` are already fine.

**Top 3 next steps:**
1. Search Console + Bing Webmaster Tools indexing.
2. Put "EQfy" in the App Store description and remove the stale AI line (fastlane file in the app repo).
3. Write the "EQfy vs Boom" page.

The full ranked list is in the report.

---

# AI visibility — write & fix all findings (`/goal`)

Branch `ai-visibility-fixes`. Source: `docs/AI_VISIBILITY.md` (private app repo).

- [x] 1. New post `vs-boom` "EQfy vs Boom" (EN + es/de/tr/zh), facts from Boom's US listing (2026-10-11)
- [x] 2. New post `sound-amplifier` (music vs hearing: Live Listen, AirPods Pro Hearing Aid) (EN + es/de/tr/zh)
- [x] 3. Entity: FAQ "same app" answer names the developer + "not to be confused with" (5 langs); `llms.txt` developer + disambiguation; Organization `founder`
- [x] 4. App repo (`../VolumeBooster`, branch off `release/v2.2.23`): App Store descriptions start with "EQfy - Louder Volume", remove the AI-enhancement + "no distortion" claims (all locales)
- [x] 5. DevPage (taraschernysh.com): app link → https://eqfy.app/ + crawlable static link
- [x] 6. `docs/AI_VISIBILITY_OUTREACH.md` (private app repo): Search Console + Bing steps, AlternativeTo/Product Hunt copy, outreach email, Reddit rules
- [x] 7. Update report statuses (ratings prompt already in app: 5 `requestReview` call sites)
- [x] 8a. Build + check, commit, PRs (#7 web, VolumeBooster#37, DevPage#10)
- [x] 8b. Merged #7, deployed to eqfy.app (Cloudflare Pages, 2026-10-11), IndexNow 200 for 65 URLs

## Review (write & fix all findings)

**Website (PR #7):**
- Two new posts in 5 languages:
  - "EQfy vs Boom": honest comparison built from Boom's US listing.
  - "Free sound amplifier app for iPhone": hearing questions point to Live Listen and the AirPods Pro Hearing Aid feature, using localized Apple links each translator checked; music questions point to Volume Boost.
- FAQ, `llms.txt` and the Organization `founder` field now tie EQfy to developer Taras Chernysh and rule out look-alike apps.
- New `table.compare` CSS so text tables wrap on phones.
- Result: 79 pages, 0 errors, 0 warnings; a second build changes nothing.

**App repo (VolumeBooster#37 → `release/v2.2.23`):** all 50 App Store description locales now lead with "EQfy - Louder Volume". The hidden "AI-Powered Audio Enhancement" claim and the "without distortion" promises are gone.

**DevPage#10:** taraschernysh.com (the App Store `sellerUrl`) now links to eqfy.app, including a static link crawlers can see.

**Follow-ups done the same day:** merged VolumeBooster#37 (plus a sync of the shared description in `aso_metadata_all_locales.md`, which `upload_metadata` fans out to the India locales) and DevPage#10. Subtitle decision: keep "Equalizer FX".

**Left for Taras (needs your accounts):**
- Deploy and IndexNow.
- Search Console and Bing Webmaster Tools.
- Upload the descriptions with v2.2.23.
- AlternativeTo, Product Hunt, outreach emails and Reddit.

Everything is paste-ready in `docs/AI_VISIBILITY_OUTREACH.md` (private app repo). No code change was needed for ratings, because the app already calls `requestReview()` in 5 places.

---

# Code review follow-up (10 findings)

- [x] `table.compare` cells wrap long words. The DE/ES tables had overflowed the page on phones.
- [x] Strategy docs moved to the private app repo. `.gitattributes` `export-ignore` keeps `src/`, `tasks/`, the README and the build scripts out of the deploy export.
- [x] EN posts call "Volume Booster Sound Amplifier" the **US** App Store name (6 posts).
- [x] vs-Boom: extras list hedged ("not mentioned in Boom's listing"), neutral heading, rating row dated (5 langs).
- [x] DE sound-amplifier now targets "Verstärker App" (not "Hörverstärker"). New slug `verstaerker-app-iphone` with a 301 in `_redirects`.
- [x] "Made for iPhone hearing aids" → "compatible hearing aids" (5 langs, facts.md §3.3).
- [x] `site.json` gets `developer`, used in the llms.txt template.
- [x] FAQ and llms.txt disambiguation no longer name the rival apps; they cite the App ID.
- [x] App repo: `upload_metadata` reads the en-US description from `descriptions_all_locales.md` (no pasted copy).

---

# SEO audit fixes (SearchFit seo-audit, score 88/100)

Plan: `~/.claude/plans/crystalline-petting-stallman.md`. Scope: everything; author stays "the EQfy team".

- [x] 1. Contrast: `--text-dim` ≥ 4.5:1 on bg, `--text-muted` ≥ 4.5:1 on cards (site.css + homepage inline CSS)
- [x] 2. Homepage fonts non-blocking (`media=print` + noscript), drop unused Outfit 300
- [x] 3. `related` arrays link the two new posts (4 posts × 5 langs)
- [x] 4. `_headers`: HSTS + one-year immutable cache for /assets/css/*
- [x] 5. Tap targets ≥ 24px for footer + breadcrumb links
- [x] 6. Per-post/per-language share images (`src/og/post.html` + `src/og/render.mjs`), lighter default `og-image.jpg`
- [ ] 7. Build/check, browser verification, PR, deploy (after OK), IndexNow, review section

## Review (SEO audit fixes)

**Changes:**
- **Contrast:** `--text-muted` → #779A77 and `--text-dim` → #6E926E (≥ 4.5:1 on page, section and card backgrounds). The homepage "Pro" badge is now #C084FC (it was 3.75:1).
- **Fonts:** the homepage Google Fonts load without blocking (`media=print` + noscript) and the unused Outfit 300 is dropped. The language button no longer wraps at 375px; that bug was already live.
- **Internal links:** `related` cards now point to vs-boom and sound-amplifier from 6 posts in 5 languages, so the new posts have 16+ inbound links (up from 7). The weakest post is unchanged at 12.
- **Headers:** `_headers` adds HSTS (1 year) and a one-year immutable cache for `/assets/css/*` (every reference is `?v=<hash>`).
- **Tap targets:** footer and breadcrumb links are now ≥ 24px tall (footer 28px).
- **Share images:**
  - Each post has its own image per language: 55 images at 95–112 KB, from `src/og/post.html` via `src/og/render.mjs`, wired up in `build.mjs`. `imageSize` now reads JPEG too.
  - The default share image is now `og-image.jpg` at 104 KB (was a 380 KB PNG); the PNG is kept for old shares.

**Verification:**
- `node build.mjs && node check.mjs`: 79 pages, 0 errors, 0 warnings, and a second build is byte-identical.
- At 375px: 0 contrast failures on /, a post, the FAQ, the blog index, zh and de; 0 small tap targets; no horizontal scroll; homepage CLS 0 with no render-blocking resources.
- Spot-checked the en, de and zh share images by eye.
