# EQfy facts + writer brief (single source of truth)

Every blog post, FAQ answer and homepage string must be consistent with this file. If something is not here, do not claim it. Verified 2026-10-11 against the app repo (`../VolumeBooster`), the live App Store listing (iTunes lookup API) and `ReleaseNotes.md`.

## 1. Identity

| Item | Value |
|---|---|
| Brand (site, logo, schema `name`) | **EQfy - Louder Volume** (first mention / titles); "EQfy" in running text |
| App Store name (US) | **Volume Booster Sound Amplifier** — mention once where helpful ("find it on the App Store as Volume Booster Sound Amplifier"). Other storefronts use other names — never quote them |
| Website | https://eqfy.app · support: **support@eqfy.app** |
| App Store ID | 6550912161 · link via placeholder `{{appstore}}` |
| Developer / seller | Taras Chernysh |
| Platform | Built for **iPhone**, requires **iOS 16 or later**. (Installs on iPad in iPhone mode — do not market as an iPad app.) |
| Category | Music |
| Price | **Free download**; optional **Premium** subscription (weekly or yearly; free trial on eligible plans). Credit packs for some AI tools. **No USD prices in localized posts**; in EN say "free to download" and avoid exact prices except in the FAQ pricing answer (weekly $1.99, yearly $27.99 in the US — "prices vary by country"). |
| Rating | **4.5 ★ on the US App Store (40 ratings)** — say "rated 4.5 on the App Store"; no user counts, no testimonials |
| Live version | **2.2.23**, released on the App Store on **2026-10-14** (App Store lookup 2026-10-21). iPhone Duo support is **available** — write "since v2.2.23" / "now available" |
| Languages | App available in **25 languages** |

## 2. What the app does (exact numbers)

**Player tools** (open any track → tabs Volume · Bass · EQ · Headphones · 3D Audio):

| Tool | Facts | Access |
|---|---|---|
| Volume Boost | dial from **100% to 200%** = up to **+12 dB** of extra gain on top of the iPhone volume | **Free** |
| Bass Boost | dial; up to **+12 dB** low-shelf boost centred around **200 Hz** (tuned so small iPhone speakers can actually reproduce it) | Premium |
| Equalizer | **7 bands: 32 Hz, 64 Hz, 200 Hz, 500 Hz, 1 kHz, 4 kHz, 16 kHz + a preamp (PR)**; **9 presets** + Custom; Reset button | Premium |
| Headphones (balance) | Left/right **audio balance** slider with "Centre" reset | Premium |
| 3D Audio | "3D Spatial Audio": **Reverb** mode (9 presets: Small/Medium/Large Room, Medium/Large Hall, Medium/Large Chamber, Cathedral, Plate) and **3D Source** mode with **4 Auto Motion** patterns (bilateral, orbit, figure-eight, breathing) | Premium |
| Playback speed | 0.5× – 2× (rabbit icon) | Premium |
| Haptic player | phone vibrates to the beat/bass | Premium |
| Export / share | save & share the enhanced audio file (speed, boost, EQ, bass and limiter included; reverb, 3D and balance are not) | **Unresolved**: `docs/FEATURES.md` says Premium, the code has no gate. Don't state free or Premium |

**EQ preset values (dB) — from `EqualizerViewModel.swift`, publish exactly:**

| Preset | Preamp | 32 | 64 | 200 | 500 | 1k | 4k | 16k |
|---|---|---|---|---|---|---|---|---|
| Rock | +6 | +5 | −3 | −6 | +3 | +6 | +3 | +4 |
| Jazz | +4 | −2 | −4 | +2 | +4 | +6 | +3 | +2 |
| Electronic | +8 | +6 | −2 | −4 | +3 | +6 | +8 | +6 |
| Classical | +4 | +3 | −2 | −3 | +2 | +4 | +6 | +4 |
| Reggae | 0 | +3 | +4 | +2 | −3 | −2 | −1 | −2 |
| Rap | +4 | +5 | +4 | +2 | 0 | +1 | +2 | +3 |
| R&B | +3 | +4 | +3 | +1 | −2 | −1 | +2 | +3 |
| Dance | +4 | +3 | +5 | +3 | +2 | +3 | +4 | +3 |
| Acoustic | +2 | +2 | 0 | −2 | −1 | +2 | +3 | +4 |

**Library & player (free)**: import songs from the iPhone **Music library** and from **Files** (MP3, M4A…); playlists; browse by artist/genre; **"Find more"** discovery of free tracks; **offline playback**; mini player.
- **DRM limit**: songs from an Apple Music *subscription* (and other protected files) play in EQfy but the enhancement tools are **not available** for them — iOS does not allow apps to process protected audio. Purchased/unprotected songs and imported files work with every tool.

**AI Studio** (needs internet): **Music Generator** (song compose from a text prompt, optional "Force instrumental", song name), **Sound Effects**, **Text to Speech**, **Noise Reducer**. **Every AI tool uses credits** (see the AI Studio pass block below): Music Generator 3,000, Sound Effects 250, Text to Speech 500, Noise Reducer 1,500 per started minute. Premium does not make them free. Do NOT mention "Voice Enhancer"/"AI audio enhancement" (hidden since v2.2.22).

