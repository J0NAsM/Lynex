# 03 — Sistema de diseño

Todo el estilo vive en `src/app/globals.css`. El proyecto usa CSS plano; Tailwind y su plugin
de PostCSS fueron retirados porque no se utilizaban.

## Tokens

| Variable | Valor | Función |
|---|---|---|
| `--ink` | `#14211f` | texto principal y botones oscuros |
| `--muted` | `#65716d` | texto secundario |
| `--paper` | `#f5f7f3` | fondo general |
| `--line` | `#d9e0da` | bordes y separadores |
| `--lime` | `#d4f36a` | CTA claro, estados y sombra del hero |
| `--coral` | `#ff735c` | énfasis, flechas y foco |
| `--teal` | `#0c6b62` | sección de contacto y dashboard |
| `--deep` | `#132b28` | bandas oscuras y footer |

Los colores se duplican donde CSS no está disponible: `layout.tsx`, `manifest.ts`,
`opengraph-image.tsx`, `apple-icon.tsx` y `public/icon.svg`. Un cambio de paleta debe revisar
todos esos archivos.

## Tipografía y composición

- `--font-body`: DM Sans.
- `--font-display`: Space Grotesk.
- Titulares con tracking negativo y `clamp()`; geometría recta y casi sin radios.
- La sombra lima del dashboard es la firma visual principal.
- El orden del CSS acompaña la página: base → hero → trust → ofertas → problemas → proceso →
  garantías → nosotros → FAQ → contacto → footer → legales/error → estilos añadidos.

## Componentes comerciales nuevos

- `.offer-grid` / `.offer-card`: dos ofertas con lista, precio opcional y plazo.
- `.symptoms-layout` / `.symptom-list`: banda oscura de problemas.
- `.process-grid-four`: cuatro pasos en escritorio.
- `.commitment-grid`: garantías en dos columnas.
- `.contact-place`: señal local bajo los medios de contacto.
- `.static-contact`: tarjeta de contacto directo usada por GitHub Pages.

## Responsive y accesibilidad

- `800px`: menú hamburguesa, layouts de dos columnas pasan a una y proceso a dos.
- `480px`: proceso a una columna, formulario apilado y ajustes del dashboard.
- `prefers-reduced-motion`: reduce animaciones y desactiva scroll suave.
- Hay skip link, foco visible, áreas táctiles de 44px, encabezados asociados a secciones,
  iconos decorativos ocultos y acordeón con estado ARIA.
- Al confirmar el formulario, el foco pasa al encabezado de éxito para no perder a quien
  navega con teclado.

El dashboard contiene números ilustrativos, no resultados de clientes; la etiqueta visible
`LYNEX / DEMO OPERATIVA` no debe eliminarse mientras esos datos no sean reales.
