# 02 — Arquitectura

## Stack

| Pieza | Elección | Nota |
|---|---|---|
| Framework | Next.js 16.3.4, App Router | salida `standalone` o exportación para Pages |
| UI | React 19.2.8 | Server Components por defecto |
| Lenguaje | TypeScript 5, `strict` | target ES2022, alias `@/*` |
| Estilos | CSS plano | sin Tailwind ni librería de componentes |
| Fuentes | DM Sans + Space Grotesk con `next/font` | autoalojadas durante el build |
| Email | API REST de Resend | `fetch`, sin SDK adicional |
| Node | 20.9 como mínimo | `.nvmrc`, CI y Docker usan Node 22 |

Solo existen tres dependencias de runtime: `next`, `react` y `react-dom`.

## Mapa de archivos

```text
src/
├── app/
│   ├── layout.tsx            fuentes, metadata y JSON-LD de negocio/servicios
│   ├── page.tsx              landing, copy y JSON-LD FAQPage
│   ├── globals.css           sistema visual completo
│   ├── error.tsx             error del segmento raíz
│   ├── global-error.tsx      último límite de error
│   ├── not-found.tsx         404 de marca
│   ├── privacidad/page.tsx   política de privacidad
│   ├── api/contact/route.ts  validación, antispam y envío por Resend
│   ├── apple-icon.tsx        icono PNG 180×180 generado
│   ├── opengraph-image.tsx   imagen social PNG 1200×630
│   ├── manifest.ts           manifest web
│   ├── robots.ts             robots.txt
│   └── sitemap.ts            sitemap.xml
├── components/
│   ├── site-navigation.tsx   menú móvil y comportamiento de cierre
│   ├── faq-list.tsx          acordeón accesible
│   └── contact-form.tsx      formulario y estados de envío
└── lib/
    └── site.ts               negocio, ofertas y configuración pública
```

Fuera de `src/`: `Dockerfile`, `.nvmrc`, `.env.example`, workflow de CI y
`scripts/prepare-standalone.mjs`. `.github/workflows/pages.yml` construye y publica
la variante estática.

## Rutas y renderizado

| Ruta | Tipo |
|---|---|
| `/` | prerenderizada en cada build |
| `/privacidad` | estática |
| `/api/contact` | dinámica, solo `POST` |
| `/opengraph-image`, `/apple-icon` | imágenes generadas |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | metadata generada |
| cualquier otra | 404 personalizada |

En GitHub Pages se exportan todas las rutas estáticas bajo `/Lynex`. El workflow
desactiva temporalmente `/api/contact` dentro del runner porque un host estático no
puede ejecutar `POST`.

## Frontera servidor/cliente

`page.tsx` sigue siendo Server Component. Solo se hidratan tres islas:

- `SiteNavigation`: menú, Escape, clic exterior, resize y bloqueo temporal de scroll.
- `FaqList`: pregunta abierta y relaciones `aria-controls`.
- `ContactForm`: formulario completo en un servidor; CTA `mailto:` en la exportación
  estática.

No conviertas la landing completa a cliente para añadir una interacción pequeña.

## Seguridad de plataforma

`next.config.ts` aplica CSP, HSTS, `X-Frame-Options`, `nosniff`, Referrer Policy y
Permissions Policy a todas las rutas. La CSP permite solo recursos propios. Si se incorpora
analítica, vídeo, calendario, mapa o fuente externa, hay que ampliar conscientemente la CSP.

Flujo con servidor:

```text
ContactForm → POST /api/contact → origen/rate limit/antispam/validación
            → API de Resend → CONTACT_TO_EMAIL
```

Flujo en Pages: `ContactForm → mailto:martinezlynex@gmail.com | wa.me/595986914726`.
La llamada usa `tel:+595986914726`. No se envía ningún secreto ni se intenta simular
un backend desde el navegador.
