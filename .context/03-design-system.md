# 03 — Sistema de diseño

Todo el CSS vive en un único archivo: `src/app/globals.css`.

## CSS plano, sin framework

Tailwind y su plugin de PostCSS fueron retirados porque no existían clases utilitarias en el
sitio. Los estilos se escriben directamente en `globals.css`; si se incorpora un framework
en el futuro, debe ser una decisión explícita y acompañada por la configuración necesaria.

## Tokens de color (`:root`)

| Variable | Valor | Uso |
|---|---|---|
| `--ink` | `#14211f` | Texto principal, botón oscuro |
| `--muted` | `#65716d` | Texto secundario |
| `--paper` | `#f5f7f3` | Fondo del sitio |
| `--line` | `#d9e0da` | Bordes y separadores |
| `--lime` | `#d4f36a` | Acento vivo: botón claro, banda de tecnologías, sombra dura |
| `--coral` | `#ff735c` | Acento cálido: `<em>` en titulares, flechas, focus ring |
| `--teal` | `#0c6b62` | Eyebrows, sección de contacto, hero visual |
| `--deep` | `#132b28` | Bandas oscuras y footer, `theme-color` |

Estos valores están **duplicados a mano** en tres sitios que no leen el CSS:
`opengraph-image.tsx`, `manifest.ts` y `layout.tsx` (`viewport.themeColor`), más
`public/icon.svg`. Si cambias la paleta, cámbialos también ahí.

## Tipografía

Dos fuentes de Google cargadas con `next/font` en `layout.tsx` y expuestas como variables:

- `--font-body` → **DM Sans**, en `body`.
- `--font-display` → **Space Grotesk**, en `h1/h2/h3`, `.brand`, métricas y elementos destacados.

Los titulares usan `clamp()` y `letter-spacing` muy negativo (`-.07em`) — es parte de la
identidad, no un accidente.

## Convenciones de escritura del CSS

- **Una regla por línea, propiedades en orden alfabético.** El archivo es denso a propósito;
  respeta el formato al añadir código.
- Las clases se agrupan por sección de la página siguiendo el orden de `page.tsx`
  (hero → trust → servicios → soluciones → proceso → resultados → nosotros → tech → faq →
  contacto → footer → páginas legales/error).
- Layout con **CSS Grid y Flexbox**, sin framework.
- `border-radius: 0` casi en todas partes: la estética es de bordes rectos, con la sombra
  dura del hero (`box-shadow: 20px 20px 0 var(--lime)`) como firma visual.

## Breakpoints

Solo dos, mobile-last (escritorio primero):

- `@media (max-width: 800px)` — el grande: nav se convierte en menú hamburguesa desplegable,
  grids de 3 columnas pasan a 2 o 1, se reduce el padding vertical de 130px a 80px.
- `@media (max-width: 480px)` — ajustes finos de móvil.
- `@media (prefers-reduced-motion: reduce)` — anula animaciones y `scroll-behavior: smooth`.

## Accesibilidad (ya implementada, no la rompas)

- `.skip-link` "Saltar al contenido" → `#contenido`.
- `:focus-visible` con outline coral de 3px y `outline-offset: 4px`.
- Cada `<section>` con `id` tiene `aria-labelledby` apuntando a su titular.
- El menú móvil usa `aria-expanded` / `aria-controls`; el acordeón de FAQ también, con
  paneles ocultos vía atributo `hidden`.
- Botón hamburguesa con área táctil mínima de 44x44.
- Los iconos decorativos llevan `aria-hidden="true"`.
- El decorado del hero es un `role="img"` con `aria-label` descriptivo, porque las métricas
  que muestra son ilustrativas.

## Animación

Mínima y solo de entrada: `.reveal` y `.reveal-delay` aplican un `fade-up` con
`animation-fill-mode: both`. No hay librería de animación ni scroll-driven effects.
