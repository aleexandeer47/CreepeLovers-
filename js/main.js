// Crêpe Lovers — interacciones, scroll y armador
import { createCrepeScene } from './scene.js';
import { FEATURED, CARTA, COMBIFICA, DAILY, FINE_PRINT, BRANCH_NOTE } from './menu-data.js';

/* ======= Datos editables ======= */
const CONFIG = {
  instagram: 'https://www.instagram.com/crepelovers/',
  dm: 'https://ig.me/m/crepelovers',
  linktree: 'https://linktr.ee/crepeloverssv',
  events: 'https://wa.me/50376014395?text=' + encodeURIComponent('¡Hola Crêpe Lovers! Quiero información para un evento 💜'),
  ubereats: 'https://www.ubereats.com/sv',
  pedidosya: 'https://www.pedidosyasv.com.sv/restaurantes/san-salvador/crepe-lover--centro-historico-ddfc0f74-4c3c-4f6a-a4ae-4da1efd4cbd6-menu',
};

const FILLINGS = [
  { id: 'nutella', label: 'Nutella', color: '#4b2415' },
  { id: 'dulce', label: 'Dulce de leche', color: '#b0692b' },
  { id: 'pistacho', label: 'Crema de pistacho', color: '#a9b45a' },
  { id: 'biscoff', label: 'Crema de Biscoff', color: '#c47a3a' },
  { id: 'fresa', label: 'Mermelada de fresa', color: '#b3172f' },
];
const TOPPINGS = [
  { id: 'strawberry', label: 'Fresas', color: '#d4203d', on: true },
  { id: 'banana', label: 'Banano', color: '#f6e3a2', on: true },
  { id: 'cream', label: 'Chantilly', color: '#fffaf2', on: true },
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
// en celular la barra del navegador aparece/desaparece al hacer scroll: no recalcular por eso
ScrollTrigger.config({ ignoreMobileResize: true });

/* ======= menú móvil ======= */
const nav = $('.nav'), navToggle = $('.nav__toggle');
function setNav(open) {
  nav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
navToggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
$$('.nav__links a').forEach((a) => a.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setNav(false); });

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

/* ======= destacados (carrusel horizontal) ======= */
const track = $('.menu__track');
FEATURED.forEach((m, i) => {
  const a = document.createElement('article');
  a.className = 'card tilt';
  a.style.setProperty('--bg', m.bg);
  a.innerHTML = `
    <div class="card__top"><span>${String(i + 1).padStart(2, '0')}</span><span class="card__tag">${m.cat}</span></div>
    <div class="card__art"><img src="${m.img}" alt="${m.name}" loading="lazy" decoding="async"></div>
    <div class="card__row"><h3>${m.name}</h3><span class="card__price">${m.price}</span></div>
    <p>${m.desc}</p>
    <a class="card__cta" href="${CONFIG.dm}" target="_blank" rel="noopener">Pedir esta</a>`;
  track.appendChild(a);
});
const end = document.createElement('article');
end.className = 'card card--end tilt';
end.innerHTML = `<h3>¿Quieres ver todo el menú?</h3><p>Más de 100 opciones: saladas, dulces, healthy, bebidas y las promos de la semana.</p><a class="btn btn--light" href="#carta">Ver carta completa</a>`;
track.appendChild(end);
$('.menu__count .tot').textContent = String(FEATURED.length).padStart(2, '0');

/* ======= carta completa ======= */
const money = (p) => `<span class="price">${p}</span>`;
function itemHTML(it) {
  const vars = it.v ? `<ul class="dish__vars">${it.v.map(([l, p]) => `<li>${l} <b>${p}</b></li>`).join('')}</ul>` : '';
  return `<li class="dish">
    <div class="dish__head"><h4>${it.n}</h4><i aria-hidden="true"></i>${it.p ? money(it.p) : ''}</div>
    ${it.d ? `<p>${it.d}</p>` : ''}${vars}${it.info ? `<p class="dish__info">${it.info}</p>` : ''}
  </li>`;
}
function sectionHTML(s) {
  const extras = s.extras ? `<div class="menu-block__extras"><h5>${s.extras.title}</h5><ul>${s.extras.list.map(([l, p]) => `<li>${l} <b>${p}</b></li>`).join('')}</ul></div>` : '';
  return `<section class="menu-block">
    <h3>${s.title}</h3>${s.note ? `<p class="menu-block__note">${s.note}</p>` : ''}
    <ul class="dishes">${s.items.map(itemHTML).join('')}</ul>${extras}
  </section>`;
}
function promosHTML() {
  const today = new Date().getDay(); // 1 = lunes … 5 = viernes
  const days = DAILY.days.map(([d, sal, dul], i) => `<li class="${i + 1 === today ? 'is-today' : ''}">
      <span class="day">${d}${i + 1 === today ? ' <em>hoy</em>' : ''}</span><span><b>Salada:</b> ${sal}</span><span><b>Dulce:</b> ${dul}</span></li>`).join('');
  return `<div class="promos">
    <article class="promo promo--combi">
      <p class="promo__kicker">${COMBIFICA.when}</p>
      <div class="promo__title"><h3>Combifica</h3><span class="promo__badge"><small>desde</small>${COMBIFICA.price}</span></div>
      <p class="promo__lead">${COMBIFICA.includes}</p>
      <ul class="promo__list">${COMBIFICA.plates.map(([t, p, d]) => `<li><div class="dish__head"><h4>${t}</h4><i aria-hidden="true"></i>${money(p)}</div><p>${d}</p></li>`).join('')}</ul>
      <p><b>Complemento:</b> ${COMBIFICA.side}</p>
      <p><b>Bebida:</b> ${COMBIFICA.drink}</p>
      <p class="promo__fine">${COMBIFICA.fine}</p>
    </article>
    <article class="promo promo--daily">
      <p class="promo__kicker">Escoge entre salado y dulce</p>
      <div class="promo__title"><h3>Daily Crêpe</h3><span class="promo__badge"><small>c/u</small>${DAILY.price}</span></div>
      <ul class="daily">${days}</ul>
      <p>${DAILY.match}</p>
      <p class="promo__fine">${DAILY.fine}</p>
    </article>
  </div>`;
}
const tabs = $('.carta__tabs'), panel = $('.carta__panel');
tabs.innerHTML = CARTA.map((g, i) => `<button class="carta__tab" role="tab" id="tab-${g.id}" aria-controls="carta-panel" aria-selected="${i === 0}" data-id="${g.id}">
  <img src="${g.img}" alt="" loading="lazy"><span>${g.label}</span></button>`).join('');
$('.carta__fine').innerHTML = `<p><b>${BRANCH_NOTE}</b></p>` + FINE_PRINT.map((t) => `<p>${t}</p>`).join('');
function showGroup(id, animate = true) {
  const g = CARTA.find((x) => x.id === id);
  $$('.carta__tab', tabs).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.id === id)));
  panel.setAttribute('aria-labelledby', 'tab-' + id);
  panel.innerHTML = g.promos ? promosHTML() : `<div class="menu-grid">${g.sections.map(sectionHTML).join('')}</div>`;
  if (window.ScrollTrigger) ScrollTrigger.refresh();
  if (animate && window.gsap && !reduceMotion) gsap.from(panel.querySelectorAll('.menu-block, .promo'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
}
tabs.addEventListener('click', (e) => {
  const b = e.target.closest('.carta__tab');
  if (!b || b.getAttribute('aria-selected') === 'true') return;
  showGroup(b.dataset.id);
  const top = $('#carta').getBoundingClientRect().top;
  if (top < -10) (lenis ? lenis.scrollTo('#carta', { duration: 1 }) : $('#carta').scrollIntoView());
});
tabs.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const list = $$('.carta__tab', tabs), i = list.indexOf(document.activeElement);
  const next = list[(i + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length];
  next.focus(); next.click();
});
showGroup(CARTA[0].id, false);
end.querySelector('a').addEventListener('click', (e) => {
  e.preventDefault();
  if (lenis) lenis.scrollTo('#carta', { duration: 1.4 }); else $('#carta').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});

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
      const n = FEATURED.length + 1;
      $('.menu__count .cur').textContent = String(Math.min(FEATURED.length, Math.round(self.progress * (n - 1)) + 1)).padStart(2, '0');
      $('.menu__bar span').style.transform = `scaleX(${self.progress})`;
    },
  },
});
$$('.card__art img', track).forEach((art) => {
  gsap.fromTo(art, { xPercent: 9 }, {
    xPercent: -9, ease: 'none',
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
