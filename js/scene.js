// Crepe Lovers — escena 3D procedural (sin modelos externos)
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const R = 1.55;                       // radio de la crepa doblada en cuartos
const T = 0.026;                      // grosor de cada capa
const Q = Math.PI / 2;
const C = (4 * R) / (3 * Math.PI);    // centroide del cuarto de círculo
const TOP = 0.13;                     // altura de la capa superior

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const rand = (a, b) => a + Math.random() * (b - a);

// Nivel de calidad: en celular / pantallas táctiles usamos materiales y geometrías más livianas
const LITE = matchMedia('(max-width: 860px), (pointer: coarse)').matches;
const SEG = LITE ? 0.6 : 1;                          // factor de segmentos de las geometrías
const seg = (n, min = 6) => Math.max(min, Math.round(n * SEG));

// Physical (clearcoat/sheen) en escritorio; Standard en celular (mucho más barato de pintar)
const PHYS_ONLY = ['clearcoat', 'clearcoatRoughness', 'sheen', 'sheenColor', 'sheenRoughness'];
function mat(params) {
  if (!LITE) return new THREE.MeshPhysicalMaterial(params);
  const p = { ...params };
  PHYS_ONLY.forEach((k) => delete p[k]);
  if (params.clearcoat) p.roughness = Math.max(0.15, (p.roughness ?? 0.5) * 0.8);
  return new THREE.MeshStandardMaterial(p);
}

// ondulación orgánica compartida por todas las capas (para que encajen)
const wave = (x, z) =>
  0.03 * Math.sin(x * 3.1 + z * 1.7) * Math.cos(z * 2.3 - x * 0.7) +
  0.014 * Math.sin(x * 7.0 - z * 5.0);

const puffAt = (x, z, amt) => {
  const r = Math.hypot(x, z) / R;
  const th = Math.atan2(-z, x);
  return amt * Math.max(0, Math.sin(2 * th)) * 4 * r * (1 - r);
};

const topH = (x, z) => TOP + T + wave(x, z) + puffAt(x, z, 0.07);

// punto aleatorio dentro de la cuña
function wedgePoint(rMin = 0.22, rMax = 0.86, margin = 0.14) {
  const th = rand(margin, Q - margin);
  const r = R * Math.sqrt(rand(rMin * rMin, rMax * rMax));
  return [r * Math.cos(th), -r * Math.sin(th)];
}

/* ---------- texturas generadas en canvas ---------- */
function canvasTex(size, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = LITE ? 2 : 4;
  return t;
}

const crepeTex = () =>
  canvasTex(LITE ? 512 : 1024, (g, s) => {
    const k = s / 1024; // las manchas escalan con el tamaño de la textura
    g.scale(k, k); s = 1024;
    const grd = g.createRadialGradient(s / 2, s / 2, 40, s / 2, s / 2, s * 0.72);
    grd.addColorStop(0, '#f6cd86');
    grd.addColorStop(1, '#dc9a45');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    // manchas doradas tipo "encaje" de la plancha
    for (let i = 0; i < 1600; i++) {
      const r = 2 + Math.pow(Math.random(), 3) * 30;
      g.beginPath();
      g.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
      g.fillStyle = `rgba(${150 + (Math.random() * 40) | 0},${72 + (Math.random() * 30) | 0},22,${rand(0.06, 0.3)})`;
      g.fill();
    }
    for (let i = 0; i < 600; i++) {
      g.beginPath();
      g.arc(Math.random() * s, Math.random() * s, rand(1, 7), 0, Math.PI * 2);
      g.fillStyle = `rgba(255,236,190,${rand(0.08, 0.25)})`;
      g.fill();
    }
  });

