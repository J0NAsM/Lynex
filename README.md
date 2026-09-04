# Lynex

Sitio comercial de Lynex, construido con Next.js, React y TypeScript. Incluye landing responsive, SEO técnico, imagen social generada, política de privacidad y contacto por correo o formulario con Resend según el hosting.

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
- `RESEND_API_KEY`: clave de API de Resend.
- `CONTACT_TO_EMAIL`: dirección que recibirá las consultas.
- `CONTACT_FROM_EMAIL`: remitente perteneciente a un dominio verificado en Resend, por ejemplo `Lynex <contacto@lynex.dev>`.

También podés completar datos comerciales opcionales. Si quedan vacíos, el sitio oculta esos elementos sin mostrar placeholders:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número con código de país y solo dígitos.
- `NEXT_PUBLIC_CONTACT_PHONE`: número en formato legible para los datos estructurados.
- `NEXT_PUBLIC_LINKEDIN_URL`: URL completa del perfil de empresa.
- `NEXT_PUBLIC_WEB_PRICE_FROM` y `NEXT_PUBLIC_SYSTEM_PRICE_FROM`: precios mínimos visibles, incluyendo moneda.

Sin las tres variables de correo, el sitio compila y funciona, pero el formulario responde con un aviso de indisponibilidad y ofrece el enlace de email directo. Nunca expongas `RESEND_API_KEY` con el prefijo `NEXT_PUBLIC_`.

## Publicación automática en GitHub Pages

Cada push a `main` ejecuta `.github/workflows/pages.yml`, genera una exportación estática con el prefijo `/Lynex` y la publica en GitHub Pages. Como Pages no ejecuta Node.js ni rutas `POST`, esta versión muestra un contacto directo por `mailto:` y no intenta llamar a `/api/contact`.

El workflow define internamente `GITHUB_PAGES=true` y `NEXT_PUBLIC_STATIC_HOSTING=true`, desactiva la ruta del servidor únicamente dentro del runner y sube la carpeta `out`. No hace falta commitear archivos generados.

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
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL=hola@lynex.dev \
  -t lynex-web .
docker run --rm -p 3000:3000 \
  -e RESEND_API_KEY=tu_clave \
  -e CONTACT_TO_EMAIL=hola@lynex.dev \
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
