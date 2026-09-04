# 07 — Convenciones y trampas

## Convenciones de código

- **Server Components por defecto.** `"use client"` solo cuando hay estado o eventos, y en el
  componente más pequeño posible.
- **El contenido va en constantes `as const`** al principio del archivo, no incrustado en el
  JSX. Los datos tabulares se modelan como tuplas (`["01", "Título", "Texto", "↗"]`) y se
  desestructuran en el `.map()`.
- **Imports con alias `@/`** (`@/lib/site`, `@/components/...`), nunca rutas relativas largas.
- **Navegación interna con `next/link`** para rutas reales (`/`, `/privacidad`); `<a href="#...">`
  para anclas dentro de la landing.
- **Sin comentarios decorativos.** Los pocos que hay explican un porqué no evidente (por
  ejemplo, el honeypot). Sigue ese criterio.
- **Todo el texto de cara al usuario, en español**, incluidos `aria-label` y mensajes de error.
- Los iconos son **caracteres Unicode** (`↗ ⌁ ▦ ◌ ⇄ ✦ ✓`), no una librería de iconos. Siempre
  con `aria-hidden="true"` cuando son decorativos.
- CSS: ver el formato obligatorio en [03-design-system.md](03-design-system.md) (una regla por
  línea, propiedades alfabéticas).

## Trampas conocidas

### 1. El proyecto usa CSS plano
Tailwind no está instalado. Las clases utilitarias no hacen nada; añade reglas a
`globals.css` siguiendo el sistema existente. Detalle en [03-design-system.md](03-design-system.md).

### 2. La CSP bloquea cualquier recurso externo
`connect-src 'self'` y `default-src 'self'` en `next.config.ts`. Analítica, fuentes de CDN,
iframes de YouTube/Calendly/Maps: todo falla, a menudo sin error visible. Amplía la CSP
conscientemente o no lo añadas.

### 3. La URL y el email públicos son datos de build
`site.url` y `site.email` son la fuente única y se configuran con variables `NEXT_PUBLIC_*`.
Si cambia cualquiera, hay que reconstruir y redesplegar; reiniciar el proceso no basta.

### 4. Los colores están duplicados fuera del CSS
`opengraph-image.tsx`, `manifest.ts`, `layout.tsx` (`themeColor`) y `public/icon.svg` no leen
las variables CSS. Un cambio de paleta son cinco archivos.

### 5. `npm start` no es `next start`
Ejecuta la salida standalone. Depende de que `postbuild` haya corrido. Ver
[06-deployment.md](06-deployment.md).

### 6. Añadir una página son tres pasos, no uno
Crear `src/app/<ruta>/page.tsx`, **añadirla a `src/app/sitemap.ts`** y, si va en el menú,
a la lista `links` de `site-navigation.tsx`.

### 7. `opengraph-image.tsx` no es React normal
Lo renderiza Satori. Subconjunto de CSS y `display: flex` explícito en todo contenedor con
hijos. Un `<div>` sin `display` rompe el build.

### 8. El rate limit no sobrevive a múltiples instancias
`Map` en memoria. Ver [04-contact-flow.md](04-contact-flow.md).

### 9. Cambiar variables `NEXT_PUBLIC_*` exige rebuild
`NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_CONTACT_EMAIL` son variables de build. Reiniciar no basta.

### 10. Hay dos carpetas en el workspace
`Lynex/` es el proyecto real (este). `lynex-app/` es un `create-next-app` sin tocar. Ver
[08-state.md](08-state.md).

## Al hacer cambios

1. `npm run check` antes de commitear.
2. Si tocas validaciones del formulario, **ajusta cliente y servidor a la vez** — los límites
   (`name` 2–80, `email` ≤254, `message` 20–3000) están duplicados por diseño.
3. Si cambias env vars, actualiza `.env.example`, el `README.md` y
   [06-deployment.md](06-deployment.md).
4. Si tocas rutas, revisa `sitemap.ts` y `robots.ts`.
5. Prueba en móvil: los breakpoints son 800px y 480px, y el menú hamburguesa solo existe
   por debajo de 800px.
6. Actualiza el archivo de `.context/` afectado **en el mismo commit**.
