# Build y despliegue

## Requisitos

- Node.js `>=20.9.0` según `package.json`.
- Node 22 recomendado y fijado en `.nvmrc` y en la imagen Docker.
- Instalación reproducible con `npm ci`.

## Variables públicas de build

Las variables `NEXT_PUBLIC_*` quedan embebidas en el bundle durante el build.
Cambiar una requiere volver a construir y desplegar.

| Variable | Obligatoria | Uso |
|---|---:|---|
| `NEXT_PUBLIC_SITE_URL` | sí | URL canónica, schema, robots y sitemap |
| `NEXT_PUBLIC_CONTACT_EMAIL` | sí | email visible y destino de enlaces `mailto:` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | sí en producción | número en dígitos para generar `wa.me` |
| `NEXT_PUBLIC_CONTACT_PHONE` | sí en producción | teléfono visible, enlace de llamada y schema local |
| `NEXT_PUBLIC_LINKEDIN_URL` | no | enlace del pie de página |
| `NEXT_PUBLIC_WEB_PRICE_FROM` | no | precio inicial visible de sitios web |
| `NEXT_PUBLIC_SYSTEM_PRICE_FROM` | no | precio inicial visible de sistemas |

Los campos opcionales se ocultan cuando están vacíos. No uses valores de relleno
en producción.

## Variables privadas de runtime

| Variable | Uso |
|---|---|
| `RESEND_API_KEY` | autentica el envío con Resend |
| `CONTACT_TO_EMAIL` | recibe los contactos; cae al email público si falta |
| `CONTACT_FROM_EMAIL` | remitente de un dominio verificado en Resend |

Nunca expongas estas tres como `NEXT_PUBLIC_*` ni las incluyas en commits.
`.env.example` documenta el formato y `.env.local` está ignorado por Git.

## Comandos de calidad

```bash
npm run dev        # desarrollo
npm run lint       # ESLint
npm run typecheck  # tipos de rutas + TypeScript
npm run build      # build y preparación standalone
npm run check      # lint + typecheck + build, igual que CI
npm run start      # servidor standalone ya construido
```

## GitHub Pages (publicación activa)

`.github/workflows/pages.yml` se ejecuta con cada push a `main` y publica
`https://j0nasm.github.io/Lynex/` mediante las acciones oficiales de Pages.

El build usa:

- `GITHUB_PAGES=true`: cambia Next.js de `standalone` a `output: "export"`, activa
  `basePath: "/Lynex"` y genera `out/`;
- `NEXT_PUBLIC_STATIC_HOSTING=true`: sustituye el formulario por contacto directo;
- `NEXT_PUBLIC_SITE_URL=https://j0nasm.github.io/Lynex`: canonicales y assets con
  el subdirectorio correcto.
- El workflow también fija `martinezlynex@gmail.com` y `+595 986 914 726` para
  correo, llamada y WhatsApp.

Solo los Route Handlers `GET` pueden exportarse. Por eso el workflow renombra
temporalmente `src/app/api/contact/route.ts` dentro del runner. El archivo fuente no
se elimina del repositorio y continúa disponible para despliegues con servidor.

`scripts/prepare-standalone.mjs` detecta este modo, verifica `out/` y crea
`.nojekyll` para que GitHub no ignore `_next`. También crea las copias `.png` de
las imágenes dinámicas para que Pages responda con el tipo de contenido correcto.

Después del build, `scripts/verify-pages.mjs` valida que `out/index.html` tenga un
tamaño consistente con la portada completa, que incluya todas las secciones y enlaces,
que use recursos bajo `/Lynex` y que existan privacidad, 404 y el wordmark. El artefacto
no se publica si alguna comprobación falla.

## Vercel

1. Importar este repositorio y mantener la raíz en `Lynex` si el proveedor parte
   de la carpeta superior.
2. Usar Node 22 y los comandos detectados de Next.js.
3. Cargar todas las variables necesarias en Production y Preview.
4. Verificar el dominio y después hacer un redeploy para que metadata y sitemap
   incorporen la URL definitiva.

## Docker

El `Dockerfile` genera una imagen multi-stage, standalone y no root. Las siete
variables públicas están declaradas como argumentos del build. Ejemplo mínimo:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://lynex.dev \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL=martinezlynex@gmail.com \
  --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER=595986914726 \
  --build-arg "NEXT_PUBLIC_CONTACT_PHONE=+595 986 914 726" \
  -t lynex .

docker run --rm -p 3000:3000 \
  -e RESEND_API_KEY=re_xxx \
  -e CONTACT_TO_EMAIL=martinezlynex@gmail.com \
  -e "CONTACT_FROM_EMAIL=Lynex <contacto@dominio-verificado.com>" \
  lynex
```

Agregá `--build-arg` para LinkedIn o precios si se publican.

## Pendientes para el dominio definitivo

- El sitio ya está publicado en GitHub Pages. `lynex.dev` estaba resolviendo a una
  página de parking al revisar el 3 de septiembre de 2026; hay que apuntar DNS al
  hosting definitivo si se usará como dominio personalizado.
- El contacto público usa `martinezlynex@gmail.com`; no depende del correo del dominio.
- Verificá el dominio remitente en Resend y publicá sus registros SPF/DKIM.
- Hacé un envío real del formulario desde el dominio final.
- La imagen Docker no se probó localmente porque Docker CLI no estaba instalado;
  el build standalone de Next sí fue probado.
