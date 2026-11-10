// Page chrome: mobile menu and the running head's rule.

const root = document.documentElement;
const $$ = <T extends Element>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

// ---- menu ----
const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
document.querySelector('[data-open-menu]')?.addEventListener('click', () => menu?.showModal());
$$('[data-close-menu]').forEach((el) => el.addEventListener('click', () => menu?.close()));

// ---- running head: the rule appears once the page has scrolled ----
const film = document.querySelector<HTMLElement>('[data-film]');
const onScroll = () => {
  root.classList.toggle('scrolled', window.scrollY > 8);
  if (film) root.classList.toggle('past-film', film.getBoundingClientRect().bottom < 68);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
