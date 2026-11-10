// Number tickers: any element with [data-count] counts up from zero the first
// time it scrolls into view. The text keeps its prefix, suffix and separators
// ("≈ 1.2", "5,000+", "10.000"); dashes and words are left alone. Width is
// locked first and digits are tabular, so nothing around the number jitters.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function parse(text: string) {
  const m = text.match(/^(\D*?)(\d[\d.,]*)(\D*)$/);
  if (!m) return null;
  const [, pre, num, post] = m;
  const thousands = /[.,]\d{3}(?!\d)/.test(num) && !/[.,]\d{1,2}$/.test(num);
  const sep = thousands ? (num.match(/[.,]/)?.[0] ?? ',') : '';
  const dec = !thousands ? (num.match(/[.,]/)?.[0] ?? '') : '';
  const target = Number(thousands ? num.replace(/[.,]/g, '') : num.replace(',', '.'));
  if (!Number.isFinite(target)) return null;
  const decimals = dec ? num.split(dec)[1].length : 0;
  const fmt = (v: number) => {
    if (thousands) return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    const s = v.toFixed(decimals);
    return dec ? s.replace('.', dec) : s;
  };
  return { pre, post, target, fmt };
}

const finals = new WeakMap<HTMLElement, string>();
function prime(el: HTMLElement) {
  const text = el.textContent ?? '';
  const p = parse(text.trim());
  if (!p) return null;
  finals.set(el, text);
  el.style.display = 'inline-block';
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  el.style.fontVariantNumeric = 'tabular-nums lining-nums';
  return p;
}
function run(el: HTMLElement) {
  const text = finals.get(el) ?? el.textContent ?? '';
  const p = parse(text.trim());
  if (!p) return;
  const t0 = performance.now(), dur = 1400 + Math.min(900, Math.log10(p.target + 1) * 260);
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
    el.textContent = p.pre + p.fmt(p.target * e) + p.post;
    if (k < 1) requestAnimationFrame(step); else el.textContent = text;
  };
  el.textContent = p.pre + p.fmt(0) + p.post;
  requestAnimationFrame(step);
}

const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
if (!reduce && els.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { run(en.target as HTMLElement); io.unobserve(en.target); }
  }, { threshold: 0.6 });
  els.forEach((el) => {
    const p = prime(el);
    if (!p) return;
    // numbers that start off screen wait at zero, so nothing flashes
    if (el.getBoundingClientRect().top > innerHeight) el.textContent = p.pre + p.fmt(0) + p.post;
    io.observe(el);
  });
}
