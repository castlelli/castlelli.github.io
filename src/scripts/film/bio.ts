// The biology half of the film: a multiple sequence alignment drawn as a wall of
// residue glyphs, and a protein backbone the first sequence folds into.
// The sequences are synthetic: one ancestral chain with realistic amino-acid
// frequencies, mutated per row with conserved and variable columns, so the wall
// reads like a real alignment without claiming to be one. The fold is a
// procedural chain of helices, strands and loops at real CA spacing (3.8 Å).
import * as THREE from 'three';
import { SCREEN } from './board';

export const AA = 'ACDEFGHIKLMNPQRSTVWY-';
// UniProt-like background frequencies (percent), gap handled separately
const FREQ = [8.3, 1.4, 5.5, 6.7, 3.9, 7.1, 2.3, 5.9, 5.8, 9.7, 2.4, 4.1, 4.7, 3.9, 5.5, 6.6, 5.3, 6.9, 1.1, 2.9];
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

export const COLS = 150, ROWS = 72;
export const CELL = SCREEN.w / 28; // 28 residues span the screen at the dive
export const ROW_GAP = CELL * 1.45;

export function makeAlignment(): number[][] {
  const r = rng(42);
  const pick = () => { let u = r() * 100; for (let i = 0; i < 20; i++) { u -= FREQ[i]; if (u <= 0) return i; } return 19; };
  const anc = Array.from({ length: COLS }, pick);
  const cons = Array.from({ length: COLS }, () => (r() < 0.3 ? 0.04 : r() < 0.6 ? 0.25 : 0.6));
  const rows: number[][] = [anc.slice()];
  for (let k = 1; k < ROWS; k++) {
    const row = anc.map((a, j) => (r() < cons[j] ? pick() : a));
    if (r() < 0.5) { const s = Math.floor(r() * COLS), l = 2 + Math.floor(r() * 6); for (let j = s; j < Math.min(COLS, s + l); j++) row[j] = 20; }
    rows.push(row);
  }
  return rows;
}

// residue colour by physico-chemical class, in the brand's cool light
export const CLASS_COLOR: Record<string, number> = {};
for (const c of 'AVLIMFWC') CLASS_COLOR[c] = 0xf3f1ea;
for (const c of 'STNQYH') CLASS_COLOR[c] = 0x9aa6f0;
for (const c of 'DEKR') CLASS_COLOR[c] = 0x7f93ff;
for (const c of 'GP') CLASS_COLOR[c] = 0xc9cef2;
CLASS_COLOR['-'] = 0x2a3470;