**Verified in code (fact-check pass, 2026-10-11)** — paths relative to `../VolumeBooster/VolumeBooster/VolumeBooster/`:
- **3D Audio head tracking (user-facing)**: in **3D Source** mode EQfy uses `CMHeadphoneMotionManager` to follow head yaw/pitch with supported AirPods (in-app hint: "Connect AirPods Pro/Max"; subtitle "Immersive sound with head tracking"; iOS asks for motion permission). Not used in Reverb mode. (`Services/Players/AudioPlayerViewModel.swift` 179, 601–619, 1646; `Modules/Details/Views/SurroundedAudio/SurroundedAudioView.swift` 51, 108, 330–367.) Say "can use head tracking with supported AirPods such as AirPods Pro or AirPods Max"; it is still EQfy's own effect, not Apple Spatial Audio.
- **Peak limiter**: every playback chain and export runs through an Apple DynamicsProcessor set up as a peak limiter (threshold −1 dB, 0.1 ms attack) after the EQ/bass stages (`AudioPlayerViewModel.swift` 291–317, ~1592–1660, 1015–1067). OK to say it "helps reduce harsh clipping"; never "prevents distortion/clipping" (reverb/3D stages sit after it, and speakers can still distort).
- **EQ "Custom"**: the preset label shows "Custom" until a preset is picked; the menu lists only the 9 presets; moving sliders does not relabel it. There is no Save (button commented out) and band values are not persisted between app launches (`Modules/EqualizerView/EqualizerViewModel.swift` 13; `EqualizerView.swift` 35–39, 48–55). Don't claim custom presets can be saved.
- **Preamp = Volume Boost gain**: the EQ preamp (PR) and the Volume Boost dial drive the same gain (`AudioPlayerViewModel.swift` 648–653, 1306–1310). Don't describe this to users (the dial doesn't visibly sync yet).
- **Headphones balance**: in-app pan (`panMixerNode.pan`, persisted). It is not in the signal chain in 3D Source mode. Interaction with the iOS Accessibility Balance slider can't be verified in code → say "keep the iOS slider centred so you only adjust balance in one place".
- **AI song output**: generated songs are saved to a **"Song Compose"** playlist under the song name (`Modules/AIProducts/SongCompose/SongComposeViewModel.swift` 50, 128, 174–188). Force instrumental text in app: "If true, guarantees that the generated song will be instrumental" (`SongComposeView.swift` 187).

