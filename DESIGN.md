---
name: Vinicius Castelli
description: A personal site that opens with a live, scroll-driven macro film, from a circuit board to a protein to an attractor, then sets the work on paper with Coomassie plates.
colors:
  night: "#0B1030"
  papel: "#F3F1EA"
  papel-elevado: "#FBFAF6"
  tinta: "#16181D"
  grafite: "#55575C"
  linha: "#CFCBBF"
  coomassie: "#24338F"
  coomassie-fundo: "#1E2B7A"
  coomassie-claro: "#DCE0F5"
  coomassie-tinta: "#C9CEF2"
  marca-texto: "#F2D43B"
  data-cool: "#6F86F6"
  data-mid: "#8A8FA8"
  data-copper: "#CF7836"
typography:
  film-display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(64px, 10vw, 168px)"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  film-question:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(40px, 5.6vw, 92px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(32px, 3.6vw, 46px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(17px, 1.25vw, 19px)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.45
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 500
rounded:
  none: "0px"
  data-end: "4px"
spacing:
  1: "4px"
  2: "8px"
  4: "16px"
  6: "24px"
  8: "32px"
  12: "48px"
  16: "64px"
  22: "88px"
  section: "clamp(88px, 11vw, 168px)"
components:
  button-go:
    backgroundColor: "{colors.marca-texto}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  plate:
    backgroundColor: "{colors.coomassie}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
  film-stage:
    backgroundColor: "{colors.night}"
    textColor: "{colors.papel}"
  segmented-control-on:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
---

# Design System: Vinicius Castelli

## Overview

**Creative North Star: "The Macro Film"**

The landing is one continuous shot the visitor drives by scrolling, lit like a product film: a Coomassie-masked dev board with gold copper on a night studio floor, a dive into its OLED, one protein sequence that becomes a wall of many, the first sequence lifting off to fold into a cartoon-ribbon protein, and the protein dissolving into the forced Duffing attractor drawn in its true phase space. Text scrolls over the film as questions and short answers; a six-step rail on the right names where you are.

After the film the page returns to paper. The work is set editorially, each project with a Coomassie figure plate; the research drawings live on one full-bleed plate; the close is a plate too. The film is the spectacle; everything after it is calm, precise and readable, so the spectacle reads as earned.

**Key Characteristics:**
- Night studio film first (WebGL, three.js), papel and Coomassie plates after.
- Every figure is real or labelled: computed attractors, figure data copied from the project's own repository, illustrations stated as such.
- Source Serif 4 carries the voice; IBM Plex Sans labels; IBM Plex Mono only for sequences and data.
- Motion has one grammar: scroll-scrubbed scenes, draw-ins on entry, nothing that loops for decoration except the film's own signals.

## Colors

A night studio and warm paper, held together by Coomassie, with one highlighter yellow and one copper for data.

### Primary
- **Coomassie** (coomassie): figure plates, plate sections, the board's solder mask.
- **Night** (night): the film's studio ground and fog.
- **Pale Coomassie Ink** (coomassie-tinta): muted text over night and plates.

### Secondary
- **Marca-texto** (marca-texto): the way into a project (contents chips, "Open" buttons, the primary project link), plus selection and focus on dark grounds.

### Tertiary
- **Data cool / mid / copper** (data-cool, data-mid, data-copper): the one diverging scale for figures on a plate, validated for CVD separation and contrast against Coomassie. Copper echoes the board's traces.

### Neutral
- **Papel**, **Tinta**, **Grafite**, **Linha**: page ground, text, secondary text, hairlines.

### Named Rules
**The Marca-texto Rule.** Yellow marks the way into a project and nothing else on the page. Data never uses it; the film never uses it.

**The Earned Blue Rule.** Coomassie appears as the board, as figure plates and as plate sections. A paper section never turns blue for variety.

## Typography

**Display Font:** Source Serif 4 (with Georgia)
**Body Font:** Source Serif 4 (with Georgia)
**Label/Mono Font:** IBM Plex Sans for labels and UI; IBM Plex Mono for sequences, bits and data

