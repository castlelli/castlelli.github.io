# castelli · brand guidelines

Version 1.0, 2026-11-16. This file is the source of truth for the identity. `DESIGN.md` (site tokens) and `src/styles/tokens.css` follow it.

## 1. Positioning

Vinicius Castelli is a founder-researcher building across **genomics software, embedded hardware and health**. The brand has to hold science, industry and health at equal weight and be judged in seconds by two audiences: research evaluators (lab heads, graduate programs) and founders, investors and industry.

The proof is the work. Every claim points to an artifact with a link, a number or an honest status ("in preparation", "live", "in progress"). The identity is bold in colour and quiet in everything else.

## 2. Wordmark

- Lowercase **castelli**, set in Funnel Display 700 with tracking at −0.03 em.
- The i is a dotless ı carrying a **square dot**, 0.17 em wide, aligned to the top of the original i-dot.
- There is no separate symbol. The wordmark is the logo.
- The **favicon** is a white `c` with the square, on ultramarine.

**Dot colour depends on the ground:**

| Ground | Letters | Dot |
|---|---|---|
| Ultramarine | White | Fluorescein |
| Ink | Raised `#F2F1ED` | Fluorescein |
| Plaster, paper, white | Ink | Ultramarine |

Fluorescein on plaster is 1.11 : 1, so the dot changes to ultramarine there.

**Files:**
- `public/brand/castelli.svg` (on light)
- `public/brand/castelli-on-ultramarine.svg`
- `public/brand/castelli-on-ink.svg`
- `public/favicon.svg`

All are outlined, so they need no installed font.

**Clear space** is the height of the square on every side. **Minimum size** is 72 px wide on screen and 18 mm in print. Below that, use the favicon.

**Don't:**
- recolour individual letters;
- outline the letters;
- swap the square for a round dot;
- capitalise;
- add a symbol, tagline lock-up or effects.

## 3. Colour

### Neutrals

| Name | Hex | Use |
|---|---|---|
| Plaster | `#E6E4DE` | Reading ground |
| Raised | `#F2F1ED` | Figures and plates on plaster |
| Ink | `#141312` | Text; dark ground |
| Ink 2 | `#55524C` | Secondary text (6.12 : 1 on plaster) |
| Rule | `#C9C6BE` | Hairlines |

### Main pair

| Name | Hex | Role | Contrast |
|---|---|---|---|
| **Ultramarine** | `#2626C9` | Brand | White on it 9.53 : 1. On plaster 7.50 : 1, so it may be used as link text |
| **Fluorescein** | `#C8E64A` | Signal | Ink on it 13.14 : 1 |

By lightness alone the two are 6.75 : 1 apart, so they stay distinct for colour-blind viewers. Fluorescein is the dye of clinical eye imaging.

### Arsenal pair (secondary)

| Name | Hex | Contrast |
|---|---|---|
| **Blood** | `#8A1C2B` | White on it 9.20 : 1 |
| **Plasma** | `#EBC94A` | Ink on it 11.48 : 1 |

This pair comes from a spun blood tube: red cells under straw-yellow plasma. Use it for health-specific content: health LinkedIn posts, clinical project material, and data series 2. **Never mix it with the main pair in one composition.**

### Rules

1. **Committed strategy.** Ultramarine owns whole regions (header, hero, title bands), between 30 and 60 percent of a page. It is never a sprinkle of accents.
2. **Signal colours are shapes or grounds.** Fluorescein and plasma never sit on plaster or white, and are never used as small text on light grounds.
3. **No white text** on fluorescein or plasma (3.13 : 1 or worse). Those grounds always take ink.
4. **Status always has a word.** Colour never carries meaning alone.
5. **No gradients, glow, grain or transparency effects.** Colour is flat ink.

### Dark tokens

When a screen runs dark, the ground is `#131211`. Ultramarine becomes `#9C9CFF` when used as text or line, and blood becomes `#FF7A8A`. Fluorescein and plasma stay the same.

## 4. Typography

There is one family, with no second face for data.

