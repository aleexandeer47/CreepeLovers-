// Crêpe Lovers — interacciones, scroll y armador
import { createCrepeScene } from './scene.js';

/* ======= Datos editables ======= */
const CONFIG = {
  instagram: 'https://www.instagram.com/crepelovers/',
  dm: 'https://ig.me/m/crepelovers',
  linktree: 'https://linktr.ee/crepeloverssv',
  events: 'https://wa.me/50376014395?text=' + encodeURIComponent('¡Hola Crêpe Lovers! Quiero información para un evento 💜'),
  ubereats: 'https://www.ubereats.com/sv',
  pedidosya: 'https://www.pedidosya.com.sv/',
};

const MENU = [
  { cat: 'Dulce', name: 'Banana Lovers', desc: 'Plátano, fresas, Nutella y hilos de chocolate.', bg: '#f4edfc', art: { kind: 'plate', fill: '#4b2415', tops: ['banana', 'berry', 'drizzle'] } },
  { cat: 'Dulce', name: 'Nutella & Fresa', desc: 'El clásico que nunca falla: Nutella generosa y fresas frescas.', bg: '#fde7dc', art: { kind: 'cone', fill: '#4b2415', cone: '#f3b3c6', tops: ['berry', 'drizzle'] } },
  { cat: 'Dulce', name: 'Cremosas', tag: 'Nuevo', desc: 'Nuestra nueva línea cremosa: 5 nuevos motivos para volver.', bg: '#e8dbf8', art: { kind: 'cone', fill: '#f2ead9', cone: '#c9a6ea', tops: ['cream', 'drizzle'] } },
  { cat: 'Dulce', name: 'Dulce de Leche', desc: 'Dulce de leche, nuez tostada y un toque de canela.', bg: '#fff1e0', art: { kind: 'plate', fill: '#b0692b', tops: ['nut', 'drizzle'] } },
  { cat: 'Salada', name: 'Royale Margarita', tag: 'Nuevo', desc: 'Salsa pomodoro, tomates cherry, queso y ensalada fresca.', bg: '#ffe3ea', art: { kind: 'savory', fill: '#c8402e', tops: ['tomato', 'greens'] } },
  { cat: 'Salada', name: 'Lomito Crêpe', desc: 'Lomito jugoso, aguacate, salsa de queso y mezcla de lechugas.', bg: '#fbe9d6', art: { kind: 'savory', fill: '#f0b63f', tops: ['meat', 'greens', 'tomato'] } },
  { cat: 'Guilt free', name: 'Guilt Free', desc: 'Para disfrutar sin culpa: opciones ligeras, mismo amor.', bg: '#dcefe2', art: { kind: 'plate', fill: '#b3172f', tops: ['berry', 'berry', 'leaf'] } },
];

const FILLINGS = [
  { id: 'nutella', label: 'Nutella', color: '#4b2415' },
  { id: 'dulce', label: 'Dulce de leche', color: '#b0692b' },
  { id: 'queso', label: 'Queso crema', color: '#f2ead9' },
  { id: 'fresa', label: 'Mermelada de fresa', color: '#b3172f' },
];
const TOPPINGS = [
  { id: 'strawberry', label: 'Fresas', color: '#d4203d', on: true },
  { id: 'banana', label: 'Plátano', color: '#f6e3a2', on: true },
  { id: 'cream', label: 'Crema batida', color: '#fffaf2', on: true },
  { id: 'drizzle', label: 'Hilos de chocolate', color: '#2e140b', on: true },
  { id: 'sprinkles', label: 'Chispas', color: '#c9a6ea', on: true },
];

/* ======= utilidades ======= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;
const isMobile = () => window.innerWidth < 860;

document.body.classList.add('is-loading');
$('#year').textContent = new Date().getFullYear();
$$('[data-link]').forEach((a) => { const url = CONFIG[a.dataset.link]; if (url) a.href = url; });

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

/* ======= smooth scroll (Lenis) ======= */
let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
$$('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const el = id.length > 1 && $(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  })
);

