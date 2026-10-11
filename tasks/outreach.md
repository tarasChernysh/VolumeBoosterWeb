# AI visibility — off-site kit (paste-ready)

Companion to [ai-visibility.md](ai-visibility.md). Everything here needs Taras's own accounts (Google, Bing, App Store Connect, AlternativeTo, Product Hunt, Reddit, email), so it's written ready to paste. Follow [facts.md](facts.md): no "#1", no user counts, no hearing-aid claims, and always say EQfy only boosts audio played inside the app.

---

## 1. Get indexed (do first, right after deploying)

**Google Search Console** (Domain property `eqfy.app` already exists):
1. Sitemaps → submit `https://eqfy.app/sitemap.xml`.
2. URL Inspection → *Request indexing* for, in this order:
   - `https://eqfy.app/`
   - `https://eqfy.app/faq/`
   - `https://eqfy.app/blog/eqfy-vs-boom/`
   - `https://eqfy.app/blog/sound-amplifier-app-iphone/`
   - `https://eqfy.app/blog/make-iphone-louder-than-max-volume/`
   - `https://eqfy.app/blog/`
   - `https://eqfy.app/es/`

**Bing Webmaster Tools** (feeds ChatGPT search, Copilot and DuckDuckGo):
1. Sign in at bing.com/webmasters → *Import from Google Search Console*. That's the fastest route, and verification is inherited.
2. Sitemaps → submit `https://eqfy.app/sitemap.xml`.
3. After each deploy, run `node indexnow.mjs --since <YYYY-MM-DD>`. This IndexNow ping covers Bing, Yandex, Seznam and Naver.

## 2. App Store listing (app repo, branch `claude/aso-eqfy-brand`)

Already done in `fastlane/descriptions_all_locales.md`:
- All 50 locales now open with "EQfy - Louder Volume".
- The hidden "AI-Powered Audio Enhancement" claim and the "without distortion" guarantees are removed.

Ship it with v2.2.23:
```bash
bundle exec fastlane ios upload_descriptions dry_run:true
```
```bash
bundle exec fastlane ios upload_descriptions
```
After release, check `https://itunes.apple.com/lookup?id=6550912161`:
- `description` should start with "EQfy - Louder Volume".
- `sellerUrl` should be `https://eqfy.app`. If it still says taraschernysh.com, change the developer website in App Store Connect.

**Decision for you (not changed):** the subtitle "Equalizer FX" is almost the same as the name of TwinBit's app "Equalizer Fx", which has 27,979 ratings. One option that carries the brand is `EQfy: Bass Booster & Equalizer` (30 chars). It changes keyword coverage, so test it in one storefront first (`ios-aso-keyword-metadata` skill).

## 3. Developer site (DevPage repo, branch `claude/eqfy-link`)

The app card and a new static footer link now point to `https://eqfy.app/` and are labelled "EQfy - Louder Volume". The cards are JS-rendered, so the footer link is the one crawlers can see. Merge the PR and GitHub Pages deploys it.

---

## 4. AlternativeTo listing

Add the app at alternativeto.net (*Add application*), then on Boom's, Equalizer Fx's and Equalizer+'s pages use *Suggest alternative*.

| Field | Value |
|---|---|
| Name | EQfy - Louder Volume |
| Website | https://eqfy.app |
| Platforms | iPhone |
| License | Freemium |
| Tags | volume-booster, equalizer, bass-booster, music-player, audio-enhancer |
| Alternative to | Boom: Bass Booster & Equalizer · Equalizer Fx · Equalizer+ HD |

**Short description:**
> iPhone app that makes your songs louder: free Volume Boost up to +12 dB, plus bass boost, a 7-band equalizer, 3D audio and AI music tools.

**Description:**
> EQfy - Louder Volume (listed on the US App Store as Volume Booster Sound Amplifier) makes music and audio files on your iPhone louder and fuller. The Volume Boost dial goes from 100% to 200%, adding up to +12 dB, and it's free. Premium adds a bass booster tuned for iPhone speakers, a 7-band equalizer with 9 genre presets, left/right balance, 3D Audio with reverb rooms and head tracking on supported AirPods, playback speed, a haptic player and export. AI Studio can generate songs, sound effects and speech. Import songs from your Music library or the Files app and play them offline. Like every iPhone app, EQfy can only boost audio played inside it, not Spotify, YouTube or calls. Requires iOS 16 or later.

## 5. Product Hunt (launch with v2.2.23 and iPhone Duo support)

- **Name:** EQfy - Louder Volume
- **Tagline (≤ 60):** `Make songs louder on iPhone: free +12 dB boost & EQ` (51)
- **Description (≤ 260):**
  > EQfy makes music on your iPhone louder and fuller. Free Volume Boost up to +12 dB, plus bass boost, a 7-band EQ, 3D audio, haptics and AI music tools. v2.2.23 adds iPhone Duo layouts: sidebar and side-by-side screens on the inner display.