**Verified in code (how-to pass, 2026-10-21, branch `release/v2.2.23`; read from source, not run on a device)** — paths relative to `../VolumeBooster/VolumeBooster/VolumeBooster/`:
- **Playback speed**: 11 fixed steps: 0.5×, 0.75×, 0.85×, 0.9×, 0.95×, 1.0×, 1.15×, 1.25×, 1.5×, 1.75×, 2.0× (`Models/AudioSpeedType.swift` 10–48), picked from a pop-up menu on the hare icon (`DetailPageExtraActionsView.swift` 65–76). It sets only `AVAudioUnitTimePitch.rate` (`AudioPlayerViewModel.swift` 1215, 1737); `.pitch` is never set → **tempo changes, pitch stays the same; there is no pitch control and no "pitched-down slowed" sound**. Gated as Premium on the player screen (`DetailsSongView.swift` 495–499); the Music-tab mini player is not gated (don't mention). Speed is **not saved**: it resets to 1.0× on a cold launch.
- **Reverb** (player › 3D Audio › "Spatial Audio" toggle › Audio Mode "Reverb"): 9 presets (Small/Medium/Large Room, Medium/Large Hall, Medium/Large Chamber, Cathedral, Plate; default Medium Room) + a **Reverb Blend** slider, Dry → Wet 0–100% in 5% steps, default 50% (`SurroundedAudioView.swift` 116–274, `AudioPlayerViewModel.swift` 445–453). Premium by design (blurred "Unlock Premium" overlay). Settings are global and saved between launches.
- **Export / share**: share button top-right of the player; shows a "Saving…" progress card, then the iOS share sheet (Save to Files, AirDrop, Messages…). Baked in: **volume boost, 7-band EQ, bass, speed, limiter**. **NOT baked in: reverb, 3D, balance.** The file is named `<song>-volume_booster` and is not added to the EQfy library. Codec is unverified (don't say "AAC"/"mp3"/"wav"). `docs/FEATURES.md` says export is Premium, but the code has **no subscription check** on the share path → **don't state whether sharing is free or Premium**; say only what is free for sure (Volume Boost, library, player).
- **Import**: Files picker accepts any audio type (`UTType.audio`), **one file at a time** (formats depend on what iOS can decode — say "MP3, M4A and other common audio files"); Music Library picker shows **downloaded** songs only, one at a time, copied into the app as .m4a. **Video files can't be imported.** Apple Music subscription (protected) songs are rejected with the in-app message "Apple Music streaming tracks are copy-protected and can't be boosted. Use purchased, synced or downloaded files."
- **Find more**: genres/artists/search; tapping plays (streams); adding a track to a playlist **downloads** it so it plays offline. Separate "Preview Songs" are **30-second clips**. Never claim a license for the free catalog (unverified).
- **Offline**: imported/added songs play with no connection and in the background. **Caveat:** with no internet the player screen shows only the Volume dial (Bass, EQ, Headphones, 3D are not rendered; speed and share still work), the Music tab hides Genres/Artists, and the AI tab is hidden. Don't claim "every tool works offline".
- **Library**: playlists (create, rename, delete), "Move" a song into a playlist, delete or rename songs, "Remove all my music" in Settings, "Recent" row on Home (last 10).

**Verified in code (AI Studio pass, 2026-10-21, `release/v2.2.23` = live 2.2.23)** — paths relative to `../VolumeBooster/VolumeBooster/VolumeBooster/`:
- **Credits, not Premium:** every AI tool checks `creditsManager.canGenerateX()` and spends credits; **no subscriber bypass exists in code** (`Services/CreditsManager.swift` 39–43, 215–235; the tool ViewModels). Costs: **Sound Effects 250**, **Text to Speech 500** (both flat per generation, whatever the length), **Noise Reducer 1,500 per started minute**, Music Generator 3,000. Credits are deducted only after a successful save. Subscribers receive a recurring credit grant (defaults: 750 per week on the weekly plan; Remote Config can change it) — don't quote numbers. Free users can earn credits in the Credit Shop (daily login streak, rewarded ads, sharing the app). A user in an active free trial gets **one** free AI generation across all tools (disclosure: "That one was on us"). With too few credits a credit-pack sheet opens. **Don't write "Premium includes Music Generator, Sound Effects and Text to Speech"** — `docs/FEATURES.md` and `ECONOMY_SOURCE_OF_TRUTH.md` say so, the code doesn't; 2026-10-21: Taras asked to correct the old claim to match the code, so the FAQ, homepages, vs-boom and ai-song-generator now say the AI tools use credits (all languages). The new AI posts leave Premium out.
- **Where:** AI tab (hidden when offline), screen title "AI Studio", grid order Music Generator, Sound Effects, Text to Speech, Noise Reducer; every tool shows "Balance: N credits" at the top. Noise Reducer card is behind Remote Config `enable_noise_reducer` (**on in production, per Taras 2026-10-21**). All tools need internet; processing is on a server via the app's proxy (never name the provider on the site). Results are saved as MP3 into the in-app Library in a named playlist and behave like any track (play, tools, share). A "Please don't close the screen while processing" banner shows while generating.
- **Text to Speech:** text box with a counter "N/5000" (limit **5,000 characters**, no word limit); "Voice:" row opens a **Select Voice** picker (search, filter chips for Gender, Age, Accent, Use case, Language; preview play button when a voice has one; voices are fetched online, up to 100 — the voice count, names and languages are unverified, so never list them or claim languages); **Speed** control 0.75×, 1×, 1.25×, 1.5×; button **Generate Speech**; success "Speech Generated!"; saved to the **Text to Speech** playlist.
- **Sound Effects:** heading "Prompt to generate sound effect", prompt box prefilled with an example; a duration toggle (automatic by default) — **don't claim how long "automatic" is** (app copy says the AI decides, the request actually sends 30 s); manual duration **1–30 seconds**; **Influence** slider 0.1–1.0 (default 0.3; higher follows the prompt more closely and varies less); button **Generate sound effect**; saved to the **SFX** playlist; no prompt length limit.
- **Noise Reducer:** "No file selected" → **Select Audio File** → **Remove Noise**; accepts **one .mp3 or .wav file only** (m4a, e.g. Voice Memos recordings, and video are rejected: "File format is not supported. Please choose wav or mp3 file"); no duration or size limit in the app; result saved as MP3 to the **Noise Reducer** playlist, original untouched. The app gives **no description** of what it removes (it calls a voice/audio-isolation endpoint — likely keeps speech, **unproven**: don't claim noise types, music support, or "isolates voice").

**Verified in code (8D + haptics pass, 2026-10-23, `release/v2.2.23`; read from source, not run on a device)** — paths relative to `../VolumeBooster/VolumeBooster/VolumeBooster/`:
- **3D Source / Auto Motion:** player › 3D Audio › "Spatial Audio" toggle (subtitle "Enable 3D positioning and reverb") › **Audio Mode** buttons Reverb / 3D Source › **Auto Motion** row: Bilateral, Orbit, Figure 8, Breathing (`SurroundedAudioView.swift` 24–64, 236–248, 376–436). Tapping the active pattern again turns motion off (`AudioPlayerViewModel.swift` 494–510). Cycle at 1×: Bilateral 5 s (left↔right), Orbit 10 s (horizontal circle at ear level), Figure 8 12.5 s, Breathing ~6.7 s (vertical) (`AudioPlayerViewModel.swift` 104–135). A **Speed** slider (Slow–Fast, 0.25×–2.00×, step 0.05, shown as "1.00x") appears only while a pattern is on and is saved between launches (`SurroundedAudioView.swift` 440–470). Cycle time = base ÷ speed. Never use the code comments' ADHD/EMDR/wellness wording on the site.
- **Music Haptics (Apple)** — support.apple.com/guide/iphone/play-music-as-taps-textures-and-more-iphff2ceeb16/ios (read 2026-10-23): Settings › Accessibility › Music Haptics; Control Center audio card button (crossed out = not available for the song); Full Mix / Vocals Only; intensity Light / Medium / Strong; "supported iPhone models", millions of songs in Apple Music, Apple Music Classical, Shazam and compatible third-party apps, over Wi-Fi or cellular. **Spotify is not named** and the page lists no iPhone models.
- **EQfy haptic player:** a haptic button (SF Symbol `apple.haptics.and.music.note`) in the player's small button row (info, haptics, speed, share); shown only when the hardware supports Core Haptics and the track isn't protected; tapping without a subscription opens the paywall, so it is **Premium** (`DetailsSongView.swift` 489–535, `DetailPageExtraActionsView.swift`). It analyses the audio EQfy plays (loudness sets intensity, dominant frequency sets sharpness: low = soft, high = sharp) and plays Core Haptics events (`Services/Haptics/AudioEngineHapticManager.swift`). The Settings toggle (`HapticToggleView`) is commented out of `SettingsView`; don't mention a Settings switch. `docs/feature_list.md` calls it free, the code gates it: follow the code.

## 3. Hard limits — NEVER claim

1. **EQfy cannot boost other apps** (Spotify, YouTube, Apple Music streaming, Netflix), **phone/FaceTime calls**, notifications or system volume. iOS sandboxing only lets EQfy process audio **played inside EQfy**. Say this plainly wherever loudness is discussed — it builds trust.
2. Not a hearing aid / medical device. Never "hearing aid", "treats hearing loss", "doctor-approved". Hearing-related content: point to Apple's Headphone Accommodations / hearing features and to a hearing professional.
3. No "Made for iPhone" / "MFi" (Apple trademark). Use "built for / optimized for iPhone Duo".
4. No user counts ("thousands of users", "10k+"), no testimonials, no invented stats, no "#1".
5. No "prevents distortion/damage" guarantees → "helps", "reduce", "use moderately".
6. Not Apple Spatial Audio / Dolby Atmos — EQfy's 3D Audio is its own in-app reverb + 3D positioning effect.
7. Don't promise features not listed here (no widgets, no Mac app, no Android, no system-wide EQ).
8. Apple trademarks: iPhone, AirPods, Apple Music, App Store, iPhone Duo are Apple's. Don't imply Apple endorsement.

## 4. iPhone Duo (post `iphone-duo`) — available since v2.2.23 (2026-10-14)

What v2.2.23 brought (from `ReleaseNotes.md` + Swift code):
- **Uses the full inner display** instead of a letter-boxed phone layout.
- **Sidebar navigation** on the inner display (iOS 27 sidebar-adaptable tabs: Home, Music, AI Studio, Settings); on narrow widths it stays a tab bar. The outer display shows a compact floating tab bar on the right edge (visible in the screenshots).
- **Home**: tool cards and the Recent list sit **side by side** in two columns.
- **Player**: the tool (Volume/Bass/EQ/Headphones/3D dial or sliders) and the track info + playback controls split into **two columns** on the inner display — and in **any landscape** iPhone orientation, which also fixes clipped controls in landscape.
- **AI Studio** grid: **2 columns → 4 columns** on wide displays.
- **Readable width** for Settings, AI forms and the promo-code screen; subscription screen opens as a page sheet on wide layouts.
- Same update also brings: a short welcome quiz that builds a personal **sound profile**, free-trial reminders that arrive **before** the trial ends, a fix for a blank screen when adding Music-library songs on Home.
- Screenshots available are **outer display only** (`/assets/images/blog/iphone-duo/`). Describe the inner-display layouts in text; do not caption an image as the inner display.

## 5. Images (all 700×1019 WebP, iPhone Duo outer display)

Path prefix `/assets/images/blog/iphone-duo/`. Always: `width="700" height="1019" loading="lazy" decoding="async"` + descriptive alt (localize alt + captions).

| File | Shows |
|---|---|
| `01-discover-music.webp` | Music tab: genres, artists, trending, "Find more" |
| `02-offline-player.webp` | Tracks list with add buttons (offline player, MP3 download & share) |
| `03-equalizer.webp` | Equaliser: PR + 32–16k sliders, Custom preset, Reset |
| `04-ai-song-generator.webp` | AI Song Generator form: prompt, song name, Force instrumental, Compose Song |
| `05-volume-booster.webp` | Volume Boost dial at 140% |
| `06-bass-booster.webp` | Bass Boost dial at 138% |
| `07-unlock-full-power.webp` | Marketing card (no device) — don't use in posts |
| `08-ai-studio.webp` | AI Studio grid: Music Generator, Sound Effects, Text to Speech, Noise Reducer |
| `09-sound-control.webp` | Headphones tab: Audio Balance L/R slider, Centre |
| `10-3d-audio.webp` | 3D Spatial Audio: toggle, Reverb / 3D Source, Auto Motion |

Suggested use: louder-than-max & volume-too-low → 05; eq-settings → 03; bass-boost → 06; airpods-louder → 05 or 09; spatial-audio → 10; ai-song-generator → 04 + 08; headphone-balance → 09; iphone-duo → gallery of 01–06, 08–10.

## 6. iOS facts (verify against support.apple.com and link the Apple page you used)

Writers must check the current wording on support.apple.com (iOS 26/27 menus moved some items under **Settings › Apps**). Typical topics: Sounds & Haptics volume; **Reduce Loud Audio / Headphone Safety**; Apple Music **EQ** + **Late Night**; **Sound Check**; **Accessibility › Audio & Visual › Balance**, **Mono Audio**, **Headphone Accommodations**; AirPods: cleaning (support.apple.com/en-us/102672), checking connection, **Conversation Awareness / Adaptive Audio**, Low Power Mode does not affect volume (don't claim otherwise without a source).
- **Apple Music EQ "Late Night" preset no longer exists** on iOS 26+ (removed from Settings › Apps › Music › EQ). Don't recommend it; recommend EQ **Off** instead of presets that cut (Bass/Treble Reducer). iOS 26 added a separate speaker setting (Reduce Loud Sounds / "Late Night Mode" in Sounds & Haptics) that *lowers* loud peaks — keep it off for maximum volume.
Safety: cite **WHO safe listening** (e.g. "Make Listening Safe" / WHO-ITU H.870: ~80 dB for 40 hours/week for adults) and Apple's Hearing/Noise features. Link sources.

**iPhone equalizers + rival bass apps (checked 2026-10-23, support.apple.com and the iTunes lookup API, US store):**
- Apple Music EQ: Settings › Apps › Music › EQ ("Choose an equalization (EQ) setting"; Apple's guide iph5643d2c85 doesn't name the presets, so Bass Booster / Bass Reducer / Treble Reducer come from the older posts); "Off" turns it off (support.apple.com/en-us/102663). It changes only the Music app.
- Headphone Accommodations (102663): Settings › Accessibility › Audio & Visual › Headphone Accommodations; works with AirPods 2 and later, AirPods Pro, AirPods Max, EarPods, several Beats; Phone and Media switches; Customize Audio flow; Hearing Assistance on AirPods Pro 2/3 (iOS 18.1+) overrides it. AirPods Equalizer (Settings › AirPods › Audio & Routing › Equalizer, Custom = Low/Mid/High): see `airpods-bass`.
- Rival listings (descriptions only, no hands-on): Boom 3.87★/4,561 (7-day trial, subscription; 8/16-band EQ, 29 presets, Headphone EQ); Equalizer Fx 4.17★/27,992 (7-band, 15+ presets, custom presets, monthly/yearly subscription); Bass Booster Volume Boost EQ (Companjen, id 1475414196) 4.38★/19,219 (10-band, 20+ presets, cloud import, no price text); Bass Booster Volume Power Amp (AppRover, id 927920917) 4.29★/18,335 (one-tap bass, flanger, pitch; Pro subscription). EQfy 4.53★/40 on the same day.

**Voice Memos + podcast apps (read 2026-10-23, support.apple.com / support.spotify.com / help.audible.com):**
- Voice Memos playback options (guide `iphebbd067ce`): Enhance Recording ("reduce background noise and echo when you play Mono and Stereo recordings"), Skip Silence, speed slider, Studio Sound (Spatial Audio recordings only). Apple: these "don't affect the recording itself". Apple does **not** say whether an export includes them: don't claim it. No volume/gain control is listed.
- Export (`iph831c37815`): Share › Save to Files; default **.m4a** (layered recordings flattened, Spatial Audio becomes stereo); "Editable" = QuickTime Audio format (untested with EQfy, so the post says to keep the default). Share (`iph3d6dc359`): Rendered = single .m4a.
- Apple Podcasts (`iph3a22707a5`): volume bar in Now Playing (touch and hold, slide); **Enhance Dialogue** = speed button › Enhance Dialogue ("hear voices more clearly"; clarity, not volume).
- Spotify (`/us/article/volume-normalization/`): iOS profile picture › Settings and privacy › Playback › Volume level Loud/Normal/Quiet, "For: Premium"; described for songs, doesn't say if it applies to podcasts. Spotify's equalizer page mentions podcasts. Audible's "Listen in the app" page lists timers/skip intervals, no volume control.

**Volume drops + AI birthday song (checked 2026-10-24):**
- Apple, headphone notifications (`iph0596a9152`): after a notification about loud listening, "the next time you plug in your headphones or connect them using Bluetooth, your volume is automatically set to a lower level" (user can raise it); Health › Browse › Hearing › Headphone Notifications; Settings › Sounds & Haptics › Headphone Safety (Reduce Loud Audio, Headphone Notifications; may be on by default / not switchable by country).
- Apple, Attention Aware Features (support.apple.com/en-us/102216): "When attention is detected, your iPhone will lower the volume of your alerts" (alerts only, TrueDepth camera); Settings › Face ID & Passcode › Attention Aware Features. Sound Check (109331): evens loudness between songs. AirPods Conversation Awareness / Personalized Volume: see `airpods-louder`.
- Music Generator input (code `SongComposeView.swift`, `VBGuidenceView.swift`): free-text prompt (no limit in the UI), "Enter song name" (default "Track name", saved as `<name>.mp3` in the "Song Compose" playlist), Force instrumental. In-app guide: no lyrics → the model writes them; own lyrics → "the system arranges them into a musical form"; can ask for a length ("60-second track") and vocal entry ("vocals start at 15 seconds"); multilingual lyrics supported. How reliably a name is sung is **unverified**: never promise it.

## 7. Content format (for `src/content/<lang>/blog/<id>.html`)

```
---
{
  "slug": "make-iphone-louder-than-max-volume",
  "title": "How to Make Your iPhone Louder Than Max Volume",
  "description": "150–160 chars, includes the primary keyword, ends with a benefit.",
  "keyword": "how to make iphone louder than max",
  "category": "guide",
  "date": "2026-10-11",
  "updated": "2026-10-11",
  "image": "/assets/images/blog/iphone-duo/05-volume-booster.webp",
  "imageAlt": "EQfy Volume Boost dial set to 140% on iPhone",
  "related": ["volume-too-low", "airpods-louder", "safe-boosting"],
  "faq": [
    { "q": "Question?", "a": "Answer in 1–3 sentences. May contain <a href=\"{{post:eq-settings}}\">links</a>." }
  ]
}
---
<p class="lead">2–3 sentence direct answer to the search query (this is what AI search and snippets quote).</p>
<h2 id="short-id">…</h2>
…
```
- Front-matter is **strict JSON** (double quotes, no comments, no trailing commas). `category`: `"news"` (Duo only) or `"guide"`. `"pinned": true` only on `iphone-duo`.
- `title` ≤ **52 characters** (the template appends " | EQfy"); zh ≤ 26 characters. Contains the primary keyword. Avoid years in titles.
- `description` 140–160 characters (zh 60–80 characters).
- Body = HTML fragment. **No `<h1>`** (template renders it). `<h2>` with short ASCII `id`s, `<h3>` under them, no skipped levels. Allowed: `p ul ol li strong em a h2 h3 table thead tbody tr th td figure img figcaption blockquote` and `<div class="note">…</div>` (callout), `<div class="gallery">figures…</div>` (2–3 column image grid).
- Do **not** add an FAQ section or a final CTA/download box in the body — the template renders the front-matter `faq` (3–5 Qs, visible + FAQPage schema) and a CTA box automatically.
- Links: internal **only** via placeholders: `{{post:<id>}}` (another post in the same language), `{{blog}}`, `{{faq}}`, `{{home}}` (+ `#volume-booster`, `#equalizer`, `#spatial-audio`, `#ai-audio`, `#sound-control` anchors, e.g. `{{home}}#equalizer`), `{{appstore}}` (App Store link). External links: `target="_blank" rel="noopener"` — Apple Support, WHO etc. Link to 2–4 related posts in-text (see keyword-map internal-link clusters).
- Length (EN): 1,200–1,800 words (Duo post 700–1,000). Translations: same structure and facts, natural local phrasing + the localized primary keyword from `keyword-map.md`; localize image alts, captions, `slug`, `title`, `description`, `keyword`, FAQ.
- Tone: friendly, direct, expert; second person; short paragraphs; numbered steps for how-tos; one honest "what EQfy can't do" note where relevant. Mention the app naturally 2–4 times, not every paragraph.
- Typography: real characters (ä ö ü ß, ı İ ş ğ ç ö ü, ñ á é í ó ú ¿ ¡), curly apostrophes OK, Chinese full-width punctuation. Encode `&` as `&amp;` in HTML text.

## 8. Localized terminology (from the app's own UI — `Localizable.xcstrings`)

Use these names for in-app features so readers find the same words on screen. Brand names stay as is: EQfy, EQfy - Louder Volume, App Store, iPhone, iPhone Duo, AirPods, Premium.

| EN (app UI) | es | de | tr | zh-Hans |
|---|---|---|---|---|
| AI Studio | Estudio IA | KI Studio | YZ Stüdyo | 人工智能工作室 |
| Volume Boost | Potenciar Volumen / Aumento de volumen | Lautstärke-Boost | Ses Güçlendirme | 音量增强 |
| Bass Boost | Potenciar Graves / Potenciador de graves | Bass-Boost | Bas Güçlendirme | 低音增强 |
| Equalizer | Ecualizador | Equalizer | Ekolayzır (SEO keyword: ekolayzer) | 均衡器 |
| Headphones (tab) / Audio Balance | Auriculares / Balance de audio | Kopfhörer / Audio-Balance | Kulaklıklar / Ses Dengesi | 耳机 / 音频平衡 |
| 3D Audio / Spatial Audio | Audio 3D / Audio espacial 3D | 3D-Audio / 3D-Raumklang | 3D Ses / Uzamsal Ses | 3D音频 / 3D空间音频 |
| Reverb · 3D Source · Auto Motion | Reverberación · Fuente 3D · Movimiento automático | Hall · 3D-Quelle · Automatische Bewegung | Yankı · 3D Kaynak · Otomatik Hareket | 混响 · 3D音源 · 自动运动 |
| Center (balance) | Centro | Mitte | Merkez | 中央 |
| Custom · Reset | Personalizado · Restablecer | Benutzerdefiniert · Zurücksetzen | Özelleştirilmiş · Sıfırla | 自定义 · 重置 |
| Music Generator · Sound Effects · Text to Speech · Noise Reducer | Generador de canciones con IA · Efectos de sonido · Texto a voz · Reductor de ruido | KI-Songgenerator · Soundeffekte · Text-zu-Sprache · Rauschunterdrückung | Müzik Oluşturucu · Ses Efektleri · Metinden Sese · Gürültü Azaltıcı | 音乐生成器 · 音效 · 文字转语音 · 降噪器 |
| Force instrumental | Forzar instrumental | Instrumental erzwingen | Enstrümantal zorla | 强制纯音乐 |
| Music Library · Files · Find more | Biblioteca de música · Archivos · Encontrar más | Musikbibliothek · Dateien · Mehr finden | Müzik Kütüphanesi · Dosyalar · Daha fazla bul | 音乐库 · 文件 · 发现更多 |
| Presets: Rock, Jazz, Electronic, Classical, Reggae, Rap, R&B, Dance, Acoustic | Rock, Jazz, Electrónico, Clásico, Reggae, Rap, R&B, Danza, Acústico | Rock, Jazz, Elektronisch, Klassisch, Reggae, Rap, R&B, Tanz, Akustisch | Rock, Caz, Elektronik, Klasik, Reggae, Rap, R&B, Dans, Akustik | 摇滚、爵士、电子、古典、雷鬼、说唱、节奏布鲁斯、舞曲、原声 |
| Unlock Premium | Desbloquear Premium | Premium freischalten | Premium'u Aç | 解锁高级版 |

**Arabic (ar) — right-to-left** — from the app's own catalog (`Localizable.xcstrings`, ar values) and `ar-sa` Apple pages. Modern Standard Arabic, friendly and neutral (imperative forms like «افتح», «اضغط»; no gendered address). URL prefix `/ar`, `hreflang="ar"`, `<html lang="ar" dir="rtl">`, **English slugs** (like zh/ja), **Latin digits** (0-9; dates via `ar-u-nu-latn`), Arabic punctuation (، ؟ ؛), « » quotes. Brand names stay in Latin script: EQfy, EQfy - Louder Volume, App Store, iPhone, iPhone Duo, AirPods, Apple Music, Spotify, YouTube, Premium (may be followed by المميز once).
| EN (app UI) | ar |
|---|---|
| AI Studio · tab "AI" | استوديو الذكاء الاصطناعي · الذكاء الاصطناعي |
| Volume Boost / Bass Boost | تعزيز الصوت / تعزيز الجهير |
| Equalizer · EQ | معادل الصوت · EQ |
| Headphones (tab) / Audio Balance | سماعات الرأس / توازن الصوت |
| Spatial Audio (toggle) · 3D Audio · 3D Source · Auto Motion | الصوت المكاني · صوت ثلاثي الأبعاد · مصدر ثلاثي الأبعاد · حركة تلقائية |
| Reverb · Reverb Environment · Reverb Blend · Audio Mode · Dry / Wet | الصدى · بيئة الصدى · مزج الصدى · وضع الصوت · جاف / رطب |
| Center (balance) · Custom · Reset | الوسط · مخصص · إعادة تعيين |
| Music Library · Files · Find more | مكتبة الموسيقى · الملفات · اعثر على المزيد |
| Choose a Track · All My Music · Recent · Remove all my music · Playlists | اختر مقطعًا · جميع موسيقاي · الأخيرة · إزالة جميع موسيقاي · قوائم التشغيل |
| Home · Music · Settings (tabs) | الرئيسية · الموسيقى · إعدادات |
| Volume · Bass · Speed · Share (player) | الصوت · الجهير · السرعة · مشاركة |
| Sound Effects · Text to Speech · Noise Reducer (card names are English in the app, glosses only) | المؤثرات الصوتية · تحويل النص إلى كلام · مزيل الضوضاء |
| Generate Speech · Select Voice · Select Audio File · Remove Noise | إنشاء الكلام · اختر الصوت · اختر ملف صوتي · إزالة الضوضاء |
| Force instrumental · Unlock Premium | فرض موسيقى آلية · فتح المميز |
| Presets: Rock, Jazz, Electronic, Classical, Reggae, Rap, R&B, Dance, Acoustic | روك, جاز, إلكتروني, كلاسيكي, ريغي, راب, آر آند بي, رقص, صوتي |
**Bidi rules for writers:** use « ← » (not «→») in arrow strings; never write a leading `+` or `−` in running text (write «حتى 12 ديسيبل», not «+12 dB»; signed numbers are fine inside the EQ table cells, CSS isolates them); never use `&rlm;`/`&lrm;`/`&nbsp;` (the build's decoder doesn't know them); Latin product names in Arabic sentences are fine as they are.

**Japanese (ja)** — from the app's own catalog (`Localizable.xcstrings`, ja values) and `ja-jp` Apple pages. Tone: polite **です・ます**, no "あなた". URL prefix `/ja`, `hreflang="ja"`, **English slugs** (like zh: Japanese slugs can't be ASCII). Brand names stay in Latin script: EQfy, EQfy - Louder Volume, App Store, iPhone, iPhone Duo, AirPods, Apple Music, Spotify, YouTube, Premium.
| EN (app UI) | ja |
|---|---|
| AI Studio · tab "AI" | AIスタジオ · AI |
| Volume Boost / Bass Boost | 音量ブースト / 低音ブースト |
| Equalizer · EQ | イコライザー · EQ |
| Headphones (tab) / Audio Balance | ヘッドフォン / オーディオバランス |
| Spatial Audio (toggle) · 3D Audio · 3D Source · Auto Motion | 空間オーディオ · 3Dオーディオ · 3Dソース · 自動モーション |
| Reverb · Reverb Environment · Reverb Blend · Audio Mode · Dry / Wet | リバーブ · リバーブ環境 · リバーブブレンド · オーディオモード · ドライ / ウェット |
| Center (balance) · Custom · Reset | 中央 · カスタム · リセット |
| Music Library · Files · Find more | ミュージックライブラリ · ファイル · もっと見つける |
| Choose a Track · All My Music · Recent · Remove all my music · Playlists | トラックを選択 · すべてのマイミュージック · 最近 · すべてのマイミュージックを削除 · プレイリスト |
| Home · Music · Settings (tabs; catalog keys `home.title`, `music.title`, `settings.title`) | ホーム · ミュージック · 設定 |
| Volume · Bass · Speed · Share (player) | 音量 · 低音 · 速度 · 共有 |
| Sound Effects · Text to Speech · Noise Reducer (card names are English in the app, glosses only) | 効果音 · テキスト読み上げ · ノイズリダクション |
| Generate Speech · Select Voice · Select Audio File · Remove Noise | 音声を生成 · 音声を選択 · オーディオファイルを選択 · ノイズを除去 |
| Force instrumental · Unlock Premium | インストゥルメンタルを強制 · プレミアムをアンロック |
| Presets: Rock, Jazz, Electronic, Classical, Reggae, Rap, R&B, Dance, Acoustic | ロック, ジャズ, エレクトロニック, クラシック, レゲエ, ラップ, R&B, ダンス, アコースティック |

**Portuguese (pt = pt-BR)** — from the app's own catalog (`Localizable.xcstrings`, pt-BR values) and `pt-br` Apple pages. Tone: **você**. URL prefix `/pt`, `hreflang="pt"`, `<html lang="pt-BR">`. Brand names stay: EQfy, EQfy - Louder Volume, App Store, iPhone, iPhone Duo, AirPods, Premium.
**Two catalog values are plain mistranslations — do NOT copy them:** "Custom" shows as "Costume" (use **Personalizado**) and the "Rock" preset shows as "Rocha" (use **Rock**). Report as an app-side localization bug.
| EN (app UI) | pt-BR |
|---|---|
| AI Studio · tab "AI" | Estúdio IA · IA |
| Volume Boost / Bass Boost | Aumento de Volume / Aumento de Graves |
| Equalizer | Equalizador |
| Headphones (tab, key `headphones.title`) / Audio Balance | Fones de ouvido / Balanço de áudio |
| Spatial Audio (toggle) · 3D Audio · 3D Source · Auto Motion | Áudio espacial · Áudio 3D · Fonte 3D · Movimento automático |
| Reverb · Reverb Environment · Reverb Blend · Audio Mode · Dry / Wet | Reverberação · Ambiente de reverberação · Mistura de reverberação · Modo de áudio · Seco / Úmido |
| Center (balance) · Custom · Reset | Centro · Personalizado · Redefinir |
| Music Library · Files · Find more | Biblioteca de músicas · Arquivos · Encontrar mais |
| Choose a Track · All My Music · Recent · Remove all my music · Playlists | Escolha uma faixa · Toda a minha música · Recentes · Remover toda a minha música · Playlists |
| Home · Music · Settings (tabs) | Início · Música · Configurações |
| Sound Effects · Text to Speech · Noise Reducer (card names are English in the app, glosses only) | Efeitos sonoros · Texto para fala · Redutor de ruído |
| Generate Speech · Select Voice · Select Audio File · Remove Noise | Gerar fala · Selecionar voz · Selecionar arquivo de áudio · Remover ruído |
| Force instrumental · Unlock Premium · Speed · Share | Forçar instrumental · Desbloquear Premium · Velocidade · Compartilhar |
| Presets: Rock, Jazz, Electronic, Classical, Reggae, Rap, R&B, Dance, Acoustic | Rock, Jazz, Eletrônico, Clássico, Reggae, Rap, R&B, Dança, Acústico |

**French (fr)** — from the app's own catalog (`Localizable.xcstrings`, fr values) and `fr-fr` Apple pages. Tone: **vous** (the app itself says "Choisissez un titre"). Brand names stay: EQfy, EQfy - Louder Volume, App Store, iPhone, iPhone Duo, AirPods, Premium.
| EN (app UI) | fr |
|---|---|
| AI Studio | Studio IA |
| Volume Boost / Bass Boost | Boost du volume / Boost des basses |
| Equalizer | Égaliseur |
| Headphones (tab) / Audio Balance | Écouteurs (catalog key `headphones.title`; generic "headphones" in running text can be casque or écouteurs) / Balance audio |
| Spatial Audio (toggle) · 3D Source · Auto Motion | Audio spatial · Source 3D · Mouvement automatique |
| Reverb · Reverb Environment · Reverb Blend · Audio Mode | Réverbération · Environnement de réverbération · Mélange de réverbération · Mode audio |
| Center (balance) · Custom · Reset | Centre · Personnalisé · Réinitialiser |
| Music Library · Files · Find more | Bibliothèque musicale · Fichiers · Trouver plus |
| Choose a Track · All My Music · Recent · Remove all my music · Playlists | Choisissez un titre · Toute ma musique · Récents · Supprimer toute ma musique · Playlists |
| Sound Effects · Text to Speech · Noise Reducer (card names are English in the app, glosses only) | Effets sonores · Synthèse vocale · Réducteur de bruit |
| Generate Speech · Select Voice · Select Audio File · Remove Noise | Générer la parole · Sélectionner la voix · Sélectionner un fichier audio · Supprimer le bruit |
| Force instrumental · Unlock Premium | Forcer instrumental · Déverrouiller Premium |
| Presets: Rock, Jazz, Electronic, Classical, Reggae, Rap, R&B, Dance, Acoustic | Rock, Jazz, Électronique, Classique, Reggae, Rap, R&B, Danse, Acoustique |

**Danish (da)** — from the app's own catalog (`Localizable.xcstrings`, da values) and `da-dk` Apple pages. Tone: **du**. URL prefix `/da`, `hreflang="da"`, `<html lang="da">`, ASCII slugs (æ→ae, ø→oe, å→aa). Decimal comma (`0,5×`), `200 %` with a no-break space (U+00A0), »…« quotes. Apple's Danish names (da-dk pages): Settings › Sounds & Haptics = Indstillinger › Lyde & haptisk feedback; Headphone Safety = Sikker brug af hovedtelefoner; Voice Memos = **Memoer** (Danes still search "diktafon"); the Files app = **Arkiver** (EQfy's own import button says "Filer", so write "Filer (appen Arkiver)"). Brand names stay: EQfy, EQfy - Louder Volume, App Store, iPhone, iPhone Duo, AirPods, Apple Music, Spotify, Premium. The Danish homepage already uses Lydforstærker (Volume Booster), Basforstærker og EQ, 3D Spatial Lyd and AI Studio.
| EN (app UI) | da |
|---|---|
| AI Studio | AI Studio |
| Volume Boost / Bass Boost | Lydforstærkning / Basforstærkning |
| Equalizer · EQ | Equalizer · EQ |
| Headphones (tab, `headphones.title`) / Audio Balance | Hovedtelefoner / Lydbalance |
| Spatial Audio (toggle) · 3D Audio · 3D Source · Auto Motion | Spatial Lyd · 3D-lyd · 3D-kilde · Automatisk bevægelse |
| Reverb · Reverb Environment · Reverb Blend · Audio Mode | Rumklang · Rumklangmiljø · Rumklangblanding · Lydtilstand |
| Center (balance) · Custom · Reset | Center · Brugerdefineret · Nulstil |
| Music Library · Files · Find more | Musikbibliotek · Filer · Find mere |
| Choose a Track · All My Music · Recent · Remove all my music · Playlists | Vælg et nummer · Al min musik · Seneste · Fjern al min musik · Afspilningslister |
| Home · Music · Settings (tabs) | Hjem · Musik · Indstillinger |
| Volume · Bass · Speed · Share (player) | Lydstyrke · Bas · Hastighed · Del |
| Sound Effects · Text to Speech · Noise Reducer (card names are English in the app, glosses only) | Lydeffekter · Tekst til tale · Støjreduktion |
| Generate Speech · Select Voice · Select Audio File · Remove Noise | Generer tale · Vælg stemme · Vælg lydfil · Fjern støj |
| Force instrumental · Unlock Premium | Tving instrumental · Lås Premium op |
| Presets: Rock, Jazz, Electronic, Classical, Reggae, Rap, R&B, Dance, Acoustic | Rock, Jazz, Elektronisk, Klassisk, Reggae, Rap, R&B, Dans, Akustisk |

Tone: es = tú; de = du; tr = sen; zh = 你. Apple's own localized menu names (Settings › …) must match Apple's localized support pages — check support.apple.com/<locale>/… (e.g. es-es, de-de, tr-tr, zh-cn) and link those localized pages instead of the English ones where they exist.