/* ======= división de texto ======= */
function splitChars(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  text.split(/\s+/).forEach((w, i, arr) => {
    const word = document.createElement('span');
    word.className = 'word';
    word.setAttribute('aria-hidden', 'true');
    for (const ch of w) {
      const c = document.createElement('span');
      c.className = 'char';
      c.textContent = ch;
      word.appendChild(c);
    }
    el.appendChild(word);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
}
function splitWords(root) {
  [...root.childNodes].forEach((node) => {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
        else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
      });
      node.replaceWith(frag);
    } else if (node.nodeType === 1) splitWords(node);
  });
}
$$('.split').forEach(splitChars);
$$('.words').forEach(splitWords);
const ctaTitle = $('.split-cta');
if (ctaTitle) {
  const t = ctaTitle.textContent;
  ctaTitle.innerHTML = `<span class="line"></span>`;
  ctaTitle.firstChild.textContent = t;
  splitChars(ctaTitle.firstChild);
}

/* ======= ilustraciones SVG del menú ======= */
function topsSVG(tops) {
  const spots = [[78, 98], [104, 90], [128, 100], [92, 110], [118, 114], [140, 92]];
  let out = '';
  tops.forEach((t, ti) => {
    spots.forEach(([x, y], i) => {
      if ((i + ti) % 2) return;
      const dx = x + ti * 3, dy = y - ti * 2;
      if (t === 'berry') out += `<path d="M${dx} ${dy - 9} q9 2 8 10 q-3 8 -8 9 q-5 -1 -8 -9 q-1 -8 8 -10z" fill="#d4203d"/><path d="M${dx} ${dy - 5} q4 1 3 6 q-1 4 -3 5 q-2-1-3-5 q-1-5 3-6z" fill="#ffc2cb"/>`;
      if (t === 'banana') out += `<circle cx="${dx}" cy="${dy}" r="9" fill="#f6e3a2" stroke="#e5c96f" stroke-width="2"/><circle cx="${dx}" cy="${dy}" r="2.5" fill="#c4a35a"/>`;
      if (t === 'cream') out += `<path d="M${dx - 11} ${dy + 4} q11 -24 22 0 z" fill="#fffaf2" stroke="#efe4d6" stroke-width="1.5"/>`;
      if (t === 'nut') out += `<ellipse cx="${dx}" cy="${dy}" rx="6" ry="4" fill="#8a5a33" transform="rotate(${i * 30} ${dx} ${dy})"/>`;
      if (t === 'tomato') out += `<circle cx="${dx}" cy="${dy}" r="7" fill="#e4472f"/><circle cx="${dx - 2}" cy="${dy - 2}" r="2" fill="#ff9f86"/>`;
      if (t === 'meat') out += `<rect x="${dx - 9}" y="${dy - 4}" width="18" height="8" rx="4" fill="#6b3420" transform="rotate(${i * 25} ${dx} ${dy})"/>`;
      if (t === 'leaf' || t === 'greens') out += `<ellipse cx="${dx}" cy="${dy}" rx="8" ry="4" fill="#5a9a4e" transform="rotate(${i * 40} ${dx} ${dy})"/>`;
    });
    if (t === 'drizzle') out += `<path d="M62 96 L84 86 L80 106 L106 90 L102 112 L130 94 L128 112 L150 98" fill="none" stroke="#2e140b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  return out;
}
function crepeSVG({ kind, fill, cone = '#f3b3c6', tops }) {
  const gold = `<defs><linearGradient id="g${Math.random().toString(36).slice(2, 7)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6cd86"/><stop offset="1" stop-color="#d9953a"/></linearGradient></defs>`;
  const gid = gold.match(/id="(\w+)"/)[1];
  if (kind === 'cone') {
    return `<svg viewBox="0 0 200 220" aria-hidden="true">${gold}
      <path d="M48 82 Q100 18 152 82 Q100 104 48 82Z" fill="url(#${gid})"/>
      <path d="M52 84 Q100 98 148 84" fill="none" stroke="${fill}" stroke-width="9" stroke-linecap="round"/>
      <g transform="translate(0,-22)">${topsSVG(tops)}</g>
      <path d="M42 86 L100 212 L158 86 Q100 112 42 86Z" fill="${cone}"/>
      <path d="M42 86 Q100 112 158 86" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M100 168 l-14 -18 c-6 -8 4 -18 14 -9 c10 -9 20 1 14 9z" fill="#b1203f"/>
    </svg>`;
  }
  const plate = `<ellipse cx="100" cy="128" rx="94" ry="44" fill="#ffffff"/><ellipse cx="100" cy="128" rx="70" ry="31" fill="none" stroke="#efe6f7" stroke-width="2"/>`;
  const side = kind === 'savory'
    ? `<g>${[[150, 118], [160, 128], [146, 132], [158, 108], [168, 120]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="${i % 2 ? '#5a9a4e' : '#7fb85f'}" transform="rotate(${i * 50} ${x} ${y})"/>`).join('')}<circle cx="152" cy="122" r="5" fill="#e4472f"/><circle cx="164" cy="112" r="4" fill="#f08a2c"/></g>`
    : '';
  return `<svg viewBox="0 0 200 200" aria-hidden="true">${gold}
    <ellipse cx="100" cy="140" rx="92" ry="40" fill="rgba(46,31,77,.12)"/>
    ${plate}${side}
    <path d="M38 126 Q60 76 118 74 Q140 76 142 98 Q100 140 38 126Z" fill="${fill}"/>
    <path d="M34 122 Q56 70 116 68 Q136 70 138 92 Q98 134 34 122Z" fill="url(#${gid})"/>
    <path d="M36 122 Q98 132 138 92" fill="none" stroke="${fill}" stroke-width="5" stroke-linecap="round"/>
    <g transform="translate(-14,-4) scale(0.92)">${topsSVG(tops)}</g>
  </svg>`;
}

const track = $('.menu__track');
MENU.forEach((m, i) => {
  const a = document.createElement('article');
  a.className = 'card tilt';
  a.style.setProperty('--bg', m.bg);
  a.innerHTML = `
    <div class="card__top"><span>${String(i + 1).padStart(2, '0')}</span><span class="card__tag ${m.tag ? 'card__tag--new' : ''}">${m.tag || m.cat}</span></div>
    <div class="card__art">${crepeSVG(m.art)}</div>
    <h3>${m.name}</h3>
    <p>${m.desc}</p>
    <a class="card__cta" href="${CONFIG.dm}" target="_blank" rel="noopener">Pedir esta</a>`;
  track.appendChild(a);
});
const end = document.createElement('article');
end.className = 'card card--end tilt';
end.innerHTML = `<h3>¿Quieres ver todo el menú?</h3><p>Crêpe amour, promos de la semana, horarios y restaurantes en un solo lugar.</p><a class="btn btn--light" href="${CONFIG.linktree}" target="_blank" rel="noopener">Ver menú completo</a>`;
track.appendChild(end);
$('.menu__count .tot').textContent = String(MENU.length).padStart(2, '0');

/* ======= armador ======= */
const fillBox = $('#fillings'), topBox = $('#toppings');
fillBox.innerHTML = FILLINGS.map((f, i) => `<label class="chip"><input type="radio" name="filling" value="${f.id}" ${i === 0 ? 'checked' : ''}><span class="chip__dot" style="--c:${f.color}"></span>${f.label}</label>`).join('');
topBox.innerHTML = TOPPINGS.map((t) => `<label class="chip"><input type="checkbox" name="topping" value="${t.id}" ${t.on ? 'checked' : ''}><span class="chip__dot" style="--c:${t.color}"></span>${t.label}</label>`).join('');

function currentOrder() {
  const f = FILLINGS.find((x) => x.id === $('input[name=filling]:checked').value);
  const tops = $$('input[name=topping]:checked').map((i) => TOPPINGS.find((t) => t.id === i.value).label.toLowerCase());
  const list = tops.length > 1 ? tops.slice(0, -1).join(', ') + ' y ' + tops.at(-1) : tops[0];
  return { f, text: `Una crêpe de ${f.label}${list ? ' con ' + list : ' sola, sin toppings'}.` };
}
function updateOrder() { $('#order-text').textContent = currentOrder().text; }
updateOrder();

/* ======= toast ======= */
let toastTimer;
function toast(msg) {
  const t = $('.toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 3200);
}

$('#order-btn').addEventListener('click', async () => {
  const msg = `¡Hola Crêpe Lovers! 💜 Quiero pedir: ${currentOrder().text}`;
  try { await navigator.clipboard.writeText(msg); toast('Pedido copiado — pégalo en el DM 💜'); }
  catch { toast(msg); }
  window.open(CONFIG.dm, '_blank', 'noopener');
});

/* ======= escena 3D ======= */
let crepe = null;
try {
  crepe = await createCrepeScene($('#gl'));
} catch (err) {
  console.warn('WebGL no disponible:', err);
  document.documentElement.classList.add('no-webgl');
}

if (crepe) {
  // etiquetas de la vista explotada
  const layer = $('.labels');
  const list = crepe.parts.filter((p) => p.label).map((p, i) => {
    const el = document.createElement('div');
    el.className = 'label';
    el.dataset.side = i % 2 ? 'l' : 'r';
    el.innerHTML = `<span class="label__dot"></span><span class="label__line"></span><span class="label__text">${p.label}</span>`;
    layer.appendChild(el);
    return { el, name: p.name };
  });
  crepe.setLabels(list);

  fillBox.addEventListener('change', () => {
    crepe.setFilling(FILLINGS.find((f) => f.id === $('input[name=filling]:checked').value).color);
  });
  topBox.addEventListener('change', (e) => crepe.setTopping(e.target.value, e.target.checked));
}
fillBox.addEventListener('change', updateOrder);
topBox.addEventListener('change', updateOrder);
$('#random-btn').addEventListener('click', () => {
  const radios = $$('input[name=filling]');
  const pick = radios[(Math.random() * radios.length) | 0];
  pick.checked = true;
  pick.dispatchEvent(new Event('change', { bubbles: true }));
  $$('input[name=topping]').forEach((c, i) => {
    const on = Math.random() > 0.4;
    if (c.checked !== on) {
      c.checked = on;
      setTimeout(() => c.dispatchEvent(new Event('change', { bubbles: true })), i * 90);
    }
  });
});

/* ======= coreografía de scroll ======= */
const S = crepe ? crepe.state : {};
const K = {
  hero: () => (isMobile() ? { x: 0, y: -1.0, rx: 0.42, s: 0.92 } : { x: 0, y: -1.62, rx: 0.5, s: 0.78 }),
  mani: () => (isMobile() ? { x: 0, y: -3.6, rx: 0.7, s: 0.7 } : { x: 1.8, y: -0.1, rx: 0.75, s: 0.8 }),
  anat: () => ({ x: 0, y: isMobile() ? -0.55 : -0.78, rx: 0.3, s: 0.72 }),
  build: () => (isMobile() ? { x: 0, y: 0.78, rx: 0.85, s: 0.74 } : { x: -1.5, y: -0.15, rx: 0.72, s: 0.86 }),
};
// Segmentos de scroll: cada uno define el estado 3D según su progreso (0→1).
// Para cada propiedad manda el último segmento ya iniciado, así nunca se pisan.
const segments = [];
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const span = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const mix = (A, B, p) => { const a = A(), b = B(), t = ease(p), o = {}; for (const k in a) o[k] = lerp(a[k], b[k], t); return o; };
function segment(trigger, start, end, get) {
  segments.push({ st: ScrollTrigger.create({ trigger, start, end, invalidateOnRefresh: true }), get });
}
function applySegments() {
  if (!crepe) return;
  const out = {};
  for (const seg of segments) {
    const p = seg.st.progress;
    const vals = seg.get(p);
    for (const k in vals) if (!(k in out) || p > 0) out[k] = vals[k];
  }
  Object.assign(S, out);
}

// hero → manifiesto
gsap.to('.hero__inner', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '70% top', scrub: true } });
gsap.to('.scroll-hint', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '20% top', scrub: true } });
segment('#hero', 'top top', 'bottom top', (p) => mix(K.hero, K.mani, p));

// manifiesto (pin + palabras que se encienden)
const mani = gsap.timeline({ scrollTrigger: { trigger: '#manifesto', start: 'top top', end: '+=140%', pin: true, scrub: true } });
mani.to('.manifesto__text .w', { opacity: 1, stagger: 0.1, ease: 'none', duration: 0.4 }, 0);
segment('#manifesto', 'top top', '+=140%', (p) => ({ ry: p }));

// anatomía: entra al centro y se "explota"
segment('#anatomy', 'top bottom', 'top top', (p) => mix(K.mani, K.anat, p));
const anat = gsap.timeline({ scrollTrigger: { trigger: '#anatomy', start: 'top top', end: '+=260%', pin: true, scrub: true } });
anat.to('.anatomy__progress span', { scaleX: 1, ease: 'none', duration: 8 }, 0);
anat.fromTo('.anatomy__head', { y: 0 }, { y: -20, duration: 8, ease: 'none' }, 0);
segment('#anatomy', 'top top', '+=260%', (p) => ({
  ry: 1 + Math.PI * span(p, 0.03, 0.95),
  explode: ease(span(p, 0.03, 0.48)) * (1 - ease(span(p, 0.72, 0.98))),
}));

// menú horizontal
const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
const menuTween = gsap.to(track, {
  x: () => -dist(), ease: 'none',
  scrollTrigger: {
    trigger: '#menu', start: 'top top', end: () => '+=' + dist(), pin: '.menu__pin', scrub: true, invalidateOnRefresh: true,
    onUpdate(self) {
      const n = MENU.length + 1;
      $('.menu__count .cur').textContent = String(Math.min(MENU.length, Math.round(self.progress * (n - 1)) + 1)).padStart(2, '0');
      $('.menu__bar span').style.transform = `scaleX(${self.progress})`;
    },
  },
});
$$('.card__art', track).forEach((art) => {
  gsap.fromTo(art, { rotate: -10, xPercent: 18 }, {
    rotate: 8, xPercent: -18, ease: 'none',
    scrollTrigger: { trigger: art.closest('.card'), containerAnimation: menuTween, start: 'left right', end: 'right left', scrub: true },
  });
});

// armador
segment('#builder', 'top bottom', 'top top', (p) => ({ ...mix(K.anat, K.build, p), ry: lerp(1 + Math.PI, Math.PI * 2 + 0.5, ease(p)) }));
segment('#builder', 'bottom bottom', 'bottom top', (p) => mix(K.build, () => ({ ...K.build(), y: K.build().y + 4 }), p));
gsap.ticker.add(applySegments);
applySegments();
gsap.from('.builder__panel', { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '#builder', start: 'top 70%' } });

