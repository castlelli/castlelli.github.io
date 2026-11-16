// The story's one line: when a chapter reaches the reading line, the panel's line
// reshapes into that chapter's figure. Native scroll; nothing is pinned or scrubbed.
import { stain } from './stain';

const root = document.querySelector<HTMLElement>('[data-story]');
if (root) {
  const shapes: number[][] = JSON.parse(root.dataset.shapes || '[]');
  const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'));
  const line = root.querySelector<SVGPathElement>('[data-line]');
  const dot = root.querySelector<SVGRectElement>('[data-dot]');
  const label = root.querySelector<HTMLElement>('[data-panel-label]');
  const num = root.querySelector<HTMLElement>('[data-panel-n]');
  const cap = root.querySelector<HTMLElement>('[data-panel-cap]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 600, H = 400, PAD = 24;
  const ease = (t: number) => 1 - Math.pow(1 - t, 4); // close to cubic-bezier(.16,1,.3,1)

  let current = shapes[0].slice();
  let active = -1;
  let raf = 0;

  const draw = (ys: number[]) => {
    const step = (W - PAD * 2) / (ys.length - 1);
    let d = '';
    for (let i = 0; i < ys.length; i++) d += `${i ? 'L' : 'M'}${(PAD + i * step).toFixed(1)} ${(H / 2 - ys[i] * H * 0.38).toFixed(1)}`;
    line?.setAttribute('d', d);
    const ey = H / 2 - ys[ys.length - 1] * H * 0.38;
    dot?.setAttribute('y', (ey - 6).toFixed(1));
  };

  const morph = (to: number[]) => {
    cancelAnimationFrame(raf);
    if (reduce) { current = to.slice(); draw(current); return; }
    const from = current.slice(), t0 = performance.now(), dur = 700;
    const tick = (now: number) => {
      const k = ease(Math.min(1, (now - t0) / dur));
      current = from.map((y, i) => y + (to[i] - y) * k);
      draw(current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const activate = (i: number) => {
    if (i === active) return;
    active = i;
    chapters.forEach((c, j) => c.classList.toggle('is-active', j === i));
    const c = chapters[i];
    if (label) label.textContent = c.querySelector('.ch-label')?.textContent?.trim() ?? '';
    if (num) num.textContent = String(i + 1);
    if (cap) cap.textContent = c.querySelector('figcaption')?.textContent ?? '';
    if (shapes[i]) morph(shapes[i]);
    if (!reduce) { const s = c.querySelector('.ch-stain'); if (s) stain(s); }
  };

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && activate(Number((e.target as HTMLElement).dataset.chapter))),
    { rootMargin: '-45% 0px -45% 0px' },
  );
  chapters.forEach((c) => io.observe(c));

  // phones: each inline figure draws itself in once, as its chapter arrives
  if (!reduce) {
    const lines = Array.from(root.querySelectorAll<SVGPathElement>('.ch-line'));
    lines.forEach((l) => { l.style.strokeDasharray = '1'; l.style.strokeDashoffset = '1'; });
    const draws = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const l = e.target.querySelector<SVGPathElement>('.ch-line');
      l?.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
      draws.unobserve(e.target);
    }), { threshold: 0.4 });
    root.querySelectorAll('.ch-fig').forEach((f) => draws.observe(f));
  }
}
