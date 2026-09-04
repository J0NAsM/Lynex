# 02 — Arquitectura

## Stack

| Pieza | Versión / elección | Nota |
|---|---|---|
| Framework | **Next.js 16.3.4**, App Router | `output: "standalone"` |
| UI | **React 19.2.8** | Server Components por defecto |
| Lenguaje | **TypeScript 5**, `strict: true` | alias `@/*` → `./src/*` |
| Estilos | **CSS plano** en `src/app/globals.css` | sin framework de utilidades |
| Fuentes | `next/font/google`: DM Sans + Space Grotesk | self-hosted en build |
| Email | **Resend** vía `fetch` a su API REST | sin SDK, sin dependencias extra |
| Node | `>= 20.9` (CI y Docker usan 22) | |

**Cero dependencias de runtime más allá de next/react/react-dom.** Es una decisión
deliberada: menos superficie, build reproducible y una CSP muy estricta que no necesita
excepciones para terceros.

## Mapa de archivos

```
src/
├── app/
│   ├── layout.tsx            Root layout: fuentes, metadata global, JSON-LD Organization
│   ├── page.tsx              La landing entera (Server Component) + todo el copy
│   ├── globals.css           TODO el CSS del sitio (~52 líneas muy densas)
│   ├── not-found.tsx         404
│   ├── privacidad/page.tsx   Política de privacidad (ruta /privacidad)
│   ├── api/contact/route.ts  POST del formulario → Resend
│   ├── opengraph-image.tsx   Imagen social 1200x630 generada con next/og
│   ├── manifest.ts           /manifest.webmanifest
│   ├── robots.ts             /robots.txt
│   └── sitemap.ts            /sitemap.xml
├── components/
│   ├── site-navigation.tsx   "use client" — menú móvil (toggle + Escape)
│   ├── faq-list.tsx          "use client" — acordeón, primer item abierto
│   └── contact-form.tsx      "use client" — máquina de estados del formulario
└── lib/
    └── site.ts               Fuente única de nombre, descripción, email y URL canónica
```

Fuera de `src/`:

```
public/icon.svg               Favicon/icono PWA (monograma L)
scripts/prepare-standalone.mjs  postbuild: copia public/ y .next/static al bundle standalone
Dockerfile                    Build multi-etapa (deps → builder → runner)
.github/workflows/ci.yml      Lint + typecheck + build en push a main y PRs
```

## Rutas

| Ruta | Tipo | Archivo |
|---|---|---|
| `/` | Estática (SSG) | `src/app/page.tsx` |
| `/privacidad` | Estática (SSG) | `src/app/privacidad/page.tsx` |
| `/api/contact` | Dinámica, `POST` | `src/app/api/contact/route.ts` |
| `/opengraph-image` | Imagen generada | `src/app/opengraph-image.tsx` |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | Metadata generada | `robots.ts`, `sitemap.ts`, `manifest.ts` |
| cualquier otra | 404 | `src/app/not-found.tsx` |

## Frontera servidor / cliente

La landing es un **Server Component**. Solo tres islas son cliente, y cada una lo es por un
motivo concreto:

- `SiteNavigation` — estado `open` del menú móvil + listener de `Escape`.
- `FaqList` — estado `openFaq` del acordeón; recibe las preguntas por props desde el server.
- `ContactForm` — estado del envío (`idle | submitting | success | error`) y `fetch`.

Si añades interactividad, **mantén el patrón**: componente cliente pequeño que recibe datos
por props, no muevas `page.tsx` a cliente.

## Seguridad a nivel de plataforma

`next.config.ts` define cabeceras para **todas** las rutas (`/(.*)`):

- CSP estricta: `default-src 'self'`, `connect-src 'self'`, `object-src 'none'`,
  `frame-ancestors 'none'`. `script-src` y `style-src` permiten `'unsafe-inline'` porque
  Next inyecta scripts y estilos inline.
- `Strict-Transport-Security` con `preload`, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` bloqueando cámara, micrófono y geolocalización.
- `poweredByHeader: false`.

**Consecuencia práctica:** meter un script de analítica, una fuente externa o un iframe
(YouTube, Maps, Calendly) **fallará en silencio** hasta que amplíes la CSP. Es el primer sitio
donde mirar si algo externo "no carga y no da error".

## Cómo fluyen los datos

No hay base de datos ni estado global. Solo hay un flujo real:

```
ContactForm (cliente)
   └─ POST /api/contact  (JSON)
        └─ validación + rate limit + honeypot
             └─ fetch https://api.resend.com/emails
                  └─ email a CONTACT_TO_EMAIL
```

Detalle completo en [04-contact-flow.md](04-contact-flow.md).
