# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Research evaluators:** lab heads, graduate programs, scientific collaborators judging rigor and seriousness.
- **Founders, investors and industry:** people deciding whether to hire, fund or partner, who skim fast and judge taste.

Both arrive cold, usually from a link (LinkedIn, email signature, GitHub profile), and give the page seconds before deciding to go deeper.

## Product Purpose

Personal portfolio of Vinicius Castelli: Computer Engineering student at Escola Politécnica (Poli-USP, 2026 → 2030) and undergraduate researcher at LEEP, ICB-USP, where he leads the modernisation of ROTIFER, the lab's open-source comparative-genomics toolkit. Direction: deep tech from the lab into industry and healthcare (machine learning, embedded systems, research software).

Success: a visitor opens a project page (ROTIFER, iGEM USP wiki and SHARP, AccessPlus, Mechanics, Digital hardware) and follows it to the live site. Contact (email, LinkedIn, GitHub) and the One Pager (About/CV) are secondary.

## Positioning

A serious engineer, builder and researcher at once, spanning biology, open-source research software and hardware. Health is the first application. Industry roles in hardware, AI and the life sciences are in scope, and the business side (product, leadership, pitching) counts as evidence too. The breadth is real and documented (lab toolkit, shipped products with thousands of users, a repurposing study, hardware focus), and the author draws his own illustrations.

## Operating Context

- Bilingual: English at `/`, Portuguese at `/pt/`. Every string exists in both (`src/i18n/en.ts`, `src/i18n/pt.ts`); project pages are Markdown per language in `src/content/work/`.
- Static Astro site deployed to GitHub Pages (`.github/workflows/deploy.yml`).
- Projects are added over time through the `work` content collection (`_template.md` documents the format).

## Capabilities and Constraints

- Pages: landing, One Pager (`/about/`, `/pt/sobre/`), one page per project (`/work/<slug>/`).
- Must work without JavaScript; content visible by default.
- Self-hosted fonts in `public/fonts/`; no third-party font or script hosts.
- No animation libraries: the only scripts are the stain (Web Animations API), the menu and the reading progress bar. Cross-document View Transitions join pages.
- Text on the site is reviewed with the humanizer skill; facts are not altered without the author's approval.
- Commits carry no co-author lines.

## Brand Commitments

Source of truth: `docs/brand-guidelines.md` (v1.0, 2026-11-16).

- Wordmark: lowercase "castelli" in Funnel Display 700 with a square i-dot (`public/brand/castelli*.svg`, favicon `public/favicon.svg`). No symbol.
- Main pair: ultramarine `#2626C9` (brand) and fluorescein `#C8E64A` (signal). Arsenal pair for health content: blood `#8A1C2B` and plasma `#EBC94A`, never mixed with the main pair.
- Neutrals: plaster `#E6E4DE`, raised `#F2F1ED`, ink `#141312`, ink 2 `#55524C`, rule `#C9C6BE`.
- Type: Funnel Display and Funnel Sans only (numbers included, tabular figures). Binding.
- Motion: the stain (clip-path wipe of solid colour) plus View Transitions. No WebGL, grain or letter-by-letter type.
- The five hand-drawn axis drawings (Poli, ICB, embedded board, edge AI, heart pump) in `src/components/axes/` are kept, on the One Pager only, in ultramarine line.

## Evidence on Hand

- ROTIFER modernisation (LEEP, ICB-USP, since 2026-02); public docs at leepusp.github.io/rotifer; tool paper in preparation.
- Poster, CEPID B3 Annual Scientific Meeting 2026 (abstract published).
- iGEM USP 2026 team wiki, lead developer.
- Vildagliptin for skin fibrosis: Cortellis Drug Repositioning Hackathon 2026-08, co-led analysis, live project page and source.
- Mechanics tools, live: wrench, momentfield, Duffing, carousel, hypocycloid (castlelli.github.io/physics/). Digital hardware, live: parameterized ALU and Verilog cosine (castlelli.github.io/electronics/).
- AccessPlus: accessplus.com.br.
- VivaPay: 5,000+ users, 10,000 transactions over 3 days. NxCoop CRM: 10,000+ users (as intern). AccessPlus: 5,000+ opportunities, led a team of 8.
- VivaPay and the vildagliptin study are off the site for now (author's decision, 2026-11-16).

The portrait cutout (`public/photos/portrait.webp`) appears on the One Pager only. Work pages show screenshots of the live sites in `public/work/<slug>/`.

Absent, never to be fabricated: published papers, awards, testimonials, employer logos, motivations the author has not stated.

## Product Principles

1. Show the work; the projects persuade, the page gets out of their way.
2. Breadth with proof: every field claimed is backed by a concrete artifact or number.
3. Honest status: in-preparation stays in-preparation, no award stays no award.
4. Hand-made: the author's own drawings carry the identity.
5. Equal standing in English and Portuguese.

## Accessibility & Inclusion

WCAG 2.1 AA contrast on every ground; keyboard reachable interactions; `prefers-reduced-motion` honored; works without JavaScript.
