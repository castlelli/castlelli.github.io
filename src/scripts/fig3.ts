import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const fig = document.querySelector<HTMLElement>('[data-axes]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (fig) {
  const stage = fig.querySelector<HTMLElement>('[data-stage]')!;
  const linesSvg = fig.querySelector<SVGSVGElement>('[data-lines]')!;
  const datum = fig.querySelector<HTMLElement>('[data-datum]')!;
  const datumMark = datum.querySelector<HTMLElement>('.ax-datum-mark')!;
  const cards = Array.from(fig.querySelectorAll<HTMLElement>('[data-ax]'));
  const spec = fig.querySelector<HTMLElement>('.ax-spec')!;
  const specs = Array.from(fig.querySelectorAll<HTMLElement>('[data-spec]'));
  const f = (n: number) => n.toFixed(1);

  // ---- routing: one line per drawing, PCB style (straight, then 45°) ----
  function route() {
    // offset* values ignore transforms, so entrance animations do not skew the routing
    const W = stage.offsetWidth, H = stage.offsetHeight;
    const cx = datum.offsetLeft + datumMark.offsetLeft + datumMark.offsetWidth / 2;
    const cy = datum.offsetTop + datumMark.offsetTop + datumMark.offsetHeight / 2;
    linesSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const wide = matchMedia('(min-width: 1000px)').matches;

    cards.forEach((card) => {
      const id = card.dataset.ax!;
      const L = card.offsetLeft, T = card.offsetTop, w = card.offsetWidth, h = card.offsetHeight;
      const g = linesSvg.querySelector(`[data-line="${id}"]`)!;
      let d: string;
      if (wide) {
        const above = T + h / 2 < cy;
        const mid = L + w / 2;
        const frac = Math.abs(mid - cx) < 4 ? 0.5 : mid < cx ? 0.8 : 0.2;
        const sx = L + w * frac;
        const sy = above ? T + h : T;
        const dx = cx - sx, dy = cy - sy;
        const sgx = Math.sign(dx), sgy = Math.sign(dy);
        if (Math.abs(dx) < 2) d = `M${f(sx)} ${f(sy)}V${f(cy)}`;
        else {
          // stub out of the drawing, chamfer, horizontal run, then 45° into the datum
          const c = 14;
          const y1 = sy + sgy * Math.abs(dy) * 0.34;
          const rem = Math.abs(cy - y1);
          d = `M${f(sx)} ${f(sy)}V${f(y1 - sgy * c)}L${f(sx + sgx * c)} ${f(y1)}H${f(cx - sgx * rem)}L${f(cx)} ${f(cy)}`;
        }
      } else {
        // narrow screens: a trunk down the left edge
        const sy = T + Math.min(60, h / 2);
        d = `M${f(L)} ${f(sy)}H8V${f(cy)}H${f(cx)}`;
      }
      g.querySelectorAll('path').forEach((p) => p.setAttribute('d', d));
    });
  }

  // ---- selection ----
  let current: string | null = null;
  function select(id: string | null) {
    if (id === current) return;
    current = id;
    stage.classList.toggle('has-sel', id !== null);
    spec.classList.toggle('has-sel', id !== null);
    cards.forEach((c) => {
      const on = c.dataset.ax === id;
      c.classList.toggle('on', on);
      c.querySelector('[data-select]')!.setAttribute('aria-pressed', String(on));
      if (c.dataset.ax === 'health') setRun(c, on);
    });
    linesSvg.querySelectorAll('[data-line]').forEach((g) => g.classList.toggle('on', (g as HTMLElement).dataset.line === id));
    specs.forEach((s) => s.classList.toggle('on', s.dataset.spec === id));
  }
  cards.forEach((c) => {
    const id = c.dataset.ax!;
    c.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') select(id); });
    c.addEventListener('click', () => select(id));
    c.addEventListener('focusin', () => select(id));
  });

  // ---- two-view drawings ----
  fig.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const card = btn.closest<HTMLElement>('[data-ax]')!;
      const alt = btn.dataset.view === 'b';
      card.classList.toggle('is-alt', alt);
      card.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) =>
        b.setAttribute('aria-pressed', String((b.dataset.view === 'b') === alt)),
      );
    }),
  );

  // ---- edge: quantiser ----
  const words = JSON.parse(fig.dataset.quant!) as { bit: string; levels: string; size: string };
  const dec = fig.dataset.dec || '.';
  const bits = fig.querySelector<HTMLInputElement>('[data-bits]');
  const bitsOut = fig.querySelector<HTMLOutputElement>('[data-bits-out]');
  const quant = fig.querySelector<SVGPathElement>('[data-quant]');
  function quantise() {
    if (!bits || !quant || !bitsOut) return;
    const b = +bits.value;
    const levels = 2 ** b;
    let d = '';
    let prev = 0;
    for (let i = 0; i <= 52; i++) {
      const v = Math.sin((i / 52) * Math.PI * 2 * 1.25);
      const q = (Math.round(((v + 1) / 2) * (levels - 1)) / (levels - 1)) * 2 - 1;
      const x = 196 + i * 2;
      const y = 108 - 40 * q;
      d += i === 0 ? `M${x} ${f(y)}` : y === prev ? `H${x}` : `H${x}V${f(y)}`;
      prev = y;
    }
    quant.setAttribute('d', d);
    const pct = String((b / 32) * 100).replace('.', dec);
    bitsOut.textContent = `${b} ${words.bit} · ${levels} ${words.levels} · ${pct} % ${words.size}`;
  }
  bits?.addEventListener('input', quantise);
  quantise();

  // ---- health: run / stop ----
  function setRun(card: HTMLElement, on: boolean) {
    const btn = card.querySelector<HTMLButtonElement>('[data-run]')!;
    card.classList.toggle('run', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? btn.dataset.on! : btn.dataset.off!;
  }
  fig.querySelector<HTMLButtonElement>('[data-run]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = (e.currentTarget as HTMLElement).closest<HTMLElement>('[data-ax]')!;
    select('health');
    setRun(card, !card.classList.contains('run'));
  });

  // ---- layout + entrance ----
  route();
  new ResizeObserver(() => route()).observe(stage);
  document.fonts?.ready.then(route);

  if (reduce) {
    datum.classList.add('lit');
    select('icb');
  } else {
    const lines = linesSvg.querySelectorAll('.ax-line');
    gsap.set(cards, { opacity: 0, y: 24 });
    gsap.set(lines, { drawSVG: '0%' });
    gsap.set(datum, { opacity: 0, scale: 0.8 });
    gsap.set('.ax-cota', { clipPath: 'inset(0 50% 0 50%)' });
    gsap
      .timeline({ scrollTrigger: { trigger: stage, start: 'top 70%', once: true }, defaults: { ease: 'power2.out' } })
      .to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, clearProps: 'opacity,transform' })
      .to('.ax-cota', { clipPath: 'inset(0 0% 0 0%)', duration: 0.7, ease: 'power3.inOut' }, 0.5)
      .to(datum, { opacity: 1, scale: 1, duration: 0.5 }, 0.8)
      .to(lines, { drawSVG: '100%', duration: 0.9, stagger: 0.1, ease: 'power1.inOut' }, 0.9)
      .add(() => { datum.classList.add('lit'); if (current === null) select('icb'); }, '>-0.05');
  }
}
