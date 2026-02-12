# Landing Page Implementation Plan

## Tasks

- [x] 1. Copy 10 screenshots from Downloads to `assets/images/screenshots/` (01.png → screenshot-1.png, etc.)
- [x] 2. Replace `index.html` with the full landing page template from `volume-booster-landing-v2.html`
- [x] 3. Update screenshot placeholders in the HTML with actual `<img>` tags pointing to the copied images
- [x] 4. Map screenshot #1 (Discover Music) to the hero phone mockup
- [x] 5. Update the screenshot grid to use all 10 screenshots with correct captions matching each image
- [x] 6. Added 10th screenshot slot in the grid (was commented out)
- [x] 7. Create placeholder `privacy.html` page
- [x] 8. Create placeholder `terms.html` page
- [x] 9. Verify all links, image paths, and structure are correct

## Screenshot Mapping (for the screenshots grid section)

| Slot | File | Title | Subtitle |
|------|------|-------|----------|
| 1 | screenshot-1.png (01) | Discover Music | Boost volume, and explore new tracks |
| 2 | screenshot-2.png (02) | Volume Booster | Boost volume and enhance bass |
| 3 | screenshot-6.png (06) | Bass Booster | Deep bass & Haptic beats |
| 4 | screenshot-8.png (08) | AI Sound Amplifier | Amplify sound with AI precision |
| 5 | screenshot-4.png (04) | Hearing Aid Equalizer | Personalize sound with precision EQ |
| 6 | screenshot-5.png (05) | Offline Music Player | Download & Share. Explore speed control |
| 7 | screenshot-3.png (03) | AI Song Generator | Music maker with AI |
| 8 | screenshot-9.png (09) | Sound Control | Fine-tune left and right channel |
| 9 | screenshot-10.png (10) | 3D Audio | Immersive audio experience |
| 10 | screenshot-7.png (07) | Full Audio Power | Unlock the full power of your audio |

## Hero Phone Mockup
- Use screenshot-1.png (Discover Music / Library screen) for the hero phone mockup

## Notes
- All CSS and JS stays inline in the single HTML file
- Screenshots are full App Store promo images (with titles/backgrounds), not raw app screenshots
- The template already has proper SEO, schema.org, responsive design, animations

## Review

### Changes Made
1. **index.html** — Replaced the simple stub with the full landing page from `volume-booster-landing-v2.html`. Updated hero phone mockup and all 10 screenshot grid slots to use real images. Zero placeholders remain.
2. **assets/images/screenshots/** — Copied and renamed all 10 screenshots from Downloads (01.png→screenshot-1.png, etc.)
3. **privacy.html** — Created placeholder Privacy Policy page with matching dark theme styling
4. **terms.html** — Created placeholder Terms of Use page with matching dark theme styling

### File Structure
```
index.html                          — Full landing page (single-file: CSS+JS inline)
privacy.html                        — Privacy Policy placeholder
terms.html                          — Terms of Use placeholder
assets/images/screenshots/          — 10 app promo screenshots
  screenshot-1.png through screenshot-10.png
```

### Screenshot Mapping
Screenshots were mapped to grid slots based on their actual content (not just filename order) to ensure captions match the images correctly. Screenshot #7 (promo/hero image) was placed as the 10th grid item.
