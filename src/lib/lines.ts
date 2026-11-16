// The story's one line in three shapes, as y-values in [-1, 1] on a shared x grid.
// Same point count everywhere, so the line can reshape from one meaning to the next.
export const N = 96;

// small seeded PRNG so the "measurements" are identical on every build
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32) * 2 - 1;
}

/** science: noisy measurements settling onto a damped model curve (illustrative) */
export function science(): number[] {
  const r = rng(7);
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const model = 0.62 * Math.exp(-1.6 * t) * Math.cos(2 * Math.PI * 2.2 * t);
    const noise = 0.42 * Math.pow(1 - t, 1.6) * r();
    return model + noise;
  });
}

/** technology: a digital signal through a gate, four periods with short edges */
export function technology(): number[] {
  return Array.from({ length: N }, (_, i) => {
    const phase = (i / N) * 4 % 1;
    if (phase < 0.04) return -0.55 + 1.1 * (phase / 0.04);
    if (phase < 0.5) return 0.55;
    if (phase < 0.54) return 0.55 - 1.1 * ((phase - 0.5) / 0.04);
    return -0.55;
  });
}

/** industry: a heartbeat trace, two beats (illustrative) */
export function industry(): number[] {
  const beat = (u: number) => {
    const g = (c: number, w: number, a: number) => a * Math.exp(-(((u - c) / w) ** 2));
    return g(0.18, 0.035, 0.14) + g(0.36, 0.012, -0.16) + g(0.4, 0.014, 0.95) + g(0.44, 0.014, -0.32) + g(0.66, 0.06, 0.26);
  };
  return Array.from({ length: N }, (_, i) => beat(((i / N) * 2) % 1) - 0.1);
}

export const shapes = () => [science(), technology(), industry()];

/** an SVG path for y-values inside a w × h box, with horizontal padding */
export function toPath(ys: number[], w: number, h: number, pad = 24): string {
  const step = (w - pad * 2) / (ys.length - 1);
  return ys.map((y, i) => `${i ? 'L' : 'M'}${(pad + i * step).toFixed(1)} ${(h / 2 - y * h * 0.38).toFixed(1)}`).join('');
}
