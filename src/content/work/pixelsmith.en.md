---
lang: en
slug: pixelsmith
order: 6
domain: image-processing
year: "2026"
title: Pixelsmith
summary: Free image tools written in C, with a DCT codec built from the 8×8 block up. The same code runs in the browser as WebAssembly.
role: Author
dates: "2026"
status: Live
site: { label: castlelli.github.io/algorithms/pixelsmith, href: "https://castlelli.github.io/algorithms/pixelsmith/" }
image: /work/pixelsmith/cover
imageAlt: "The Pixelsmith landing page: “Forge your pixels.” beside a photo of two parrots being recompressed block by block, with live quality, size, ratio and PSNR readouts."
stack: [C, WebAssembly, JavaScript, Makefile]
links:
  - { label: Repository, href: "https://github.com/castlelli/algorithms/tree/main/pixelsmith" }
---

Pixelsmith is one small C11 library and one command-line tool. It compresses images with its own codec: YCbCr, 4:2:0 subsampling, an 8×8 DCT, quantization and Huffman tables built per image.

Around the codec there are the everyday tools: resize, crop, rotate, tone and colour adjustments, filters, palette reduction with dithering, and quality metrics such as PSNR and SSIM.

The website runs the same C code compiled to WebAssembly. Images stay on your machine, and nothing is uploaded. The tests run with AddressSanitizer and UBSan.
