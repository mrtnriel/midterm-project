---
name: editorial-portfolio
description: Build single-page personal sites, portfolios, profile pages, fan pages, and landing pages in a "soft brutalist" print-magazine style - cream and charcoal monochrome, oversized serif display type, tiny uppercase mono labels, 1px grid borders, 0px radius, marquee ticker, masked scroll reveals, and hover-image list rows. Use this skill whenever the user asks for an editorial, magazine-style, brutalist, bento-grid, or "Awwwards-like" portfolio or personal site, shares a reference site or reconstruction brief in this style, or says things like "sharp corners", "huge serif heading", "1px lines", "ticker", or "dark footer with giant name" - even if they never say "editorial" or "brutalist".
---

# Editorial Portfolio

A design system and build recipe for one-page sites that look like a printed magazine spread: flat blocks, hairlines, and type that does all the visual work. It was distilled from a reference build (an idol-profile site) but is subject-agnostic. Swap in the user's own name, copy, and photography.

The look depends on **discipline, not decoration**. Almost every "improvement" an eager builder adds (a shadow, a rounded card, an accent color, a gradient) breaks it. When in doubt, remove something.

## Before building

Confirm or infer these from the conversation. Ask at most one question if something essential is missing; otherwise state your assumption and proceed.

1. **Subject**: whose site is it (name, role/tagline, a short bio)?
2. **Language of copy**: the reference used Indonesian labels with English accents. Match the user's language; keep section numbering ("01", "02") regardless.
3. **Stack**: default to a single `index.html` + `style.css` + `script.js` with no build step. Use React/Next.js + Tailwind + Framer Motion only if the user asks for it or already has that stack. Respect any constraint the user states (for example "vanilla JS only" or "no libraries").
4. **Assets**: portrait, a cutout (transparent PNG) for the hero if they have one, gallery images. If missing, use neutral placeholder blocks (flat `#D1D1D1` with a mono label), never stock-looking imagery or remote URLs.

## Page structure

Build in this order. Each section is a full-width horizontal band separated by a 1px border.

| # | Section | Theme | Summary |
|---|---------|-------|---------|
| - | Pre-loader | dark | 100vh, centered katakana/glyph, title, small loader; ~1.5s then cuts or fades to the page |
| - | Sticky nav | light | Logo left, section links right, 1px bottom border, small uppercase |
| - | Hero | light | Bento-style editorial grid with metadata corners, giant letter-spaced name layered behind a cutout image, bottom text blocks, marquee ticker at the base |
| 01 | Profile | light | 4/8 column split: portrait left; big greeting, body copy, metadata right |
| 02 | Activities | light | Full-width list rows separated by 1px lines; hover reveals a cropped image |
| 03 | Quote | dark | Full-width, moderate height, one large centered quote |
| 04 | Gallery | light | Row of portrait-oriented images separated by thin borders; hover scales image |
| 05 | Contact / footer | dark | Terminal-feel: big thank-you heading, social link grid, giant name at the very bottom |

Adapt the section list to the user's content (a developer might swap Activities for Projects and Gallery for Work), but keep the rhythm: light, light, light, **dark**, light, **dark**. The dark bands are deliberate visual breaks.

## Design tokens

Define these once on `:root` and use them everywhere. A single border variable keeps the grid lines consistent.

```css
:root {
  --paper: #F5F5F0;      /* light sections */
  --ink: #1A1A1A;        /* dark sections + text on light */
  --line-light: #1A1A1A; /* borders on light sections */
  --line-dark: #D1D1D1;  /* borders on dark sections (or a 20% paper tint) */
  --radius: 0px;

  --font-display: "Playfair Display", "PP Editorial New", "Ogg", Georgia, serif;
  --font-body: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono: "JetBrains Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace;

  --gutter: clamp(16px, 3vw, 40px);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
* { border-radius: 0; box-sizing: border-box; }
```

Rules that define the look:

- **Monochrome only.** No accent colors. Color enters only through photography.
- **Radius is 0 everywhere**: images, buttons, inputs, containers.
- **No shadows, no gradients, no blur.** Flat blocks and lines only.
- **Borders are exactly 1px.** Never 2px, never a faded alpha line on light sections.
- Dark sections invert: `background: var(--ink); color: var(--paper)`.

## Typography

Type is the main visual driver. The contrast in scale between display text and labels must be extreme.

- **Display** (hero name, section headings, list titles, quote): high-contrast serif, Regular or Italic, never bold. Hero name `10vw` to `15vw`, wide letter-spacing so the name reads like "M A R S H A". Section headings roughly `4vw` to `8vw`. Tight line-height (`0.9` to `1.05`).
- **Body**: clean sans, `1rem` to `1.125rem`, line-height `1.5`, standard weight, max line length around 60ch.
- **Labels and metadata**: mono or tracked sans, **always uppercase**, `0.75rem`, letter-spacing `0.05em` or more. Used for section numbers ("01"), nav links, dates, tags, list indices like "(01)".
- **Decorative glyphs**: katakana or other script characters are used as graphic elements in the pre-loader and hero. Only include them if they suit the subject; otherwise use a symbol or the subject's native script.

Load fonts from Google Fonts (`Playfair Display`, `Inter`, `JetBrains Mono`) with real fallback stacks. If the user has licensed PP Editorial New or similar, prefer that.

## Layout and grid

Use a 12-column CSS Grid for the hero and gallery, flexbox for nav and footer links.

- Profile: `grid-template-columns: 4fr 8fr` (portrait / text) with a 1px divider between.
- Hero: place metadata blocks in the top-left and top-right corners (event label, date, author). Center the giant name; layer the cutout image above it with `z-index` so the name sits **behind** the subject's head and shoulders. Bottom blocks hold short text (a "news" block and a "question" block). Draw each block with 1px borders so it reads as a bento grid.
- Every container edge is a line. If two blocks touch, they share one border, not two (use `border-right`/`border-top` on one side only, or `gap: 1px` over a line-colored background).

### Responsive behavior

- **1024px and up**: full 12-column grid.
- **768 to 1023px**: reduced margins; hero type scales via `vw`; Profile can drop to 50/50.
- **Under 768px**: stack everything. Hero image sits above or below the name. Nav collapses to a hamburger (a full-screen dark overlay menu with large serif links fits the style). Gallery becomes a single column or a horizontal scroll-snap carousel.
- Wide content (long hero name, tickers) must never cause horizontal page scroll; clip with `overflow: hidden` on the section.

## Motion

Motion is deliberate and physical, never bouncy. Use `--ease-out` and keep durations short.

| Effect | Spec |
|--------|------|
| Pre-loader | Dark screen, static text, ~1.5s, then fade or hard cut to the light page |
| Scroll reveal | Headings and text blocks translate up from an invisible mask and fade in, ~0.6s, ease-out, triggered once |
| Marquee | Infinite horizontal text strip, linear easing, constant slow speed, separator glyph like "✦" |
| List hover | Cropped image appears abruptly (~0.2s) next to the cursor or over the row |
| Gallery hover | Image scales to `1.05` inside a clipped (`overflow: hidden`) frame |
| Link-cell hover | Background fills solid (paper on dark), text color inverts |
| Smooth scroll | Lenis (or Locomotive) for heavy scroll physics; optional, skip if the user wants zero dependencies |

Always honor `prefers-reduced-motion: reduce`: disable the marquee animation, reveals, and scaling, and show content immediately.

## Component recipes

### Masked text reveal
Wrap each line in an `overflow: hidden` container and animate the inner element. This is what makes headings feel "printed in" rather than faded in.