- **Topics:** iOS, Music, Audio, Artificial Intelligence
- **Links:** https://eqfy.app · the App Store link with `ct=producthunt` (make a new campaign token so you can see installs)
- **Maker's first comment:**
  > Hi Product Hunt! I'm Taras, the developer. {One sentence in your own words on why you built EQfy.} The Volume Boost dial (up to +12 dB) is free. To be upfront about the limits: iOS only lets EQfy process audio it plays itself, so it can't boost Spotify, YouTube or calls. Import your own songs or use the free music discovery. This release also lays EQfy out for iPhone Duo's inner display, with a sidebar and side-by-side screens. I'd love feedback on the EQ presets and the 3D Audio rooms.

  If v2.2.23 isn't live yet on launch day, change the iPhone Duo sentence to "coming in v2.2.23".

## 6. Outreach: the "Late Night EQ is gone" correction

All three articles were verified on 2026-10-11 to still tell readers to pick Apple Music's **Late Night** EQ. That preset isn't in Settings › Apps › Music › EQ on iOS 26.

| Outlet | Article | Byline / date |
|---|---|---|
| TechRadar | https://www.techradar.com/how-to/how-to-make-your-iphone-louder | James Rogerson, 2022-02-26 |
| Tom's Guide | https://www.tomsguide.com/how-to/how-to-make-an-iphone-louder | updated 2025-09-30 |
| iPhoneLife | https://iphonelife.com/content/how-to-boost-volume-your-iphone | Hallei Halter, 2024-01-25 |
| iGeeksBlog | https://www.igeeksblog.com/boom-bass-booster-equalizer-iphone-app-review/ | Reviews Boom; pitch an EQfy review or an "apps ready for iPhone Duo" piece instead |

Before sending, open Settings › Apps › Music › EQ on an iOS 26 iPhone and take a screenshot to attach.

**Subject:** Quick fix for your "make iPhone louder" guide (Late Night EQ is gone in iOS 26)

> Hi {name},
>
> Your guide "{article title}" ({url}) is still one of the top results for making an iPhone louder, so I wanted to flag a small thing: step "{step}" tells readers to choose **Late Night** in Settings › Music › EQ. On iOS 26 that preset is no longer in the list (screenshot attached; the menu is now Settings › Apps › Music › EQ). The closest current advice is to set EQ to **Off** and turn off **Sound Check**, and to check the new Reduce Loud Sounds speaker setting in Sounds & Haptics, which *lowers* loud peaks.
>
> Full disclosure: I make an iPhone app in this space, EQfy - Louder Volume. Its Volume Boost adds up to +12 dB to songs played in the app, and it's free (it can't boost Spotify or calls, which iOS doesn't allow). If you ever refresh the "apps" section, I'm happy to send a promo code or answer questions. But the Late Night fix is the main reason I'm writing.
>
> Thanks for the guide,
> Taras Chernysh, https://eqfy.app

## 7. Reddit and communities: rules plus three answer templates

Rules:
- Only answer existing questions.
- **Always disclose** ("I'm the developer of …").
- Lead with the free iOS fix and link a blog guide before the app.
- Never upvote from alt accounts.
- Max one EQfy mention per thread.
- Check each subreddit's self-promotion rule first: r/iphone, r/AirPods, r/headphones, r/ios.

**"My iPhone is too quiet" threads:**
> A few settings quietly cap iPhone volume: Settings › Sounds & Haptics › Headphone Safety › Reduce Loud Audio (turn it off or raise the limit), Settings › Apps › Music › EQ (set it to Off; the old Late Night preset is gone in iOS 26) and Sound Check (off). Also check Settings › Accessibility › Audio & Visual › Balance is centred, and clean the speaker grille with a dry soft brush. Full checklist: https://eqfy.app/blog/iphone-volume-too-low-fixes/
> Disclosure: I made that guide and an app called EQfy that adds up to +12 dB to songs you play in it (free). It can't boost Spotify or calls; iOS doesn't allow that.

**"AirPods too quiet / one AirPod quieter" threads:**
> Check Reduce Loud Audio, then Conversation Awareness / Personalized Volume (they lower media), and clean the mesh (Apple's cleaning guide: https://support.apple.com/en-us/102672). For one side quieter, centre the Balance slider in Accessibility › Audio & Visual. More steps: https://eqfy.app/blog/make-airpods-louder/ (I wrote it; I also make the EQfy booster app.)

**"Best EQ / bass booster app for iPhone?" threads:**
> Depends on where your music comes from. No iPhone app can EQ Spotify or Apple Music streaming; they only process audio they play themselves. If you want lots of control, Boom has a 16-band EQ and headphone profiles (trial, then subscription). Equalizer+ HD is a solid player with a 7-band EQ. I make EQfy (7-band EQ + preamp, bass boost, free +12 dB volume boost), so I'm biased. Here's an honest comparison with Boom: https://eqfy.app/blog/eqfy-vs-boom/

## 8. Ratings

No code change needed. The app already calls `requestReview()` in 5 places: `DetailsSongView`, `TracksListView`, `AudioComperisonListView`, `SaleCreditsView` and `SaleConsumableView`.

Lever to watch: rating count (40 today). If it stalls, move one prompt to a "happy moment" in a later release, such as after a boosted song finishes.
