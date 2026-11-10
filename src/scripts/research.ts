// Plate I controls: two-view drawings, the edge-AI quantiser, the heart pump.

const fig = document.querySelector<HTMLElement>('[data-axes]');
if (fig) {
  const f = (n: number) => n.toFixed(1);

  // two-view drawings
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

  // edge: quantise a sine to 2^bits levels
  const words = JSON.parse(fig.dataset.quant!) as { bit: string; levels: string; size: string };
  const dec = fig.dataset.dec || '.';
  const bits = fig.querySelector<HTMLInputElement>('[data-bits]');
  const out = fig.querySelector<HTMLOutputElement>('[data-bits-out]');
  const quant = fig.querySelector<SVGPathElement>('[data-quant]');
  function quantise() {
    if (!bits || !quant || !out) return;
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
    out.textContent = `${b} ${words.bit} · ${levels} ${words.levels} · ${pct} % ${words.size}`;
  }
  bits?.addEventListener('input', quantise);
  quantise();

  // health: run / stop the pump
  const run = fig.querySelector<HTMLButtonElement>('[data-run]');
  run?.addEventListener('click', () => {
    const card = run.closest<HTMLElement>('[data-ax]')!;
    const on = !card.classList.contains('run');
    card.classList.toggle('run', on);
    run.setAttribute('aria-pressed', String(on));
    run.textContent = on ? run.dataset.on! : run.dataset.off!;
  });
}