const shadowTex = () =>
  canvasTex(256, (g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(70,30,12,0.42)');
    grd.addColorStop(0.55, 'rgba(70,30,12,0.16)');
    grd.addColorStop(1, 'rgba(70,30,12,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
  });

const berrySkinTex = () =>
  canvasTex(256, (g, s) => {
    g.fillStyle = '#d4203d';
    g.fillRect(0, 0, s, s);
    for (let y = 8; y < s; y += 18) {
      for (let x = (y / 18) % 2 ? 4 : 13; x < s; x += 18) {
        g.beginPath();
        g.ellipse(x, y, 1.8, 3, 0, 0, Math.PI * 2);
        g.fillStyle = '#f7d25c';
        g.fill();
      }
    }
  });

const berryCutTex = () => {
  const t = canvasTex(256, (g, s) => {
    g.fillStyle = '#d81f3d';
    g.fillRect(0, 0, s, s);
    const grd = g.createRadialGradient(s / 2, s * 0.47, 6, s / 2, s * 0.5, s * 0.46);
    grd.addColorStop(0, '#fff2f3');
    grd.addColorStop(0.35, '#ffb3bd');
    grd.addColorStop(0.75, '#ef4a64');
    grd.addColorStop(1, '#d81f3d');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
  });
  t.repeat.set(3.85, 3.57);
  t.offset.set(0.5, 0.536);
  return t;
};

const bananaTex = () =>
  canvasTex(256, (g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 4, s / 2, s / 2, s / 2);
    grd.addColorStop(0, '#fff4cf');
    grd.addColorStop(0.8, '#f6e3a2');
    grd.addColorStop(1, '#e8cf7e');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      g.beginPath();
      g.arc(s / 2 + Math.cos(a) * 26, s / 2 + Math.sin(a) * 26, 3.5, 0, Math.PI * 2);
      g.fillStyle = 'rgba(120,80,30,.55)';
      g.fill();
    }
  });

/* ---------- geometrías ---------- */
function surface(yBase, puff, radius = R) {
  const g = new THREE.RingGeometry(0.0001, radius, seg(80), seg(30), 0, Q);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    p.setY(i, yBase + wave(x, z) + puffAt(x, z, puff));
  }
  g.computeVertexNormals();
  g.translate(-C, 0, C);
  return g;
}

function tubeAlong(fn, n, radius, yMid) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const [x, z] = fn(i / n);
    pts.push(new THREE.Vector3(x - C, yMid + wave(x, z), z + C));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg(n * 1.4), radius, seg(10), false);
}

const arcFn = (radius) => (t) => [radius * Math.cos(t * Q), -radius * Math.sin(t * Q)];

function crepeLayer(yBase, puff, mat) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(surface(yBase + T, puff), mat));
  g.add(new THREE.Mesh(surface(yBase - T, puff * 0.4), mat));
  g.add(new THREE.Mesh(tubeAlong(arcFn(R), 90, T * 1.05, yBase), mat));
  return g;
}

function strawberryPiece(skinMat, cutMat, leafMat) {
  const prof = [[0, -0.15], [0.05, -0.135], [0.095, -0.09], [0.12, -0.02], [0.118, 0.04], [0.09, 0.09], [0.045, 0.115], [0, 0.12]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, seg(20), 0, Math.PI), skinMat);
  const shape = new THREE.Shape();
  shape.moveTo(prof[0].x, prof[0].y);
  prof.forEach((p) => shape.lineTo(p.x, p.y));
  for (let i = prof.length - 1; i >= 0; i--) shape.lineTo(-prof[i].x, prof[i].y);
  const capGeo = new THREE.ShapeGeometry(shape, 10);
  capGeo.rotateY(-Math.PI / 2);
  const cap = new THREE.Mesh(capGeo, cutMat);
  const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.035, 6), leafMat);
  leaf.position.y = 0.125;
  const piece = new THREE.Group();
  piece.add(body, cap, leaf);
  piece.rotation.z = -Math.PI / 2;          // cara cortada hacia arriba
  const holder = new THREE.Group();
  holder.add(piece);
  return holder;
}

