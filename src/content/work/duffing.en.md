---
lang: en
slug: duffing
order: 1
title: Duffing oscillator, live
summary: A forced nonlinear oscillator integrated in the browser. Change the inputs and watch chaos appear.
role: Model, integrator and page
dates: 2026-11
status: live
icon: oscillation
pins: [RK4, Python, NumPy, pytest, LaTeX, JavaScript, Canvas, Web Audio, Phase space, Basins]
links:
  - { label: Open live, href: "https://castlelli.github.io/algorithms/pme3100/optativa-9/" }
  - { label: Source, href: "https://github.com/castlelli/algorithms/tree/main/pme3100/optativa-9" }
---

The Duffing oscillator is a mass on a spring that stiffens as it stretches, pushed by a periodic force. Small changes in the inputs move it from a steady orbit to chaos.

The page runs a fourth-order Runge-Kutta integration in the browser. It draws the position over time, the phase portrait, the bifurcation diagram and the basins of attraction, and it updates as you change the mass, the spring, the damping or the force.

Built for PME3100 Mechanics I at Poli-USP. The same model in Python produces the written report.
