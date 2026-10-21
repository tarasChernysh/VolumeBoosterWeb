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
| Live version | 2.2.22. **v2.2.23 is NOT released yet** → write "coming in v2.2.23" / "the next update" |
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

**AI Studio** (needs internet): **Music Generator** (song compose from a text prompt, optional "Force instrumental", song name), **Sound Effects**, **Text to Speech**, **Noise Reducer**. Credit-based: Premium includes Music Generator, Sound Effects and Text to Speech; **Noise Reducer always uses credits** (also for subscribers). Do NOT mention "Voice Enhancer"/"AI audio enhancement" (hidden since v2.2.22).

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

## 3. Hard limits — NEVER claim

1. **EQfy cannot boost other apps** (Spotify, YouTube, Apple Music streaming, Netflix), **phone/FaceTime calls**, notifications or system volume. iOS sandboxing only lets EQfy process audio **played inside EQfy**. Say this plainly wherever loudness is discussed — it builds trust.
2. Not a hearing aid / medical device. Never "hearing aid", "treats hearing loss", "doctor-approved". Hearing-related content: point to Apple's Headphone Accommodations / hearing features and to a hearing professional.
3. No "Made for iPhone" / "MFi" (Apple trademark). Use "built for / optimized for iPhone Duo".
4. No user counts ("thousands of users", "10k+"), no testimonials, no invented stats, no "#1".
5. No "prevents distortion/damage" guarantees → "helps", "reduce", "use moderately".
6. Not Apple Spatial Audio / Dolby Atmos — EQfy's 3D Audio is its own in-app reverb + 3D positioning effect.
7. Don't promise features not listed here (no widgets, no Mac app, no Android, no system-wide EQ).
8. Apple trademarks: iPhone, AirPods, Apple Music, App Store, iPhone Duo are Apple's. Don't imply Apple endorsement.

## 4. iPhone Duo (post `iphone-duo`) — coming in v2.2.23

What v2.2.23 brings (from `ReleaseNotes.md` + Swift code):
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

Tone: es = tú; de = du; tr = sen; zh = 你. Apple's own localized menu names (Settings › …) must match Apple's localized support pages — check support.apple.com/<locale>/… (e.g. es-es, de-de, tr-tr, zh-cn) and link those localized pages instead of the English ones where they exist.