function creamGeo() {
  const prof = [[0.0, 0], [0.2, 0], [0.225, 0.03], [0.22, 0.07], [0.19, 0.12], [0.15, 0.17], [0.11, 0.22], [0.07, 0.27], [0.035, 0.31], [0, 0.34]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(prof, seg(64, 32));
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const th = Math.atan2(z, x) + y * 7;      // giro de manga pastelera
    const r = Math.hypot(x, z) * (1 + 0.16 * Math.cos(8 * th));
    p.setXYZ(i, r * Math.cos(th - y * 7), y, r * Math.sin(th - y * 7));
  }
  g.computeVertexNormals();
  return g;
}

/* ---------- escena ---------- */
export async function createCrepeScene(canvas) {
  // Resolución: la escena cubre toda la pantalla, así que cada décima de pixel ratio cuenta.
  // Empezamos en 1.5 (escritorio) / 1.25 (celular) y la calidad se ajusta sola si hay tirones.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !LITE, alpha: true, powerPreference: 'high-performance' });
  const maxPR = Math.min(window.devicePixelRatio, LITE ? 1.25 : 1.5);
  const minPR = Math.min(window.devicePixelRatio, LITE ? 0.75 : 1);
  let pixelRatio = maxPR;
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  // Sombras reales solo en escritorio; en celular queda la sombra de contacto pintada bajo el plato
  renderer.shadowMap.enabled = !LITE;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.25, 6.2);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xfff4ec, 0x5a3d91, 0.5));
  const key = new THREE.DirectionalLight(0xfff0dd, 2.3);
  key.position.set(3, 5, 4);
  key.castShadow = !LITE;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 20 });
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc9a6ff, 1.6);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  // materiales
  const tex = crepeTex();
  const crepeMat = mat({
    map: tex, bumpMap: tex, bumpScale: 2.5, roughness: 0.72,
    sheen: 0.4, sheenColor: new THREE.Color('#ffd9a0'), side: THREE.DoubleSide,
  });
  const foldMat = crepeMat.clone();
  foldMat.transparent = true;
  const fillingMat = mat({ color: '#4b2415', roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.25, side: THREE.DoubleSide });
  const chocoMat = mat({ color: '#2e140b', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });
  const plateMat = mat({ color: '#fffaf5', roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide });
  const skinMat = mat({ map: berrySkinTex(), roughness: 0.35, clearcoat: 0.6, side: THREE.DoubleSide });
  const cutMat = mat({ map: berryCutTex(), roughness: 0.4, clearcoat: 0.5, side: THREE.DoubleSide });
  const leafMat = new THREE.MeshStandardMaterial({ color: '#3f8f3a', roughness: 0.6 });
  const bananaMat = new THREE.MeshStandardMaterial({ map: bananaTex(), roughness: 0.55 });
  // la crema no necesita sheen: con Standard se ve igual y cuesta mucho menos
  const creamMat = new THREE.MeshStandardMaterial({ color: '#fffaf2', roughness: 0.6 });
  const sprinkleMat = new THREE.MeshStandardMaterial({ roughness: 0.4 });

  const model = new THREE.Group();
  scene.add(model);

  // ---- partes (cada grupo se puede "explotar" verticalmente) ----
  const parts = [];
  const addPart = (name, label, off, labelY, obj) => {
    model.add(obj);
    parts.push({ name, label, off, labelY, obj, vis: 1, target: 1, vel: 0 });
    return obj;
  };

  // plato + sombra de contacto
  const plate = new THREE.Group();
  const plateProf = [[0, 0], [1.2, 0], [1.38, 0.04], [1.58, 0.12], [1.64, 0.16], [1.6, 0.172], [1.5, 0.135], [1.22, 0.05], [0.95, 0.034], [0, 0.034]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const plateMesh = new THREE.Mesh(new THREE.LatheGeometry(plateProf, seg(72, 40)), plateMat);
  plateMesh.position.y = -0.135;
  plateMesh.receiveShadow = true;
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = -0.15;
  plate.add(blob, plateMesh);
  addPart('plate', null, -1.0, 0, plate);

  addPart('bottom', 'Crêpe artesanal', -0.45, 0, crepeLayer(0, 0, crepeMat));

  // relleno con "cordón" brillante visible en el borde
  const filling = new THREE.Group();
  filling.add(new THREE.Mesh(surface(0.095, 0.05, R * 0.99), fillingMat));
  filling.add(new THREE.Mesh(surface(0.035, 0.02, R * 0.99), fillingMat));
  filling.add(new THREE.Mesh(tubeAlong(arcFn(R * 0.985), 90, 0.036, 0.065), fillingMat));
  addPart('filling', 'Relleno cremoso', 0.05, 0.065, filling);

  addPart('top', 'Doblada a mano', 0.5, 0.15, crepeLayer(TOP, 0.07, crepeMat));

  // dobleces (cierran el sándwich en los bordes rectos)
  const folds = new THREE.Group();
  const fr = (TOP + 2 * T) / 2;
  folds.add(new THREE.Mesh(tubeAlong((t) => [t * R, 0], 40, fr, TOP / 2), foldMat));
  folds.add(new THREE.Mesh(tubeAlong((t) => [0, -t * R], 40, fr, TOP / 2), foldMat));
  for (const [x, z] of [[0, 0], [R, 0], [0, -R]]) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(fr, 20, 14), foldMat);
    s.position.set(x - C, TOP / 2 + wave(x, z), z + C);
    folds.add(s);
  }
  model.add(folds);

  // plátano
  const banana = new THREE.Group();
  const bGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.05, seg(28, 16));
  for (const [x, z] of [[0.55, -0.35], [0.9, -0.5], [0.35, -0.8], [0.75, -0.95], [1.1, -0.25]]) {
    const m = new THREE.Mesh(bGeo, bananaMat);
    m.position.set(x - C, topH(x, z) + 0.03, z + C);
    m.rotation.set(rand(-0.15, 0.15), rand(0, 6), rand(-0.15, 0.15));
    banana.add(m);
  }
  addPart('banana', 'Banano', 0.9, 0.2, banana);

  // fresas
  const berries = new THREE.Group();
  for (const [x, z] of [[0.45, -0.55], [0.95, -0.75], [0.6, -1.05], [1.15, -0.45], [0.3, -0.3], [0.8, -0.2]]) {
    const s = strawberryPiece(skinMat, cutMat, leafMat);
    s.position.set(x - C, topH(x, z) + 0.085, z + C);
    s.rotation.set(rand(-0.25, 0.25), rand(0, Math.PI * 2), 0);
    s.scale.setScalar(rand(0.9, 1.15));
    berries.add(s);
  }
  addPart('strawberry', 'Fresas frescas', 1.25, 0.25, berries);

  // crema batida
  const cream = new THREE.Group();
  const cGeo = creamGeo();
  for (const [x, z, sc] of [[0.62, -0.62, 1], [1.02, -0.32, 0.75], [0.36, -0.98, 0.7]]) {
    const m = new THREE.Mesh(cGeo, creamMat);
    m.position.set(x - C, topH(x, z) - 0.01, z + C);
    m.scale.setScalar(sc);
    m.rotation.y = rand(0, 6);
    cream.add(m);
  }
  addPart('cream', 'Chantilly', 1.6, 0.3, cream);

  // chocolate en hilos
  const drizzle = new THREE.Group();
  for (let k = 0; k < 2; k++) {
    const pts = [];
    const n = 11;
    for (let i = 0; i <= n; i++) {
      const th = i % 2 ? Q - 0.18 : 0.18;
      const r = R * (0.28 + (0.62 * i) / n) + k * 0.12;
      const x = r * Math.cos(th + k * 0.06), z = -r * Math.sin(th + k * 0.06);
      pts.push(new THREE.Vector3(x - C, topH(x, z) + 0.025, z + C));
    }
    drizzle.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.2), seg(160, 80), 0.02, seg(8), false), chocoMat));
  }
  addPart('drizzle', 'Chocolate', 1.95, 0.2, drizzle);

  // chispas de colores
  const N = LITE ? 110 : 150;
  const sprinkles = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.012, 0.05, 2, 6), sprinkleMat, N);
  const palette = ['#b1203f', '#c9a6ea', '#f3b3c6', '#ffffff', '#5a3d91', '#ffd166'].map((c) => new THREE.Color(c));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), pos = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < N; i++) {
    const [x, z] = wedgePoint(0.15, 0.93, 0.07);
    pos.set(x - C, topH(x, z) + 0.013, z + C);
    q.setFromEuler(e.set(0, rand(0, Math.PI * 2), Math.PI / 2, 'YXZ'));
    sprinkles.setMatrixAt(i, m4.compose(pos, q, one));
    sprinkles.setColorAt(i, palette[i % palette.length]);
  }
  const sprGroup = new THREE.Group();
  sprGroup.add(sprinkles);
  addPart('sprinkles', 'Chispas de colores', 2.25, 0.17, sprGroup);

  // sombras: todo proyecta, pero solo las superficies grandes (crêpe, relleno, plato) las reciben
  const receivers = new Set(['plate', 'bottom', 'filling', 'top']);
  if (!LITE) {
    parts.forEach((p) => p.obj.traverse((o) => {
      if (!o.isMesh || o === blob) return;
      o.castShadow = p.name !== 'sprinkles';
      o.receiveShadow = receivers.has(p.name);
    }));
    folds.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  }

  /* ---------- estado controlado desde el scroll ---------- */
  const state = { x: 0, y: -1.05, rx: 0.42, ry: 0, s: 0.92, explode: 0, introY: 0, introR: 0, spin: 0.22 };
  const cur = { x: 0, y: -1.05, rx: 0.42, ry: 0, s: 0.92, explode: 0 };
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const fillTarget = new THREE.Color('#4b2415');
  let pulse = 0, pulseV = 0, spinAngle = 0, fit = 1, active = true, labels = [];

  window.addEventListener('pointermove', (ev) => {
    mouse.tx = (ev.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (ev.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let lastW = 0, lastH = 0;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    // en celular la barra del navegador cambia el alto al hacer scroll: ignoramos esos saltos pequeños
    if (w === lastW && Math.abs(h - lastH) < 120) return;
    lastW = w; lastH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fit = clamp(camera.aspect / 1.35, 0.62, 1);
  }
  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  const v3 = new THREE.Vector3();

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 6);
    for (const p of ['x', 'y', 'rx', 'ry', 's']) cur[p] += (state[p] - cur[p]) * k;
    cur.explode += (state.explode - cur.explode) * (1 - Math.exp(-dt * 8));
    mouse.x += (mouse.tx - mouse.x) * k;
    mouse.y += (mouse.ty - mouse.y) * k;
    spinAngle += dt * state.spin * (1 - cur.explode * 0.8);

    // resorte para el "pop" del armador
    pulseV += (-pulse * 180 - pulseV * 14) * dt;
    pulse += pulseV * dt;

    model.position.set(cur.x * fit, cur.y + state.introY + Math.sin(t * 1.2) * 0.035, 0);
    model.rotation.set(cur.rx + mouse.y * 0.1, cur.ry + spinAngle + state.introR + mouse.x * 0.3, 0);
    model.scale.setScalar(cur.s * fit * (1 + pulse));

    fillingMat.color.lerp(fillTarget, k);
    foldMat.opacity = 1 - smooth(0, 0.12, cur.explode);
    folds.visible = foldMat.opacity > 0.01;

    const E = cur.explode, stg = 0.035, span = 1 - stg * (parts.length - 1);
    parts.forEach((p, i) => {
      const local = clamp((E - i * stg) / span);
      p.local = local;
      p.obj.position.y = p.off * easeInOut(local);
      // resorte de visibilidad (armador)
      p.vel += ((p.target - p.vis) * 220 - p.vel * 18) * dt;
      p.vis += p.vel * dt;
      const sc = Math.max(0.0001, p.vis);
      p.obj.scale.set(sc, sc, sc);
      p.obj.visible = p.vis > 0.01;
    });

    renderer.render(scene, camera);

    // etiquetas HTML proyectadas desde 3D
    if (labels.length) {
      const w = window.innerWidth, h = window.innerHeight;
      for (const l of labels) {
        const p = l.part;
        const o = smooth(0.62, 0.98, p.local) * (p.obj.visible ? 1 : 0);
        if (o <= 0.001) { if (l.shown) { l.el.style.opacity = 0; l.shown = false; } continue; }
        v3.set(0, p.obj.position.y + p.labelY, 0);
        model.localToWorld(v3);
        v3.project(camera);
        l.el.style.transform = `translate3d(${((v3.x + 1) / 2) * w}px, ${((1 - v3.y) / 2) * h}px, 0)`;
        l.el.style.opacity = o;
        l.shown = true;
      }
    }
  }

  /* ---------- calidad adaptativa ----------
     Medimos el tiempo entre cuadros mientras la escena está activa. Si el promedio
     pasa de ~22 ms (menos de 45 fps), bajamos la resolución en pasos; al llegar al
     mínimo, apagamos las sombras. Si va sobrado mucho tiempo, subimos un paso. */
  const perf = { n: 0, sum: 0, warm: 40, good: 0, shadowsOff: LITE };
  function applyPixelRatio(pr) {
    pixelRatio = Math.round(clamp(pr, minPR, maxPR) * 100) / 100;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, lastH || window.innerHeight, false);
  }
  function adapt(ms) {
    if (perf.warm > 0) { perf.warm--; return; }       // los primeros cuadros compilan shaders
    perf.n++; perf.sum += Math.min(ms, 100);
    if (perf.n < 45) return;
    const avg = perf.sum / perf.n;
    perf.n = 0; perf.sum = 0;
    if (avg > 22) {
      perf.good = 0;
      if (pixelRatio > minPR + 0.01) applyPixelRatio(pixelRatio - 0.25);
      else if (!perf.shadowsOff) {
        perf.shadowsOff = true;
        key.castShadow = false;
        renderer.shadowMap.enabled = false;
        scene.traverse((o) => { if (o.material) [].concat(o.material).forEach((m) => { m.needsUpdate = true; }); });
      }
      perf.warm = 20;
    } else if (avg < 13 && pixelRatio < maxPR - 0.01 && ++perf.good >= 4) {
      perf.good = 0;
      applyPixelRatio(pixelRatio + 0.25);
      perf.warm = 20;
    }
  }

  let lastT = performance.now();
  renderer.setAnimationLoop((now) => {
    const ms = now - lastT; lastT = now;
    if (!active || document.hidden) { clock.getDelta(); return; }
    frame();
    adapt(ms);
  });

  // compilar shaders antes del primer cuadro evita el tirón inicial
  renderer.compile(scene, camera);
  await new Promise((res) => requestAnimationFrame(() => { frame(); res(); }));

  return {
    state,
    parts,
    setActive(v) { if (v && !active) { perf.warm = Math.max(perf.warm, 10); perf.n = 0; perf.sum = 0; } active = v; },
    setFilling(hex) { fillTarget.set(hex); this.bump(); },
    setTopping(name, on) {
      const p = parts.find((x) => x.name === name);
      if (p) { p.target = on ? 1 : 0; this.bump(); }
    },
    bump() { pulseV += 1.4; },
    setLabels(list) {
      labels = list.map(({ el, name }) => ({ el, part: parts.find((p) => p.name === name), shown: false })).filter((l) => l.part);
    },
  };
}
