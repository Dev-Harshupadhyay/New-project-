# Harsh Upadhyay — portfolio (v3, "Contact Sheet")

A static site in plain HTML, CSS and JavaScript. No framework, no build step required, no CDN.
Open `index.html` and it runs — online or off.

```
new-portfolio/
├── index.html              # markup only, commented section by section
├── css/
│   └── style.css           # the whole design system, 00 → 13, commented
├── js/
│   └── main.js             # reveal, header, clock, copy-email — commented
├── assets/
│   ├── profile.webp        # portrait, 760×950, 54 KB
│   └── projects/           # live-app screenshots, 1200px wide, WebP
│       ├── cinevood.webp   # 58 KB
│       ├── tarazu.webp     # 23 KB
│       └── climatek.webp   # 32 KB
├── fonts/                  # self-hosted woff2: Gambetta, Switzer, JetBrains Mono
├── tools/
│   └── build.py            # inlines everything into single-file.html
├── single-file.html        # portable build: 438 KB, zero network requests
├── PRODUCT.md              # durable product truth (Impeccable init output)
├── DESIGN.md               # the visual system this page implements
└── vercel.json             # static deploy config
```

## Run it locally

```bash
cd new-portfolio
python3 -m http.server 8080
# open http://localhost:8080
```

Double-clicking `index.html` also works — nothing is fetched from the network.

## The two builds

| | `index.html` (split) | `single-file.html` (portable) |
|---|---|---|
| Requests | 11 (css, js, 6 fonts, 3–4 images) | **1** (the document itself) |
| Fonts & images | separate files, cached forever | inlined as base64 data URIs |
| Use for | the real deploy | emailing, sharing, one-off uploads |

Rebuild the portable file after any edit:

```bash
python3 tools/build.py     # → single-file.html
```

Both builds are pixel-identical (verified: one 9×10px diff, the ticking clock).

## Deploy

**Vercel** — drag-and-drop the folder, or:

```bash
npm i -g vercel
cd new-portfolio
vercel --prod
```

**Netlify** — drag the folder onto <https://app.netlify.com/drop>.
`vercel.json` is ignored there and harmless.

**GitHub Pages** — push, then Settings → Pages → deploy from `main` / root.

After the first deploy, update two absolute URLs in `index.html` if the domain changes:
`<link rel="canonical">` and `og:image` (currently relative — make it
`https://your-domain/assets/projects/cinevood.webp` so social cards render).

## What to edit

| You want to change | Where |
|---|---|
| Name, role, availability | `index.html` → `.hero` |
| Email (4 places + JSON-LD) | search `harsh48227@gmail.com` |
| A project | one `<article class="project">` block: title, desc, chips, live URL, `<img>` |
| A project screenshot | drop a 1200px-wide file in `assets/projects/`, update the `<img>` `width`/`height` |
| About copy | `.about__body` paragraphs + the three `.lists` columns |
| Certifications | `.creds` — one `<article class="cred">` per row |
| Colours, type scale, spacing | `css/style.css` → `:root` tokens (section 01) |
| Fonts | `fonts/` + the `@font-face` block (section 00). If you swap a file, update the `url()` path (`../fonts/…`) |
| Contact form link | the `https://tally.so/r/QKpNqX` button in `.contact__actions` |
| Motion | `css/style.css` section 13 + `js/main.js` section 1 |

## Built-in behaviour

- Sticky header hides on scroll-down, returns on scroll-up, gains a shadow once scrolled.
- 2px red reading-progress rule across the top (one element, GPU-scaled).
- Live local time in IST via `Intl.DateTimeFormat` — real, not decorative.
- "Click to copy" on the email, with a `mailto:` fallback when the clipboard API is unavailable.
- Scroll-reveal via `IntersectionObserver`, staggered, fully disabled under
  `prefers-reduced-motion: reduce`.
- Works with JavaScript disabled: every link and the whole layout are intact.

## Quality gates passed

- **Impeccable detector: 60/62 rules clean**, on both builds. The two remaining are false-positive
  `cramped-padding` notes on the full-bleed section grounds — see `DESIGN.md` § Audit.
- Contrast: every text pair ≥ 4.5:1 on both paper tones (lowest 4.65:1).
- No horizontal overflow at 390px or 1440px; verified with headless screenshots at both widths.
- Every tap target ≥ 44px, verified in a headless pass.
- One `h1`, no skipped heading levels, alt text on all screenshots, JSON-LD `Person`.
- Zero console errors on both builds.

## Notes for the next iteration

- Project links point at the deployments listed on `pmharshuu.netlify.app`. If a URL changes
  (Render cold starts, Netlify renames), update the three `href`s.
- Tarazu's domain is spelled `tarzau.netlify.app` on the old site while the project is called
  "Tarazu" — confirm which spelling is real.
- ClimaTek's screenshot is branded "ATMOSPHERA" internally. If the product was renamed, the caption
  and copy should follow.
