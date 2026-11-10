// The dev board the film opens on, modelled procedurally in millimetres:
// a Coomassie solder-mask PCB with ENIG gold pads, a QFP microcontroller,
// pin headers, passives, USB-C, and an OLED module on standoffs whose amber
// flex cable folds down to the board. The OLED is a live canvas texture.
import * as THREE from 'three';

export const BOARD = { w: 64, d: 36, t: 1.6 };
// OLED active area, in world coordinates (the screen faces +y)
export const SCREEN = { cx: 10, cz: 0, y: 5.95, w: 22, h: 11 };

const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

export interface Board {
  group: THREE.Group;
  oled: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture; screen: THREE.Mesh };
}

export function buildBoard(): Board {
  const g = new THREE.Group();
  const top = BOARD.t;

  // materials
  const mask = new THREE.MeshPhysicalMaterial({ color: 0x23308a, roughness: 0.42, clearcoat: 0.85, clearcoatRoughness: 0.22, sheen: 0.2 });
  const trace = new THREE.MeshPhysicalMaterial({ color: 0x3446b4, roughness: 0.38, clearcoat: 0.85, clearcoatRoughness: 0.2 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd9b45a, metalness: 1, roughness: 0.24 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xc8ccd4, metalness: 1, roughness: 0.32 });
  const plastic = new THREE.MeshStandardMaterial({ color: 0x0f1014, roughness: 0.6 });
  const epoxy = new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.5 });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0xc9b28f, roughness: 0.55 });
  const kapton = new THREE.MeshPhysicalMaterial({ color: 0xc8771c, roughness: 0.35, clearcoat: 0.6, transmission: 0.0 });
  const fr4 = new THREE.MeshStandardMaterial({ color: 0x0c0d12, roughness: 0.5 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x030408, roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, reflectivity: 0.6 });

  const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  };

  // PCB with rounded corners and four mounting holes
  const s = new THREE.Shape();
  const W = BOARD.w / 2, D = BOARD.d / 2, r = 3;
  s.moveTo(-W + r, -D); s.lineTo(W - r, -D); s.quadraticCurveTo(W, -D, W, -D + r); s.lineTo(W, D - r);
  s.quadraticCurveTo(W, D, W - r, D); s.lineTo(-W + r, D); s.quadraticCurveTo(-W, D, -W, D - r); s.lineTo(-W, -D + r);
  s.quadraticCurveTo(-W, -D, -W + r, -D);
  const holes = [[-W + 3.5, -D + 3.5], [W - 3.5, -D + 3.5], [-W + 3.5, D - 3.5], [W - 3.5, D - 3.5]];
  for (const [hx, hz] of holes) { const h = new THREE.Path(); h.absarc(hx, hz, 1.6, 0, Math.PI * 2, true); s.holes.push(h); }
  const pcbGeo = new THREE.ExtrudeGeometry(s, { depth: top, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.12, bevelSegments: 2, curveSegments: 24 });
  pcbGeo.rotateX(Math.PI / 2); pcbGeo.translate(0, top, 0);
  const pcb = new THREE.Mesh(pcbGeo, mask); pcb.castShadow = pcb.receiveShadow = true; g.add(pcb);
  for (const [hx, hz] of holes) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.7, 40), gold); ring.rotation.x = -Math.PI / 2; ring.position.set(hx, top + 0.13, hz); g.add(ring);
  }

  // headers along both long edges: black bases, gold square pins
  const PITCH = 2.54, NP = 20, hx0 = -((NP - 1) * PITCH) / 2;
  for (const z of [-D + 2.6, D - 2.6]) {
    box(NP * PITCH, 2.5, 2.54, plastic, 0, top, z);
    const pins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.64, 8.4, 0.64), gold, NP);
    const m = new THREE.Matrix4();
    for (let i = 0; i < NP; i++) { m.makeTranslation(hx0 + i * PITCH, top + 2.5 + 1.2, z); pins.setMatrixAt(i, m); }
    pins.castShadow = true; g.add(pins);
    const pads = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.85, 0.85, 0.06, 20), gold, NP);
    for (let i = 0; i < NP; i++) { m.makeTranslation(hx0 + i * PITCH, top + 0.14, z + (z < 0 ? 2.2 : -2.2)); pads.setMatrixAt(i, m); }
    g.add(pads);
  }

  // QFP microcontroller with gull-wing leads
  const MX = -13, MZ = 1, MS = 10;
  box(MS, 1.25, MS, epoxy, MX, top + 0.05, MZ);
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshStandardMaterial({ color: 0x24262c, roughness: 0.3 }));
  dot.rotation.x = -Math.PI / 2; dot.position.set(MX - MS / 2 + 1.4, top + 1.31, MZ - MS / 2 + 1.4); g.add(dot);
  const LEADS = 12, leadGeo = new THREE.BoxGeometry(0.28, 0.18, 1.3);
  const leads = new THREE.InstancedMesh(leadGeo, steel, LEADS * 4);
  const q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(1, 1, 1), mm = new THREE.Matrix4();
  let li = 0;
  const leadPos: [number, number][] = [];
  for (let side = 0; side < 4; side++) for (let i = 0; i < LEADS; i++) {
    const o = -((LEADS - 1) * 0.8) / 2 + i * 0.8, a = (side * Math.PI) / 2;
    const lx = Math.cos(a) * (MS / 2 + 0.55), lz = Math.sin(a) * (MS / 2 + 0.55);
    const px = MX + lx + -Math.sin(a) * o, pz = MZ + lz + Math.cos(a) * o;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a + Math.PI / 2); p.set(px, top + 0.2, pz);
    mm.compose(p, q, sc); leads.setMatrixAt(li++, mm);
    leadPos.push([MX + Math.cos(a) * (MS / 2 + 1.3) - Math.sin(a) * o, MZ + Math.sin(a) * (MS / 2 + 1.3) + Math.cos(a) * o]);
  }
  leads.castShadow = true; g.add(leads);

  // traces: 45-degree routes from the MCU to the header pads, slightly raised under the mask
  const R = rng(7);
  const addTrace = (pts: [number, number][], w = 0.32) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, z1] = pts[i], [x2, z2] = pts[i + 1];
      const len = Math.hypot(x2 - x1, z2 - z1); if (len < 0.01) continue;
      const seg = new THREE.Mesh(new THREE.BoxGeometry(len + w, 0.05, w), trace);
      seg.position.set((x1 + x2) / 2, top + 0.03, (z1 + z2) / 2); seg.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      seg.receiveShadow = true; g.add(seg);
    }
  };
  leadPos.forEach(([lx, lz], i) => {
    if (i % 2) return;
    const toTop = lz < MZ;
    const pin = Math.round(((lx - hx0) / PITCH) + (R() - 0.5) * 6);
    const px = hx0 + Math.max(0, Math.min(NP - 1, pin)) * PITCH;
    const pz = toTop ? -D + 4.8 : D - 4.8;
    const mid = lz + (toTop ? -1 : 1) * (1.5 + R() * 2.5);
    const dz = Math.abs(pz - mid), dx = px - lx;
    const bend = Math.min(Math.abs(dx), dz * 0.9);
    addTrace([[lx, lz], [lx, mid], [lx + Math.sign(dx) * bend, mid + (toTop ? -1 : 1) * bend], [px, mid + (toTop ? -1 : 1) * bend], [px, pz]]);
  });

  // passives (0603) around the MCU, a crystal can, a power LED, a tact switch
  const R2 = rng(19);
  const capGeo = new THREE.BoxGeometry(1.6, 0.8, 0.8), endGeo = new THREE.BoxGeometry(0.3, 0.82, 0.82);
  for (let i = 0; i < 22; i++) {
    const a = R2() * Math.PI * 2, rad = 8 + R2() * 6;
    const x = MX + Math.cos(a) * rad, z = MZ + Math.sin(a) * rad * 0.75;
    if (Math.abs(z) > D - 6.5 || x > -1) continue;
    const rot = R2() > 0.5 ? 0 : Math.PI / 2;
    const body = new THREE.Mesh(capGeo, R2() > 0.5 ? ceramic : epoxy); body.position.set(x, top + 0.4, z); body.rotation.y = rot; body.castShadow = true; g.add(body);
    for (const e of [-0.65, 0.65]) { const end = new THREE.Mesh(endGeo, steel); end.position.set(x + Math.cos(rot) * e, top + 0.41, z - Math.sin(rot) * e); end.rotation.y = rot; g.add(end); }
  }
  box(3.2, 1.0, 2.5, steel, MX + 9, top, MZ - 7.5);
  const led = box(1.6, 0.7, 0.8, new THREE.MeshStandardMaterial({ color: 0xf3f1ea, emissive: 0xf3f1ea, emissiveIntensity: 0.9 }), -W + 9, top, D - 7);
  led.castShadow = false;
  box(6, 3.4, 6, plastic, -W + 9, top, -D + 9.5);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 1.2, 32), plastic); knob.position.set(-W + 9, top + 3.9, -D + 9.5); knob.castShadow = true; g.add(knob);

  // USB-C on the left edge
  const usb = new THREE.Mesh(new THREE.CapsuleGeometry(1.55, 5.9, 8, 24), steel);
  usb.rotation.z = Math.PI / 2; usb.rotation.y = Math.PI / 2; usb.scale.set(1, 1, 1);
  usb.position.set(-W + 3, top + 1.6, 0); usb.castShadow = true; g.add(usb);

  // OLED module: black carrier on four standoffs, glass, amber flex
  const OY = 4.2;
  for (const [sx, sz] of [[-1.5, -6.5], [21.5, -6.5], [-1.5, 6.5], [21.5, 6.5]]) {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, OY - top, 6), steel); st.position.set(sx, top + (OY - top) / 2, sz); st.castShadow = true; g.add(st);
  }
  box(27, 1.1, 16, fr4, SCREEN.cx, OY, SCREEN.cz);
  box(25, 0.6, 13.6, glass, SCREEN.cx, OY + 1.1, SCREEN.cz);
  const flex = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CubicBezierCurve3(
    new THREE.Vector3(SCREEN.cx - 12.5, OY + 1.3, 0), new THREE.Vector3(SCREEN.cx - 17, OY + 1.3, 0),
    new THREE.Vector3(SCREEN.cx - 17, top + 0.3, 0), new THREE.Vector3(SCREEN.cx - 21, top + 0.1, 0)), 24, 0.2, 4), kapton);
  flex.scale.set(1, 1, 1); g.add(flex);
  box(4, 0.15, 9, kapton, SCREEN.cx - 15, OY + 1.25, 0);

  // the live screen
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN.w, SCREEN.h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  screen.rotation.x = -Math.PI / 2; screen.position.set(SCREEN.cx, SCREEN.y, SCREEN.cz); g.add(screen);

  // silkscreen: labels, the monogram, revision
  const silk = document.createElement('canvas'); silk.width = 2048; silk.height = 1152;
  const sx = silk.getContext('2d')!, k = 2048 / BOARD.w;
  sx.fillStyle = '#f3f1ea'; sx.strokeStyle = '#f3f1ea';
  const at = (x: number, z: number) => [(x + W) * k, (z + D) * k];
  sx.font = `500 ${1.5 * k}px "IBM Plex Mono", monospace`; sx.textAlign = 'center';
  ['3V3', 'GND', 'D0', 'D1', 'D2', 'D3', 'A0', 'A1', 'SDA', 'SCL'].forEach((l, i) => { const [x, y] = at(hx0 + i * 2 * PITCH, -D + 6.2); sx.fillText(l, x, y); });
  sx.font = `600 ${2.4 * k}px "IBM Plex Sans", sans-serif`; sx.textAlign = 'left';
  { const [x, y] = at(-W + 13.5, D - 6.2); sx.fillText('V. CASTELLI · VC-01 · REV A', x, y); }
  sx.lineWidth = 0.18 * k;
  { const [x, y] = at(MX - MS / 2 - 0.9, MZ - MS / 2 - 0.9); sx.strokeRect(x, y, (MS + 1.8) * k, (MS + 1.8) * k); }
  { const [x, y] = at(-W + 6.6, D - 9); sx.font = `600 ${3.2 * k}px "Source Serif 4", serif`; sx.fillText('VC', x, y); sx.fillRect(x, y + 0.7 * k, 5.1 * k, 0.16 * k); }
  const silkTex = new THREE.CanvasTexture(silk); silkTex.colorSpace = THREE.SRGBColorSpace; silkTex.anisotropy = 8;
  const silkMesh = new THREE.Mesh(new THREE.PlaneGeometry(BOARD.w, BOARD.d), new THREE.MeshStandardMaterial({ map: silkTex, transparent: true, roughness: 0.7, depthWrite: false }));
  silkMesh.rotation.x = -Math.PI / 2; silkMesh.position.y = top + 0.15; silkMesh.receiveShadow = true; g.add(silkMesh);

  return { group: g, oled: { canvas, ctx, tex, screen } };
}
