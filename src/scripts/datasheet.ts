import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Measured values count up once. Text such as "~200", "≤ 11" or "5,000+" keeps
// its prefix, suffix and separators; dashes and non-numbers are left alone.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const text = el.textContent ?? '';
    const match = text.match(/^(\D*)(\d[\d.,]*)(\D*)$/);
    if (!match) return;
    const [, pre, num, post] = match;
    const sep = num.match(/[.,]/)?.[0] ?? '';
    const thousands = /[.,]\d{3}$/.test(num);
    const target = Number(thousands ? num.replace(/[.,]/g, '') : num.replace(',', '.'));
    if (!Number.isFinite(target)) return;
    const decimals = thousands ? 0 : (num.split(/[.,]/)[1]?.length ?? 0);
    const fmt = (v: number) => {
      if (thousands) return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
      return v.toFixed(decimals).replace('.', sep || '.');
    };
    const state = { v: 0 };
    el.style.minWidth = `${el.offsetWidth}px`;
    gsap.to(state, {
      v: target, duration: 1.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = pre + fmt(state.v) + post; },
      onComplete: () => { el.textContent = text; },
    });
  });
}
