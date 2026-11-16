---
name: Vinicius Castelli
description: An index-first portfolio on plaster with ultramarine bands, one Funnel family, and a single stain motion. The work leads from the first viewport.
colors:
  plaster: "#E6E4DE"
  raised: "#F2F1ED"
  ink: "#141312"
  ink-2: "#55524C"
  rule: "#C9C6BE"
  ultramarine: "#2626C9"
  fluorescein: "#C8E64A"
  blood: "#8A1C2B"
  plasma: "#EBC94A"
  dark-ground: "#131211"
  ultramarine-lit: "#9C9CFF"
  blood-lit: "#FF7A8A"
typography:
  display:
    fontFamily: "Funnel Display, Funnel Sans, system-ui, sans-serif"
    fontSize: "clamp(64px, 9vw, 128px)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  h1:
    fontFamily: "Funnel Display, Funnel Sans, system-ui, sans-serif"
    fontSize: "clamp(44px, 6vw, 72px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  h2:
    fontFamily: "Funnel Display, Funnel Sans, system-ui, sans-serif"
    fontSize: "clamp(32px, 3.6vw, 48px)"
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  h3:
    fontFamily: "Funnel Display, Funnel Sans, system-ui, sans-serif"
    fontSize: "clamp(24px, 2.4vw, 32px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Funnel Sans, system-ui, sans-serif"
    fontSize: "clamp(19px, 1.6vw, 22px)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Funnel Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Funnel Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  none: "0px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
  12: "48px"
  16: "64px"
  24: "96px"
  section: "clamp(72px, 9vw, 136px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.raised}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-on-brand:
    backgroundColor: "{colors.fluorescein}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  band:
    backgroundColor: "{colors.ultramarine}"
    textColor: "#FFFFFF"
  footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.raised}"
  work-row-hover:
    backgroundColor: "{colors.ultramarine}"
    textColor: "#FFFFFF"
---

# Design System: Vinicius Castelli

The brand source of truth is `docs/brand-guidelines.md`. This file records how the site applies it.

## Overview

**North star: "The work, stained."** A plaster reading ground with ultramarine bands that own the top of every page. The landing is index-first: name, positioning and the work list share the first viewport, and every project leads to its live site. Motion is one idea, the stain, plus View Transitions between pages.

**Key characteristics:**
- Committed colour: ultramarine covers the header, the hero and case-page title bands (30 to 60 percent of a page). The footer is ink. Fluorescein appears only as a signal: the i-dot, the primary button on ultramarine, focus on dark grounds.
- One family: Funnel Display for headlines, Funnel Sans for everything else, numbers included.
- Real imagery only: screenshots of the live sites, the portrait on the One Pager, and the author's axis drawings.
- Zero radius, hairlines, no cards, no eyebrows, no section numbers, no stat tiles.

## Colors

- **Ultramarine** is the brand ground for bands; white text on it is 9.53 : 1. On plaster it is link and figure colour (7.50 : 1).
- **Fluorescein** is the signal, only on ultramarine or ink, always with ink text on it.
- **Blood and plasma** are reserved for health-specific content and never share a composition with ultramarine and fluorescein.
- **Plaster, raised, ink, ink 2, rule** are the neutrals.

**Named rules:**
- **The Ground Rule.** Fluorescein and plasma never sit on plaster.
- **The Word Rule.** Status always has a word; colour never carries meaning alone.

## Typography

- Display 700, −0.04 em, leading 0.92: the name in the hero.
- h1 and h2 in Funnel Display, from 600 to 700.
- Body in Funnel Sans, 17 px with 1.55 leading, 62 to 70 ch measure. Tabular figures everywhere.

## Layout

12 columns, 1280 px max width, side gutter at least 16 px (72 px from 900 px wide). The landing hero is sized to its content, never 100vh. Work rows run the full width, with title, line, domain, year and status.

## Motion

- **The stain:** a clip-path wipe of a solid ultramarine (or white on bands) copy of the text, using `cubic-bezier(.16,1,.3,1)`.
  - On load, on the hero name: in, then out, 1.5 s, once.
  - On work rows: on hover or focus, the row ground becomes ultramarine, 520 ms.
- **The story ("How I see it"):** one line, three meanings. A sticky ultramarine panel holds one fluorescein line that reshapes (700 ms) into noisy data, a digital signal and a heartbeat as each chapter reaches the reading line. Native scroll only: no pinning, no scrub. Phones and no-JS get a static figure per chapter.
- **View Transitions:** the work row title morphs into the case page title (`view-transition-name: title-<slug>`).
- **Reduced motion and no JavaScript:** static, complete pages.
