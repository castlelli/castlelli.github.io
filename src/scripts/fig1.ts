import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { PLATE, BALLOON_X, YAW0, YAW_RANGE, plateGeo, lift } from '../lib/iso';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const svg = document.querySelector<SVGSVGElement>('[data-assembly]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (svg) {
  const plates = Array.from(svg.querySelectorAll<SVGGElement>('[data-plate]'));
  const lines = Array.from(svg.querySelectorAll<SVGLineElement>('[data-cl]'));
  const state = { yaw: YAW0, p: 1 };

  function render() {
    const geos = plates.map((_, i) => plateGeo(i, state.yaw));
    plates.forEach((g, i) => {
      const geo = geos[i];
      g.setAttribute('transform', `translate(0 ${lift(i, state.p).toFixed(2)})`);
      const paths = g.querySelectorAll<SVGPathElement>(':scope > path');
      paths.forEach((p, k) => p.setAttribute('d', geo.d[k]));
      const [ax, ay] = geo.anchor;
      const by = ay - 22;
      const leader = g.querySelector<SVGLineElement>('[data-leader]')!;
      leader.setAttribute('x1', ax.toFixed(1)); leader.setAttribute('y1', ay.toFixed(1));
      leader.setAttribute('x2', String(BALLOON_X - 13)); leader.setAttribute('y2', by.toFixed(1));
      g.querySelector('circle')!.setAttribute('cy', by.toFixed(1));
      g.querySelector('.b-n')!.setAttribute('y', (by + 4).toFixed(1));
      g.querySelector('.b-l')!.setAttribute('y', (by + 29).toFixed(1));
    });
    const top = PLATE.count - 1;
    lines.forEach((ln, k) => {
      const [x, y] = geos[0].corners[k];
      ln.setAttribute('x1', x.toFixed(1)); ln.setAttribute('x2', x.toFixed(1));
      ln.setAttribute('y1', (y + lift(0, state.p)).toFixed(1));
      ln.setAttribute('y2', (y - top * PLATE.t + lift(top, state.p)).toFixed(1));
    });
    svg!.style.setProperty('--open', String(state.p));
  }

  // ---- balloon <-> parts list ----
  const rows = Array.from(document.querySelectorAll<HTMLTableRowElement>('.bom-table tbody tr'));
  function mark(item: string | null) {
    plates.forEach((g) => g.classList.toggle('on', item !== null && g.dataset.item === item));
    rows.forEach((r) => r.classList.toggle('on', item !== null && r.dataset.item === item));
  }
  plates.forEach((g) => {
    const b = g.querySelector<SVGAElement>('.balloon')!;
    b.addEventListener('pointerenter', () => mark(g.dataset.item!));
    b.addEventListener('pointerleave', () => mark(null));
    b.addEventListener('focus', () => mark(g.dataset.item!));
    b.addEventListener('blur', () => mark(null));
    g.addEventListener('pointerenter', () => mark(g.dataset.item!));
    g.addEventListener('pointerleave', () => mark(null));
  });
  rows.forEach((r) => {
    r.addEventListener('pointerenter', () => mark(r.dataset.item!));
    r.addEventListener('pointerleave', () => mark(null));
  });

  // ---- drag to rotate, springs back on release ----
  let dragging = false;
  let startX = 0;
  let startYaw = YAW0;
  let moved = false;
  svg.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false; startX = e.clientX; startYaw = state.yaw;
    gsap.killTweensOf(state, 'yaw');
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    state.yaw = gsap.utils.clamp(YAW0 - YAW_RANGE, YAW0 + YAW_RANGE, startYaw - dx * 0.12);
    render();
  }, { passive: true });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    if (reduce) { state.yaw = YAW0; render(); return; }
    gsap.to(state, { yaw: YAW0, duration: 1.1, ease: 'elastic.out(1, 0.55)', onUpdate: render });
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  // a drag that ends on a balloon should not follow its link
  svg.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);

  // ---- name cota: measure the rendered name ----
  const name = document.querySelector<HTMLElement>('[data-name]');
  const px = document.querySelector<HTMLElement>('[data-name-px]');
  const measure = () => { if (name && px) px.textContent = `${Math.round(name.getBoundingClientRect().width)} px`; };
  measure();
  window.addEventListener('resize', measure, { passive: true });
  document.fonts?.ready.then(measure);

  // ---- motion ----
  if (!reduce) {
    state.p = 0;
    render();

    const paths = svg.querySelectorAll('.plate > path');
    const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
    intro
      .from('.hero-copy > *', { y: 22, opacity: 0, duration: 0.7, stagger: 0.09 })
      .from('[data-name-cota]', { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power3.inOut' }, 0.35)
      .from(paths, { drawSVG: '0%', duration: 1.1, stagger: 0.012, ease: 'power1.inOut' }, 0.15)
      .from('.bom', { y: 18, opacity: 0, duration: 0.6 }, 0.9)
      .from('.hero-fig .fig-cap', { opacity: 0, duration: 0.5 }, 1.1);

    const mm = gsap.matchMedia();
    // Tall desktop viewports: pin the hero and explode while pinned.
    mm.add('(min-width: 1000px) and (min-height: 840px)', () => {
      const st = ScrollTrigger.create({
        trigger: '.hero',
        start: 'top 56px',
        end: '+=90%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => { state.p = self.progress; render(); },
      });
      return () => st.kill();
    });
    // Everything else: explode as the figure travels up the screen.
    mm.add('not ((min-width: 1000px) and (min-height: 840px))', () => {
      const st = ScrollTrigger.create({
        trigger: '.hero-fig',
        start: 'top 62%',
        end: 'top 8%',
        scrub: 0.6,
        onUpdate: (self) => { state.p = self.progress; render(); },
      });
      return () => st.kill();
    });
  }
}
