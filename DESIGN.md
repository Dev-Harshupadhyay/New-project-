# DESIGN.md — "Contact Sheet"

The visual world shipped in `index.html`. Written in Impeccable's order:
`PRODUCT.md` → visitor mode → visual world → craft floor.

## Mode

**Experience.** The visitor arrives for the work. The artifact leads from the first viewport and the
interface recedes: no chrome competing with the screenshots, no decorative section frames, no cards.
Where persuasion is needed it comes from evidence — live links, real screenshots, honest copy.

## The world

A **contact sheet**: the way a photographer's proofs are laid out. Hairline rules, index numbers in
the left margin, machine-typed labels, full-bleed proof images, and one loud ink-red mark doing all
the shouting. The red is pulled straight from the portrait's backdrop, so page and photograph are cut
from the same stock. The paper is a cool limestone grey with a faint grain, deliberately *not* the
warm cream that AI design reaches for by reflex.

## Palette

| Token | Value | Use |
|---|---|---|
| `--paper` | `#E7E8EA` | page ground — cool limestone, never pure white |
| `--paper-deep` | `#DCDDE0` | alternating band (About) |
| `--ink` | `#1A1B1D` | tinted near-black, never `#000` |
| `--ink-2` | `#44464A` | body copy |
| `--ink-3` | `#5D6064` | labels, meta — 5.16:1 on paper, 4.65:1 on the band |
| `--rule` | `rgba(26,27,29,.17)` | the entire grid is built on these hairlines |
| `--rule-strong` | `rgba(26,27,29,.33)` | image frames, chips |
| `--red` | `#D2202B` | the one mark: progress rule, pips, asterisks, hover |
| `--red-deep` | `#98131C` | red *text* at small sizes (7.04:1) |
| `--red-wash` | `#F0D8D6` | the grease-pencil underline, selection |

Red never fills an area. No gradients. No gray text on a coloured fill.

## Typography

- **Display — Gambetta** (400/500). A contemporary serif with real personality in the `a`, `y` and
  the numerals. Roman, not italic: the headings earn their voice from scale and rhythm.
- **Text — Switzer** (400/500/600). Tight, neutral, made for screens.
- **Meta — JetBrains Mono** (400/500). Index numbers, labels, chips, clock. Always uppercase,
  `letter-spacing .1–.14em`, and **never below 12px**.
- Fluid scale with `clamp()`. Body measure capped at `62ch`, leads at `46ch`. Tracking tightens as
  size grows (`-.015em` on display).

## Layout

12-column logic, `max-width: 1240px`, fluid gutters. Sections are numbered `01 – 04` in the left
margin, sharing the same three-column skeleton as the project rows
(`label | content | aside`), so the page reads as one sheet rather than a stack of blocks.
Proof images are indented `4vw` from the text column, are never cropped, and never centred.
Nothing is nested, nothing floats, nothing has a drop shadow except the sticky header once scrolled.

## Motion

One vocabulary: **reveal**. Elements rise `14px` and fade in on first intersection
(`cubic-bezier(.2,.7,.2,1)`, 620ms, 60ms stagger). The hero plays once on load. Hover shifts things
`2–4px`, or scales an image by `1.2%`. No bounce, no elastic, no parallax, no scroll-jacking,
no auto-scrolling marquee (the stack list is a static ledger). `prefers-reduced-motion: reduce`
removes all of it.

## Craft floor

- Tinted darks and cool paper only. No `#000`, no `#fff`, no pure gray.
- Every tap target ≥ 44px, verified in a headless pass.
- Every screenshot has descriptive alt text; decorative glyphs are `aria-hidden`.
- Skip link, single `h1`, no skipped heading levels, four landmarks.
- `:focus-visible` ring in `--red` on everything interactive.
- Real data in real elements: `<time>` for the live IST clock, `<dl>` for the fact list,
  `<article>` per project, JSON-LD `Person`.
- Self-hosted `.woff2` (Gambetta, Switzer, JetBrains Mono), ~127 KB total, `font-display: swap`.
- Real local time via `Intl.DateTimeFormat` with `Asia/Kolkata`. No decorative filler.

## Audit

`npx impeccable detect` on the shipped file: **60 of 62 rules pass.** The two remaining
`cramped-padding` notes are false positives on the two full-bleed `<section>` grounds — the detector
reads a coloured section ground as a container needing inset, while the inner `.wrap` already carries
the gutter (making the gutter a section padding would visibly inset the dark contact band from the
viewport edge, which is worse design). Zero low-contrast, undersized-text, or typography findings.

## Bans honoured

Inter / Roboto / system stack · purple-to-blue gradients · cards inside cards · rounded-square icon
tile above a heading · emoji as icons · three equal columns of generic features · "passionate about
clean code" copy · fake metrics · auto-playing carousels · hidden mobile nav · custom cursors ·
cream-by-reflex backgrounds · uppercase body passages · em-dash saturation.