- **Funnel Display** sets the name, headlines and wordmark-scale type. Weight is 600 to 700. Tracking is −0.035 to −0.04 em from 56 px up, and −0.02 em below that.
- **Funnel Sans** sets everything else, including numbers and data, with tabular figures (`font-variant-numeric: tabular-nums`).

**Scale (px):**

| 14 | 17 | 22 | 32 | 48 | 72 | clamp(64, 9vw, 128) |
|---|---|---|---|---|---|---|
| caption | body | lead | h3 | h2 | h1 | display |

**Settings:**
- Body leading 1.55. Display leading 0.92 to 0.95.
- Measure 62 to 70 ch.
- Headings balanced (`text-wrap: balance`).
- Sentence case everywhere; no tracked uppercase labels.

Both faces are OFL. The site self-hosts the variable woff2 files.

## 5. Layout

- 12-column grid, 1280 px max content width, 0 radius.
- Hairlines separate; nothing becomes a card by default.
- No eyebrows above headings, no section numbers, no stat tiles, no logo walls.
- Space: tight inside a group, generous between groups, and more above a heading than below it.

## 6. Motion

**The stain.** Text takes up colour the way a slide takes up stain. It is a clip-path wipe of solid colour, never gradient text.
- It runs once per page load, on the name.
- It runs on hover or focus, on work rows.
- Pages are joined by View Transitions: the title of a work row becomes the title of its page.

**One line, three meanings.** On the landing, a single fluorescein line on ultramarine reshapes as the visitor reads: noisy data, a digital signal, a heartbeat. The page scrolls natively; nothing is pinned or tied to the scrollbar.

One curve, `cubic-bezier(.16, 1, .3, 1)`, at 520 to 900 ms. Hover changes take 180 ms.

**Reduced motion:** nothing moves, and nothing is lost. **No JavaScript:** everything is visible.

**Never:**
- WebGL wallpaper
- particle fields
- grain or bloom
- letter-by-letter type
- bounce or elastic easing
- scroll that shows nothing

## 7. Voice

**Artifact, number, status.** Name the thing, give its unit, say where it stands.

**Write:**
- short declarative sentences;
- plain verbs;
- Portuguese written natively, not translated.

**Never claim:**
- unpublished papers as published;
- awards;
- testimonials;
- a company that doesn't exist yet.

All public copy goes through the humanizer pass, and no fact changes without the author's approval.

| Instead of | Write |
|---|---|
| Building deep-tech for healthcare. I bridge computational biology and embedded edge AI… | I build across genomics software, embedded hardware and health. |
| Passionate about impact | (cut it, show the project) |

## 8. LinkedIn

LinkedIn shows images about 552 px wide on desktop and about 340 px on a phone, on a light (`#F4F2EE`) or dark (`#1B1F23`) feed.

1. **No plaster grounds.** They disappear in the light feed. Use ultramarine, ink or fluorescein, or off-white with an element running to the edges.
2. **Minimum text is 40 px at 1080 wide** (about 12.6 px on a phone). Headlines are 96 px or larger. A slide holds 25 words at most.
3. **Accessibility:** alt text on every post, and the post copy repeats each slide's key line.
4. **Templates:**

| Template | Size | Treatment |
|---|---|---|
| Banner | 1584 × 396 | Ultramarine. The left 560 px is covered by the photo; text sits in the right-hand safe area |
| Avatar | 400 × 400 | Portrait cutout on ultramarine, with the fluorescein square |
| Carousel | 1080 × 1350, as PDF | Ultramarine cover, off-white content slides, one idea each |
| Link post | 1200 × 627 | Ink ground, with an ultramarine strip at the bottom edge |
| Quote card | 1080 × 1080 | Fluorescein ground, ink text |

Health content may swap in the blood and plasma pair for the whole post.

## 9. What we left behind

The previous identity was critiqued as amateur. These habits stay out:
- a WebGL film before the work;
- blue-on-navy scenes;
- grain;
- a name revealed letter by letter;
- yellow highlighter buttons;
- a serif monogram with a dimension line;
- category words ("deep-tech", "bridge", "clinical impact").
