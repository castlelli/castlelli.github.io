// Geometry for FIG. 1, the exploded assembly. Shared by the server render and
// the client script, so the drawing exists without JavaScript and can be
// re-projected when the visitor drags to rotate it.

export type Pt = [number, number];

export const PLATE = { w: 300, d: 200, t: 16, gap: 92, count: 4 };
export const YAW0 = 45;
export const YAW_RANGE = 20;

const rad = (deg: number) => (deg * Math.PI) / 180;

export function project(x: number, y: number, z: number, yaw: number): Pt {
  const c = Math.cos(rad(yaw));
  const s = Math.sin(rad(yaw));
  const xr = x * c - y * s;
  const yr = x * s + y * c;
  return [xr, yr * 0.5 - z];
}

const f = (n: number) => n.toFixed(1);

function path(pts: [number, number][], z: number, yaw: number, close = true): string {
  return (
    pts
      .map(([x, y], i) => {
        const [X, Y] = project(x, y, z, yaw);
        return `${i ? 'L' : 'M'}${f(X)} ${f(Y)}`;
      })
      .join('') + (close ? 'Z' : '')
  );
}

const rect = (x0: number, y0: number, x1: number, y1: number): [number, number][] => [
  [x0, y0], [x1, y0], [x1, y1], [x0, y1],
];

function ring(cx: number, cy: number, r: number, n = 12): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  });
}

// A gene drawn the way gene-neighbourhood figures draw it: a block arrow.
function gene(x0: number, x1: number, y: number, h = 11): [number, number][] {
  const dir = x1 > x0 ? 1 : -1;
  const head = Math.min(14, Math.abs(x1 - x0) * 0.45) * dir;
  return [
    [x0, y - h], [x1 - head, y - h], [x1, y], [x1 - head, y + h], [x0, y + h],
  ];
}

export interface Shape { cls: string; pts: [number, number][]; close: boolean }

// Top-face artwork of each plate, bottom to top.
function details(i: number): Shape[] {
  const s = (cls: string, pts: [number, number][], close = true): Shape => ({ cls, pts, close });
  const { w, d } = PLATE;
  const hw = w / 2, hd = d / 2;
  switch (i) {
    case 0: {
      // Foundations: a base plate with mounting holes and a setting-out grid.
      const out: Shape[] = [];
      for (const [cx, cy] of [[-hw + 22, -hd + 22], [hw - 22, -hd + 22], [hw - 22, hd - 22], [-hw + 22, hd - 22]])
        out.push(s('d-line', ring(cx, cy, 8)));
      for (let x = -90; x <= 90; x += 45) out.push(s('d-soft', [[x, -hd + 44], [x, hd - 44]], false));
      for (let y = -50; y <= 50; y += 50) out.push(s('d-soft', [[-hw + 44, y], [hw - 44, y]], false));
      return out;
    }
    case 1: {
      // Shipped products: three packages on a board, with their pins.
      const out: Shape[] = [];
      for (const cx of [-95, 0, 95]) {
        out.push(s('d-line', rect(cx - 30, -34, cx + 30, 34)));
        out.push(s('d-soft', ring(cx - 19, -23, 3.5, 8)));
        for (let y = -24; y <= 24; y += 12) {
          out.push(s('d-soft', [[cx - 30, y], [cx - 40, y]], false));
          out.push(s('d-soft', [[cx + 30, y], [cx + 40, y]], false));
        }
      }
      out.push(s('d-soft', [[-hw + 18, 66], [hw - 18, 66]], false));
      out.push(s('d-soft', [[-hw + 18, -66], [hw - 18, -66]], false));
      return out;
    }
    case 2: {
      // Web builds: a page wireframe.
      return [
        s('d-line', rect(-hw + 22, -hd + 22, hw - 22, hd - 22)),
        s('d-line', [[-hw + 22, -hd + 46], [hw - 22, -hd + 46]], false),
        s('d-soft', ring(-hw + 36, -hd + 34, 4, 8)),
        s('d-soft', ring(-hw + 50, -hd + 34, 4, 8)),
        s('d-line', rect(-hw + 38, -hd + 62, -10, 20)),
        s('d-soft', rect(8, -hd + 62, hw - 38, -22)),
        s('d-soft', rect(8, -8, hw - 38, 20)),
        s('d-soft', [[-hw + 38, 40], [hw - 38, 40]], false),
        s('d-soft', [[-hw + 38, 56], [hw - 90, 56]], false),
      ];
    }
    default: {
      // Research: gene neighbourhoods, three genomes with one conserved gene.
      const out: Shape[] = [];
      const rows: [number, [number, number, boolean?][]][] = [
        [-58, [[-128, -84], [-76, -22], [-14, 36, true], [44, 92], [128, 100]]],
        [0, [[-88, -128], [-80, -40], [-32, 18, true], [26, 62], [70, 124]]],
        [58, [[-124, -60], [-10, -52], [-2, 48, true], [100, 56], [108, 130]]],
      ];
      for (const [y, genes] of rows) {
        out.push(s('d-soft', [[-hw + 14, y], [hw - 14, y]], false));
        for (const [a, b, hot] of genes) out.push(s(hot ? 'd-hot' : 'd-line', gene(a, b, y)));
      }
      return out;
    }
  }
}

const DETAILS = Array.from({ length: PLATE.count }, (_, i) => details(i));

export interface PlateGeo {
  /** path data, in a fixed order: side A, side B, top, then details */
  d: string[];
  cls: string[];
  /** rightmost corner on screen, where the balloon leader starts */
  anchor: Pt;
  /** the three visible lower corners, for the dashed centre lines */
  corners: Pt[];
}

export function plateGeo(i: number, yaw: number): PlateGeo {
  const { w, d, t } = PLATE;
  const hw = w / 2, hd = d / 2;
  const z0 = i * t;
  const z1 = z0 + t;
  const P = (x: number, y: number, z: number) => project(x, y, z, yaw);
  const q = (pts: Pt[]) => pts.map(([X, Y], k) => `${k ? 'L' : 'M'}${f(X)} ${f(Y)}`).join('') + 'Z';

  const sideA = q([P(-hw, hd, z0), P(hw, hd, z0), P(hw, hd, z1), P(-hw, hd, z1)]);
  const sideB = q([P(hw, -hd, z0), P(hw, hd, z0), P(hw, hd, z1), P(hw, -hd, z1)]);
  const top = path(rect(-hw, -hd, hw, hd), z1, yaw);
  const det = DETAILS[i];

  return {
    d: [sideA, sideB, top, ...det.map((sh) => path(sh.pts, z1 + 0.01, yaw, sh.close))],
    cls: ['p-side', 'p-side', 'p-top', ...det.map((sh) => sh.cls)],
    anchor: P(hw, -hd, z1),
    corners: [P(-hw, hd, z0), P(hw, hd, z0), P(hw, -hd, z0)],
  };
}

/** vertical offset of plate i at explosion progress p (0 closed, 1 open) */
export function lift(i: number, p: number): number {
  return -(i - (PLATE.count - 1) / 2) * PLATE.gap * p;
}

export const VIEWBOX = { x: -215, y: -292, w: 560, h: 520 };
export const BALLOON_X = 262;
