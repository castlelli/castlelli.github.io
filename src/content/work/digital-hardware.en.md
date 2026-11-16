---
lang: en
slug: digital-hardware
order: 5
kind: collection
domain: digital-hardware
year: "2026"
title: Digital hardware
summary: Hardware built from logic gates, in Verilog, with a version you can open in the browser.
role: Author
dates: "2026"
status: Live
site: { label: castlelli.github.io/electronics, href: "https://castlelli.github.io/electronics/" }
image: /work/digital-hardware/alu-schematic
imageAlt: "The schematic of the 8-bit ALU: inputs A and B through an adder, a shifter, parity and compare blocks into a multiplexer, with live values on every wire."
stack: [Verilog, Testbenches, Python, JavaScript]
links:
  - { label: Repository, href: "https://github.com/castlelli/electronics" }
items:
  - { title: An ALU you can redesign, summary: "A gate-level ALU, parameterised from 4 to 64 bits with five adder architectures. Change it and watch the floorplan and critical path move. The original fixed 8-bit ALU and its testbench are there too.", href: "https://castlelli.github.io/electronics/alu/", image: /work/digital-hardware/alu, imageAlt: "The ALU page with a configuration panel and the gate diagram of the 8-bit ALU." }
  - { title: Cosine in Verilog, summary: "A cosine approximation in Verilog, with its testbench and a comparison against the exact values.", href: "https://github.com/castlelli/electronics/tree/main/ep01" }
---

These are digital systems built up from logic gates. Each one is written in Verilog and verified with testbenches. Where it helps, it also has a page where you can watch it run.
