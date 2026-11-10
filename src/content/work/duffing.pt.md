---
lang: pt
slug: duffing
order: 1
title: Oscilador de Duffing, ao vivo
summary: Um oscilador não linear forçado, integrado no navegador. Mude os dados e veja o caos aparecer.
role: Modelo, integrador e página
dates: 2026-11
status: no ar
icon: oscillation
pins: [RK4, Python, NumPy, pytest, LaTeX, JavaScript, Canvas, Web Audio, Fases, Bacias]
links:
  - { label: Abrir ao vivo, href: "https://castlelli.github.io/algorithms/pme3100/optativa-9/" }
  - { label: Código, href: "https://github.com/castlelli/algorithms/tree/main/pme3100/optativa-9" }
---

O oscilador de Duffing é uma massa presa a uma mola que endurece conforme estica, empurrada por uma força periódica. Pequenas mudanças nos dados levam o sistema de uma órbita estável ao caos.

A página roda uma integração Runge-Kutta de quarta ordem no navegador. Ela desenha a posição no tempo, o retrato de fase, o diagrama de bifurcação e as bacias de atração, e se atualiza conforme você muda a massa, a mola, o amortecimento ou a força.

Feito para PME3100 Mecânica I, na Poli-USP. O mesmo modelo em Python gera o relatório escrito.
