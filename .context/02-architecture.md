# 02 — Arquitectura

## Stack

| Pieza | Elección | Nota |
|---|---|---|
| Framework | Next.js 16.3.4, App Router | salida `standalone`, home con ISR diario |
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
`scripts/prepare-standalone.mjs`.

## Rutas y renderizado

| Ruta | Tipo |
|---|---|
| `/` | prerenderizada, revalidación cada 24 horas |
| `/privacidad` | estática |
| `/api/contact` | dinámica, solo `POST` |
| `/opengraph-image`, `/apple-icon` | imágenes generadas |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | metadata generada |
| cualquier otra | 404 personalizada |

## Frontera servidor/cliente

`page.tsx` sigue siendo Server Component. Solo se hidratan tres islas:

- `SiteNavigation`: menú, Escape, clic exterior, resize y bloqueo temporal de scroll.
- `FaqList`: pregunta abierta y relaciones `aria-controls`.
- `ContactForm`: validación nativa, tiempo de llenado, envío y foco posterior al éxito.

No conviertas la landing completa a cliente para añadir una interacción pequeña.

## Seguridad de plataforma

`next.config.ts` aplica CSP, HSTS, `X-Frame-Options`, `nosniff`, Referrer Policy y
Permissions Policy a todas las rutas. La CSP permite solo recursos propios. Si se incorpora
analítica, vídeo, calendario, mapa o fuente externa, hay que ampliar conscientemente la CSP.

Flujo con estado real:

```text
ContactForm → POST /api/contact → origen/rate limit/antispam/validación
            → API de Resend → CONTACT_TO_EMAIL
```
