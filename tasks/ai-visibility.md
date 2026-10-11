# AI Visibility Report: EQfy - Louder Volume

Audit date: **2026-10-11** (the day eqfy.app went live). Method: SearchFit `ai-visibility` framework.
Related: [facts.md](facts.md) (what we may claim) · [keyword-map.md](keyword-map.md) (SEO clusters) · [todo.md](todo.md).

> **How this was measured.** I ran 9 prompts through a search-grounded AI answer engine (web search + LLM summary, US results, one run each). That's the same mechanism ChatGPT search, Perplexity and Gemini use. I also checked App Store data with the iTunes lookup API, crawler access with `curl`, and Claude's own built-in knowledge.
>
> I did **not** query ChatGPT, Gemini or Perplexity directly, so treat the scores as estimates. Re-run the same prompts in each assistant every month (see [Monitoring](#monitoring)).

## Fix status (updated 2026-10-11)

| # | Finding | Status | Where |
|---|---|---|---|
| 1 | eqfy.app not indexed | **Deployed 2026-10-11** and IndexNow pinged (65 URLs, HTTP 200). Taras submits Search Console and Bing Webmaster himself. | [outreach.md §1](outreach.md) |
| 2a | App Store listing never says "EQfy" | **Fixed and merged** into `release/v2.2.23` (VolumeBooster#37). All 50 locales open with "EQfy - Louder Volume", and the shared India copy in `aso_metadata_all_locales.md` is synced. Goes live with the v2.2.23 upload. | app repo `fastlane/` |
| 2b | Listing sells the hidden "AI-Powered Audio Enhancement" and "without distortion" | **Fixed and merged** (all locales, both fastlane files) | same |
| 2c | `sellerUrl` → taraschernysh.com, which links to github.io | **Fixed and live** (DevPage#10 merged). taraschernysh.com links to eqfy.app, including a crawlable footer link. Re-check `sellerUrl` after v2.2.23 ships (`marketing_url` = eqfy.app). | DevPage |
| 2d | Subtitle "Equalizer FX" collides with TwinBit's "Equalizer Fx" | **Decided 2026-10-11: keep "Equalizer FX"** (ASO). The collision is mitigated by the FAQ/llms.txt disambiguation and the EQfy-first description. Revisit if AI answers keep mixing the apps up. | [outreach.md §2](outreach.md) |
| 3 | Name collisions and no developer link on the site | **Fixed.** FAQ answer (5 languages) names developer Taras Chernysh and says EQfy is not related to "Louder Volume: Sound Booster" or "Equalizer Fx". `llms.txt` says the same. Organization schema has `founder` on all 6 homepages. | `src/content/*/faq.json`, `build.mjs`, `index.html` |
| 4 | No "EQfy vs Boom" page | **Written:** `/blog/eqfy-vs-boom/` + es/de/tr/zh | `src/content/*/blog/vs-boom.html` |
| 5 | Top Search Console query "free sound amplifier app for iPhone" answered by hearing-aid apps | **Written:** `/blog/sound-amplifier-app-iphone/` + es/de/tr/zh | `src/content/*/blog/sound-amplifier.html` |
| 6 | No third-party footprint (AlternativeTo, Product Hunt, roundups, Reddit) | **Drafted, paste-ready.** Taras posts and sends from his own accounts. | [outreach.md §4–7](outreach.md) |
| 7 | Thin social proof (40 ratings) | **No code change needed.** The app already calls `requestReview()` in 5 places. | [outreach.md §8](outreach.md) |
| 8 | Monitoring | Monthly prompt log below. Next check 2026-11-11. | [Monitoring](#monitoring) |

---

## Current Visibility Score: 23/100

| Dimension | Score (0–10) | Notes |
|---|---|---|
| **Presence** | 1 | Named in **0 of 6** discovery prompts. The brand query "EQfy Louder Volume app" returns *other* apps. The only way it surfaces is a search for the exact US App Store name plus the developer name. |
| **Accuracy** | 4 | The site and `llms.txt` are accurate. The App Store description (the most-read source about the app) still sells **"AI-Powered Audio Enhancement"**, which has been hidden since v2.2.22 (facts.md §2). |
| **Sentiment** | 5 | Neutral by default: there are no reviews, threads or articles to form an opinion from. The 4.53★ rating rests on only 40 ratings. |
| **Position** | 0 | Never recommended in any list. |
| **Completeness** | 2 | When the listing does surface, the AI repeats listing bullets. It never mentions the free +12 dB boost, the 7-band EQ or the honest in-app-only limit. |
| **Consistency** | 2 | Different name in every storefront. "EQfy" never appears on the App Store. `sellerUrl` ≠ eqfy.app. Name collides with other apps (details below). |

Overall = (1+4+5+0+2+2) / 6 × 10 ≈ **23**

### Root causes (in order of impact)
1. **eqfy.app is not in the search index yet.** `site:eqfy.app` returned 0 pages. Search-grounded AI can't cite what isn't indexed. Expected for a domain launched today, but it is blocker #1.
2. **The entity is split into pieces.** AI models can't connect "EQfy" ↔ the App Store app ↔ eqfy.app:
   - The App Store listing never says "EQfy".
   - The listing name changes by storefront: US *Volume Booster Sound Amplifier*, DE *Lautstärke erhöhen - Equalizer*, ES *Amplificador de Volumen & Bajo*, TR *Equalizer Volume - Bass Boost*.
   - `sellerUrl` is `https://www.taraschernysh.com`, and that page links to the old `github.io/VolumeBoosterWeb/` URL instead of eqfy.app.
3. **Name collisions.** "Louder Volume: Sound Booster" (id6747962445), "Louder Volume Booster", "LOUDER: AI Volume Booster" and **"Equalizer Fx: Bass Booster App"** (TwinBit, 27,979 ratings) are all different apps. Our US subtitle is "Equalizer FX". An AI that sees "Louder Volume" or "Equalizer FX" will probably attribute it to a rival.
4. **No third-party footprint.** No reviews, no "best of" lists, no AlternativeTo entry, no Reddit threads. Those are exactly the sources the AI answers cited.
5. **Thin social proof:** 40 ratings vs 3,800–28,000 for the apps that get recommended.

### What is already good (keep it)
- Crawl access is fine. Live `robots.txt` allows everything, and `llms.txt` returns 200. **GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot and Google-Extended** user-agents all get HTTP 200 from Cloudflare. No AI-bot blocking is on.
- Structured data is in place:
  - Organization, WebSite and MobileApplication schema with the real rating (4.5 / 40), offers and `alternateName`.
  - FAQPage on the home, FAQ and post pages; BlogPosting and BreadcrumbList on posts.
- The content is easy for AI to quote:
  - Every post opens with a direct-answer lead paragraph.
  - Honest limits are stated plainly ("can't boost Spotify or calls").
  - A FAQ entry already answers "Is EQfy the same app as Volume Booster Sound Amplifier?".

---

## Prompt Analysis

| # | Prompt | Mentioned? | Position | Sentiment | Accurate? | Named instead |
|---|---|---|---|---|---|---|
| 1 | "best volume booster app for iPhone" | No | — | — | — | Boom (most recommended), Increase Volume, Higher Volume |
| 2 | "best equalizer app for iPhone 2026" | No | — | — | — | Boom, Flacbox, **Equalizer+ HD (top pick)**, Equalizer Fx, Apple's built-in EQ |
| 3 | "how to make iPhone louder than max volume app" | No | — | — | — | Generic "Volume Booster"/"Max Volume Booster" (TechRadar), built-in tips, Apple Music **"Late Night" EQ (removed in iOS 26, so the advice is stale)** |
| 4 | "EQfy Louder Volume app" (brand) | **No** | — | — | ✗ "couldn't find any app called EQfy" | Louder Volume: Sound Booster, Louder Volume Booster: Amplify, LOUDER: AI Volume Booster, Max & Louder |
| 5 | "free sound amplifier app for iPhone" *(top Search Console query)* | No | — | — | — | Hearing-aid style mic amplifiers (Sound Amplifier, Hearify, PhoneAmp), Apple Live Listen |
| 6 | "best bass booster app iPhone reddit" | No | — | — | — | Boom ("comes up most often"), Equalizer FX, VOX |
| 7 | "Boom bass booster alternatives iPhone" | No | — | — | — | Equalizer FX, "Volume Booster" (AlternativeTo), built-in EQ |
| 8 | `site:eqfy.app` (index check) | 0 pages | — | — | — | Unrelated "Equafy" / "eq.app" results |
| 9 | "Volume Booster Sound Amplifier iPhone app Taras Chernysh" | Yes (listing only) | #1 | 0 | Partly: features right, but "can't confirm who made it" | — |
| — | Claude (built-in knowledge, no search) | No | — | — | — | No prior knowledge of "EQfy" |

**Sources AI engines cited for these prompts:**
- Publishers: iPhoneLife, Tom's Guide, TechRadar, iGeeksBlog, Digital Trends, techcult.
- Directories: AlternativeTo, appfollow.io.
- Global Delight's own blog (the maker of Boom).
- Many raw App Store listings.

An app with a keyword-matching **name** (e.g. "Increase Volume", 120 ratings) gets listed even with few ratings. Brand entity and listing text matter as much as review count.

---

## Competitor Comparison

US App Store data from the iTunes lookup API (2026-10-11). "Mentions" = number of the 6 discovery prompts (#1, 2, 3, 5, 6, 7) where the AI answer named the app. The score is a rough estimate on the same 6-dimension scale.

| Brand | App Store rating | Mentions (of 6) | Est. visibility | Most mentioned in |
|---|---|---|---|---|
| **EQfy** (Volume Booster Sound Amplifier) | 4.53★ / 40 | 0 | **23** | Only an exact-name search |
| Boom: Bass Booster & Equalizer (Global Delight) | 3.86★ / 4,524 | 4 | ~70 | Volume booster, best EQ, bass booster, alternatives. The default answer. |
| Equalizer Fx: Bass Booster App (TwinBit) | 4.17★ / 27,979 | 3 | ~45 | Best EQ, bass booster, Boom alternatives |
| Equalizer+ HD music player (MWM) | 3.79★ / 9,364 | 1 | ~35 | Best EQ (named the top all-round pick) |
| Increase Volume Sound (V. Ivakhnenko) | 4.48★ / 120 | 1 | ~25 | Best volume booster |
| Higher Volume: Louder Boost | 4.26★ / 3,834 | 1 | ~25 | Best volume booster |

**Facts for a future "EQfy vs Boom" page** (from Boom's US listing; re-verify on the day you write it):
- **Pricing:** Boom offers a "7-day trial version" and then a subscription. EQfy's Volume Boost is free (facts.md). This is the clearest honest difference.
- **Equalizer and presets:**
  - Boom: 8- or 16-band custom EQ, 29 presets, Headphone EQ for 5,000+ headphone models, 3D surround.
  - EQfy: 7 bands + preamp, 9 presets.
  - Be honest that Boom's EQ is more granular.
- **Music sources:**
  - Boom: TIDAL, 40K radio stations and podcasts, link downloads.
  - EQfy: Music library and Files import, free "Find more" discovery, offline player.
- **EQfy only:** AI Studio (music generator, sound effects, text to speech, noise reducer), the haptic player, and iPhone Duo layouts once v2.2.23 ships.
- **Shared limit:** iOS doesn't let any third-party app process DRM-protected Apple Music tracks (facts.md). Equalizer Fx and Equalizer+ HD say so in their listings; Boom's listing doesn't mention it.

---

## Action Plan (priority order)

1. **Get indexed (Google + Bing).** Expected impact: **High**. It unblocks everything else.
   - Search Console: submit `sitemap.xml`, then request indexing for `/`, `/faq/`, `/blog/`, the Duo post and `/es/`.
   - **Bing Webmaster Tools:** add eqfy.app (you can import it from Search Console) and submit the sitemap. Bing's index feeds ChatGPT search, Copilot and DuckDuckGo.
   - After each deploy, run `node indexnow.mjs --since <date>` (already built).
2. **Join up the entity: App Store ↔ eqfy.app ↔ developer site.** Expected impact: **High**.
   - Start the App Store description with the brand in every locale, e.g. "**EQfy - Louder Volume** is a volume booster, bass booster and 7-band equalizer for iPhone…". The en-US source currently opens with "Volume Booster is your all-in-one…". File: `../VolumeBooster/VolumeBooster/fastlane/descriptions_all_locales.md`, uploaded with `fastlane ios upload_descriptions`.
   - **Remove "3. AI-Powered Audio Enhancement"** from that file (en-US line ~29 and every locale). It contradicts facts.md, and AI engines repeat whatever the listing says.
   - The v2.2.23 draft already sets `marketing_url`/`support_url` → `https://eqfy.app`. After upload, re-check `sellerUrl` in `https://itunes.apple.com/lookup?id=6550912161`. If it still shows taraschernysh.com, change the developer website in App Store Connect.
   - On taraschernysh.com, change the `github.io/VolumeBoosterWeb/` link to `https://eqfy.app` and label it "EQfy - Louder Volume".
   - *Decision for you (ASO trade-off):* the subtitle "Equalizer FX" overlaps with TwinBit's "Equalizer Fx", which has 27,979 ratings. Consider a subtitle that carries the brand, e.g. "EQfy: Bass Booster & Equalizer". Test it in one storefront first, because it changes keyword coverage.
3. **Publish an "EQfy vs Boom" page.** Expected impact: **High** for prompts #1, #6 and #7.
   - Structure: a direct-answer lead, a comparison table built from the facts above, a "who should pick which" section with honest trade-offs, and a 3–5 question FAQ.
   - Write it EN first, then translate to es/de/tr/zh like the other posts.
   - Follow facts.md: no "#1", no invented stats, date the comparison, and link Boom's App Store page as the source.
   - It is picked up by `build.mjs` → `llms.txt` and the sitemap automatically.
4. **Get onto the directories AI engines cite.** Expected impact: **High/Medium**.
   - **AlternativeTo:** list EQfy and mark it as an alternative to Boom, Equalizer Fx and Equalizer+. AlternativeTo was cited in prompts #4 and #7.
   - **Product Hunt:** launch with v2.2.23 (iPhone Duo support is a real news hook).
   - Add the new profile URLs to the Organization `sameAs` once they exist.
5. **Pitch the roundup authors.** Expected impact: **Medium**.
   - TechRadar ("How to make your iPhone louder"), Tom's Guide and iPhoneLife still recommend Apple Music's **Late Night** EQ, which iOS 26 removed.
   - Send them a short, sourced correction plus EQfy as the free +12 dB option. That's a useful pitch, not just a self-promotional ask.
   - iGeeksBlog reviews Boom, so pitch them an EQfy review or an "apps ready for iPhone Duo" piece.
6. **Join Reddit and community threads.** Expected impact: **Medium** (Reddit weighs heavily in AI answers).
   - Answer real "iPhone too quiet", "AirPods quiet" and "EQ app for iPhone" threads in r/iphone, r/AirPods and r/headphones.
   - Lead with the fix, link the matching blog guide, and **disclose that you're the developer**. No sock-puppet posts.
7. **Grow ratings past 40.** Expected impact: **Medium**.
   - The app already asks for reviews: `requestReview()` is called in `DetailsSongView`, `TracksListView`, `AudioComperisonListView`, `SaleCreditsView` and `SaleConsumableView`.
   - Watch the rating count. Only move a prompt to a "happy moment" if the count stalls.
8. **Small on-site touches.** Expected impact: **Low** (do them alongside #3).
   - Add a "Not to be confused with *Louder Volume: Sound Booster* or *Equalizer Fx*, which are different apps" line to the FAQ entry about the App Store name and to `llms.txt`.
   - Add `sameAs` links as profiles appear.

## Content to Create
- [x] **EQfy vs Boom** (`/blog/eqfy-vs-boom/`, then 4 translations). Targets: "Boom alternatives", "best bass booster app iPhone", "best volume booster app for iPhone".
- [x] **Sound amplifier for music vs for hearing** (`/blog/sound-amplifier-app-iphone/` + 4 translations). Targets: "free sound amplifier app for iPhone" (the top Search Console query, where AI answers list hearing-aid apps). Honest angle: EQfy makes *music* louder; for hearing, point to Apple Live Listen and the AirPods Pro Hearing Aid / Conversation Boost (facts.md §3.2: never claim hearing aid).
- [x] **AlternativeTo + Product Hunt descriptions:** [outreach.md §4–5](outreach.md)
- [x] **Outreach email** (Late Night correction + EQfy mention): [outreach.md §6](outreach.md). The Late Night advice was verified in all three articles.
- Existing posts already map to prompts. Keep them updated rather than writing duplicates:
  - [louder-than-max](../blog/make-iphone-louder-than-max-volume/) → prompt #3
  - [eq-settings](../blog/best-iphone-eq-settings-by-genre/) → #2
  - [bass-boost](../blog/boost-bass-on-iphone-speakers/) → #6
  - [volume-too-low](../blog/iphone-volume-too-low-fixes/) and [airpods-louder](../blog/make-airpods-louder/) → Reddit-style troubleshooting prompts

---

## Monitoring

Re-run the 9 prompts above **monthly** (next check: **2026-11-11**) in ChatGPT (search on), Perplexity, Gemini and Claude. Add a row per run:

| Date | Assistant | Prompt # | Mentioned? | Position | Sentiment | Accurate? | Notes |
|---|---|---|---|---|---|---|---|
| 2026-10-11 | search-grounded proxy | 1–9 | 0/6 discovery | — | — | — | Baseline (this report) |

What to expect:
- Search-grounded answers (ChatGPT search, Perplexity, Gemini) can change within **weeks** of indexing.
- Built-in model knowledge (Claude, ChatGPT without search) only changes at the next training update, which takes **months**.

Leading indicators to watch before AI mentions show up:
- Pages indexed in Search Console and Bing.
- Brand query #4 returns eqfy.app.
- `sellerUrl` = eqfy.app.
- Rating count.
