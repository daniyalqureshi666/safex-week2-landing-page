# SafeX VAPT Landing Page — v2 (Deployable Lead-Capture Build)

**Author:** Daniyal Hussain Qureshi
**Project:** SafeX Solutions Internship — Week 2 Task
**Live URL:** [https://safex-week2-landing-page.vercel.app](https://safex-week2-landing-page.vercel.app/)
**GitHub Repo:** [github.com/daniyalqureshi666/safex-week2-landing-page](https://github.com/daniyalqureshi666/safex-week2-landing-page/tree/main)

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

## Configuration (Already Live in This Deployment)

Both integrations below are already configured and confirmed working in the
deployed version — included here for reference and for anyone redeploying
this project from scratch.

1. **Formspree**
   - Form endpoint is wired into `Source Code/index.html`
     (`action="https://formspree.io/f/xrpzrdrp"`).
   - Verified: test submissions are received by email and appear in the
     Formspree dashboard.
   - To reuse this project elsewhere, create your own form at
     [formspree.io](https://formspree.io) and swap in your endpoint.

2. **Google Analytics (GA4)**
   - GA4 (`gtag.js`) is loaded in `<head>` with a live Measurement ID.
   - Verified: GA's **Realtime** report shows pageviews and the
     `generate_lead` event firing on successful form submission.
   - To reuse this project elsewhere, create your own GA4 property at
     [analytics.google.com](https://analytics.google.com) and swap in your
     Measurement ID (replace both occurrences in `index.html`).

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

## Testing Checklist (Week 2 Step 5) — Completed

- [x] Chrome (desktop) — form submits, nav/menu/FAQ interactions work
- [x] Firefox (desktop) — same checks; `fetch` submission and CSS
      Grid/Flexbox rendering match Chrome
- [x] Mobile Safari (iOS) — mobile nav toggle, tap targets, viewport scaling,
      and form keyboard behavior all confirmed working
- [x] Lighthouse (on the **live production URL**) — all four categories
      passing 90+:

  | Category       | Score |
  |----------------|-------|
  | Performance    | 95    |
  | Accessibility  | 96    |
  | Best Practices | 96    |
  | SEO            | 100   |

  Note: an early Lighthouse run was affected by Vercel's Deployment
  Protection auth wall blocking the crawler, and a malformed HTML block in
  the footer (an unmatched closing tag around the social icons). Both were
  fixed before the final run above.

## A/B Testing (Week 2 Step 3)

The hero headline, subtext, and primary CTA each have two copy variants for
A/B testing:

- **Variant A** (default): `https://safex-week2-landing-page.vercel.app/`
  — risk/fear-based framing: *"Protect Your Business Before Attackers Find
  the Weaknesses"*
- **Variant B**: `https://safex-week2-landing-page.vercel.app/?v=b`
  — free-offer/urgency framing: *"Find Your Vulnerabilities Before Hackers
  Do — Free Scan Included"*

Viewing Variant B also logs an `ab_variant_view` event in GA4, so traffic
split between the two URLs can be compared by lead-conversion rate
(`generate_lead` events) directly in Google Analytics.

## Notes

- The form has a native `action`/`method` as a progressive-enhancement
  fallback — if JavaScript fails to load, the browser still POSTs directly to
  Formspree.
- No secrets or API keys are needed client-side; Formspree and GA4 are both
  designed for public frontend use with the IDs above.