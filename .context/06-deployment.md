# 06 — Build y despliegue

## Variables de entorno

| Variable | Obligatoria | Momento | Para qué |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recomendada | **Build** | Canonical, OG, sitemap, robots. Sin barra final. Por defecto `https://lynex.dev` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recomendada | **Build** | Email público y enlace alternativo. Por defecto `hola@lynex.dev` |
| `RESEND_API_KEY` | Solo para el formulario | Runtime | Clave de la API de Resend |
| `CONTACT_TO_EMAIL` | Solo para el formulario | Runtime | Buzón que recibe las consultas |
| `CONTACT_FROM_EMAIL` | Solo para el formulario | Runtime | Remitente en dominio verificado: `Lynex <contacto@dominio.com>` |

Reglas duras:

- **Nunca** pongas `NEXT_PUBLIC_` delante de `RESEND_API_KEY`: la publicarías en el navegador.
- Las dos variables `NEXT_PUBLIC_*` se congelan en el build → cambiarlas exige **redesplegar**.
- Las tres de email son de runtime → basta reiniciar el proceso.
- Sin las tres de email el sitio **compila y sirve igual**; solo el formulario devuelve `503`.

Plantilla en `.env.example`. En local: `copy .env.example .env.local`.

## Scripts npm

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en `:3000` |
| `npm run build` | Build de Next + `postbuild` |
| `npm run postbuild` | `scripts/prepare-standalone.mjs` (automático tras `build`) |
| `npm start` | `node .next/standalone/server.js` — **no** es `next start` |
| `npm run lint` | ESLint (config flat, `eslint-config-next` core-web-vitals + TS) |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm run check` | lint + typecheck + build — **lo mismo que valida CI** |

Ejecuta `npm run check` antes de abrir un PR; evita el 100% de los fallos de CI.

## Por qué existe `prepare-standalone.mjs`

`output: "standalone"` genera `.next/standalone/server.js` con solo las dependencias que hacen
falta, pero **Next no copia `public/` ni `.next/static/`** dentro de esa carpeta. El script de
postbuild los copia (borrando el destino antes, para no dejar archivos huérfanos entre builds).

Sin ese paso, `npm start` sirve la app **sin CSS ni imágenes**. Si ves el sitio "desnudo" tras
un build, es esto. El script lanza un error explícito si no encuentra la salida standalone.

## Vercel

1. Importar el repo (`github.com/J0NAsM/Lynex`); Vercel detecta Next.js solo.
2. Añadir las cinco variables en **Project Settings → Environment Variables**.
3. Desplegar.
4. Asociar el dominio y confirmar que `NEXT_PUBLIC_SITE_URL` coincide con la URL canónica;
   **redesplegar** si la cambias.
5. Enviar un mensaje real desde el formulario y verificar la entrega en Resend.

Nota: en serverless, el rate limit en memoria es por instancia — ver
[04-contact-flow.md](04-contact-flow.md).

## Docker

Build multi-etapa (`deps` → `builder` → `runner`) sobre `node:22-alpine`:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://lynex.dev \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL=hola@lynex.dev \
  -t lynex-web .

docker run --rm -p 3000:3000 \
  -e RESEND_API_KEY=tu_clave \
  -e CONTACT_TO_EMAIL=hola@lynex.dev \
  -e "CONTACT_FROM_EMAIL=Lynex <contacto@lynex.dev>" \
  lynex-web
```

Puntos a tener en cuenta:

- La URL y el email públicos son **`--build-arg`**, no `-e`. Pasarlos como variables de runtime no tiene efecto.
- La imagen final corre como usuario sin privilegios (`nextjs`, uid 1001).
- `HOSTNAME=0.0.0.0` y `PORT=3000` ya vienen fijados; cambia `PORT` si necesitas otro.
- Telemetría de Next desactivada (`NEXT_TELEMETRY_DISABLED=1`).
- **En producción, pon HTTPS por delante del contenedor.** La cabecera HSTS ya se envía.
- `.dockerignore` excluye `.git`, `.github`, `.next`, `node_modules` y todos los `.env*`
  salvo `.env.example`.

## CI — `.github/workflows/ci.yml`

Workflow "Calidad", en push a `main` y en cada PR. Node 22, caché de npm,
`npm ci` → `lint` → `typecheck` → `build`. Permisos reducidos a `contents: read`.

No hay job de despliegue: el deploy lo gestiona Vercel (o el pipeline de Docker que se monte).
