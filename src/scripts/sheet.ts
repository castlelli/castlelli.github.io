// Sheet chrome: print modes, layers, menu, crosshair, scroll trace, current sheet.

const root = document.documentElement;
const $$ = <T extends Element>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

// ---- print modes ----
function setMode(mode: string, persist = true) {
  root.setAttribute('data-mode', mode);
  $$<HTMLButtonElement>('[data-set-mode]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.setMode === mode)),
  );
  const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (theme) theme.content = getComputedStyle(root).getPropertyValue('--bg').trim();
  if (persist) {
    try { localStorage.setItem('vc-mode', mode); } catch { /* storage unavailable */ }
  }
}
setMode(root.getAttribute('data-mode') || 'blueprint', false);
$$<HTMLButtonElement>('[data-set-mode]').forEach((b) =>
  b.addEventListener('click', () => setMode(b.dataset.setMode!)),
);

// ---- layers ----
$$<HTMLInputElement>('[data-toggle-layer]').forEach((box) =>
  box.addEventListener('change', () => {
    const layer = box.dataset.toggleLayer!;
    root.toggleAttribute(`data-hide-${layer}`, !box.checked);
    $$<HTMLInputElement>(`[data-toggle-layer="${layer}"]`).forEach((o) => (o.checked = box.checked));
  }),
);
document.addEventListener('click', (e) => {
  const pop = document.querySelector<HTMLDetailsElement>('.tb-layers[open]');
  if (pop && !pop.contains(e.target as Node)) pop.open = false;
});

// ---- menu ----
const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
document.querySelector('[data-open-menu]')?.addEventListener('click', () => menu?.showModal());
$$('[data-close-menu]').forEach((el) => el.addEventListener('click', () => menu?.close()));

// ---- crosshair + coordinate readout ----
const xhH = document.querySelector<HTMLElement>('[data-xh-h]');
const xhV = document.querySelector<HTMLElement>('[data-xh-v]');
const xy = document.querySelector<HTMLElement>('[data-xy]');
const pad = (n: number, w = 4) => String(Math.max(0, Math.round(n))).padStart(w, '0');
if (xhH && xhV && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let raf = 0;
  let px = 0, py = 0;
  window.addEventListener('pointermove', (e) => {
    px = e.clientX; py = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      xhH.style.transform = `translateY(${py}px)`;
      xhV.style.transform = `translateX(${px}px)`;
      xhH.classList.add('on'); xhV.classList.add('on');
      if (xy) xy.textContent = `X ${pad(px)} · Y ${pad(py + window.scrollY)}`;
    });
  }, { passive: true });
  document.addEventListener('pointerleave', () => { xhH.classList.remove('on'); xhV.classList.remove('on'); });
}

// ---- scroll trace ----
const dot = document.querySelector<HTMLElement>('[data-trace-dot]');
const pct = document.querySelector<HTMLElement>('[data-pct]');
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  if (dot) dot.style.top = `${p * 100}%`;
  if (pct) pct.textContent = `${pad(p * 100, 3)} %`;
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();

// ---- current sheet ----
const sheets = $$<HTMLElement>('[data-sheet]');
const label = document.querySelector<HTMLElement>('[data-current-sheet]');
if (sheets.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const id = (en.target as HTMLElement).dataset.sheet!;
        $$<HTMLAnchorElement>('[data-nav]').forEach((a) => {
          if (a.dataset.nav === id) {
            a.setAttribute('aria-current', 'true');
            if (label) label.textContent = a.textContent!.replace(/^(\d\d)/, '$1 · ');
          } else a.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sheets.forEach((s) => io.observe(s));
}
