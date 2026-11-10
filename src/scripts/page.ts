// Page chrome: mobile menu, the running head's rule, and figure entrances.

const root = document.documentElement;
const $$ = <T extends Element>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

// ---- menu ----
const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
document.querySelector('[data-open-menu]')?.addEventListener('click', () => menu?.showModal());
$$('[data-close-menu]').forEach((el) => el.addEventListener('click', () => menu?.close()));

// ---- running head: the rule appears once the page has scrolled ----
const onScroll = () => root.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- figures draw themselves once, when they come into view ----
// Figures are complete in the HTML. Script marks them pending (hidden parts)
// only when motion is allowed, then runs them when they enter the viewport.
const figs = $$<SVGSVGElement>('[data-schem], [data-phase]');
if (figs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target as SVGSVGElement;
        el.classList.remove('pending');
        el.classList.add('run');
        io.unobserve(el);
      }
    },
    { threshold: 0.25 },
  );
  figs.forEach((f) => {
    const r = f.getBoundingClientRect();
    // a figure already on screen at load runs straight away
    f.classList.add('pending');
    if (r.top < innerHeight && r.bottom > 0) requestAnimationFrame(() => { f.classList.remove('pending'); f.classList.add('run'); });
    else io.observe(f);
  });
}
