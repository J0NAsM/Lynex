# Lynex

Sitio comercial de los sistemas propios de Lynex, ofrecidos a clientes mediante suscripción mensual. Está construido con Next.js, React y TypeScript e incluye landing responsive, identidad visual provisional, SEO técnico, imagen social, política de privacidad y contacto según el hosting.

**Sitio publicado:** [j0nasm.github.io/Lynex](https://j0nasm.github.io/Lynex/)

## Desarrollo local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Abrí `http://localhost:3000`. Para validar exactamente lo que revisa CI:

```bash
npm run check
```

## Variables de entorno

Copiá `.env.example` como `.env.local` y configurá:

- `NEXT_PUBLIC_SITE_URL`: URL pública final. Se usa en canonical, Open Graph, sitemap y robots.
- `NEXT_PUBLIC_CONTACT_EMAIL`: dirección que se muestra públicamente y usa el enlace de email alternativo.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número con código de país y solo dígitos.
- `NEXT_PUBLIC_CONTACT_PHONE`: el mismo número en formato visible e internacional.
- `RESEND_API_KEY`: clave de API de Resend.
- `CONTACT_TO_EMAIL`: dirección que recibirá las consultas.
- `CONTACT_FROM_EMAIL`: remitente perteneciente a un dominio verificado en Resend, por ejemplo `Lynex <contacto@lynex.dev>`.

El contacto público actual está precargado en `.env.example` y en el despliegue de Pages. También podés completar estos datos comerciales opcionales; si quedan vacíos, el sitio los oculta sin mostrar placeholders:

- `NEXT_PUBLIC_LINKEDIN_URL`: URL completa del perfil de empresa.
- `NEXT_PUBLIC_WEB_PRICE_FROM` y `NEXT_PUBLIC_SYSTEM_PRICE_FROM`: precios mensuales visibles, incluyendo moneda y período. Si faltan, la web indica que varían según alcance y uso.

Sin las tres variables de correo, el sitio compila y funciona, pero el formulario responde con un aviso de indisponibilidad y ofrece el enlace de email directo. Nunca expongas `RESEND_API_KEY` con el prefijo `NEXT_PUBLIC_`.

## Publicación automática en GitHub Pages

Cada push a `main` ejecuta `.github/workflows/pages.yml`, genera `out/index.html` con el prefijo `/Lynex` y lo publica en GitHub Pages. La portada enlaza Servicios, Problemas, Proceso, Garantías, Nosotros, Preguntas, Contacto y la política de privacidad. Antes de subirla, el workflow comprueba que el índice, esas secciones, sus enlaces y los recursos de marca realmente existan.

Como Pages no ejecuta Node.js ni rutas `POST`, esta versión ofrece correo, llamada y WhatsApp directos, y no intenta llamar a `/api/contact`.

El workflow define internamente `GITHUB_PAGES=true` y `NEXT_PUBLIC_STATIC_HOSTING=true`, desactiva la ruta del servidor únicamente dentro del runner y sube la carpeta `out`. No hace falta commitear archivos generados. La fuente del índice es `src/app/page.tsx`; Next.js produce el `index.html` final durante el build.

## Identidad visual provisional

`public/lynex-wordmark.svg` conserva la pieza horizontal azul oscuro y plateada usada cuando aparece solo el nombre de la empresa. `src/components/brand-wordmark.tsx` contiene la versión compacta y reutilizable de cabecera, pie y páginas internas. Ambas representan un wordmark provisional y pueden sustituirse cuando exista el logo definitivo.

## Publicar en Vercel

1. Importá este repositorio en Vercel.
2. Añadí las cinco variables principales y los datos comerciales opcionales que quieras mostrar en **Project Settings → Environment Variables**.
3. Desplegá. Vercel detectará Next.js automáticamente.
4. Asociá el dominio y confirmá que `NEXT_PUBLIC_SITE_URL` coincide con la URL canónica; volvé a desplegar si cambiás esa variable.
5. Enviá un mensaje real desde el formulario y revisá la entrega en Resend.

## Publicar con Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://lynex.dev \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL=martinezlynex@gmail.com \
  --build-arg NEXT_PUBLIC_WHATSAPP_NUMBER=595986914726 \
  --build-arg "NEXT_PUBLIC_CONTACT_PHONE=+595 986 914 726" \
  -t lynex-web .
docker run --rm -p 3000:3000 \
  -e RESEND_API_KEY=tu_clave \
  -e CONTACT_TO_EMAIL=martinezlynex@gmail.com \
  -e "CONTACT_FROM_EMAIL=Lynex <contacto@lynex.dev>" \
  lynex-web
```

El contenedor usa la salida `standalone` de Next.js y se ejecuta como usuario sin privilegios. En producción, colocá HTTPS delante del contenedor.

También podés probar la compilación standalone sin Docker con `npm run build` y `npm start`. Definí `PORT` si necesitás un puerto distinto de 3000.

## Comprobaciones posteriores

- Visitá `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` y `/opengraph-image`.
- Probá navegación, FAQ y el medio de contacto correspondiente tanto en móvil como en escritorio.
- Confirmá que la URL canónica y la vista previa social usan el dominio final.
- Revisá que el correo no llegue a spam y configurá SPF/DKIM según indique tu proveedor.
