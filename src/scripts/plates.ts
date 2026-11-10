// Work plates: wipe open on entry, tilt and catch the light under the pointer,
// and the Duffing points build up in integration order as you scroll past.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const plates = Array.from(document.querySelectorAll<HTMLElement>('[data-plate]'));

if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    // watch the figure, not the plate: a clipped plate never counts as visible
    for (const en of entries) if (en.isIntersecting) {
      const p = en.target.querySelector('[data-plate]'); p?.classList.remove('pending'); p?.classList.add('run'); io.unobserve(en.target);
    }
  }, { threshold: 0.2 });
  plates.forEach((p) => { p.classList.add('pending'); io.observe(p.parentElement ?? p); });
}

if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  plates.forEach((p) => {
    p.addEventListener('pointermove', (e) => {
      const r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      p.style.setProperty('--ry', `${(x - 0.5) * 5}deg`); p.style.setProperty('--rx', `${(0.5 - y) * 4}deg`);
      p.style.setProperty('--lx', `${x * 100}%`); p.style.setProperty('--ly', `${y * 100}%`);
    });
    p.addEventListener('pointerleave', () => { p.style.setProperty('--rx', '0deg'); p.style.setProperty('--ry', '0deg'); });
  });
}

// Duffing: ten chunks of the section, revealed in the order they were integrated
document.querySelectorAll<SVGSVGElement>('[data-phase]').forEach((svg) => {
  if (reduce) return;
  const chunks = Array.from(svg.querySelectorAll<SVGPathElement>('.ph-dots'));
  gsap.set(chunks, { opacity: 0 });
  const paint = (st: ScrollTrigger) => chunks.forEach((c, i) => { c.style.opacity = String(Math.max(0, Math.min(1, st.progress * chunks.length - i))); });
  ScrollTrigger.create({ trigger: svg, start: 'top 85%', end: 'center 45%', onUpdate: paint, onRefresh: paint });
});