```html
<h2 class="reveal"><span>Di atas panggung</span></h2>
```
```css
.reveal { overflow: hidden; }
.reveal > span { display: block; transform: translateY(100%); opacity: 0;
  transition: transform .6s var(--ease-out), opacity .6s var(--ease-out); }
.reveal.in > span { transform: none; opacity: 1; }
```
```js
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

### Marquee ticker
Duplicate the track content so the loop is seamless.

```css
.ticker { overflow: hidden; border-block: 1px solid var(--line-light); }
.ticker__track { display: flex; width: max-content; animation: scroll 30s linear infinite; }
.ticker__track span { padding: 0.75rem 1.5rem; font: 0.75rem var(--font-mono);
  text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
@keyframes scroll { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .ticker__track { animation: none; } }
```

### List row with hover image (Activities)
Structure: full-width row, `border-top` and `border-bottom` 1px, containing mono index "(01)", large serif title, and description. On `mouseenter`, show an absolutely positioned image; on `mousemove`, follow the cursor with a small offset; on `mouseleave`, hide. Use `pointer-events: none` on the image. On touch devices there is no hover, so show a small thumbnail inline in the row instead.

### Footer link grid
A row of links separated by 1px borders. Hover fills the cell with `--paper` and flips text to `--ink` (`transition: background .2s, color .2s`). Under the grid, set the subject's name at huge size (`18vw`+) cropped by the bottom edge of the page.

### Sticky nav
`position: sticky; top: 0`, background `var(--paper)` (so content does not show through), 1px bottom border, logo left, links right, all small uppercase tracked text. Highlight the current section with an underline or an inverted cell, not a color.

## Build workflow

1. Write the token and base CSS first (variables, reset, type scale, border utilities).
2. Build sections top to bottom with real content, one at a time. Keep section markup semantic (`<header>`, `<nav>`, `<section id>`, `<footer>`).
3. Add motion last: reveals, marquee, hover effects, then smooth scroll if wanted.
4. Test at 1440, 1024, 768, and 390px widths. Look for horizontal scroll, broken stacking, hero name overflow, and unreadable contrast on dark bands.
5. Run the fidelity checklist below before delivering.

For a single-page deliverable in chat, produce one self-contained `index.html` (inline CSS and JS, Google Fonts allowed) and present or publish it. For a project the user will keep developing, split into `index.html`, `css/style.css`, `js/main.js`, and `assets/`.

## Fidelity checklist

Before finishing, verify each item:

- [ ] Every corner is sharp (search the CSS for `radius`; it should only appear as `0`).
- [ ] No box-shadow, gradient, or accent color anywhere.
- [ ] All structural lines are 1px and use the border variables.
- [ ] Display serif text is huge and labels are tiny; the contrast is unmistakable.
- [ ] Section rhythm is light, light, light, dark, light, dark.
- [ ] Labels and nav are uppercase, tracked, and small.
- [ ] Reveals use the overflow-hidden mask technique, not a plain fade.
- [ ] Hover states exist for list rows, gallery images, and footer links.
- [ ] Reduced-motion users get a static, fully readable page.
- [ ] Mobile has no horizontal scroll, and the nav is usable.

## Accessibility

The style is high-contrast by nature, so keep it that way: body text at least 4.5:1, visible `:focus-visible` outlines (a 2px offset outline in `--ink` or `--paper`), alt text on photographs, `aria-label` on the hamburger button, and `aria-hidden="true"` on the duplicated ticker content. Do not rely on hover alone to convey information.

## Fidelity notes: what is certain and what is guessed

The reference was analyzed from video, so some values are estimates. Treat them as sensible defaults, not law:

- **Observed**: section order, light/dark theming, serif vs sans classification, hover behaviors, the continuous ticker.
- **Estimated**: exact fonts (PP Editorial New / Inter), exact hex values (`#F5F5F0`, `#1A1A1A`), animation timings (0.6s ease-out).
- **Inferred**: mobile breakpoints, stacking order, the underlying tech stack.

If the user supplies real brand fonts, colors, or timings, use theirs and keep everything else in this system.

## Anti-patterns

- Rounded "cards", pill buttons, or soft drop shadows.
- Adding a brand color for buttons or links "to make it pop".
- Bold sans headings in place of the huge regular-weight serif.
- Centered everything. The grid is asymmetrical; use the 4/8 split and corner metadata.
- Fading everything in uniformly. Reveals should be masked slides, and hover reveals should be abrupt.
- Remote placeholder images or scripts that may fail to load; use flat placeholder blocks instead.
