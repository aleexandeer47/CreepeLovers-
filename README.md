# Crêpe Lovers — Landing page

Landing interactiva para Crêpe Lovers (Your happy place · Est. 2007 · El Salvador).
Crêpe 3D procedural con Three.js, scroll estilo Apple con GSAP ScrollTrigger y Lenis.

## Correr en local

```bash
npm run dev
```

(Necesita un servidor local; abrir `index.html` directo no carga los módulos.)

## Editar contenido

- Links, rellenos y toppings del armador: `js/main.js` (`CONFIG`, `FILLINGS`, `TOPPINGS`)
- Menú completo, destacados y promos: `js/menu-data.js` (`FEATURED`, `CARTA`, `COMBIFICA`, `DAILY`), fotos en `assets/menu/`
- Colores y tipografía: variables en `:root` de `css/styles.css`
- Escena 3D: `js/scene.js`
