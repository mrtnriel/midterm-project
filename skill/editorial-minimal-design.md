---
name: editorial-minimal-design
description: Design and build web pages and UI in a warm, minimalist, editorial-startup style (think venture studio, accelerator, or founder-focused site). Cream background, near-black text, huge bold neo-grotesque headlines, secondary editorial serif for reading paragraphs (Libre Baskerville), sharp square-cornered buttons, hairline dividers, arrow glyphs, and generous whitespace. Use this skill whenever the user asks for a landing page, hero section, portfolio, startup or studio website, or "clean / minimal / editorial / serious / institutional / Y Combinator-style" design, or references a minimalist site they want to emulate, even if they don't name the style explicitly. Also use when restyling existing HTML/CSS/React to feel quieter, more confident, and more typographic.
---

# Editorial Minimal Design

A quiet, confident, typography-first aesthetic. It reads as institutional but modern, trustworthy and founder-focused rather than playful. The design does not shout: no gradients, no stock imagery, no accent colors, no decoration beyond a few arrow glyphs and hairlines. Hierarchy comes from **size, weight, and gray value**, never from effects.

## Core principles

1. **Typography does the heavy lifting.** A sharp typographic pairing: huge bold neo-grotesque headlines and structural UI elements (Inter) paired with an elegant, highly readable editorial serif (Libre Baskerville) for body paragraphs and narrative copy.
2. **Restraint.** Two tones plus a gray. If you are tempted to add a color, shadow, gradient, or icon, don't.
3. **Warm, not cold.** Off-white "paper" background instead of pure white; near-black instead of pure black.
4. **Sharp and utilitarian.** Square corners, thin borders, flat fills.
5. **Space is the luxury.** Generous padding, one strong left edge, lots of empty room around the hero.

## Design tokens

Use CSS custom properties so the palette stays consistent.

```css
:root {
  /* Color */
  --bg: #f6f2ea;          /* warm cream / off-white */
  --ink: #15130f;         /* near-black, slightly warm */
  --ink-muted: #55524b;   /* body / supporting text */
  --ink-subtle: #7a766d;  /* nav links, captions */
  --line: #d9d4c9;        /* hairline borders */

  /* Type */
  --font-sans: "Inter", "Helvetica Neue", Arial, system-ui, sans-serif;
  --font-serif: "Libre Baskerville", Georgia, Cambria, "Times New Roman", Times, serif;

  /* Layout */
  --container: 1400px;
  --gutter: clamp(20px, 5vw, 80px);
  --radius: 0;            /* always square */
}
```

If adapting to dark mode, invert to a warm near-black background (`#14120f`) with cream text (`#f3efe6`) and keep the same hairline approach. Do not introduce accent colors.

## Typography

| Role | Size | Weight | Font | Notes |
|---|---|---|---|---|
| Hero headline (h1) | `clamp(2.75rem, 7vw, 5.5rem)` | 700 | `--font-sans` | `letter-spacing: -0.03em; line-height: 1.05` |
| Section headline (h2) | `clamp(2rem, 4vw, 3.25rem)` | 600-700 | `--font-sans` | `letter-spacing: -0.02em; line-height: 1.1` |
| Subheadings / titles (h3) | `1.2rem-1.35rem` | 600 | `--font-sans` | `letter-spacing: -0.02em; line-height: 1.25` |
| Lead / subhead (p.lead) | `1.25rem-1.4rem` | 400 | `--font-serif` | `color: var(--ink-muted); line-height: 1.6; max-width: ~40-60ch` |
| Paragraphs & Lists (p, li) | `1rem-1.0625rem` | 400 | `--font-serif` | `line-height: 1.65-1.7` |
| Nav / buttons | `0.95rem-1rem` | 400 nav, 500 buttons | `--font-sans` | |
| Wordmark / Eyebrows | `0.85rem-1.1rem` | 500-600 | `--font-sans` | UPPERCASE, slight tracking |
| Metadata / Tech tags | `0.75rem-0.85rem` | 400-500 | `--font-sans` | |

Rules:
- **Tight tracking on big type** (negative letter-spacing) on sans-serif headlines is the signature move. Never track out large headlines.
- **Editorial serif for body copy:** Reading paragraphs, narrative body text, and lists (`p`, `li`, `.lead`, project summaries, experience details, tech stack items) use **Libre Baskerville** (`--font-serif`) for timeless editorial presence and comfortable reading.
- **Utilitarian sans for UI & metadata:** Headlines, navigation, buttons, wordmarks, kickers/eyebrows, dates, and badges use **Inter** (`--font-sans`).
- Headlines wrap naturally to 3 lines at desktop width; cap them with `max-width: ~18-20ch` per line feel (roughly 1100-1200px).
- Headlines are sentence case and end with a period. Write them as a declarative statement ("We provide X with a Y to build Z.").
- Use gray for supporting text rather than a lighter weight.
- Enable `-webkit-font-smoothing: antialiased`.

## Layout

