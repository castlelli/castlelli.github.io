// Boots the film only when it can play well: WebGL available, motion allowed,
// no data saver. three.js loads after first paint so the page is readable at once.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

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

  // the beats fade in and out as they cross the middle of the screen
  section.querySelectorAll<HTMLElement>('[data-beat]').forEach((b, i) => {
    if (i === 0) {
      gsap.to(b, { opacity: 0, ease: 'none', scrollTrigger: { trigger: b, start: 'bottom 70%', end: 'bottom 20%', scrub: true } });
      return;
    }
    gsap.fromTo(b.children, { opacity: 0 }, { opacity: 1, stagger: 0.08, ease: 'power1.inOut', scrollTrigger: { trigger: b, start: 'top 75%', end: 'top 35%', scrub: true } });
    gsap.to(b.children, { opacity: 0, ease: 'power1.inOut', immediateRender: false, scrollTrigger: { trigger: b, start: 'bottom 45%', end: 'bottom 10%', scrub: true } });
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

    addEventListener('pointermove', (e) => film.setPointer(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5), { passive: true });
    addEventListener('resize', () => film.resize(), { passive: true });

    // render only while the film is on screen and the tab is visible
    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible && !document.hidden ? film.start() : film.stop(); }).observe(section);
    document.addEventListener('visibilitychange', () => (visible && !document.hidden ? film.start() : film.stop()));
    film.start();
  });
}
