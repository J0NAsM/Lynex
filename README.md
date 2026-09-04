# Lynex

Sitio comercial de Lynex, construido con Next.js, React y TypeScript. Incluye landing responsive, SEO técnico, imagen social generada, política de privacidad y formulario de contacto con entrega mediante Resend.

## Desarrollo local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`. Para validar exactamente lo que revisa CI:

```bash
npm run check
```

## Variables de entorno

Copia `.env.example` como `.env.local` y configura:

- `NEXT_PUBLIC_SITE_URL`: URL pública final. Se usa en canonical, Open Graph, sitemap y robots.
- `NEXT_PUBLIC_CONTACT_EMAIL`: dirección que se muestra públicamente y usa el enlace de email alternativo.
- `RESEND_API_KEY`: clave de API de Resend.
- `CONTACT_TO_EMAIL`: dirección que recibirá las consultas.
- `CONTACT_FROM_EMAIL`: remitente perteneciente a un dominio verificado en Resend, por ejemplo `Lynex <contacto@lynex.dev>`.

Sin las tres variables de correo, el sitio compila y funciona, pero el formulario responde con un aviso de indisponibilidad y ofrece el enlace de email directo. Nunca expongas `RESEND_API_KEY` con el prefijo `NEXT_PUBLIC_`.

## Publicar en Vercel

1. Importa este repositorio en Vercel.
2. Añade las cinco variables anteriores en **Project Settings → Environment Variables**.
3. Despliega. Vercel detectará Next.js automáticamente.
4. Asocia el dominio y confirma que `NEXT_PUBLIC_SITE_URL` coincide con la URL canónica; vuelve a desplegar si cambias esa variable.
5. Envía un mensaje real desde el formulario y revisa la entrega en Resend.

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

El contenedor usa la salida `standalone` de Next.js y se ejecuta como usuario sin privilegios. En producción, coloca HTTPS delante del contenedor.

También puedes probar la compilación standalone sin Docker con `npm run build` y `npm start`. Define `PORT` si necesitas un puerto distinto de 3000.

## Comprobaciones posteriores

- Visita `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` y `/opengraph-image`.
- Prueba navegación, FAQ y formulario tanto en móvil como en escritorio.
- Confirma que la URL canónica y la vista previa social usan el dominio final.
- Revisa que el correo no llegue a spam y configura SPF/DKIM según indique tu proveedor.