// features / eventos
gsap.from('.feature', { y: 70, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.features__grid', start: 'top 80%' } });
gsap.from('.features__head > *, .events__copy > *', { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.features', start: 'top 75%' } });
gsap.fromTo('.events__card', { rotateX: 14, y: 80, scale: 0.94 }, { rotateX: 0, y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.events', start: 'top bottom', end: 'center center', scrub: true } });
gsap.to('.cone', { rotate: 8, y: -14, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
$$('.balloon').forEach((b, i) => gsap.to(b, { y: -18 - i * 6, rotate: i % 2 ? 6 : -6, duration: 2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));

// CTA
gsap.from('.cta__title .char', { yPercent: 110, duration: 1, stagger: 0.03, ease: 'expo.out', scrollTrigger: { trigger: '.cta', start: 'top 65%' } });
gsap.from('.cta__sub, .cta__btns, .delivery', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.cta', start: 'top 55%' } });
$$('.floaty').forEach((f, i) => {
  gsap.to(f, { y: -40 - i * 10, rotate: i % 2 ? 12 : -12, duration: 3 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.fromTo(f, { yPercent: 40 * (i + 1) }, { yPercent: -40 * (i + 1), ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
});
gsap.fromTo('.footer__word', { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

// nav con fondo al hacer scroll
ScrollTrigger.create({ start: 60, end: 'max', onToggle: (self) => $('.nav').classList.toggle('is-scrolled', self.isActive) });

// render 3D solo cuando la escena es visible (ahorra batería)
if (crepe) {
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    crepe.setActive(visible.size > 0);
  });
  ['#hero', '#manifesto', '#anatomy', '#builder'].forEach((s) => io.observe($(s)));
}

/* ======= micro-interacciones ======= */
if (canHover && !reduceMotion) {
  // cursor
  const cur = $('.cursor');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; cur.classList.add('is-on'); }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
  gsap.ticker.add(() => { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; });
  document.addEventListener('pointerover', (e) => cur.classList.toggle('is-hover', !!e.target.closest('a, button, .chip, .card')));

  // botones magnéticos
  $$('.magnetic').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });

  // tarjetas con inclinación 3D
  $$('.tilt').forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 16);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* ======= intro ======= */
function intro() {
  document.body.classList.remove('is-loading');
  const tl = gsap.timeline({ onComplete: () => lenis && lenis.start() });
  tl.to('.loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' })
    .set('.loader', { display: 'none' })
    .from('.hero .char', { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.035, ease: 'expo.out' }, '-=0.45')
    .from('.hero .eyebrow, .hero__sub, .hero__ctas, .scroll-hint, .nav', { y: 26, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, '<0.25');
  if (crepe) tl.fromTo(S, { introY: 3.4, introR: -Math.PI * 1.3 }, { introY: 0, introR: 0, duration: 2.2, ease: 'expo.out' }, 0.7);
}

await document.fonts.ready;
ScrollTrigger.refresh();
if (reduceMotion) { $('.loader').style.display = 'none'; document.body.classList.remove('is-loading'); }
else intro();
