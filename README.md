# SafeX VAPT Landing Page — v2 (Deployable Lead-Capture Build)

## Overview

A responsive, single-page landing site for SafeX Solutions' VAPT (Vulnerability
Assessment and Penetration Testing) service line. Built as a static site with
a real form backend and analytics, so it is ready to deploy and start
capturing leads immediately — no server to maintain.

This is the Week 2 upgrade of the Week 1 prototype: the contact form now
submits to a live backend, visits and submissions are tracked in Google
Analytics, and the hero copy has an A/B-ready second variant.

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — Flexbox/Grid layout, CSS custom properties for the SafeX brand
  palette
- **Vanilla JavaScript** — no framework, no build step
- **[Formspree](https://formspree.io)** — form backend (email notification +
  dashboard, no server code)
- **Google Analytics 4 (gtag.js)** — pageview + event tracking
- **Vercel** — static hosting / deployment

## Project Files

```
Source Code/
├── index.html      # Structure, GA4 snippet, form markup, A/B data-attributes
├── style.css        # Styling (brand tokens live in :root)
├── script.js         # Nav, animations, form validation + submission, A/B switch
└── vercel.json        # Static hosting config (clean URLs)
```

## What's New in v2

1. **Real form backend (Formspree)** — the contact form POSTs to a Formspree
   endpoint via `fetch()`. Successful/failed submissions are handled with
   inline status messages; the button disables while sending to prevent
   double-submits.
2. **Analytics** — GA4 is loaded in `<head>`. A `generate_lead` event fires on
   successful form submission (with the selected service as a parameter), and
   a `form_submit_error` event fires on failure, so both conversions and drop
   -offs are visible in GA.
3. **A/B-ready hero copy** — the hero `<h1>`, subtext, and primary CTA each
   carry `data-variant-a` / `data-variant-b` attributes. Appending `?v=b` to
   the URL swaps in the alternate copy and logs an `ab_variant_view` GA event,
   so you (or a tool like GrowthBook / a simple 50/50 redirect) can run a real
   test without touching markup again.
4. **Branding** — logo and brand colors carried over from Week 1's design
   tokens (`--color-primary`, `--color-secondary`, etc. in `style.css`);
   favicon placeholder added, pointing at the same logo asset until an
   official favicon file is supplied.

## Setup — Before You Deploy

1. **Formspree**
   - Create a free account at [formspree.io](https://formspree.io) and add a
     new form.
   - Copy your form endpoint (`https://formspree.io/f/xxxxxxxx`).
   - In `Source Code/index.html`, replace:
     ```html
     action="https://formspree.io/f/YOUR_FORM_ID"
     ```
     with your real endpoint.
   - Submit a test entry once live and confirm it appears in your Formspree
     dashboard / inbox.

2. **Google Analytics**
   - Create a GA4 property at [analytics.google.com](https://analytics.google.com)
     and copy its Measurement ID (format `G-XXXXXXXXXX`).
   - In `Source Code/index.html`, replace **both** occurrences of
     `G-XXXXXXXXXX` with your real ID.
   - After deploying, use GA's **Realtime** report to confirm pageviews and
     the `generate_lead` event are recording.

## Run Locally

No build tools or dependencies required — it's a static site.

```bash
cd "Source Code"

# Option 1: just open it
open index.html            # macOS
start index.html           # Windows

# Option 2: serve it (recommended, avoids form/fetch CORS quirks)
npx serve .
# or
python3 -m http.server 5500
```

Then visit `http://localhost:5500` (or whichever port your server prints).

## Deploy to Vercel

```bash
npm install -g vercel        # one-time
cd "Source Code"
vercel                        # follow prompts, deploy to preview
vercel --prod                 # promote to production
```

Or via the Vercel dashboard: **New Project → Import Git Repository**, point it
at the repo, set the root directory to `Source Code/`, and deploy — no build
command needed since this is a static site.

## Testing Checklist (Week 2 Step 5)

- [ ] Chrome (desktop) — form submits, nav/menu/FAQ interactions work
- [ ] Firefox (desktop) — same checks; verify `fetch` submission and
      CSS Grid/Flexbox rendering match Chrome
- [ ] Mobile Safari (iOS) — mobile nav toggle, tap targets, viewport scaling,
      and form keyboard behavior (especially `<select>` and `type="email"`)
- [ ] Lighthouse (on the **live** URL, not localhost) — Performance,
      Accessibility, Best Practices, SEO all ≥ 90

## Notes

- The form has a native `action`/`method` as a progressive-enhancement
  fallback — if JavaScript fails to load, the browser still POSTs directly to
  Formspree.
- No secrets or API keys are needed client-side; Formspree and GA4 are both
  designed for public frontend use with the IDs above.
