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

---

# Readable text (Taras: "text is a faint green, make all text clearly visible")

Cause: body and supporting text use gray-green and pale-green colors on a dark green background. #779A77 (descriptions, nav, footer, cards) reads washed out, and blog/FAQ text (#B7D9BC, #A9CBAE) plus the homepage checklist (mint #86EFAC) is green-tinted. Fix: switch the **text** colors to neutral light grays (only a faint green hint) and keep green just for accents (links, eyebrows, badges, buttons).

- [x] 1. New `--text-body: #E4EBE5` (14.9:1) for long-form text: blog paragraphs/lists/tables, FAQ answers (site.css + homepage FAQ), homepage checklist items
- [x] 2. `--text-muted` #779A77 → #C9D3CB (11.7:1): descriptions, nav, card text, footer links (site.css + index.html tokens)
- [x] 3. `--text-dim` #6E926E → #A7B5AA (8.4:1): breadcrumb, copyright, small labels
- [x] 4. Re-apply 5 homepages, build + check, browser before/after on home, post, FAQ (desktop + 375px)
- [ ] 5. PR, deploy after OK, review section

## Review (readable text)

**Changes:**
- **Neutral palette** (Taras picked "Neutral light gray"):
  - `--text-body` #E4EBE5 (new) for blog paragraphs, lists and tables, FAQ answers, the homepage checklist, and privacy/terms body text.
  - `--text-muted` #779A77 → #C9D3CB.
  - `--text-dim` #6E926E → #A7B5AA.
- **Green is now accents only:** links, eyebrows, badges, buttons. Headings stay near-white.
- **Legal pages:** privacy.html and terms.html had their own copy of the tokens, still at the original #6B8F6B / #3D5C3D, and mint body text. Both are now on the same palette.
- **Purple hero tag** ("AI Studio") is now #C084FC, the same as the Pro badge.

**Verification:**
- `node build.mjs && node check.mjs`: 79 pages, 0 errors.
- Text-color inventory on home, post, FAQ, blog index, privacy and /de/: every body and supporting text is #E4EBE5, #C9D3CB, #A7B5AA or #F0FDF4.
- Before/after crops at 375px confirm the change.

---

# More posts + more languages (plan: `~/.claude/plans/what-else-post-we-sparkling-scroll.md`)

Decisions (Taras, 2026-10-21): all 4 topic groups (11 posts), languages ja + fr + pt-BR + ar (full), every post in every language, new posts first, Claude-only translation review.

## Phase A: new posts (en, es, de, tr, zh), one PR per group
- [x] A1. Comparisons: `best-volume-boosters`, `best-eq-apps` (branch `posts-comparisons`)
- [x] A2. How-tos: `slowed-reverb`, `play-mp3-offline`, `louder-audio-file` (branch `posts-howtos`)
- [x] A3. Troubleshooting: `spotify-louder`, `bluetooth-volume-low`, `airpods-bass` (branch `posts-troubleshooting`)
- [x] A4. AI Studio: `ai-text-to-speech`, `ai-sound-effects`, `remove-background-noise` (branch `posts-ai-studio`)

## Phase B: new languages (all 23 posts + FAQ + homepage each)
- [x] B1. fr (+ check.mjs landing list from site.json, landing-i18n usage, render.mjs language filter) (branch `lang-fr`)
- [x] B2. pt (key `pt`, htmlLang `pt-BR`) (branch `lang-pt`)
- [x] B3. ja (readingMinutes, check.mjs CJK rules, ja font stacks) (branch `lang-ja`)
- [x] B4. ar (RTL: `dir`, logical CSS properties, `[dir="rtl"]` overrides, Arabic fonts, OG) (branch `lang-ar`)

## Review (A1: comparisons)