export function glyphAtlas(): THREE.CanvasTexture {
  const n = AA.length, size = 128;
  const c = document.createElement('canvas'); c.width = size * n; c.height = size;
  const x = c.getContext('2d')!;
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = `500 ${size * 0.74}px "IBM Plex Mono", ui-monospace, monospace`;
  for (let i = 0; i < n; i++) x.fillText(AA[i] === '-' ? '·' : AA[i], i * size + size / 2, size * 0.54);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

/** A wall of residues lying in the screen plane, one row per sequence. */
export function buildWall(rows: number[][], atlas: THREE.Texture) {
  const count = rows.length * COLS;
  const geo = new THREE.PlaneGeometry(CELL * 0.92, CELL * 1.2);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uAtlas: { value: atlas }, uRows: { value: 1 }, uHideFirst: { value: 0 }, uFade: { value: 1 }, uN: { value: AA.length } },
    vertexShader: /* glsl */ `
      attribute float aGlyph; attribute float aRow; attribute vec3 aColor;
      varying vec2 vUv; varying vec3 vColor; varying float vA;
      uniform float uRows; uniform float uHideFirst; uniform float uFade;
      void main() {
        vUv = uv; vColor = aColor;
        float show = clamp(uRows - aRow, 0.0, 1.0);
        if (aRow < 0.5) show *= 1.0 - uHideFirst;
        vA = show * uFade * (aRow < 0.5 ? 1.0 : 0.82);
        vec4 wp = instanceMatrix * vec4(position, 1.0);
        wp.y -= (1.0 - show) * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * wp;
        vUv.x = (aGlyph + uv.x) / ${AA.length.toFixed(1)};
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uAtlas; varying vec2 vUv; varying vec3 vColor; varying float vA;
      void main() { float a = texture2D(uAtlas, vUv).a; if (a * vA < 0.01) discard; gl_FragColor = vec4(vColor * 1.25, a * vA); }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const glyph = new Float32Array(count), row = new Float32Array(count), col = new Float32Array(count * 3);
  const m = new THREE.Matrix4(), c = new THREE.Color();
  let i = 0;
  const x0 = SCREEN.cx - SCREEN.w / 2 + CELL / 2;
  for (let k = 0; k < rows.length; k++) for (let j = 0; j < COLS; j++) {
    m.makeTranslation(x0 + j * CELL, SCREEN.y - 0.02, SCREEN.cz - k * ROW_GAP);
    mesh.setMatrixAt(i, m);
    glyph[i] = rows[k][j]; row[i] = k;
    c.setHex(CLASS_COLOR[AA[rows[k][j]]]); col.set([c.r, c.g, c.b], i * 3);
    i++;
  }
  geo.setAttribute('aGlyph', new THREE.InstancedBufferAttribute(glyph, 1));
  geo.setAttribute('aRow', new THREE.InstancedBufferAttribute(row, 1));
  geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(col, 3));
  mesh.frustumCulled = false;
  return mesh;
}

/** CA trace of a small α/β protein, centred on the origin, in scene units. */
export function buildFold(n: number, scale = 0.55): { pts: THREE.Vector3[]; ss: string[] } {
  const r = rng(11);
  const plan: [string, number][] = [['L', 4], ['H', 16], ['L', 5], ['E', 7], ['L', 4], ['E', 7], ['L', 6], ['H', 18], ['L', 5], ['E', 6], ['L', 4], ['H', 14], ['L', 4]];
  const pts: THREE.Vector3[] = [];
  const ss: string[] = [];
  let p = new THREE.Vector3(-10, 0, 0), d = new THREE.Vector3(1, 0.2, 0.1).normalize();
  const up = new THREE.Vector3();
  for (const [kind, len] of plan) {
    up.set(r() - 0.5, r() - 0.5, r() - 0.5).cross(d).normalize();
    const side = new THREE.Vector3().crossVectors(d, up);
    for (let i = 0; i < len && pts.length < n; i++) {
      if (kind === 'H') {
        const a = (i * 100 * Math.PI) / 180;
        const q = p.clone().addScaledVector(d, i * 1.5).addScaledVector(up, Math.cos(a) * 2.3).addScaledVector(side, Math.sin(a) * 2.3);
        pts.push(q); ss.push('H');
      } else if (kind === 'E') {
        pts.push(p.clone().addScaledVector(d, i * 3.3).addScaledVector(up, i % 2 ? 0.9 : -0.9)); ss.push('E');
      } else {
        // loops wander, pulled back toward the core so the chain stays globular
        const back = p.clone().multiplyScalar(-0.06);
        d.add(new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(0.9)).add(back).normalize();
        p = p.clone().addScaledVector(d, 3.8); pts.push(p.clone()); ss.push('L');
        continue;
      }
    }
    const last = pts[pts.length - 1];
    p = last.clone();
    // turn back on itself, as strands and helices pack against each other
    d.negate().add(new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(0.8)).add(p.clone().multiplyScalar(-0.04)).normalize();
    p.addScaledVector(d, 3.8);
  }
  while (pts.length < n) { const q = pts[pts.length - 1].clone().add(new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(3.8)); pts.push(q); ss.push('L'); }
  const c = new THREE.Vector3(); pts.forEach((q) => c.add(q)); c.divideScalar(pts.length);
  return { pts: pts.slice(0, n).map((q) => q.sub(c).multiplyScalar(scale)), ss: ss.slice(0, n) };
}

/**
 * A cartoon ribbon along the CA trace, the way structural biologists draw
 * proteins: wide flat helices, strands that end in an arrowhead, thin round
 * loops. A rectangular section is swept along the curve's Frenet frames.
 * The `aU` attribute (0..1 along the chain) lets a shader draw it in.
 */
export function buildRibbon(curve: THREE.Curve<THREE.Vector3>, ss: string[], k = 1): THREE.BufferGeometry {
  const n = ss.length, M = n * 10;
  const frames = curve.computeFrenetFrames(M, false);
  const pos: number[] = [], nor: number[] = [], uu: number[] = [], idx: number[] = [];
  const at = (i: number) => ss[Math.min(n - 1, Math.floor((i / M) * n))];
  const endOfStrand = (i: number) => { const r = Math.floor((i / M) * n); return at(i) === 'E' && (r + 1 >= n || ss[r + 1] !== 'E'); };
  const P = new THREE.Vector3(), N = new THREE.Vector3(), B = new THREE.Vector3();
  // half-widths and half-thicknesses per sample, then smoothed so a helix
  // eases into a loop instead of stepping; the strand arrowhead stays sharp
  const W = new Float32Array(M + 1), H = new Float32Array(M + 1), tip = new Uint8Array(M + 1);
  for (let i = 0; i <= M; i++) {
    const s = at(i);
    if (s === 'H') { W[i] = 0.78; H[i] = 0.13; }
    else if (s === 'E') { W[i] = 0.62; H[i] = 0.16; if (endOfStrand(i)) { const f = ((i / M) * n) % 1; W[i] = 1.02 * (1 - f) + 0.02; tip[i] = 1; } }
    else { W[i] = 0.2; H[i] = 0.2; }
  }
  const sw = Float32Array.from(W), sh = Float32Array.from(H), R = 6;
  for (let i = 0; i <= M; i++) {
    if (tip[i]) continue;
    let a = 0, b = 0, c = 0;
    for (let j = Math.max(0, i - R); j <= Math.min(M, i + R); j++) { if (tip[j]) continue; a += W[j]; b += H[j]; c++; }
    sw[i] = a / c; sh[i] = b / c;
  }
  for (let i = 0; i <= M; i++) {
    curve.getPointAt(i / M, P);
    N.copy(frames.normals[i]); B.copy(frames.binormals[i]);
    const w = sw[i] * k, h = sh[i] * k;
    const corners: [number, number][] = [[w, h], [-w, h], [-w, -h], [w, -h]];
    const faceN = [B, N.clone().negate(), B.clone().negate(), N];
    for (let c = 0; c < 4; c++) {
      const [a, b] = corners[c], [a2, b2] = corners[(c + 1) % 4];
      for (const [x, y] of [[a, b], [a2, b2]]) {
        pos.push(P.x + N.x * x + B.x * y, P.y + N.y * x + B.y * y, P.z + N.z * x + B.z * y);
        const fn = faceN[c]; nor.push(fn.x, fn.y, fn.z); uu.push(i / M);
      }
    }
  }
  const per = 8;
  for (let i = 0; i < M; i++) for (let c = 0; c < 4; c++) {
    const a = i * per + c * 2, b = a + 1, a1 = a + per, b1 = b + per;
    idx.push(a, a1, b, b, a1, b1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('aU', new THREE.Float32BufferAttribute(uu, 1));
  g.setIndex(idx);
  return g;
}
