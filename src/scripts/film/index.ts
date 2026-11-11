// Boots the film only when it can play well: WebGL available, motion allowed,
// no data saver. three.js loads after first paint so the page is readable at once.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
// phones: the address bar showing/hiding must not re-measure the triggers mid-scroll
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
const section = document.querySelector<HTMLElement>('[data-film]');
const canvas = document.querySelector<HTMLCanvasElement>('[data-film-canvas]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = (navigator as any).connection?.saveData === true;

function webgl() {
  try { const c = document.createElement('canvas'); return Boolean(c.getContext('webgl2')); } catch { return false; }
}

// the name sets itself, letter by letter, on load
const name = document.querySelector<HTMLElement>('[data-split]');
if (name && !reduce) {
  document.fonts?.ready.then(() => {
    const split = SplitText.create(name, { type: 'chars', charsClass: 'ch' });
    gsap.from(split.chars, { yPercent: 110, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035, delay: 0.15 });
  });
}

if (section && canvas && !reduce && !saveData && webgl()) {
  root.classList.add('film-on');
  const light = matchMedia('(max-width: 899px), (pointer: coarse)').matches;
  const terminal = JSON.parse(section.dataset.terminal || '[]') as string[];
  const rail = Array.from(section.querySelectorAll<HTMLElement>('[data-rail]'));
  const railAt = [0, 0.24, 0.31, 0.4, 0.56, 0.86];

  // each beat's text is pinned (CSS sticky); over its pinned window it fades
  // in, holds, and fades out, without moving. The hero starts visible.
  section.querySelectorAll<HTMLElement>('[data-beat]').forEach((b, i) => {
    const inner = b.querySelector<HTMLElement>('.beat-in')!;
    const st = { trigger: b, start: 'top top', end: 'bottom bottom', scrub: true };
    if (i === 0) {
      gsap.timeline({ scrollTrigger: st }).to(inner, { opacity: 1, duration: 0.55 }).to(inner, { opacity: 0, duration: 0.45, ease: 'power1.in' });
      return;
    }
    gsap.set(inner, { opacity: 0 });
    // fades happen only while the text is pinned, so it is never seen moving
    const last = b.classList.contains('beat--coda');
    const tl = gsap.timeline({ scrollTrigger: st }).to(inner, { opacity: 1, duration: 0.3, ease: 'power1.out' }).to(inner, { opacity: 1, duration: 0.4 });
    // the closing line stays up as the work scrolls in
    if (!last) tl.to(inner, { opacity: 0, duration: 0.3, ease: 'power1.in' }); else tl.to(inner, { opacity: 1, duration: 0.3 });
  });

  document.fonts?.ready.then(async () => {
    await Promise.all([
      document.fonts.load('500 64px "IBM Plex Mono"'),
      document.fonts.load('600 64px "IBM Plex Sans"'),
      document.fonts.load('600 64px "Source Serif 4"'),
    ]).catch(() => {});
    const { createFilm } = await import('./film');
    const film = createFilm(canvas, { light, terminal });
    (window as any).__film = film; // lets tests jump to a frame

    ScrollTrigger.create({
      trigger: section, start: 'top top', end: 'bottom bottom',
      onUpdate: (st) => {
        film.setProgress(st.progress);
        let on = 0; railAt.forEach((a, i) => { if (st.progress >= a) on = i; });
        rail.forEach((r, i) => r.classList.toggle('on', i === on));
      },
    });
    rail[0]?.classList.add('on');

    // parallax follows a mouse only: touch-scrolling must not nudge the camera
    addEventListener('pointermove', (e) => e.pointerType === 'mouse' && film.setPointer(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5), { passive: true });
    // resize only when the width changes; on phones the address bar changes the height while scrolling
    let lastW = innerWidth;
    addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; film.resize(); } }, { passive: true });

    // render only while the film is on screen and the tab is visible
    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible && !document.hidden ? film.start() : film.stop(); }).observe(section);
    document.addEventListener('visibilitychange', () => (visible && !document.hidden ? film.start() : film.stop()));
    film.start();
  });
}
