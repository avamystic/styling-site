# Ava Sharbaf — Identity Stylist

Personal website for Ava Sharbaf, identity stylist, NYC.
Single-page scrolling site built with plain HTML, CSS, and JavaScript. No build step required.

---

## Before You Deploy

Complete the two required placeholders in the code:

**1. Formspree endpoint** — in `script.js` line with `'https://formspree.io/f/YOUR_FORM_ID'`
→ Create a form at [formspree.io](https://formspree.io), copy your form ID, replace `YOUR_FORM_ID`.

**2. Calendly link** — two places in `index.html` (`https://calendly.com/YOUR_LINK`)
→ Replace with your actual Calendly URL.

**3. Add your photos** — place these files in `/images/optimized/`:
- `hero.jpg` + `hero.webp` — hero background (recommend portrait or editorial full-bleed, focal top 20%)
- `about.jpg` + `about.webp` — your portrait (tall/portrait crop)
- `detail-1.jpg` + `detail-1.webp` — styling detail or accent image
- Originals can stay in `/images/`; optimized versions serve from `/images/optimized/`

**4. Social links** — update the `#` href values in the footer (`index.html`) with your real Instagram and LinkedIn URLs.

**5. Open Graph image** — the OG and Twitter card meta tags reference `/images/optimized/hero.jpg`. Make sure this image is square-friendly (1200×630) for best social previews.

---

## Running Locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Deploy to Cloudflare Pages

### First deploy

1. Push this repository to GitHub (or GitLab):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Create a project**.

3. Connect your GitHub account and select this repository.

4. Under **Build settings**:
   - **Framework preset**: None
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/` (root, or just leave blank)

5. Click **Save and Deploy**. Cloudflare will deploy within seconds.

### Connect your custom domain

1. In your Cloudflare Pages project, go to **Custom domains** → **Set up a custom domain**.
2. Enter your domain (e.g., `avasharbaf.com`).
3. If your domain is already on Cloudflare DNS (recommended), the CNAME record is added automatically.
4. If your domain registrar is external, add a CNAME record pointing to `YOUR_PROJECT.pages.dev`.
5. For the root/apex domain, Cloudflare handles flattening automatically—no `www` required.
6. SSL is provisioned automatically (usually within a few minutes).

### Subsequent updates

Push to the `main` branch and Cloudflare Pages redeploys automatically.

---

## File Structure

```
/
├── index.html          — all page content (one file)
├── styles.css          — all styles (CSS custom properties)
├── script.js           — nav, animations, form handling
├── favicon.svg         — monogram favicon
├── _headers            — Cloudflare Pages security headers
├── images/
│   └── optimized/      — web-ready WebP + JPG images (add yours here)
└── README.md
```