**Changes:**
- Two new posts in en, es, de, tr and zh (10 files): "Best Volume Booster Apps for iPhone, Compared" and "Best Equalizer Apps for iPhone, Compared". Each has a comparison table, a section per app and a "which one should you pick" list.
- Rival facts come from the US App Store listings and the iTunes lookup API on 2026-10-21 (Boom, Equalizer Fx, Equalizer+ HD, Increase Volume Sound, Higher Volume, plus Apple Music's built-in EQ). Every claim says "per its listing" or is dated. Higher Volume is described as untested, because its listing doesn't say how it works.
- Both posts state the iOS limit (no app can boost other apps or protected Apple Music tracks) and EQfy's honest gaps (EQ doesn't save custom presets; 7 bands vs Boom's 16).
- `related` arrays of 6 existing posts (x 5 languages) now point to the new posts, so each has 3-4 inbound links. New keyword-map rows and clusters (#13, #14).
- 10 new share images. Re-rendering also changed 8 existing JPEGs by a few bytes with no title change; those were restored.

**Verification:** `node build.mjs && node check.mjs` gives 89 pages, 0 errors, 0 warnings. At 375 px the en/de/es/tr/zh posts have no sideways scroll, the tables fit (343 px) and no image is broken.

## Review (A2: how-to posts)

**Changes:**
- Three new posts in en, es, de, tr and zh (15 files): "Slowed and Reverb on iPhone", "How to Play MP3 Files on iPhone Offline" and "How to Make an Audio File Louder on iPhone".
- Facts come from a code read of the app (branch `release/v2.2.23`), now recorded in `tasks/facts.md` §2. The code check changed what the posts say:
  - Speed keeps the original pitch (tempo only), so the post says EQfy can't make the pitched-down "slowed" sound.
  - Reverb, 3D and balance are not in a shared file; speed, volume boost, EQ, bass and the limiter are.
  - Speed resets to 1.0x on a cold launch; reverb settings are saved.
  - With no internet the player screen shows only the Volume dial, so the offline post says so.
  - Video can't be imported; Apple Music subscription songs are rejected.
- Whether sharing is free or Premium is not stated: `docs/FEATURES.md` says Premium, the code has no gate. The posts only call Volume Boost and the library free.
- Related cards of 6 existing posts (x5 languages) now link to the new posts. keyword-map rows and clusters 15-17, 15 share images.

**Verification:** `node build.mjs && node check.mjs` gives 104 pages, 0 errors, 0 warnings. At 375 px all 15 new pages have no sideways scroll, no broken images and 3 related cards. Not verified on a device: the app behaviours above come from reading code.

## Review (A3: troubleshooting posts)

**Changes:**
- Three new posts in en, es, de, tr and zh (15 files): "Make Spotify Louder on iPhone: Volume and EQ Tips", "iPhone Bluetooth Volume Too Low? Fixes That Work" and "How to Get More Bass on AirPods". Each opens with what EQfy can't do (it only boosts audio played inside the app).
- Instructions come from Apple and Spotify support pages (fetched 2026-10-21, with the localized Apple and Spotify pages used in es/de/tr; Spotify isn't offered in mainland China, so zh keeps the US links). Only what the pages say is stated:
  - Spotify: Volume level Loud, Audio Normalization and the Equalizer, with no preset names or band count (Spotify doesn't publish them) and a note that Volume level is listed for Premium.
  - Apple: Device Type for third-party Bluetooth devices, Forget This Device, Airplane Mode for interference, the ear tip fit and seal test, and the new three-band custom AirPods EQ (Apple's page doesn't give an iOS version, so the post says it may not be available on all models).
  - Not Apple-documented, so worded as general advice or left out: the two-volume-controls idea, accessory firmware updates, what Headphone Accommodations' tones do, and any bass effect of noise control.
- Apple's article 102449 is "If your headphones don't work with your iPhone or iPad", not a volume page; the posts now name it correctly.
- Related cards of 6 existing posts (x5 languages) point to the new posts; the new posts have 2-3 inbound cards each. keyword-map rows and clusters 18-20, 15 share images.

**Verification:** `node build.mjs && node check.mjs` gives 119 pages, 0 errors, 0 warnings. At 375 px all 15 new pages have no sideways scroll, no broken images and 3 related cards. All 53 external Apple and Spotify links return 200. Not checked on a device: iOS menu names (taken from Apple's pages) and the Spotify app labels.

## Follow-up: export claim on the homepages

`docs/FEATURES.md` says export is Premium but the code has no gate on sharing (see facts.md), so the six homepages (en + es/de/tr/zh/da) no longer tie export to Premium:
- removed the "Pro" badge from the Download & Share card
- showcase line is now "Export and share your boosted audio" (no "with Premium")
- FAQ answer (page + JSON-LD) lists Premium as "balance, speed and haptics" without export
- `src/landing/<lang>.json`: the 2 affected entries per language updated (key and translation), homepages re-applied. `node build.mjs && node check.mjs`: 119 pages, 0 errors, 0 warnings.

## Review (A4: AI Studio posts)

**Changes:**
- Three new posts in en, es, de, tr and zh (15 files): "Text to Speech on iPhone: AI Voices and Free Options", "AI Sound Effects Generator for iPhone: How to Use It" and "Remove Background Noise from Audio on iPhone". This completes Phase A (11 new posts).
- Facts come from the app code (`release/v2.2.23`, which is the live 2.2.23) and Apple's support pages, recorded in `tasks/facts.md` §2:
  - Costs: Text to Speech 500 credits per generation (limit 5,000 characters), Sound Effects 250 credits (1-30 s manual duration, Influence 0.1-1.0), Noise Reducer 1,500 credits per started minute (MP3 or WAV only, no M4A or video).
  - Taras's decisions (2026-10-21): Noise Reducer is live; the posts say only that the tools use credits and leave Premium out.
  - Not claimed: voices and languages offered, which noises the Noise Reducer removes, how long "automatic" duration is, the AI provider.
  - Free Apple options named with exact paths: Read & Speak (Spoken Content in older iOS), Live Speech, Voice Memos' Enhance Recording (a playback setting that doesn't export a file), Mic Mode Voice Isolation, Photos Audio Mix (iPhone 16+ Spatial Audio videos), Background Sounds, GarageBand sound library.
- Two new posts link to each other; ai-song-generator and louder-audio-file now link to them. keyword-map rows and clusters 21-23, 15 share images.
- Fixed raw `&` in the FAQ answers of the en and de `airpods-bass` posts (answers are inserted as HTML).

**Verification:** `node build.mjs && node check.mjs` gives 134 pages, 0 errors, 0 warnings. At 375 px all 15 new pages have no sideways scroll, no broken images, 3 related cards and 4 FAQ items. All 35 external Apple links return 200. Not checked on a device: the in-app labels and flows (read from code).

**Known site-wide conflicts left open:** the FAQ, homepages, vs-boom and the ai-song-generator post still say Premium includes the AI tools (code: all tools spend credits; Taras chose to keep the new posts neutral); the Duo post, FAQ and homepages still say "coming in v2.2.23", which went live on 2026-10-14 (a separate PR is next).

## Follow-up: "Premium includes the AI tools" corrected (2026-10-21)

The code makes every user spend credits on every AI tool (see facts.md), but the site said Premium includes Music Generator, Sound Effects and Text to Speech. Corrected to "AI tools use credits" in:
- `ai-song-generator` (FAQ answer, lead, credits section, Noise Reducer paragraph) in 5 languages; the credits section now lists the costs and how to get credits. The Noise Reducer paragraph also no longer suggests a voice memo (M4A is rejected; MP3 or WAV only)
- FAQ page: "How do AI credits work?" (with costs) and "What does Premium include?" (5 languages)
- `vs-boom` lead (5 languages)
- homepages: showcase line and FAQ answer (page and JSON-LD), `index.html` plus the 5 landing files
`node build.mjs && node check.mjs`: 134 pages, 0 errors, 0 warnings.

## Follow-up: iPhone Duo is available (2026-10-21)

v2.2.23 went live on the App Store on 2026-10-14 (App Store lookup shows version 2.2.23 and that release date; its notes mention iPhone Duo). Everything that said "coming in v2.2.23" now says it is available:
- `iphone-duo` post in 5 languages: new title ("iPhone Duo Support Is Here in EQfy v2.2.23" and translations), description, lead, note ("Available now … released on October 14, 2026"), FAQ, headings, tense of the whole body, `updated`
- FAQ page item "Does EQfy support iPhone Duo?" (5 languages), the ai-song-generator link sentence and link text, the vs-boom bullet
- homepages: "Which devices does EQfy support?" answer (page + JSON-LD) in `index.html` and the 5 landing files; the generated "latest posts" card and `llms.txt` (template in `build.mjs`) follow automatically
- Duo share image (`assets/images/blog/iphone-duo/og.png`, from `src/og/iphone-duo.html`): tag now "Now in v2.2.23"
- `tasks/facts.md`: live version 2.2.23, §4 now "available since v2.2.23"
`node build.mjs && node check.mjs`: 134 pages, 0 errors, 0 warnings; a scan of every built page, JSON-LD and llms.txt finds no leftover "coming"/"next update" wording about Duo.

## Review (B1: French)

**Changes:**
- **French is now a full language** at `/fr/`: homepage, blog index, FAQ and all 23 posts (23 posts x 6 languages), with the language in every switcher and every hreflang set. `src/site.json` (`langs`, `contentLangs`, `landingLangs`), `src/i18n/fr.json`, `src/content/fr/` (23 posts + `faq.json`), `src/landing/fr.json`.
- **Tone and typography:** "vous" (the app itself uses it); real no-break spaces (U+00A0) before ? ! : ; % and inside « », decimal commas, French date format.
- **Terms:** from the app's string catalog, recorded as a French table in `tasks/facts.md` §8. The catalog shows the Headphones tab as "Écouteurs", so the table (which first said "Casque") was corrected. English-only app labels (AI Studio card names, Compose Song, Influence, playlist names) stay English in bold with a French gloss.
- **Apple and Spotify links:** every Apple link points to its `fr-fr` page and uses Apple's French menu names; Spotify help links use `/fr/` where the page exists. 53 external links, all 200.
- **Tooling:** `check.mjs` now reads the homepage languages from `site.json` (it used to skip any language not in a hard-coded list); `landing-i18n.mjs` lists the languages in its usage line; `src/og/render.mjs` takes optional language codes (`node src/og/render.mjs fr`). README updated; keyword-map has an FR column.
- Existing languages changed only by the French additions (a hreflang link and a switcher option per page, plus French in the 404 page's language list).

**Verification:** `node build.mjs && node check.mjs` gives 160 pages, 0 errors, 0 warnings (homepage structure of /fr/ matches index.html). All 26 French pages (homepage, blog index, FAQ, 23 posts) pass at 375 px (no sideways scroll, no broken images, 3 related cards, FAQ present); the navigation stays on one row at 1025, 1040, 1100 and 1280 px. 22 share images rendered (the Duo post keeps its own).

**Not verified:** a native French speaker has not read the translations. Apple's French names for the Music EQ presets (Bass Booster etc.) weren't found, so those stay English with a gloss; "Désactivé" for the Music EQ Off choice, and the Spotify French app labels, come from help pages, not a device.

## Review (B2: Portuguese, pt-BR)

**Changes:**
- **Brazilian Portuguese is now a full language** at `/pt/` (key `pt`, `<html lang="pt-BR">`, `hreflang="pt"`, which also serves pt-PT readers): homepage, blog index, FAQ and all 23 posts (23 posts x 7 languages), in every switcher and hreflang set. `src/site.json`, `src/i18n/pt.json`, `src/content/pt/` (23 posts + `faq.json`), `src/landing/pt.json`. No code changes were needed: French's tooling fixes already cover it.
- **Tone and typography:** "você", Brazilian vocabulary (compartilhar, arquivo, app, fones de ouvido), simple typography (200%, `3.000`, decimal comma, no special spaces).
- **Terms:** from the app's catalog (pt-BR table in `tasks/facts.md` §8). Two catalog values are plain mistranslations and were NOT copied: "Custom" shows as "Costume" (used Personalizado) and the "Rock" preset as "Rocha" (used Rock). **Both are app-side bugs worth fixing in the app repo.**
- **Apple and Spotify links:** every Apple link points to its `pt-br` page with Apple's Brazilian menu names (Ajustes, Central de Controle, ...); Spotify links use `/br-pt/`. 56 external links, all 200.
- keyword-map has a PT column; README language lists updated; 22 share images.

**Verification:** `node build.mjs && node check.mjs`: 186 pages, 0 errors, 0 warnings. All 26 Portuguese pages pass at 375 px (no sideways scroll, no broken images, 3 related cards, FAQ present); navigation stays on one row at 1025-1280 px. Existing languages changed only by the Portuguese additions.

**Not verified:** no native Brazilian reader has checked the text. Apple's pt-BR pages don't list the Music EQ preset names, so "Aumentar Graves", "Reduzir Graves", "Reduzir Agudos", "Alto-falantes Pequenos" and "Amplificador de Voz" come from a Brazilian Apple-news article (MacMagazine), not an Apple page. Apple's pt-BR pages call both the speaker and the headphone loudness setting "Limite de Volume" (the posts use "Redução do Volume" in one place), and voice memos are "Gravador".

## Review (B3: Japanese)

**Changes:**
- **Japanese is now a full language** at `/ja/` (`<html lang="ja">`, `hreflang="ja"`): homepage, blog index, FAQ and all 23 posts (23 posts x 8 languages), in every switcher and hreflang set. `src/site.json`, `src/i18n/ja.json`, `src/content/ja/` (23 posts + `faq.json`), `src/landing/ja.json`.
- **Tooling for CJK (4 small edits):**
  - `build.mjs` `readingMinutes`: Japanese is counted by characters (500 per minute, like zh at 400); without it every post would have shown "1 min" (now 4-10).
  - `check.mjs`: `ja` uses the same CJK title and description length rules as `zh`.
  - `assets/css/site.css`: a `:lang(ja)` font stack (Hiragino Sans, Hiragino Kaku Gothic ProN, Meiryo, Noto Sans JP; no Chinese fonts).
  - `src/og/post.html`: the same stack for share images, otherwise PingFang SC would draw the kanji with Chinese glyph shapes (checked: the ja image uses Japanese shapes).
- **Text rules:** polite です・ます, no "あなた" (one marketing line was reworded), 「」 and 、。, no spaces between Japanese and Latin text; **English slugs** (Japanese can't be ASCII), titles ≤ 26 characters, descriptions 60-90.
- **Terms:** from the app's catalog (Japanese table in `tasks/facts.md` §8). The Music tab is ミュージック (`music.title`), not 音楽 as the table first said (corrected). English-only app labels stay English in bold with a Japanese gloss.
- Apple and Spotify links: every Apple link points to its `ja-jp` page with Apple's Japanese menu names; Spotify links use `/jp/`. 52 external links, all 200. keyword-map has a JA column.

**Verification:** `node build.mjs && node check.mjs`: 212 pages, 0 errors, 0 warnings. All 26 Japanese pages pass at 375 px (no sideways scroll, no broken images, 3 related cards, FAQ present); navigation stays on one row at 1025-1280 px; the Japanese font stack is applied on posts. Other languages changed only by the Japanese additions plus the CSS version hash. 22 share images rendered.

**Not verified:** a native Japanese reader has not read the text. Apple's Japanese pages don't list the Music EQ preset names (Bass Booster etc.), so they stay English with a gloss. The homepage <title> had to drop "Free Sound Amplifier" to fit the 34-character limit ("EQfy - Louder Volume：iPhoneの音量ブースト"); the meta description keeps 無料サウンドアンプ. The "slowed and reverb" post uses "slowed reverb" in its title (length limit).

## Review (B4: Arabic, right-to-left) — Phase B complete

**Changes:**
- **Arabic is now a full language** at `/ar/` (`<html lang="ar" dir="rtl">`, `hreflang="ar"`): homepage, blog index, FAQ and all 23 posts (23 posts x 9 languages), in every switcher and hreflang set. `src/site.json` (new `"dir": "rtl"` field, only on ar), `src/i18n/ar.json` (`ar-u-nu-latn`: Latin digits), `src/content/ar/` (23 posts + `faq.json`), `src/landing/ar.json`. English slugs, like zh and ja.
- **RTL mechanics (all identical in left-to-right pages):**
  - `build.mjs` and `landing-i18n.mjs` emit `dir="rtl"` when the language has `dir`; the card aria-label regex strips both → and ←.
  - `assets/css/site.css` and the homepage inline CSS: physical properties swapped for logical ones (dropdown `inset-inline-end`, breadcrumb separator margin, list indent, note and blockquote border, table `text-align: start`, nav underline, badge and hero-badge padding/margin).
  - `index.html`: an RTL-only block (the alternating "reverse" showcase sections swap columns with `direction: rtl`, which needed undoing; the balance visual stays LTR so L is on the left).
  - Arabic: font stack (SF Arabic, Geeza Pro, Segoe UI, Tahoma, Noto Sans Arabic), `letter-spacing: 0` so letters join, taller heading line-height, and `unicode-bidi: plaintext` in table cells so signed numbers (+5, −3) stay intact.
  - Share images: `render.mjs` passes `dir`, `post.html` sets it and has the Arabic font stack (checked: mirrored layout, joined letters).
- **Writers' bidi rules** (in `tasks/facts.md` §8): ← not →, no leading +/− in running text ("حتى 12 ديسيبل"), no invisible control characters or `&rlm;`, Latin digits, English brand names inline. The audit found no violations.
- **Terms:** from the app's catalog (Arabic table in `tasks/facts.md`). Apple links point to `ar-sa` pages with Apple's Arabic menu names; Spotify links use `ae-ar` (the `/ar/` page serves Spanish). 55 external links, all 200. keyword-map has an AR column; README updated.

**Verification:** `node build.mjs && node check.mjs`: 238 pages, 0 errors, 0 warnings. All 26 Arabic pages pass at 375 px (no sideways scroll, no broken images, 3 related cards, FAQ present); the navigation stays on one row at 1025-1280 px. In RTL: the logo is on the right, the language dropdown stays inside the viewport at 375 and 1100 px, the showcase sections alternate with right-to-left text, L is on the left in the balance visual, the note border/list indent/breadcrumb separator are on the correct side, and the EQ table keeps its signed numbers. English pages measured identical to before (3px left note border, 24px left list indent, dropdown at right 0). Other languages changed only by the logical-property swaps, the RTL-only block and the Arabic additions.

**Not verified:** no native Arabic reader has checked the text. Apple's Arabic pages don't list the Music EQ preset names, so they stay English with an Arabic gloss. Spotify's Arabic help page calls the Playback menu «إعادة التشغيل» (literally "restart"); the posts add "(Playback)". App-side catalog issues found: the key `Balance:` ("Balance: N credits" in the AI tools) is translated «التوازن:» (audio balance, not account balance), and the Figure 8 motion pattern uses an Arabic-Indic digit (٨). Layout checks used computed styles and a shrunken browser pane, not a real Arabic-language device.

# More EN posts (plan: `~/.claude/plans/what-else-seo-optimized-snappy-flame.md`)

English only for now (translations later in one batch). New ids go in `related` of EN posts only. One PR per group.

- [x] PR 1 `posts-8d-haptics`: `8d-audio`, `music-haptics`
- [x] PR 2 `posts-bass-eq`: `best-bass-boosters`, `iphone-equalizer`
- [x] PR 3 `posts-voice-podcasts`: `voice-memo-louder`, `podcasts-too-quiet`
- [x] PR 4 `posts-volume-ai`: `volume-keeps-going-down`, `ai-birthday-song`

Per post: verify facts (app code + Apple pages) → write EN → fact-check → add to `related` of 1-3 EN posts → keyword-map → `node src/og/render.mjs en` → `node build.mjs && node check.mjs` → preview.

## Review (PR 1: 8D audio + Music Haptics, EN only)

**Changes:**
- Two new EN posts: `8d-audio` (`/blog/8d-audio-iphone/`) and `music-haptics` (`/blog/music-haptics-iphone/`), each with a lead answer, 4 FAQ entries, Apple source links where relevant and the standard "what EQfy can't do" note.
- 8D audio explains the term honestly (not a format, headphones needed) and walks through 3D Audio › 3D Source › Auto Motion › Orbit with the Speed slider; the four patterns and their cycle times come from the code. It says plainly that 3D is a live effect and is not included in shared files.
- Music Haptics covers Apple's feature (steps, Full Mix / Vocals Only, intensity, "not working" checklist, Spotify not named by Apple) and EQfy's own haptic player for imported files (Premium).
- `related`: `8d-audio` replaces one card in `spatial-audio` and `slowed-reverb`, `music-haptics` replaces one in `bass-boost` (each keeps 3 cards; EN only). `tasks/keyword-map.md` clusters 24-25, `tasks/facts.md` new verified block (§2). Share images `en-8d-audio.jpg`, `en-music-haptics.jpg`.

**Verification:** `node build.mjs && node check.mjs`: 240 pages, 0 errors, 0 warnings (the build prints "missing translations" for the 8 other languages, expected until the translation batch). Browser preview at 375 and 1280 px: no sideways scroll, no broken images, FAQ and JSON-LD present, share image URL set, post listed on `/blog/`; no language switcher on these posts (EN only).

**Not verified:** nothing was run on a device (facts read from source). Apple's page lists no supported iPhone models, so the post doesn't name any. `render.mjs` aborts here because headless Chrome exits non-zero at teardown even though the screenshot is written; the two images were made with a scratch script using the same Chrome flags and `sips` settings (not committed). The homepage "latest posts" block uses a fixed `latestPosts` list and was left alone.

## Review (PR 2: best bass booster apps + "Does iPhone have an equalizer?", EN only)

**Changes:**
- `best-bass-boosters` (`/blog/best-bass-booster-apps-iphone/`): compares EQfy, Boom, Equalizer Fx, Bass Booster Volume Boost EQ (Companjen) and Bass Booster Volume Power Amp (AppRover) from their US listings (dated Oct 2026), plus Apple Music's free Bass Booster preset and Spotify's EQ. Says plainly that EQfy's Bass Boost is Premium, its EQ is less detailed than Boom's or Companjen's, it can't save presets and has 40 ratings.
- `iphone-equalizer` (`/blog/does-iphone-have-an-equalizer/`): where the real equalizers are (Music app EQ, AirPods Equalizer, Headphone Accommodations, Spotify), why there is no system-wide one, and the app option. Apple steps come from support.apple.com (read 2026-10-23).
- `related` swaps (EN only): `vs-boom` and `best-eq-apps` → `best-bass-boosters`; `eq-settings` → `iphone-equalizer`. keyword-map clusters 26-27 (and "best bass booster app iphone" moved from `vs-boom` to the new post); facts.md block with the checked Apple pages and rival numbers. Share images for both.
- Also fixed on PR 1's branch: plain `<table>` scrolls sideways inside its column at 375 px, so text tables in the new posts use `class="compare"` (fixed, wrapping columns).

**Verification:** `node build.mjs && node check.mjs`: 242 pages, 0 errors, 0 warnings. Preview at 375 px: no sideways page scroll, no broken images, FAQ present; the comparison table fits the column.

**Not verified:** rival apps were not installed or tested, so their rows rest on their App Store descriptions (the Companjen listing doesn't say what is paid). Ratings move daily. Apple's Music EQ guide doesn't list preset names; the preset names reuse the existing `bass-boost` post.

## Review (PR 3: voice memo louder + podcasts too quiet, EN only)

**Changes:**
- `voice-memo-louder` (`/blog/make-voice-memo-louder-iphone/`): why a memo is quiet in the file, what Voice Memos can do (Enhance Recording, Skip Silence, speed: Apple says playback options don't change the recording), then Voice Memos › Save to Files (.m4a) › EQfy Files import › Volume Boost › share. Honest that noise is boosted too and that the Noise Reducer tool takes MP3/WAV only.
- `podcasts-too-quiet` (`/blog/podcasts-too-quiet-iphone/`): fixes in order: Apple Podcasts (volume bar, Enhance Dialogue), Spotify Volume level (Premium; Spotify's page doesn't say it covers podcasts), audiobook apps, iPhone limits, then EQfy for episode files you have, with the existing speech EQ recipe. Says plainly EQfy can't touch the Podcasts/Spotify/Audible apps.
- `related` swaps (EN only): `louder-audio-file` (best-volume-boosters → voice-memo-louder) and `spotify-louder` (volume-too-low → podcasts-too-quiet). keyword-map clusters 28-29 and cluster lines; facts.md block with the checked Apple/Spotify/Audible pages. Share images for both.

**Verification:** `node build.mjs && node check.mjs`: 244 pages, 0 errors, 0 warnings. Preview at 375 px: no sideways scroll, no broken images, FAQ and share image URL present.

**Not verified:** nothing run on a device. Whether an exported Voice Memos file includes Enhance Recording is not stated by Apple and is left open in the post. Whether EQfy opens Voice Memos' "Editable" (QuickTime Audio) export wasn't tested, so the post says to use the default .m4a. Apple's per-show Podcasts settings (seen in a search summary only) are not mentioned. Audible's file protection is described as "usually copy-protected", not tested.

## Review (PR 4: volume keeps going down + AI birthday song, EN only)

**Changes:**
- `volume-keeps-going-down` (`/blog/iphone-volume-keeps-going-down/`): a symptom table and six causes, each tied to an Apple page: headphone notifications set a lower volume on the next connection, Reduce Loud Audio, AirPods Conversation Awareness / Personalized Volume, Attention Aware Features (alerts only, not media), Sound Check, a pressed volume button. EQfy is a side note and the post says it can't switch off iOS volume features.
- `ai-birthday-song` (`/blog/ai-birthday-song-generator-with-name/`): Music Generator steps, two ways to get a name into the song (describe it, or write your own lyrics, which the in-app guide says the system arranges), an original lyric template, six prompt examples, credits (3,000; one free generation in a free trial; never "free" or "Premium includes"), and a responsible-use note. It says the name may not be sung clearly.
- `related` swaps (EN only): `ai-song-generator` (ai-sound-effects → ai-birthday-song) and `volume-too-low` (louder-audio-file → volume-keeps-going-down). keyword-map clusters 30-31, facts.md block, share images.
- Also on PR 3's branch: the podcasts post no longer says "thousands of independent producers".

**Verification:** `node build.mjs && node check.mjs`: 246 pages, 0 errors, 0 warnings. Preview at 375 px: no sideways scroll, no broken images, FAQ present, the symptom table fits and its anchor links resolve.

**Not verified:** nothing run on a device. How reliably the AI sings a given name is unknown (the post doesn't promise it). The Attention Aware menu path is quoted from Apple's article (Settings › Face ID & Passcode); other iOS versions may place it elsewhere, which the post says.

## Overall review: 8 new EN-only posts (PRs #21-#24, stacked)

- 8 posts, 4 stacked PRs, all EN only. Merge in order #21 → #22 → #23 → #24 (retarget each to `main` after the one below merges). Deploy only after Taras OKs it, then `node indexnow.mjs --since 2026-10-23`.
- **Translations are the open item.** Each post still needs es/de/tr/zh/fr/pt/ja/ar versions (the build warns "missing translations" for all 8 until then); then add the localized slugs to keyword-map and the new ids to the `related` arrays in the other languages.
- **Length:** the posts run about 750-1,170 words, below the plan's 1,200-1,800 target. I kept them to facts I could verify instead of padding. Extend them if the target matters.
- **Demand:** no search-volume tool was connected (Ahrefs needs authorization), so the picks rest on Google autocomplete signals, not volumes.
- `src/og/render.mjs` aborts here because headless Chrome exits non-zero at teardown; share images were made with an equivalent scratch script. Worth fixing in `render.mjs` (ignore the exit code if the screenshot exists).

# Translate the 8 new posts into es, de, tr, zh, fr, pt, ja, ar

Taras (2026-10-24): hold the merges, translate first. Branch `translate-new-posts`, stacked on `posts-volume-ai` (#24). 8 posts x 8 languages = 64 files.

- [x] 1. One subagent per language writes `src/content/<lang>/blog/<id>.html` for the 8 ids (brief: facts.md §7-8, keyword-map, two existing posts of that language, `Localizable.xcstrings` for new UI terms, localized Apple/Spotify links); each runs the validator (scratchpad `validate-translation.py`) before reporting
- [x] 2. Apply the same `related` swaps to the 10 changed EN posts in every language (done: 80 one-line edits)
- [x] 3. Second pass per language: terms vs `Localizable.xcstrings`, localized Apple links return 200, natural phrasing
- [x] 4. keyword-map: localized primary keywords + slugs for ids 24-31 (cols es/de/tr/zh/fr/pt/ja/ar)
- [x] 5. Share images for 64 new posts (scratch script, Chrome exits non-zero at teardown), `node build.mjs && node check.mjs`, browser preview (375 px; RTL for ar), PR
- [x] 6. Review section

## Review (translations of the 8 new posts)

**Changes:**
- 64 new files: `src/content/{es,de,tr,zh,fr,pt,ja,ar}/blog/<id>.html` for `8d-audio`, `music-haptics`, `best-bass-boosters`, `iphone-equalizer`, `voice-memo-louder`, `podcasts-too-quiet`, `volume-keeps-going-down`, `ai-birthday-song`. One subagent per language; each used facts.md §7-8, two existing posts of that language, `Localizable.xcstrings` for in-app terms and the localized Apple/Spotify pages for menu names. es/de/tr/fr/pt have localized ASCII slugs; zh/ja/ar keep the English slug.
- The 10 `related` swaps made in the English posts are applied to every language (80 one-line edits), so all 9 languages link the same posts.
- English fix carried to all 9 languages: the best-bass-boosters lead called both "Bass Booster" apps "simple music players"; AppRover's app is a one-tap booster, so it now says "simpler apps built around bass boosting".
- keyword-map: localized primary keywords and slugs for the 8 ids in all 8 language columns. 64 share images.

**Verification:** `node build.mjs && node check.mjs`: 279 posts, 310 pages, 0 errors, 0 warnings, no "missing translations" left. The validator (scratchpad, not committed) passes for all 8 languages: strict-JSON front-matter, same placeholders, same h2/h3 ids, same table/list/link counts, slug rules, title and description lengths. All 120 external links in the new posts return 200. Numbers in every translation match the English once separators are normalized. All 64 pages at 375 px: no sideways scroll, no broken images, no overflowing tables, FAQ and 3 related cards present; Arabic pages are `dir="rtl"`. Ja and ar share images checked by eye (Japanese glyph shapes; Arabic mirrored with joined letters).

**Not verified / worth a native reader:**
- No native speaker has read any language. Terms came from the app's catalog and Apple's localized pages.
- Spotify's and Audible's localized help pages: Audible only has an English article reachable, so that link stays English and is labelled in each language. Spotify links use each language's locale and return 200 on GET.
- Apple's pages disagree across languages on a few terms: the pt-BR posts call "Reduce Loud Audio" **Limite de Volume** (Apple's pt-BR wording) while the older pt posts say **Redução do Volume**; Apple's zh page says Music Haptics covers "tens of millions" of songs while the English page says "millions" (translations follow English); Apple's Japanese Sound Check page says 音楽 where the iPhone guide says ミュージック (posts use ミュージック).
- Own coinages to check: ar «مشغّل الحس اللمسي», tr "Haptik oynatıcı" (EQfy's haptic player, which the app doesn't name).
- French spacing: the new posts use U+202F before : ; ? ! (per facts.md §8 rule) while the 23 older French posts use U+00A0 everywhere; both render the same, left as is.
- "Music Haptics arrived with iOS 18" is based on Apple's guide being tagged iOS 18, not an explicit Apple statement.
- App-side catalog issues seen again: ar "Figure 8" uses an Arabic-Indic digit, ar `Balance:` means audio balance, tr `Balance:`.

# Localize the site properly (plan: `~/.claude/plans/localize-my-website-properly-agile-falcon.md`)

Taras (2026-10-24): polish the existing languages, make Danish a full language, add ko/it/nl/pl/ru/uk as full languages. Privacy/Terms and screenshots stay English. Switcher keeps flags, Russian without one. Keywords from DataForSEO MCP (fallback: Keyword Planner / autocomplete). 8 stacked PRs: `l10n-polish` → `lang-da` → `lang-it` → `lang-nl` → `lang-pl` → `lang-ko` → `lang-ru` → `lang-uk`.

## Phase A: polish (PR `l10n-polish`)
- [x] A1. `render.mjs`: don't abort when Chrome exits non-zero after writing the screenshot
- [x] A2. Localized default share image (`site.html` params, i18n `og` key, `og/<lang>-site.jpg`, used by build.mjs + landing-i18n)
- [x] A3. iPhone Duo post: drop `ogImage` in the 8 non-EN translations (localized cards)
- [x] A4. Per-language 404 pages (`<prefix>/404.html`)
- [x] A5. Footer Privacy/Terms links marked English (`hreflang="en"` + "(English)" label)
- [x] A6. aria-labels "Main navigation" / "Breadcrumb" from i18n
- [x] A7. Japanese homepage copyright line
- [x] A8. `200%` translatable on homepages; German posts/FAQ use a no-break space before `%`
- [x] A9. `inLanguage` = page language (`pt-BR`, `zh-Hans`)
- [x] A10. Homepage switcher `lang` attributes, ja/zh font stacks, scrollable dropdown
- [x] A11. Build, check, browser preview, PR, review

## Review (Phase A: polish)

**Changes:**
- **Share images in every language:** `src/og/site.html` takes `?title&sub&pills&lang&dir` (English when empty) and keeps the green highlighted words on one line. `render.mjs` writes `assets/images/og/<lang>-site.jpg` from the new `og` strings in `src/i18n/<lang>.json`. `build.mjs` uses it as the default image for that language's blog index, FAQ, 404 and any post without its own card. `landing-i18n.mjs apply` swaps it into the homepage meta and JSON-LD. The 8 translated iPhone Duo posts dropped the English `og.png` and now have localized cards. 16 new images.
- **render.mjs no longer aborts** when Chrome exits non-zero at teardown after writing the screenshot.
- **404 per language:** `build.mjs` writes `<prefix>/404.html` for each content language (new `notFound` strings). Its buttons go to that language's home, blog and FAQ. Cloudflare Pages serves the nearest 404.html, so a miss under `/de/` now gets the German page.
- **Legal links:** Privacy/Terms stay English, so every non-EN footer marks them with `hreflang="en"` and a "(in English)" label in the page language (i18n + homepage dictionaries, Danish too).
- **Hard-coded English removed:** the nav and breadcrumb `aria-label`s come from i18n (`nav.main`, `nav.breadcrumb`). The Japanese homepage copyright now says 無断複写・転載を禁じます。
- **Numbers:** `landing-i18n.mjs` now also extracts text runs that contain `%`, so the hero stat and the two dials say `200 %` (de/fr/da, no-break space), `%200` (tr) or `200%`. German posts and FAQ: 101 `<digit> %` now use a no-break space, so the number can't wrap away from the sign. The 6 French cases are only in `alt` text and were left as they are.
- **`inLanguage`** on homepages, posts, blog index and FAQ is the page's language tag (`pt-BR`, `zh-Hans`), matching `<html lang>`.
- **Homepage:** switcher options carry `lang`. The zh/ja/ar font stacks from `site.css` are now in the homepage CSS. The language dropdown gets `max-height` + scrolling (site.css too) so 16 languages will fit a phone.

**Verification:** `node build.mjs && node check.mjs`: 318 pages, 0 errors, 0 warnings. In the browser at 375 px: `/de/404.html` is German with German buttons and the other languages listed; `/ar/404.html` is RTL; `/de/` shows `200 %` three times, the footer reads "Datenschutzerklärung (auf Englisch)", and there's no sideways scroll; `/ja/` uses the Japanese font stack and the dropdown scrolls (max-height 716 px). Share images checked by eye for de, ja (もっと大きく on one line), ar (RTL, joined letters), fr, es and the German Duo card.

**Not verified:** the local server can't show Cloudflare's nearest-404 fallback; that is checked after deploy by opening a missing `/de/…` URL. Danish has no share image yet (it comes with Phase B). No native speaker has read the new strings.

## Phase B + C: new full languages (one PR each)
- [x] da (Danish)
- [x] it (Italian)
- [x] nl (Dutch)
- [ ] pl (Polish)
- [ ] ko (Korean, + CJK tooling)
- [ ] ru (Russian, no flag)
- [ ] uk (Ukrainian)

## Review (Danish, PR `lang-da`)

**Changes:**
- **Danish is now a full language** at `/da/`: homepage, blog index, FAQ, 404 and all 31 posts, with Danish in every switcher and hreflang set. `src/site.json` (`da` added to `contentLangs`), `src/i18n/da.json`, `src/content/da/` (31 posts + `faq.json`).
- **Homepage:** blog, FAQ and post links now go to the Danish pages (they went to `#faq` and the English blog before). The "(engelsk)" notes on the blog link and in 4 FAQ answers are gone. The latest-posts block is filled, and the share image is `og/da-site.jpg`.
- **Keywords:** the Ahrefs MCP connects, but every Keywords Explorer call (even the free test query) returns "Insufficient plan": the API isn't on the account. So the Danish keywords come from Google autocomplete (hl=da, gl=dk), as for fr/pt/ja/ar. Danes search problems in Danish ("iphone lav lyd", "airpods lav lyd", "skru op for lyden iphone", "lav en sang med ai", "fjern baggrundsstøj på iphone") and some tech terms in English ("equalizer iphone", "slowed reverb"). keyword-map has a DA column; slugs are ASCII (æ→ae, ø→oe, å→aa).
- **Terms:** from the app's catalog (Danish table in `tasks/facts.md` §8), plus Apple's da-dk names found by the translators: Voice Memos = **Memoer** (not Diktafon), the Files app = **Arkiver** (EQfy's import button says Filer), Settings › **Lyde & haptisk feedback**, Music Haptics = **Haptisk feedback til musik** (the slug was renamed to `haptisk-feedback-musik-iphone` to match), Spatial Audio = **Rumlig lyd**. Apple links point to `da-dk` pages; Spotify links to `dk-da`. All checked to return 200.
- 32 share images (31 posts + the site image).

**Verification:** `node build.mjs && node check.mjs`: 352 pages, 0 errors, 0 warnings. The validator (scratchpad) passes for all 31 posts: strict-JSON front-matter, same placeholders, same h2/h3 ids, same table/list/link/image counts, slug and length rules. FAQ: 7 groups and 22 items, like English. In the browser at 375 px: all 31 Danish posts have no sideways scroll. Post, blog index, FAQ and 404 are `lang="da"` with Danish dates ("11. oktober 2026") and reading time ("7 min. læsning"), 3 related cards, the FAQ present, no broken images and no links into the English blog. Share images checked by eye.

**Not verified / worth a native reader:**
- No native Danish speaker has read the text.
- Apple's Danish pages disagree on some names, e.g. "Formindsk høje lyde" vs "Formindsk høj lyd" and "Lyd og routing" vs "Lyd og rute". The posts follow the AirPods guide.
- Apple Music's EQ preset names stay English with a Danish gloss (no Apple da page lists them).
- **English source issues found while translating** (not fixed; they affect all 10 languages):
  - `slowed-reverb` says "a 0.8× song", but 0.8× isn't one of the app's speed steps (0.75 → 0.85).
  - `iphone-equalizer` calls the player tab "Equalizer", but it is "EQ".
  - `airpods-bass` uses the fit-test path Settings › your AirPods, while Apple's current page says Settings › Bluetooth › More info.
- App catalog issues (app repo): `Balance:` (credits) is translated as audio balance in da as well.

## Review (Dutch, PR `lang-nl`)

**Changes:**
- **Dutch is now a full language** at `/nl/`: homepage, blog index, FAQ, 404 and all 31 posts, in every switcher and hreflang set. `src/site.json` (`langs.nl`, `contentLangs`, `landingLangs`), `index.html` (one hreflang link and one switcher option), `src/i18n/nl.json`, `src/landing/nl.json`, `src/content/nl/` (31 posts + `faq.json`). 32 share images.
- **Keywords:** Google autocomplete (hl=nl, gl=nl), as for da (Ahrefs has no API access on this account). Dutch searchers type "iPhone geluid harder zetten", "iPhone geluid zacht", "geluidsversterker app", "liedje maken met AI", "achtergrondgeluid verwijderen". Dutch spelling joins brand compounds with a hyphen (iPhone-geluid, geluidsversterker-app), so titles and `keyword` fields use the hyphen; Google treats it as a space.
- **Terms:** app catalog (Dutch table in `tasks/facts.md` §8) plus Apple's nl-nl names found by the translators: Settings › Sounds & Haptics = **Horen en voelen**, Voice Memos = **Dictafoon**, Files = **Bestanden**, Music Haptics = **Voelbare muzieksignalen** (the slug was renamed to `voelbare-muzieksignalen-iphone` to match), Spatial Audio = ruimtelijke audio. Apple links point to `nl-nl` pages, Spotify links to `/nl/`; all checked to return 200. The WHO pages and Audible have no Dutch version and say "(in het Engels)".
- **Catalog mistakes not copied:** the "Dance" preset ("Dans") and the credit balance ("Balans:" → saldo).

**Verification:** `node build.mjs && node check.mjs`: 387 pages, 0 errors, 0 warnings. The validator passes for all 31 posts; i18n has the same keys as English; the homepage dictionary has all 181 keys with matching `{n}` tokens; FAQ 7 groups and 22 items. In the browser at 375 px: 34 Dutch pages (31 posts, blog index, FAQ, 404) have no sideways scroll, `lang="nl"`, 3 related cards per post and no links into the English blog. All 20 unique images return 200 (202 of 273 `<img>` tags are lazy-loaded, so a naturalWidth test on off-screen frames is meaningless). The dropdown lists 11 languages and scrolls (max-height 716 px).

**Not verified:** no native Dutch reader; Apple's nl-nl pages disagree with themselves in places (e.g. "Verminder hard geluid" vs "harde geluiden", "Audio en routing" vs "routering"); Apple Music EQ preset names stay English with a Dutch gloss (no Apple page lists them).

**English source issues found while translating** (not fixed here; they affect all languages): the homepage card says "EQ'd audio anywhere — no connection required" but offline the player shows only the Volume dial (facts.md §2); `remove-background-noise` says "sliders icon, then Options" in Voice Memos but Apple's page says the More (…) button; `8d-audio` calls "Enable 3D positioning and reverb" a toggle label (it is the subtitle); `bluetooth-volume-low` step 6 and `spotify-louder` cite claims their linked pages don't make.

## Review (Italian, PR `lang-it`)

**Changes:**
- **Italian is now a full language** at `/it/`: homepage, blog index, FAQ, 404 and all 31 posts, in every switcher and hreflang set. `src/site.json`, `index.html`, `src/i18n/it.json`, `src/landing/it.json`, `src/content/it/` (31 posts + `faq.json`), 32 share images, all homepages regenerated with the new switcher entry.
- **Keywords:** Italian Google autocomplete (hl=it, gl=it), as for da/nl (no Ahrefs API access). Italians search "aumentare volume iPhone", "volume iPhone basso (anche se al massimo)", "equalizzatore iPhone", "audio spaziale iPhone", "creare canzone con ia", "da testo a voce". The app says IA (Studio IA); the posts use IA, with AI where readers search it.
- **Terms:** app catalog (Italian table in `tasks/facts.md` §8) plus Apple's it-it names found by the translators: Suoni e feedback aptico, Salute dell'udito, Memo Vocali, File, **Feedback aptici musica** (Music Haptics; the slug was renamed to `feedback-aptici-musica-iphone` to match), Audio spaziale. Apple links point to `it-it`, Spotify to `/it/`; all return 200. WHO and Audible are marked "(in inglese)".
- **Consistency fix:** two loudness posts wrote the Apple Music presets as «Riduttore bassi / Riduttore alti» from memory while the tone posts described them in words. All posts now describe them and give the English name («Bass Reducer», «Treble Reducer»), because no Apple Italian page lists the preset names.
- **Catalog mistakes not copied:** "Dance" ("Danza") and the credit balance ("Bilanciamento:" → saldo crediti).

**Verification:** `node build.mjs && node check.mjs`: 422 pages, 0 errors, 0 warnings. Validator: 31/31 posts pass; i18n, homepage dictionary (181 keys, matching `{n}` tokens) and FAQ (7 groups, 22 items) match English. Browser at 375 px: all 34 Italian pages have no sideways scroll, `lang="it"`, 3 related cards and a FAQ on every post, no links into the English blog, and no broken images; the dropdown lists 12 languages.

**Not verified:** no native Italian reader; the Apple Music preset names; the balance slider letters (assumed S/D); "Credit Shop" stays English (the app has no Italian title for it).

