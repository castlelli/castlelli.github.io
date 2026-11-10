---
name: Vinicius Castelli
description: A personal site set like the first page of a landmark technical paper, with Coomassie figure plates.
colors:
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
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(56px, 7.4vw, 104px)"
    fontWeight: 600
    lineHeight: 0.94
    letterSpacing: "-0.028em"
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
  segmented-control-on:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
---

# Design System: Vinicius Castelli

## Overview

**Creative North Star: "The Technical Journal"**

The site reads like page one of a paper from the Bell System Technical Journal era: a running head, a title set large in serif, an italic byline and abstract, numbered sections, figures with "Fig. n." captions and tables with "Table n." captions above them. The person is the subject and the projects are the contents. Paper carries the reading; blueprint appears only where there is a figure to look at or a drawing to operate.

Density is that of a well-set journal page: generous margins, a 62-character measure, three or four type sizes per page, and hierarchy that comes from space and position more than size. The old drawing-sheet chrome (zone frames, crosshairs, coordinate readouts, print modes, title blocks, parts lists) was rejected by the author as too robotic and is not part of this system.

**Key Characteristics:**
- Papel ground with tinta ink; Coomassie only as figure plates and full-bleed plate sections.
- Source Serif 4 carries the voice; IBM Plex Sans for labels; IBM Plex Mono only for data in transit.
- Figures are real: computed or drawn by the author, captioned like a paper.
- Square corners everywhere; hairline rules in place of boxes.

## Colors

One saturated blue against warm paper, with a single highlighter yellow held in reserve.

### Primary
- **Coomassie** (coomassie): the plate. Fills figure panels and the two plate sections (research drawings, correspondence). Also the link and list-marker accent on paper.
- **Deep Coomassie** (coomassie-fundo) and **Pale Coomassie Ink** (coomassie-tinta): secondary tones inside plates; coomassie-tinta is muted text and figure labels on blue.

### Secondary
- **Marca-texto** (marca-texto): the way into a project. Nothing else.

### Neutral
- **Papel** (papel): the page ground and the line work on plates.
- **Papel elevado** (papel-elevado): reserved lighter paper.
- **Tinta** (tinta): body text, strong rules (table tops, running head on scroll, section rules).
- **Grafite** (grafite): secondary text, captions, metadata on paper.
- **Linha** (linha): hairline dividers between rows and entries.

### Named Rules
**The Marca-texto Rule.** Yellow marks the way into a project (contents chips, "Open" buttons, the primary project link) plus text selection and plate focus rings. It never decorates a figure, a heading or a chart line.

**The Earned Blue Rule.** Coomassie appears where there is a figure to read or a drawing to operate. A paper section never gets a blue background just for variety.

## Typography

**Display Font:** Source Serif 4 (with Georgia)
**Body Font:** Source Serif 4 (with Georgia)
**Label/Mono Font:** IBM Plex Sans for labels and UI; IBM Plex Mono for data

**Character:** A sober book serif doing almost everything, with a neutral grotesque for the small print around it, like a journal's body type and its captions set by the same compositor.

### Hierarchy
- **Display** (600, clamp(56px, 7.4vw, 104px), 0.94): the name on the front page and the title of a CV or project page.
- **Headline** (400, clamp(32px, 3.6vw, 46px), 1.08): section heads, with a small Plex Sans roman numeral inline before them (I, II, III, IV) on the landing.
- **Body** (400, clamp(17px, 1.25vw, 19px), 1.6): prose at max 62ch; abstracts and summaries in italic.
- **Label** (500, 13–15px): metadata keys, table heads, nav, buttons, in sentence case. Uppercase with 0.14em tracking only for the single "Contents" label and the block labels inside Fig. 1.
- **Data** (IBM Plex Mono 500, 13px): only for signals inside figures (bases, bits). Never for headings or labels.

### Named Rules
**The Three Sizes Rule.** A page uses display, headline, body and caption sizes and nothing between them. Rank comes from space and position.

**The Italic Abstract Rule.** Bylines, abstracts, summaries and figure-label prose are italic serif; that is how this world says "about the thing" rather than "the thing".

