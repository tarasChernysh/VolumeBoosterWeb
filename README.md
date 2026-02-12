# Volume Booster — Website

SEO-optimized landing page for [Louder Volume & Sound Amplifier](https://apps.apple.com/app/id6670594196) iOS app.

Hosted on GitHub Pages.

## Setup

### 1. Create GitHub Repository

```bash
# Create a new repo on GitHub named: volume-booster
# Then locally:
cd volume-booster-site
git init
git add .
git commit -m "Initial commit: site structure"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/volume-booster.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to **Settings** → **Pages** in your repo
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes — your site will be live at `https://YOUR_USERNAME.github.io/volume-booster/`

### 3. Update App Store Connect

1. Go to **App Store Connect** → your app → **App Information**
2. Set **Marketing URL** to your GitHub Pages URL
3. Save

### 4. Verify app-ads.txt

After deploying, verify the file is accessible:
```
https://YOUR_USERNAME.github.io/volume-booster/app-ads.txt
```

### 5. (Optional) Custom Domain

If you buy a domain later:
1. Add a `CNAME` file with your domain name
2. In repo **Settings** → **Pages** → **Custom domain** → enter your domain
3. Configure DNS at your registrar (A records or CNAME)
4. Enable **Enforce HTTPS**

## Structure

```
/
├── index.html              # Main landing page (EN)
├── app-ads.txt             # AdMob ads.txt
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine directives
├── .gitignore
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── images/             # Screenshots, icons, OG images
    └── js/
        └── main.js
```

## SEO Checklist

- [x] Semantic HTML5 structure
- [x] Meta descriptions per page
- [x] Open Graph & Twitter Card tags
- [x] Schema.org SoftwareApplication markup
- [x] Apple Smart App Banner meta tag
- [x] hreflang tags for localized versions
- [x] sitemap.xml
- [x] robots.txt
- [x] app-ads.txt for AdMob
- [ ] Google Search Console verification
- [ ] Localized pages (TR, DE, DA, FR)
- [ ] Feature-specific landing pages
