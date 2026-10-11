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
- [ ] 8. Commit on branch + open PR (deploy stays manual via wrangler)
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