## Layout

A centered column up to 1280px wide, with 16px side gutters on phones and 72px from 900px up. Sections are separated by a large vertical rhythm (clamp(88px, 11vw, 168px)); two paper sections in a row share one gap. The landing alternates grounds: hero and selected work on paper, research as a full-bleed plate, the software table on paper, correspondence on a plate.

Two-column compositions appear from about 960–1060px: hero text beside Fig. 1; each project as figure plus abstract, alternating sides, with the figure always in the wider column. The research plate uses a 6-column grid: two panels of 3 above, three panels of 2 below. Below those widths everything stacks, and tables become stacked records under 720px.

## Elevation & Depth

Flat. There are no drop shadows; the only box-shadow is a 1px inset hairline (rgba(22, 24, 29, 0.08)) that crisps a plate's edge on paper. Depth comes from ground changes (paper against Coomassie) and from rule weight: 1.5px tinta for structural rules, 1px linha for row dividers. The running head gets a backdrop blur and its tinta rule only once the page scrolls.

### Named Rules
**The Paper Has No Shadows Rule.** Nothing lifts off the page. A plate is a printed figure, not a card.

## Shapes

Square corners throughout (0px). Rules in place of boxes: tables are open-sided with heavier top and bottom rules, lists are separated by hairlines, the segmented control is a 1px outline with filled selected state. The only drawn icon is a 1.5px round-capped arrow in three directions (in, back, out).

## Components

### Buttons
- **Shape:** square (0px), 44px tall.
- **Primary (go):** marca-texto fill, tinta text, Plex Sans 500 15px, 0 18px padding, arrow icon after the label.
- **Hover / Focus:** the gap before the arrow widens from 10px to 16px; focus is a 2px Coomassie outline on paper, marca-texto on plates.
- **Quiet link:** Plex Sans 500 15px, no fill, underline on hover; used for Source, back links and the one-pager link.

### Contents entry
A row with a number, the title in serif, the summary in Plex Sans under it, and a yellow "Open" chip at the end. Hairline between rows, a tinta rule above the list.

### Figure plate
- **Background:** coomassie, papel line work at 1.3–1.6px non-scaling strokes.
- **Padding:** clamp(20px, 3.6vw, 52px).
- **Caption:** below, serif 16px grafite, figure number in bold tinta ("Fig. 2.").
- **Motion:** draws in once when it enters the viewport (boxes stroke in, points build up); signals loop slowly. Everything is complete and static under reduced motion or without JavaScript.

### Journal table
Caption above ("Table 1." bold), Plex Sans 13px column heads between a 1.5px top rule and a 1px rule, rows on 1px linha, a 1.5px bottom rule. Numbers right-aligned with tabular lining figures.

### Segmented control
1px outline, Plex Sans 13px; the pressed state fills with tinta (on paper) or papel with Coomassie text (on plates).

### Navigation
A running head: monogram and name on the left; Work, Research, Contact, One Pager in grafite Plex Sans, tinta on hover; place and language switch after a hairline divider. Under 900px it collapses to a "Menu" button that opens a full-screen paper dialog with large serif links.

## Do's and Don'ts

### Do:
- **Do** give every figure a numbered caption and make it real: computed, measured or drawn by the author.
- **Do** keep Coomassie to plates and plate sections, and marca-texto to project entry points.
- **Do** set abstracts, bylines and summaries in italic Source Serif 4.
- **Do** keep every figure legible at 390px; scale SVG text up on narrow screens when the plate shrinks.

### Don't:
- **Don't** bring back the drawing-sheet chrome: zone frames, crosshairs, X/Y readouts, title blocks, parts lists, print-mode switches.
- **Don't** tile the blueprint grid on paper sections; the faint grid lives only inside plate sections.
- **Don't** use Plex Mono for labels or headings, or uppercase tracked labels above headings.
- **Don't** add shadows, rounded cards or big-number stat tiles.
- **Don't** use Unicode arrows or emoji as icons; use the drawn arrow.
