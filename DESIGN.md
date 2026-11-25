---
name: Vinicius Castelli
description: "A single ink page: name, a short bio and links in sentences, with ultramarine and fluorescein details."
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
  page:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.raised}"
  link:
    underline: "{colors.fluorescein}"
    hover: "{colors.ultramarine-lit}"
---

# Design System: Vinicius Castelli

The brand source of truth is `docs/brand-guidelines.md`. This file records how the site applies it.

## Overview

The site is one page in English (`/`) and Portuguese (`/pt/`): the wordmark, the name, a short bio, and three sentences that carry the links (LinkedIn and GitHub, the Substack, email). Copy lives in `src/i18n/en.ts` and `src/i18n/pt.ts`; the page is `src/views/Landing.astro`.

## Colors

- **Ink** is the ground for the whole page; text is raised, secondary text `#B9B6AE`, hairlines `#3A3833`.
- **Ultramarine** marks the page: a 6 px strip across the top and a square before each link sentence.
- **Fluorescein** is the signal: the wordmark's i-dot, link underlines, focus rings and selection.
- **Ultramarine lit** (`#9C9CFF`) is the hover colour for links on ink.

## Typography

Funnel Display for the name and the link sentences, Funnel Sans for everything else. Tabular figures everywhere.

## Motion

One idea, the stain: on load, a fluorescein copy of the name wipes in and out once (1.5 s). Reduced motion and no JavaScript get a static page.
