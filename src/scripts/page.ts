// Page chrome: the mobile menu, the stain on load, and the reading bar on long pages.
import { stain } from './stain';

const $$ = <T extends Element>(sel: string) => Array.from(document.querySelectorAll<T>(sel));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- menu ----
const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
document.querySelector('[data-open-menu]')?.addEventListener('click', () => menu?.showModal());
$$('[data-close-menu]').forEach((el) => el.addEventListener('click', () => menu?.close()));

// ---- the stain: a solid copy of the text wipes in and out once ----
const stains = $$<HTMLElement>('[data-stain-load]');
if (!reduce && stains.length) {
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => stains.forEach((el) => stain(el, 200)));
}

// ---- reading bar: only where the page is long enough to need one ----
const bar = document.querySelector<HTMLElement>('[data-progress]');
if (bar) {
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  if (document.documentElement.scrollHeight > innerHeight * 2.2) {
    bar.hidden = false;
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }
}
