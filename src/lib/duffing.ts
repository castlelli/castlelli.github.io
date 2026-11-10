// The forced Duffing oscillator, x'' + δx' + αx + βx³ = γ cos ωt, integrated with
// fourth-order Runge-Kutta. Shared by the Poincaré figure (build time) and the
// film's last beat (in the browser), so both show the same real attractor.

export const DUFFING = { delta: 0.3, alpha: -1, beta: 1, gamma: 0.5, omega: 1.2 } as const;

export interface DuffingRun {
  /** one [x, v] point per forcing period (the Poincaré section) */
  section: [number, number][];
  /** the continuous trajectory, sampled every `every` steps: [x, v, phase in 0..1) */
  path: [number, number, number][];
}

export function integrate({ periods = 4500, skip = 100, steps = 100, pathPeriods = 0, every = 2 } = {}): DuffingRun {
  const { delta: D, alpha: A, beta: B, gamma: G, omega: W } = DUFFING;
  const T = (2 * Math.PI) / W, h = T / steps;
  const acc = (t: number, x: number, v: number) => -D * v - A * x - B * x ** 3 + G * Math.cos(W * t);
  let x = 1, v = 0, t = 0;
  const section: [number, number][] = [];
  const path: [number, number, number][] = [];
  const total = periods + skip;
  for (let k = 0; k < total; k++) {
    for (let i = 0; i < steps; i++) {
      const a1 = acc(t, x, v);
      const x2 = x + (h / 2) * v, v2 = v + (h / 2) * a1, a2 = acc(t + h / 2, x2, v2);
      const x3 = x + (h / 2) * v2, v3 = v + (h / 2) * a2, a3 = acc(t + h / 2, x3, v3);
      const v4 = v + h * a3, a4 = acc(t + h, x + h * v3, v4);
      x += (h / 6) * (v + 2 * v2 + 2 * v3 + v4);
      v += (h / 6) * (a1 + 2 * a2 + 2 * a3 + a4);
      t += h;
      if (k >= total - pathPeriods && i % every === 0) path.push([x, v, i / steps]);
    }
    if (k >= skip) section.push([x, v]);
  }
  return { section, path };
}