- Content sits in a centered container (`max-width: var(--container)`) with side gutters. **Everything aligns to one left edge**: wordmark, headline, subtext, and buttons share the same x-position.
- Hero: tall, with large vertical padding (`clamp(96px, 16vh, 200px)` top and bottom). Headline, then a short lead paragraph, then a button row.
- Header: ~80px tall, wordmark left, nav centered, primary CTA right. Separated from the page by a 1px hairline.
- Sections are separated by full-bleed 1px hairlines (`border-top: 1px solid var(--line)`), not by background color changes.
- Prefer left-aligned text. Avoid centered hero text.
- Use CSS grid or flexbox with generous gaps (`gap: 16px` for button rows, `gap: 40px` for nav).

## Components

### Primary button
Solid near-black fill, cream text, square corners, trailing arrow.

```css
.btn {
  display: inline-flex; align-items: center; gap: 12px;
  padding: 18px 26px;
  font: 500 1rem var(--font-sans);
  border: 1px solid var(--ink);
  border-radius: 0;
  text-decoration: none;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}
.btn-primary { background: var(--ink); color: var(--bg); }
.btn-primary:hover { background: transparent; color: var(--ink); }
.btn-secondary { background: transparent; color: var(--ink); border-color: var(--ink); }
.btn-secondary:hover { background: var(--ink); color: var(--bg); }
```

Use the `→` character (not an icon library) as the arrow: `Apply to Join the Studio →`. Pair one primary and one secondary button side by side in the hero, with a ~16px gap. The header CTA is a slightly smaller primary button.

### Navigation
Plain text links in `--ink-subtle`, no underlines, no pills. On hover, shift to `--ink`. Keep to 5-6 short single-word items (Studio, Talent, Partners, About, Insights, Contact).

### Hairline dividers
`1px solid var(--line)`. Used under the header, between sections, and around the outlined button. Never use shadows or cards with rounded corners.

## Reference skeleton

```html
<header class="site-header">
  <div class="container header-row">
    <a class="wordmark" href="/">BRAND NAME</a>
    <nav><a href="#">Studio</a><a href="#">Talent</a><a href="#">About</a></nav>
    <a class="btn btn-primary" href="#">Apply to Join <span>→</span></a>
  </div>
</header>

<main>
  <section class="hero container">
    <h1>We provide founders with a platform to build global companies.</h1>
    <p class="lead">One or two sentences of plain, factual context about who you are.</p>
    <div class="actions">
      <a class="btn btn-primary" href="#">Primary action <span>→</span></a>
      <a class="btn btn-secondary" href="#">Secondary action <span>→</span></a>
    </div>
  </section>
</main>
```

```css
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
p, li { font-family: var(--font-serif); }
.container { max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); }
.site-header { border-bottom: 1px solid var(--line); }
.header-row { display: flex; align-items: center; justify-content: space-between; height: 80px; }
.wordmark { font-weight: 600; letter-spacing: 0.01em; color: var(--ink); text-decoration: none; }
nav { display: flex; gap: 40px; }
nav a { color: var(--ink-subtle); text-decoration: none; }
nav a:hover { color: var(--ink); }
.hero { padding-block: clamp(96px, 16vh, 200px); }
.hero h1 { font-size: clamp(2.75rem, 7vw, 5.5rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; max-width: 20ch; margin: 0 0 32px; }
.lead { font-size: 1.3rem; line-height: 1.6; color: var(--ink-muted); max-width: 40em; margin: 0 0 40px; }
.actions { display: flex; gap: 16px; flex-wrap: wrap; }
```

On mobile, collapse the nav into a simple menu button or stack it, keep the headline large (it should still dominate), and let the buttons stack full-width.

## Do

- Use **Inter** (Google Fonts) for headlines, navigation, and structural UI, paired with **Libre Baskerville** (Google Fonts) for paragraphs and editorial narrative copy.
- Keep copy plain, declarative, and confident. Short sentences. No hype words or emoji.
- Let one headline and one CTA pair define each section.
- Keep contrast high for headings and accessible for gray text (check `--ink-muted` against `--bg` is at least 4.5:1).
- Provide visible `:focus-visible` outlines (e.g. `outline: 2px solid var(--ink); outline-offset: 3px`) since the design is otherwise flat.

## Don't

- No gradients, glassmorphism, drop shadows, glows, or blurred blobs.
- No rounded corners, pill buttons, or card-with-shadow patterns.
- No accent colors, colorful icons, or illustration sets.
- No centered, all-caps, or letter-spaced-out headlines.
- No stock photography in the hero. If imagery is needed later, use black-and-white or heavily restrained photos placed below the fold.
- No heavy animation. At most a subtle fade or color transition on hover (~150ms).

## Extending the style to other sections

- **Feature/pillar list:** a hairline-separated grid of 2-4 columns; each item has a small uppercase label (`0.8rem`, `--ink-subtle`, tracked slightly), a bold short title, and 1-2 lines of muted body text.
- **Stats:** very large numerals (same bold, tight-tracked sans), small muted caption beneath.
- **Logos / partners:** plain text wordmarks or grayscale logos in a single row between hairlines.
- **Footer:** same cream background, hairline on top, small muted links in columns, wordmark on the left.
- **Forms:** square inputs with a 1px `--ink` border, no radius, label above in `--ink-subtle`, same primary button.
