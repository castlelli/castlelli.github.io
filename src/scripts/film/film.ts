// The film: one scene, one camera path, driven by scroll progress p in [0, 1].
//   0.00–0.30  a dev board in studio light; its OLED runs a terminal
//   0.24–0.34  the camera dives into the screen; the screen shows one sequence
//   0.34–0.50  through the glass: one sequence becomes an alignment of many
//   0.50–0.72  the first sequence lifts off and folds into a protein
//   0.84–1.00  the protein dissolves into the Duffing attractor, drawn in its
//              true phase space (S¹ × R²: the forcing phase is the angle)
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { buildBoard, SCREEN } from './board';
import { AA, CELL, CLASS_COLOR, ROWS, buildFold, buildRibbon, buildWall, glyphAtlas, makeAlignment } from './bio';
import { integrate } from '../../lib/duffing';

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const NIGHT = 0x0b1030;

export interface Film { setProgress(p: number): void; jump(p: number): void; setPointer(x: number, y: number): void; start(): void; stop(): void; resize(): void; }

export function createFilm(canvas: HTMLCanvasElement, opts: { light?: boolean; terminal: string[] }): Film {
  const light = Boolean(opts.light);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !light, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, light ? 1 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NIGHT);
  scene.fog = new THREE.FogExp2(NIGHT, 0.0042);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 2000);

  // studio: a warm key with soft shadows, a cool Coomassie rim, a dark floor
  const key = new THREE.SpotLight(0xfff1e0, 2600, 0, Math.PI / 6, 0.6, 1.6);
  key.position.set(46, 92, 38); key.target.position.set(0, 0, 0); key.castShadow = true;
  key.shadow.mapSize.set(light ? 1024 : 2048, light ? 1024 : 2048); key.shadow.bias = -0.0004; key.shadow.radius = 6;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x8a9bff, 1.6); rim.position.set(-60, 26, -70); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0x3c4aa8, 0x05060f, 0.35));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.MeshStandardMaterial({ color: 0x0d1336, roughness: 0.92 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // the board
  const board = buildBoard();
  board.group.rotation.y = 0;
  scene.add(board.group);
  const { ctx: oc, canvas: ocv, tex: otex } = board.oled;

  // the alignment, lying in the screen plane
  const rows = makeAlignment();
  const atlas = glyphAtlas();
  const wall = buildWall(rows, atlas);
  wall.visible = false;
  scene.add(wall);
  const wallMat = wall.material as THREE.ShaderMaterial;

  // the fold: the first sequence's residues fly to a CA trace above the wall
  const N = 110;
  const FC = new THREE.Vector3(SCREEN.cx + 44, 34, -46);
  const fold = buildFold(N, 0.62);
  const ca = fold.pts.map((v) => v.add(FC));
  const startPos = Array.from({ length: N }, (_, j) => new THREE.Vector3(SCREEN.cx - SCREEN.w / 2 + CELL / 2 + j * CELL, SCREEN.y - 0.02, SCREEN.cz));
  const flyGeo = new THREE.PlaneGeometry(CELL * 0.92, CELL * 1.2);
  const flyMat = wallMat.clone();
  flyMat.uniforms = THREE.UniformsUtils.clone(wallMat.uniforms);
  flyMat.uniforms.uAtlas.value = atlas; flyMat.uniforms.uRows.value = 1e6; flyMat.uniforms.uHideFirst.value = 0; flyMat.uniforms.uFade.value = 0;
  const fly = new THREE.InstancedMesh(flyGeo, flyMat, N);
  {
    const glyph = new Float32Array(N), row = new Float32Array(N).fill(1), col = new Float32Array(N * 3), c = new THREE.Color();
    for (let j = 0; j < N; j++) { glyph[j] = rows[0][j]; c.setHex(CLASS_COLOR[AA[rows[0][j]]]); col.set([c.r, c.g, c.b], j * 3); }
    flyGeo.setAttribute('aGlyph', new THREE.InstancedBufferAttribute(glyph, 1));
    flyGeo.setAttribute('aRow', new THREE.InstancedBufferAttribute(row, 1));
    flyGeo.setAttribute('aColor', new THREE.InstancedBufferAttribute(col, 3));
  }
  fly.frustumCulled = false; fly.visible = false; scene.add(fly);

  const curve = new THREE.CatmullRomCurve3(ca, false, 'centripetal');
  const tubeGeo = buildRibbon(curve, fold.ss, 1);
  // a physical, slightly translucent ribbon that draws itself along the chain
  const tubeMat = new THREE.MeshPhysicalMaterial({ color: 0xa9b3f5, roughness: 0.5, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.45, sheen: 0.4, sheenColor: new THREE.Color(0x6f86f6), envMapIntensity: 0.6, side: THREE.DoubleSide, transparent: true, opacity: 0 });
  const reveal = { value: 0 };
  tubeMat.onBeforeCompile = (sh) => {
    sh.uniforms.uReveal = reveal;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aU; varying float vU;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvU = aU;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uReveal; varying float vU;').replace('#include <dithering_fragment>', '#include <dithering_fragment>\nif (vU > uReveal) discard;\n gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.62, 0.68, 1.0), 0.25 * (1.0 - smoothstep(0.0, 1.0, abs(vU - 0.5) * 2.0)));');
  };
  const tube = new THREE.Mesh(tubeGeo, tubeMat); tube.castShadow = true; tube.visible = false; scene.add(tube);
  const beads = new THREE.Group();

  // the attractor: the continuous Duffing trajectory wrapped on a torus,
  // angle = forcing phase, so the flow's real geometry shows in depth
  const run = integrate({ periods: 140, skip: 100, pathPeriods: 140, every: 1 });
  const AN = run.path.length;
  const att = new Float32Array(AN * 3), from = new Float32Array(AN * 3), seed = new Float32Array(AN);
  for (let i = 0; i < AN; i++) {
    const [x, v, ph] = run.path[i], th = ph * Math.PI * 2, R = 15 + x * 5.2;
    att.set([FC.x + Math.cos(th) * R, FC.y + v * 6.5, FC.z + Math.sin(th) * R], i * 3);
    const c = ca[i % N]; from.set([c.x + (Math.random() - 0.5) * 1.2, c.y + (Math.random() - 0.5) * 1.2, c.z + (Math.random() - 0.5) * 1.2], i * 3);
    seed[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(from, 3));
  pGeo.setAttribute('aTo', new THREE.BufferAttribute(att, 3));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const pMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 0 }, uA: { value: 0 }, uPx: { value: renderer.getPixelRatio() }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute vec3 aTo; attribute float aSeed; uniform float uT; uniform float uPx; uniform float uTime; varying float vS;
      void main() {
        float k = clamp((uT - aSeed * 0.45) / 0.55, 0.0, 1.0); k = k * k * (3.0 - 2.0 * k);
        vec3 p = mix(position, aTo, k);
        p += 0.25 * vec3(sin(uTime * 0.7 + aSeed * 40.0), cos(uTime * 0.6 + aSeed * 30.0), sin(uTime * 0.5 + aSeed * 20.0)) * (1.0 - k);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uPx * (1.4 + 2.6 * aSeed) * (60.0 / -mv.z);
        vS = 0.55 + 0.45 * aSeed;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uA; varying float vS;
      void main() { vec2 d = gl_PointCoord - 0.5; float a = smoothstep(0.5, 0.0, length(d)); gl_FragColor = vec4(vec3(0.96, 0.95, 0.92) * vS, a * uA); }`,
  });
  const points = new THREE.Points(pGeo, pMat); points.frustumCulled = false; points.visible = false; scene.add(points);

  // post: depth of field, a little bloom on the screen and LED, grain and vignette
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: 80, aperture: 0.00018, maxblur: 0.0085 });
  if (!light) composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.22, 0.45, 0.94);
  if (!light) composer.addPass(bloom);
  const grain = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmt: { value: 0.045 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse; uniform float uTime; uniform float uAmt; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
      void main(){ vec4 c = texture2D(tDiffuse, vUv); float v = smoothstep(1.05, 0.25, length(vUv - 0.5)); c.rgb *= mix(0.62, 1.0, v); c.rgb += (h(vUv * 1000.0) - 0.5) * uAmt; gl_FragColor = c; }`,
  });
  composer.addPass(grain);
  composer.addPass(new OutputPass());

  // camera path: positions and targets as smooth curves through keyframes
  const K: [number, [number, number, number], [number, number, number]][] = [
    [0.0, [58, 40, 70], [-17, 1, 6]],
    [0.1, [40, 38, 52], [-6, 3, 3]],
    [0.2, [14, 40, 22], [9, 5, 0]],
    [0.27, [10, 31, 9.5], [10, 6, 0.6]],
    [0.31, [10, 15.5, 4.2], [10, 6, 0]],
    [0.35, [10.5, 9.2, 4.6], [11.5, 5.9, -2.5]],
    [0.43, [22, 26, 24], [30, 5.9, -20]],
    [0.5, [96, 74, 54], [70, 5.9, -50]],
    [0.58, [FC.x + 40, FC.y + 22, FC.z + 70], [FC.x - 14, FC.y - 4, FC.z]],
    [0.72, [FC.x + 4, FC.y + 6, FC.z + 52], [FC.x - 15, FC.y, FC.z]],
    [0.86, [FC.x + 40, FC.y + 14, FC.z + 34], [FC.x - 12, FC.y, FC.z + 6]],
    [1.0, [FC.x - 10, FC.y + 22, FC.z + 64], [FC.x - 20, FC.y - 2, FC.z]],
  ];
  // portrait screens: the opening shots centre the board and stand further back
  if (innerWidth / innerHeight < 0.9) {
    K[0] = [0.0, [70, 70, 100], [4, 0, 2]];
    K[1] = [0.1, [46, 56, 70], [6, 3, 1]];
  }
  const pc = new THREE.CatmullRomCurve3(K.map((k) => new THREE.Vector3(...k[1])), false, 'centripetal');
  const tc = new THREE.CatmullRomCurve3(K.map((k) => new THREE.Vector3(...k[2])), false, 'centripetal');
  const along = (p: number) => {
    let i = 0; while (i < K.length - 2 && p > K[i + 1][0]) i++;
    const t = clamp((p - K[i][0]) / (K[i + 1][0] - K[i][0]));
    const e = t * t * (3 - 2 * t) * 0.65 + t * 0.35; // ease, but never stop dead
    return (i + e) / (K.length - 1);
  };

  // OLED: a terminal that types, then one sequence set to the wall's grid
  const wPx = ocv.width, hPx = ocv.height, cellPx = wPx / 28;
  let lastOled = '';
  function drawOled(p: number, time: number) {
    const stage = p < 0.235 ? 'term' : 'seq';
    const typed = Math.floor(smooth(0.02, 0.2, p) * 999);
    const blink = Math.floor(time * 2) % 2;
    const sig = stage + typed + blink;
    if (sig === lastOled) return; lastOled = sig;
    oc.fillStyle = '#020309'; oc.fillRect(0, 0, wPx, hPx);
    if (stage === 'term') {
      oc.font = `500 ${hPx * 0.1}px "IBM Plex Mono", monospace`; oc.fillStyle = '#dbe3ff'; oc.textBaseline = 'top';
      let left = typed;
      opts.terminal.forEach((line, i) => {
        const shown = line.slice(0, Math.max(0, left)); left -= line.length + 6;
        oc.globalAlpha = i === 0 ? 1 : 0.78;
        oc.fillText(shown + (left < 0 && left > -line.length - 6 && blink ? '▍' : ''), wPx * 0.05, hPx * (0.12 + i * 0.16));
      });
      oc.globalAlpha = 1;
    } else {
      oc.font = `500 ${cellPx * 1.02}px "IBM Plex Mono", monospace`; oc.textAlign = 'center'; oc.textBaseline = 'middle';
      for (let j = 0; j < 28; j++) {
        const g = AA[rows[0][j]]; oc.fillStyle = '#' + CLASS_COLOR[g].toString(16).padStart(6, '0');
        oc.fillText(g, (j + 0.5) * cellPx, hPx * 0.5);
      }
      oc.textAlign = 'left';
    }
    otex.needsUpdate = true;
  }

  // state
  let p = 0, target = 0, px = 0, py = 0, sx = 0, sy = 0, raf = 0, running = false;
  const timer = new THREE.Timer();
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  const flat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)), qj = new THREE.Quaternion();

  function frame(now?: number) {
    raf = requestAnimationFrame(frame);
    timer.update(now);
    const dt = Math.min(timer.getDelta(), 0.05), time = timer.getElapsed();
    p += (target - p) * (1 - Math.pow(0.0015, dt));
    sx += (px - sx) * 0.05; sy += (py - sy) * 0.05;

    // camera along the path, with a small parallax from the pointer
    const u = along(p);
    const cp = pc.getPoint(u), ct = tc.getPoint(u);
    const dist = cp.distanceTo(ct);
    const par = Math.min(1, dist / 40) * 2.2;
    camera.position.copy(cp).add(tmpV.set(sx * par, -sy * par * 0.6, 0));
    camera.lookAt(ct);
    bokeh.uniforms['focus'].value = dist;
    bokeh.uniforms['aperture'].value = p < 0.3 ? 0.00022 : p < 0.52 ? 0.00016 : 0.00007;

    // board and screen
    const inside = p > 0.312;
    board.group.visible = !inside;
    floor.visible = !inside;
    if (!inside) drawOled(p, time);

    // alignment
    wall.visible = p > 0.3;
    wallMat.uniforms.uRows.value = 1 + smooth(0.34, 0.49, p) * (ROWS - 1);
    wallMat.uniforms.uFade.value = 1 - 0.75 * smooth(0.5, 0.64, p) - 0.25 * smooth(0.84, 0.96, p);
    wallMat.uniforms.uHideFirst.value = p > 0.5 ? 1 : 0;

    // fold
    const fk = smooth(0.5, 0.66, p);
    fly.visible = p > 0.5 && p < 0.75;
    flyMat.uniforms.uFade.value = 1 - smooth(0.64, 0.72, p);
    if (fly.visible) {
      tmpQ.copy(camera.quaternion);
      for (let j = 0; j < N; j++) {
        const k = clamp((fk - (j / N) * 0.4) / 0.6), e = k * k * (3 - 2 * k);
        tmpV.lerpVectors(startPos[j], ca[j], e); tmpV.y += Math.sin(e * Math.PI) * 6;
        qj.slerpQuaternions(flat, tmpQ, smooth(0, 0.3, e));
        tmpM.compose(tmpV, qj, one);
        fly.setMatrixAt(j, tmpM);
      }
      fly.instanceMatrix.needsUpdate = true;
    }
    tube.visible = p > 0.6 && p < 0.97;
    tubeMat.opacity = smooth(0.6, 0.64, p) * (1 - smooth(0.86, 0.94, p));
    reveal.value = smooth(0.6, 0.74, p) * 1.001;
    const spin = smooth(0.64, 1, p) * Math.PI * 1.2;
    for (const o of [tube, beads]) { o.position.copy(FC); o.rotation.y = spin; o.position.sub(tmpV.copy(FC).applyAxisAngle(new THREE.Vector3(0, 1, 0), spin)); }

    // attractor
    const ak = smooth(0.84, 0.99, p);
    points.visible = p > 0.83;
    pMat.uniforms.uT.value = ak; pMat.uniforms.uA.value = smooth(0.83, 0.88, p) * 0.9; pMat.uniforms.uTime.value = time;
    points.position.copy(FC); points.rotation.y = spin + time * 0.04 * ak; points.position.sub(tmpV.copy(FC).applyAxisAngle(new THREE.Vector3(0, 1, 0), points.rotation.y));

    (grain.uniforms as any).uTime.value = time;
    composer.render();
  }

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h;
    // keep the board framed on tall phone screens
    camera.fov = w / h < 0.9 ? 46 : 32;
    // on portrait screens, render the lower part of a taller frame so the
    // subject sits in the top third, above the text
    if (w / h < 0.9) camera.setViewOffset(w, h * 1.4, 0, h * 0.4, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  resize();

  return {
    setProgress(v) { target = clamp(v); },
    jump(v) { target = p = clamp(v); },
    setPointer(x, y) { px = x; py = y; },
    start() { if (running) return; running = true; timer.reset?.(); frame(); },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize,
  };
}
