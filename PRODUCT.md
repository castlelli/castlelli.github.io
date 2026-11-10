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

Personal portfolio of Vinicius Castelli: Computer Engineering student at Escola Politécnica (Poli-USP, 2026 → 2030) and undergraduate researcher at LEEP, ICB-USP, where he leads the modernisation of ROTIFER, the lab's open-source comparative-genomics toolkit. Direction: embedded systems for health.

Success: a visitor opens a project page (Duffing oscillator, vildagliptin repurposing study). Contact (email, LinkedIn, GitHub) and the One Pager (About/CV) are secondary.

## Positioning

A serious engineer, builder and researcher at once, spanning biology and health, open-source research software, and hardware. The breadth is real and documented (lab toolkit, shipped products with thousands of users, a repurposing study, hardware focus), and the author draws his own illustrations.

## Operating Context

- Bilingual: English at `/`, Portuguese at `/pt/`. Every string exists in both (`src/i18n/en.ts`, `src/i18n/pt.ts`); project pages are Markdown per language in `src/content/work/`.
- Static Astro site deployed to GitHub Pages (`.github/workflows/deploy.yml`).
- Projects are added over time through the `work` content collection (`_template.md` documents the format).

## Capabilities and Constraints

- Pages: landing, One Pager (`/about/`, `/pt/sobre/`), one page per project (`/work/<slug>/`).
- Must work without JavaScript; content visible by default.
- Self-hosted fonts in `public/fonts/`; no third-party font or script hosts.
- GSAP is available as a dependency.
- Text on the site is reviewed with the humanizer skill; facts are not altered without the author's approval.
- Commits carry no co-author lines.

## Brand Commitments

- Monogram "VC" with a dimension-line mark under it (`public/brand/monograma*.svg`, `src/components/Monogram.astro`).
- Palette from the brand kit: papel `#F3F1EA`, papel elevado `#FBFAF6`, tinta `#16181D`, grafite `#55575C`, linha `#CFCBBF`, Coomassie `#24338F`, Coomassie claro `#DCE0F5`, marca-texto `#F2D43B`.
- Type from the brand kit: Source Serif 4 (400, 400 italic, 600), IBM Plex Sans (400/500/600), IBM Plex Mono (400/500). Binding.
- The blueprint / cyanotype idea is the author's, to be used selectively, not as wallpaper.
- Five hand-drawn axis drawings (Poli, ICB, embedded board, edge AI, heart pump) in `src/components/axes/` are kept.

## Evidence on Hand

- ROTIFER modernisation (LEEP, ICB-USP, since 2026-02); public docs at leepusp.github.io/rotifer; tool paper in preparation.
- Poster, CEPID B3 Annual Scientific Meeting 2026 (abstract published).
- iGEM USP 2026 team wiki, lead developer.
- Vildagliptin for skin fibrosis: Cortellis Drug Repositioning Hackathon 2026-08, co-led analysis, live project page and source.
- Duffing oscillator, live in-browser simulation.
- VivaPay: 5,000+ users, 10,000 transactions over 3 days. NxCoop CRM: 10,000+ users (as intern). AccessPlus: 5,000+ opportunities, led a team of 8.

Absent, never to be fabricated: a portrait photo (placeholder until supplied), published papers, awards, testimonials, employer logos.

## Product Principles

1. Show the work; the projects persuade, the page gets out of their way.
2. Breadth with proof: every field claimed is backed by a concrete artifact or number.
3. Honest status: in-preparation stays in-preparation, no award stays no award.
4. Hand-made: the author's own drawings carry the identity.
5. Equal standing in English and Portuguese.

## Accessibility & Inclusion

WCAG 2.1 AA contrast on every ground; keyboard reachable interactions; `prefers-reduced-motion` honored; works without JavaScript.