**Character:** A book serif set huge over the film, then at reading size on paper; a neutral grotesque for the small print.

### Hierarchy
- **Film display** (600, clamp(64px, 10vw, 168px), 0.88): the name, revealed letter by letter on load.
- **Film question** (400, clamp(40px, 5.6vw, 92px), 1.02): the three questions over the film.
- **Headline** (400, clamp(32px, 3.6vw, 46px), 1.08): section heads on paper, with a small inline roman numeral.
- **Body** (400, clamp(17px, 1.25vw, 19px), 1.6): prose at max 62ch; summaries and captions in italic.
- **Label** (500, 13–15px): metadata, nav, buttons, table heads, in sentence case.

### Named Rules
**The No Eyebrow Rule.** Nothing sits above a heading. The film's rail lives at the edge, never over the text.

## Layout

The film is a 900svh-tall section with a sticky 100svh stage; beats are placed so each lands on its scene (≈0.16 board, 0.46 alignment, 0.69 fold, 0.97 attractor). A left-to-right scrim keeps text legible over the scene. After the film: a centered column up to 1280px with 16px gutters on phones and 72px from 900px; sections separated by clamp(88px, 11vw, 168px). Projects alternate figure and text with the figure always in the wider column; the research plate is a 6-column grid (3+3 above, 2+2+2 below); tables become stacked records under 720px. On phones the film runs in a light mode (no depth of field or bloom, DPR 1, wider lens) and the rail hides.

## Elevation & Depth

Depth lives inside the film: physically based materials, an environment map, a warm key with shadows, a cool rim, depth of field, bloom and grain. The paper page is flat: no drop shadows, only a 1px inset hairline on plates, a slight tilt and a soft light under the pointer on project plates.

### Named Rules
**The Paper Has No Shadows Rule.** After the film, nothing lifts off the page except the plate you are pointing at, by a few degrees.

## Shapes

Square corners on paper and plates (0px). Data bars end in 4px rounded caps anchored at the baseline. The drawn arrow (1.5px, round caps) is the only icon.

## Components

### Film
- **Stage:** night ground, WebGL canvas fading in over a still poster; disabled without WebGL, under reduced motion or with data saver, where beats stack as plain sections.
- **Beats:** large serif question, short answer, entering and leaving with a lift and fade scrubbed to scroll.
- **Rail:** six labels, right edge, the current one lit with a longer tick.

### Buttons
- **Go (primary):** marca-texto fill, tinta text, Plex Sans 500 15px, 44px tall, drawn arrow; the gap before the arrow widens on hover.
- **Quiet link:** Plex Sans 500 15px, underline on hover.

### Figure plate
Coomassie panel, papel line work at non-scaling 1–1.6px, numbered caption below in serif. Plates wipe open on entry; the Duffing points build up in integration order as you scroll; the PAGA graph draws edges, then nodes, then the DPP4 branch, with hover and focus tooltips and a table view.

### Number ticker
Any numeric value marked for it counts up once on entry with tabular figures and locked width; below the fold it waits at zero; static under reduced motion.

### Navigation
A running head: dark and translucent over the film, paper after it; monogram, name, four links, place and language.

## Do's and Don'ts

### Do:
- **Do** keep every figure honest: computed, copied from its source with the source's caveats, or labelled as an illustration.
- **Do** time scroll text to the film's scenes and keep it on the scrim side of the frame.
- **Do** validate any data palette against the plate before using it.
- **Do** keep the page complete without JavaScript or WebGL.

### Don't:
- **Don't** bring back drawing-sheet chrome (zone frames, crosshairs, coordinate readouts, title blocks, print modes).
- **Don't** use marca-texto in figures or the film.
- **Don't** put labels above headings or use Plex Mono for headings.
- **Don't** add drop shadows or rounded cards on paper.
- **Don't** use Unicode arrows or emoji as icons.
