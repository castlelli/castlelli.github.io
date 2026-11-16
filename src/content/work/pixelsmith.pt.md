---
lang: pt
slug: pixelsmith
order: 6
domain: image-processing
year: "2026"
title: Pixelsmith
summary: Ferramentas de imagem gratuitas escritas em C, com um codec DCT construído a partir do bloco 8×8. O mesmo código roda no navegador em WebAssembly.
role: Autor
dates: "2026"
status: No ar
site: { label: castlelli.github.io/algorithms/pixelsmith, href: "https://castlelli.github.io/algorithms/pixelsmith/" }
image: /work/pixelsmith/cover
imageAlt: "A página inicial do Pixelsmith: “Forge your pixels.” ao lado de uma foto de duas araras sendo recomprimida bloco a bloco, com qualidade, tamanho, taxa e PSNR ao vivo."
stack: [C, WebAssembly, JavaScript, Makefile]
links:
  - { label: Repositório, href: "https://github.com/castlelli/algorithms/tree/main/pixelsmith" }
---

O Pixelsmith é uma pequena biblioteca em C11 e uma ferramenta de linha de comando. Ele comprime imagens com um codec próprio: YCbCr, subamostragem 4:2:0, DCT 8×8, quantização e tabelas de Huffman montadas para cada imagem.

Em volta do codec ficam as ferramentas do dia a dia: redimensionar, recortar, girar, ajustes de tom e cor, filtros, redução de paleta com pontilhado e métricas de qualidade como PSNR e SSIM.

O site roda o mesmo código C compilado para WebAssembly. As imagens ficam na sua máquina e nada é enviado. Os testes rodam com AddressSanitizer e UBSan.
